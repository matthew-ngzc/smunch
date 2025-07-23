from telegram import (
    InlineKeyboardMarkup, InlineKeyboardButton
)
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, ConversationHandler, filters,
)
from telegram.helpers import escape_markdown

import os, redis, requests, hmac, hashlib, json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

redis = redis.Redis.from_url(os.environ["REDIS_URL"], decode_responses=True)
BOT_TOKEN = os.environ["BOT_TOKEN"]
BACKEND_URL = os.environ["BACKEND_URL"]

# AVAILABLE STATES (as of now)
WAIT_OTP, CONFIRM_LINK = range(2)

# ─────────────────── /start ───────────────────
async def start(update, ctx):
    tg_id = update.effective_user.id
    handle = update.effective_user.username
    smunch_user_id = None

    # 1. Update telegram_username in backend
    try:
        req = requests.put(f"{BACKEND_URL}/api/telegram/update-username", json={
            "telegram_user_id": tg_id,
            "telegram_username": handle
        }, timeout=5)

        # store the user id in conversation handler data
        if req.status_code == 200:
            data = req.json()
            smunch_user_id = data.get("smunch_user_id")
            ctx.user_data["smunch_user_id"] = smunch_user_id
        else:
            ctx.user_data["smunch_user_id"] = None
    except Exception:
        ctx.user_data["smunch_user_id"] = None        

    # 3. Build menu (show other options if verified, otherwise only verify button)
    buttons = [[InlineKeyboardButton("✅ Verify Telegram account", callback_data="VERIFY_TG")]]
    if smunch_user_id:
        buttons.append([InlineKeyboardButton("💳 Submit payment screenshot", callback_data="PAY_SS")])

    # Opening text
    await update.message.reply_text(
        f"Hi <b>@{update.effective_user.username}</b>! How may I help you today?",
        reply_markup=InlineKeyboardMarkup(buttons),
        parse_mode="HTML"
    )


# ─────────────────── VERIFY TELEGRAM ───────────────────
async def choose_verify(update, ctx):
    if update.callback_query:
        await update.callback_query.answer()
        target = update.callback_query.message
    else:
        target = update.message

    await target.reply_text("Great! Please type the 6-digit code shown on the SMUNCH website.")
    return WAIT_OTP

async def got_otp(update, ctx):
    code = update.message.text.strip()
    payload = redis.get(f"otp:{code}")
    if not payload:
        await update.message.reply_text("❌ Invalid or expired code. Try again.")
        return WAIT_OTP

    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        await update.message.reply_text("⚠️ Error reading OTP data. Please try again.")
        return WAIT_OTP
    
    #put the data returned in user_data
    ctx.user_data["verify_telegram"] = dict(
        otp = code,
        smunch_user_id = data["id"],
        email = escape_markdown(data['email'], version=2)
    )

    await update.message.reply_text(
        f"You are about to link the SMUNCH account registered under <b>{data['email']}</b> with this Telegram "
        f"account <b>@{update.effective_user.username}</b>.\n\nIs this correct?",
        reply_markup=confirm_kb(),
        parse_mode="HTML"
    )

    return CONFIRM_LINK

def confirm_kb():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("✅ Yes", callback_data="CONFIRM_YES"),
         InlineKeyboardButton("❌ No",  callback_data="CONFIRM_NO")]
    ])

