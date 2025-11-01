# 🚀 Deploy to Vercel via GitHub

## Step-by-Step Guide

### Step 1: Initialize Git (if not done)
```bash
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Create First Commit
```bash
git commit -m "Initial commit - AI Assistant Hub"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (name it whatever you want, e.g., "ai-assistant-hub")
3. **DO NOT** initialize with README
4. Copy the repository URL

### Step 5: Connect to GitHub
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 6: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add all your `.env` variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_GEMINI_API_KEY`
7. Click "Deploy"

### Step 7: Get Your Live URL! 🎉
Vercel will give you a URL like:
```
https://ai-assistant-hub.vercel.app
```

**This is your shareable link!** Send it to your friends! 🌍

---

## Quick Commands Summary

```bash
# 1. Initialize git
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

Then go to https://vercel.com and import your repo!

---

## Update Your App

Every time you make changes:
1. `git add .`
2. `git commit -m "Your update message"`
3. `git push`
4. Vercel automatically deploys! ✨

---

## Notes

- ✅ Vercel is FREE
- ✅ Auto-deploys on every push
- ✅ Fast CDN worldwide
- ✅ Custom domain support (optional)

