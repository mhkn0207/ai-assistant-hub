# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and create a new project
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Google" provider
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (you can secure it later)
5. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps" → Web app
   - Copy the `firebaseConfig` values

## Step 3: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and fill in your values:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## Step 5: Update Firebase Config

Edit `src/services/firebase.js` and replace the placeholder values, OR use the environment variables (already set up).

## Step 6: Run the App

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Step 7: (Optional) Set Up Firestore Security Rules

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 8: Deploy to Firebase Hosting

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login
firebase login

# Initialize (if needed)
firebase init hosting
# Select: dist, Yes (SPA), No (don't overwrite)

# Build and deploy
npm run build
firebase deploy
```

---

**That's it! Your AI Study Assistant is ready to use! 🎉**

