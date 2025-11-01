# 📋 Next Steps Checklist

## ✅ Step 1: Install Node.js
- **Download:** https://nodejs.org/ (choose LTS version)
- **Install:** Run the installer (includes npm automatically)
- **Verify:** Open a NEW terminal and run:
  ```bash
  node --version
  npm --version
  ```

---

## ✅ Step 2: Set Up Firebase Project

1. **Go to:** https://console.firebase.google.com/
2. **Click:** "Add Project" or "Create a project"
3. **Enter project name:** (e.g., "ai-study-assistant")
4. **Disable Google Analytics** (optional, for free tier)
5. **Click:** "Create project"

### Enable Authentication:
- Go to **Authentication** → **Get Started**
- Click **Sign-in method** tab
- Enable **Google** provider
- Add your email as a test user (optional)

### Create Firestore Database:
- Go to **Firestore Database** → **Create database**
- Choose **Start in test mode** (for development)
- Select a location (closest to you)
- Click **Enable**

### Get Your Firebase Config:
- Go to **Project Settings** (gear icon) → **General**
- Scroll to **Your apps** section
- Click the **Web** icon (`</>`) to add a web app
- Register app with a nickname (e.g., "web")
- **Copy the `firebaseConfig` values**

---

## ✅ Step 3: Get Gemini API Key

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click:** "Create API Key"
4. **Copy** the API key (you can create a new key if needed)

---

## ✅ Step 4: Create .env File

Once you have your Firebase config and Gemini API key:

1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```
   (Or manually create `.env` file in the project root)

2. Open `.env` and replace the placeholder values:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy... (your actual Firebase API key)
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   
   VITE_GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

---

## ✅ Step 5: Install Dependencies

After Node.js is installed, open terminal in project folder and run:

```bash
npm install
```

This will install:
- React & React DOM
- React Router
- Firebase SDK
- Vite
- Tailwind CSS
- And all other dependencies

---

## ✅ Step 6: Run the Project

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open:** http://localhost:5173 in your browser

---

## ✅ Step 7: Test the App

1. You should see the **Login page**
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You'll be redirected to the **Dashboard**
5. Click **"Create New Note"**
6. Type some notes and test the AI features!

---

## 🚨 Troubleshooting

### If `npm install` fails:
- Make sure Node.js is installed and terminal is restarted
- Try: `npm install --legacy-peer-deps`

### If Firebase auth doesn't work:
- Check that Google Sign-In is enabled in Firebase Console
- Verify your `.env` file has correct values
- Make sure you're using the web app config (not Android/iOS)

### If Gemini API errors:
- Verify your API key is correct
- Check that the key has proper permissions
- Make sure you're using the free tier (no credit card needed)

### If port 5173 is in use:
- Vite will automatically use the next available port
- Check the terminal output for the actual URL

---

## 📦 Ready to Deploy?

After testing locally, deploy to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting
# Select: dist, Yes (SPA), No (don't overwrite)

# Build and deploy
npm run build
firebase deploy
```

---

**Need help?** Check the `README.md` or `SETUP.md` files for more details.

