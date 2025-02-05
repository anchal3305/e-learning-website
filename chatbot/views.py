import os
import requests
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# Manually load .env
load_dotenv()

# Fetch API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print(f"🔹 GEMINI_API_KEY (Loaded in views.py): {GEMINI_API_KEY}")  # Debugging print

if not GEMINI_API_KEY:
    print("⚠️ GEMINI_API_KEY is still missing! Check your .env file or environment variables.")

@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_response(request):
    if not GEMINI_API_KEY:
        return Response({"response": "Gemini API key is missing."}, status=500)

    user_message = request.data.get("message", "")
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": user_message}]}]}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        bot_reply = response_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Sorry, I couldn't understand.")

        return Response({"response": bot_reply})

    except Exception as e:
        return Response({"response": f"Error with Gemini API: {str(e)}"}, status=500)