# Continue verifying telegram
async def confirm_yes(update, ctx):
    await update.callback_query.answer()
    p = ctx.user_data.get("verify_telegram")
    if not p:
        return

    # Build HMAC signature
    raw = f"{p['otp']}.{update.effective_user.id}"
    signature = hmac.new(BOT_TOKEN.encode(), raw.encode(), hashlib.sha256).hexdigest()

    # Call backend
    # try:
    #     r = requests.post(f"{BACKEND_URL}/api/telegram/confirm-otp", json={
    #         "otp": p["otp"],
    #         "telegram_user_id": update.effective_user.id,
    #         "telegram_handle": update.effective_user.username,
    #         "signature": signature
    #     }, timeout=10)
    #     if r.status_code == 200:
    #         await update.message.edit_text("✅ Verification complete.")
    #     else:
    #         err = r.json().get("error", "Unknown error")
    #         await update.message.edit_text(f"❌ Verification failed: {err}")
    try:
        r = requests.post(f"{BACKEND_URL}/api/telegram/verifyTelegram", json={
            "otp": p["otp"],
            "telegram_user_id": update.effective_user.id,
            "telegram_username": update.effective_user.username,
            "signature": signature
        }, timeout=10)
        if r.status_code == 200:
            await update.callback_query.edit_message_text("✅ Verification complete.")
        else:
            try:
                err = r.json().get("error", "Unknown error")
            except Exception:
                err = r.text or "Unknown error"
            await update.callback_query.edit_message_text(f"❌ Verification failed: {err}")

    except Exception as e:
        await update.callback_query.edit_message_text(f"❌ Verification failed: {err}")
        return ConversationHandler.END

    ctx.user_data.clear()
    await update.callback_query.message.reply_text("Hi again! How may I help you today?", reply_markup=main_menu())
    return ConversationHandler.END

# User say dw to continue verifying
async def confirm_no(update, ctx):
    await update.callback_query.answer()
    await update.callback_query.edit_message_text("❌ Verification cancelled.")
    await update.callback_query.message.reply_text("Hi again! How may I help you today?", reply_markup=main_menu())
    ctx.user_data.clear()
    return ConversationHandler.END

# ─────────────────── SEND PAYMENT SCREENSHOT ───────────────────
async def choose_payment_order(update, ctx):
    await update.callback_query.answer()

    smunch_user_id = ctx.user_data.get("smunch_user_id")

    #For not verified
    if not smunch_user_id:
        await update.callback_query.edit_message_text(
            "❌ Your Telegram account is not linked to any SMUNCH account.\n"
            "Please verify it first through the SMUNCH website.",
            reply_markup=main_menu()
        )
        return

    # Fetch unpaid orders
    try:
        r = requests.get(f"{BACKEND_URL}/api/orders/unpaid", params={
            "user_id": smunch_user_id
        }, timeout=5)
        orders = r.json().get("orders", [])
    except Exception:
        orders = []

    if not orders:
        await update.callback_query.edit_message_text(
            "🎉 You have no pending orders needing payment verification.",
            reply_markup=main_menu()
        )
        return

    # Build the list of orders as inline buttons
    buttons = [
        [InlineKeyboardButton(
            f"{o['merchant']} - {o['delivery_date']} (ID: {o['order_id']})",
            callback_data=f"PAY_SELECT_{o['order_id']}")
        ] for o in orders
    ]

    # Display the orders to select from
    await update.callback_query.edit_message_text(
        "Please select the order you are submitting a payment screenshot for:",
        reply_markup=InlineKeyboardMarkup(buttons)
    )


def main_menu():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("✅ Verify Telegram account", callback_data="VERIFY_TG")],
        [InlineKeyboardButton("💳 Submit payment screenshot", callback_data="PAY_SS")]
    ])

# ─── Conversation Registration ───
conv = ConversationHandler(
    entry_points=[
        CallbackQueryHandler(choose_verify, pattern="^VERIFY_TG$"),
        CommandHandler("verify_telegram", choose_verify),
    ],
    states={
        WAIT_OTP: [MessageHandler(filters.TEXT & ~filters.COMMAND, got_otp)],
        CONFIRM_LINK: [
            CallbackQueryHandler(confirm_yes, pattern="^CONFIRM_YES$"),
            CallbackQueryHandler(confirm_no,  pattern="^CONFIRM_NO$")
        ],
    },
    fallbacks=[],
    conversation_timeout=300,
    #per_message=True,
)

app = Application.builder().token(os.environ["BOT_TOKEN"]).build()
app.add_handler(CommandHandler("start", start))
#app.add_handler(CallbackQueryHandler(choose_verify, pattern="^VERIFY_TG$"))
app.add_handler(CallbackQueryHandler(choose_payment_order, pattern="^PAY_SS$"))
app.add_handler(conv)
app.run_polling()
