# backendbot.py
import os
from flask import Flask, request, jsonify
import redis
import requests
import random
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") 


redis_url = os.getenv("REDIS_URL")  
r = redis.from_url(redis_url, decode_responses=True)


@app.route('/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()
    handle = data.get("telegram_handle")

    if not handle:
        return jsonify({"error": "telegram_handle is required"}), 400

    otp = str(random.randint(100000, 999999))
    r.setex(f"otp:{otp}", 300, handle)

    telegram_link = f"https://t.me/smunch_bot?start=verify_{otp}"  # replace your_bot_username

    print(f"generated otp:{otp} for handle:{handle}")
    return jsonify({
        "otp": otp,
        "telegram_link": telegram_link
    })


# generate otp and return telegram link
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    otp = data.get("otp")
    handle = data.get("telegram_handle")

    redis_from_user = r.get(f"otp:{otp}")
    redis_from_bot = r.get(f"tele_verify:{otp}")

    print(" verifying otp:", otp)
    print(" handle from user:", handle)
    print(" redis_from_user:", redis_from_user)
    print(" redis_from_bot:", redis_from_bot)

    # check if both redis values match
    if redis_from_user == handle and redis_from_bot == handle:
        print(" verification passed")

        SUPABASE_URL = os.getenv("SUPABASE_URL")
        SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        SUPABASE_USER_TABLE = "users"  # change if needed

        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        update_payload = {
            "telegram_handle": handle,
            "telegram_verified": True
        }

        response = requests.patch(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_USER_TABLE}?telegram_handle=eq.{handle}",
            headers=headers,
            json=update_payload
        )

        if response.status_code == 200:
            print(" user updated in Supabase")
        else:
            print(" failed to update user:", response.text)
        

        return jsonify({'verified': True})
    
    print(" verification failed")
    return jsonify({'verified': False}), 400


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)