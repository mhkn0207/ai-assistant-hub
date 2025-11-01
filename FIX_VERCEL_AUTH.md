# 🔧 Fix "Failed to sign in" on Vercel

## ⚠️ The Problem

When deployed to Vercel, Google Sign-In fails because Firebase doesn't recognize your Vercel domain as an authorized domain.

## ✅ Quick Fix - Add Vercel Domain to Firebase

### Step 1: Get Your Vercel URL

After deployment, your app will have a URL like:
- `https://ai-assistant-hub.vercel.app`
- or `https://ai-assistant-hub-[random].vercel.app`

**Copy your exact Vercel URL!**

---

### Step 2: Add Domain to Firebase Authorized Domains

1. **Go to Firebase Console:**
   👉 https://console.firebase.google.com/project/ai-assistant-f93c5/authentication/settings

2. **Scroll down to "Authorized domains"**

3. **Click "Add domain"**

4. **Enter your Vercel domain** (without https://):
   ```
   ai-assistant-hub.vercel.app
   ```
   or
   ```
   ai-assistant-hub-[random].vercel.app
   ```

5. **Click "Add"**

6. **Also add** (if not already there):
   - `localhost` (for local development)
   - Your custom domain (if you have one)

---

### Step 3: Verify Environment Variables in Vercel

Make sure ALL environment variables are set in Vercel:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Verify all 7 variables are present:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GEMINI_API_KEY`

4. Make sure they're set for **"Production"** environment

---

### Step 4: Redeploy (if needed)

If you changed environment variables:
1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** on the latest deployment

---

## ✅ After Fixing

1. **Wait 1-2 minutes** for Firebase to update
2. **Refresh your Vercel app**
3. **Try signing in again** - it should work! 🎉

---

## 🔍 Common Issues

### Issue 1: Still getting "Failed to sign in"

**Solution**: 
- Check browser console (F12) for detailed errors
- Verify all environment variables are correct
- Make sure domain is exactly as shown in Vercel (no typos)

### Issue 2: "Unauthorized domain" error

**Solution**:
- Double-check the domain you added matches your Vercel URL exactly
- Make sure you added it to the correct Firebase project

### Issue 3: Environment variables not working

**Solution**:
- Make sure variables start with `VITE_`
- Redeploy after adding/updating variables
- Check Vercel deployment logs for errors

---

## 📋 Quick Checklist

- [ ] Added Vercel domain to Firebase Authorized Domains
- [ ] All 7 environment variables set in Vercel
- [ ] Environment variables set for "Production"
- [ ] Redeployed (if changed variables)
- [ ] Tested sign-in on Vercel URL

---

## 🔗 Quick Links

- **Firebase Auth Settings**: https://console.firebase.google.com/project/ai-assistant-f93c5/authentication/settings
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Environment Variables**: (In your project → Settings → Environment Variables)

---

After adding your Vercel domain, sign-in should work! 🚀

