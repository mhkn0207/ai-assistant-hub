# 📝 How to Fill Your .env File

Open `.env` in your project root and replace with your actual values:

## Example .env File:

```env
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
VITE_FIREBASE_AUTH_DOMAIN=ai-study-assistant-abc123.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-study-assistant-abc123
VITE_FIREBASE_STORAGE_BUCKET=ai-study-assistant-abc123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Gemini API Configuration (from Google AI Studio)
VITE_GEMINI_API_KEY=AIzaSyAbc123xyz789YourActualGeminiKeyHere
```

## ⚠️ Important Notes:

1. **NO SPACES** around the `=` sign
2. **NO QUOTES** around the values
3. Make sure each value is on a **separate line**
4. Don't commit `.env` to git (it's already in `.gitignore`)

## Where to Find Each Value:

### Firebase Values:
- Go to: Firebase Console → Your Project → ⚙️ Settings → General
- Scroll to "Your apps" → Web app → Config
- Copy the values from `firebaseConfig` object

### Gemini API Key:
- Go to: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key

