# 🔄 How to Restart the Dev Server

After updating your `.env` file, you need to restart the dev server:

## Steps:

1. **Stop the current server:**
   - Go to your terminal/PowerShell
   - Press `Ctrl + C`
   - Wait for it to stop

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **The server will restart and load your new `.env` values**

4. **Open in browser:**
   - Go to: http://localhost:5173
   - You should see the Login page!

---

## ✅ Verify It's Working:

1. You should see the **Login page** (not errors)
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You'll be redirected to the **Dashboard**
5. Click **"Create New Note"**
6. Try typing some notes and test the AI features!

---

## 🚨 If You See Errors:

- **Firebase errors:** Check your `.env` file values
- **Gemini errors:** Verify your API key is correct
- **Auth errors:** Make sure Google Sign-In is enabled in Firebase
- **Firestore errors:** Ensure Firestore database is created

