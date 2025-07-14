import os
import redis
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# load env
load_dotenv()

# get credentials
BOT_TOKEN = os.getenv("BOT_TOKEN")
REDIS_URL = os.getenv("REDIS_URL")

# to check if its accessible
print(" BOT_TOKEN:", BOT_TOKEN)
print(" REDIS_URL:", REDIS_URL)

# test redis
try:
    r = redis.from_url(REDIS_URL, decode_responses=True)
    r.ping()
    print(" redis connected")
except Exception as e:
    print(" redis connection failed:", e)
    r = None

# start handler
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        print("🔹 /start called")
        args = context.args
        print("🔹 args received:", args)

        if not args:
            await update.message.reply_text("missing verification code.")
            return

        arg = args[0]
        if arg.startswith('verify_'):
            otp = arg.split('_')[1]
            handle = update.message.from_user.username or "(no username)"

            print(f"🔹 storing tele_verify:{otp} → {handle}")

            if r:
                try:
                    r.setex(f"tele_verify:{otp}", 300, handle)
                    print(" redis setex success")
                except Exception as redis_err:
                    print(" redis setex failed:", redis_err)
            else:
                print(" redis client not available")

            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"hi @{handle}! otp received. please go back to smunch to complete verification."
            )
        else:
            await update.message.reply_text("invalid verification format.")
    except Exception as e:
        print(" bot error:", e)
        await update.message.reply_text("something went wrong.")

# bot runner
def run_bot():
    print(" starting bot...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print(" bot is now running and listening...")
    app.run_polling()

# run
if __name__ == "__main__":
    run_bot()



