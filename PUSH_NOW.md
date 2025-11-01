# 🚀 Push to GitHub - Commands to Run

Since Git is installed, you just need to **restart your PowerShell** or **open a new terminal**.

Then run these commands in order:

## Step-by-Step Commands

### 1. Navigate to your project (if not already there)
```bash
cd C:\Users\dell\Project
```

### 2. Initialize Git (if not done)
```bash
git init
```

### 3. Configure Git (one-time, replace with your info)
```bash
git config --global user.name "mhkn0207"
git config --global user.email "your.email@example.com"
```

### 4. Add all files
```bash
git add .
```

### 5. Create first commit
```bash
git commit -m "Initial commit - AI Assistant Hub"
```

### 6. Add GitHub remote
```bash
git remote add origin https://github.com/mhkn0207/ai-assistant-hub.git
```

### 7. Rename branch to main
```bash
git branch -M main
```

### 8. Push to GitHub
```bash
git push -u origin main
```

---

## All-in-One Script

Or run this script: **push-to-github.bat**

Just double-click it and follow the prompts!

---

## After Pushing ✅

Your code will be live at:
👉 https://github.com/mhkn0207/ai-assistant-hub

Then deploy to Vercel:
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Add environment variables from `.env`
5. Deploy!

---

## If Git Still Not Recognized

**Restart your terminal/PowerShell** after installing Git, or:

1. Open a **new** PowerShell window
2. Navigate to: `cd C:\Users\dell\Project`
3. Run the commands above

---

Your repository is ready: https://github.com/mhkn0207/ai-assistant-hub.git 🚀

