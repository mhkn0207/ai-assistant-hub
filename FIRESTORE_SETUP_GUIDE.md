# 🔥 Firestore Setup Guide - Fix 400 Errors

## 🎯 Quick Fix for Firestore 400 Errors

The `400 Bad Request` errors mean **Firestore database hasn't been set up yet**. Follow these steps:

## ✅ Step-by-Step Setup

### 1. Go to Firebase Console
Open: https://console.firebase.google.com/project/ai-assistant-f93c5/firestore

### 2. Create Firestore Database
- Click **"Create database"** button (top right)
- Choose **"Start in test mode"** for development
- Select a **location** (choose closest to you - e.g., `us-central`, `asia-south1`)
- Click **"Enable"**
- ⏰ **Wait 1-2 minutes** for database to initialize

### 3. Verify Database is Active
- You should see **"Active"** status in green
- Database location should be visible
- Collection count should be 0

### 4. Set Firestore Security Rules (Important!)

Go to: https://console.firebase.google.com/project/ai-assistant-f93c5/firestore/rules

Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"** to save the rules.

### 5. Refresh Your App
- Go back to your app: http://localhost:5173
- **Hard refresh**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- The 400 errors should disappear!

## 🎉 What Works After Setup

✅ **My Lists Feature** - Save songs, movies, books  
✅ **Calendar Scheduling** - Schedule when to watch/read/listen  
✅ **Study Notes** - Create and save study notes  
✅ **Firestore Persistence** - All data saved in database  

## 🚨 If Still Getting Errors

### Check These:
1. **Firestore Status**: Make sure it shows "Active" in Firebase Console
2. **Location**: Ensure you selected a valid location
3. **Rules**: Security rules should be published
4. **Browser**: Try incognito mode or clear cache
5. **Wait**: Sometimes takes 2-5 minutes for Firestore to fully initialize

### Common Issues:

**Issue**: "Database location is not available"
- **Fix**: Choose a different location in Firebase Console

**Issue**: "Permission denied"
- **Fix**: Check your security rules match the code above

**Issue**: "Network error"
- **Fix**: Check internet connection, try different network

**Issue**: Still seeing 400 errors after 5 minutes
- **Fix**: Go to Firebase Console → Firestore → Settings → Check status

## 📱 Test Firestore Setup

After setup, test by:
1. Go to **Spotify AI** or **Movie AI**
2. Get recommendations
3. Click **"Add to List"** on any item
4. If successful, you'll see "Added!" confirmation
5. Go to **"My Lists"** in navbar to see saved items

## 🔗 Quick Links

- **Firebase Console**: https://console.firebase.google.com/
- **Firestore Console**: https://console.firebase.google.com/project/ai-assistant-f93c5/firestore
- **Security Rules**: https://console.firebase.google.com/project/ai-assistant-f93c5/firestore/rules
- **Project Settings**: https://console.firebase.google.com/project/ai-assistant-f93c5/settings/general

---

**Note**: The AI features (Spotify, Movie, Book recommendations) work without Firestore! Only the "Add to List" and "Study Notes" features require Firestore to be set up.

