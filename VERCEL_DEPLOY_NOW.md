# 🚀 Deploy to Vercel - Step by Step

Your code is on GitHub: https://github.com/mhkn0207/ai-assistant-hub

Now deploy to Vercel in 5 minutes:

---

## Step 1: Sign Up/Login to Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. You'll be redirected to Vercel dashboard

---

## Step 2: Import Your Repository

1. Click **"Add New Project"** button (top right)
2. Find your repository: **`mhkn0207/ai-assistant-hub`**
3. Click **"Import"** button next to it

---

## Step 3: Configure Project Settings

Vercel will auto-detect Vite settings, but verify:

- **Framework Preset**: `Vite` ✓
- **Root Directory**: `./` ✓
- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist` ✓
- **Install Command**: `npm install` ✓

**All settings should be correct by default!** Just verify them.

---

## Step 4: Add Environment Variables ⚠️ CRITICAL!

**Before clicking "Deploy", click "Environment Variables"**

Add ALL 7 environment variables from your `.env` file:

### Click "Add" for each:

1. **Key**: `VITE_FIREBASE_API_KEY`
   **Value**: (copy from your `.env` file)

2. **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
   **Value**: (copy from your `.env` file)

3. **Key**: `VITE_FIREBASE_PROJECT_ID`
   **Value**: (copy from your `.env` file)

4. **Key**: `VITE_FIREBASE_STORAGE_BUCKET`
   **Value**: (copy from your `.env` file)

5. **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   **Value**: (copy from your `.env` file)

6. **Key**: `VITE_FIREBASE_APP_ID`
   **Value**: (copy from your `.env` file)

7. **Key**: `VITE_GEMINI_API_KEY`
   **Value**: (copy from your `.env` file)

**⚠️ IMPORTANT**: Make sure all 7 variables are added!
**⚠️ Make sure environment is set to "Production" for all**

---

## Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait ~2-3 minutes
3. Watch the build progress
4. When done, you'll see: **"Congratulations! Your project has been deployed"**

---

## Step 6: Get Your Live URL! 🎉

After deployment, you'll get a URL like:
```
https://ai-assistant-hub.vercel.app
```

**This is your shareable link!** Send it to friends! 🌍

---

## 🔄 Update Your App

Every time you push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will **automatically deploy** the new version! ✨

---

## ✅ Quick Checklist

- [ ] Signed up for Vercel with GitHub
- [ ] Imported `mhkn0207/ai-assistant-hub` repository
- [ ] Verified project settings (Vite, build command, output dir)
- [ ] Added all 7 environment variables
- [ ] Clicked "Deploy"
- [ ] Got the live URL!

---

## 🆘 Troubleshooting

**Build fails?**
- Check that all environment variables are added
- Make sure variable names start with `VITE_`
- Check build logs in Vercel dashboard

**App doesn't work?**
- Verify all 7 environment variables are set correctly
- Check browser console for errors
- Make sure Firebase and Gemini API keys are valid

**Need help?**
- Check Vercel deployment logs
- Verify your `.env` file values match Vercel environment variables

---

Your repository: https://github.com/mhkn0207/ai-assistant-hub
Deploy at: https://vercel.com/new

🚀 Good luck with your deployment!

