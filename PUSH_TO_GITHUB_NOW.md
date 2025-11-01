# 🚀 Push to GitHub - Step by Step

## ⚠️ Step 0: Install Git First

Git is not currently installed on your system. Install it:

### Install Git:
1. Download: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (click "Next" through everything)
4. **Restart your terminal/PowerShell** after installation

---

## ✅ After Installing Git, Run These Commands:

### Step 1: Open PowerShell in your project folder
```
C:\Users\dell\Project
```

### Step 2: Initialize Git
```bash
git init
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Configure Git (one-time setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Create First Commit
```bash
git commit -m "Initial commit - AI Assistant Hub"
```

---

## 📋 Create GitHub Repository

### Step 6: Go to GitHub
1. Open: https://github.com/new
2. Repository name: `ai-assistant-hub`
3. Description: "AI Assistant Hub - Music, Movies, Books & Sports"
4. Choose **Public** or **Private**
5. **DO NOT** check "Add a README file"
6. Click **"Create repository"**

### Step 7: Copy Repository URL
After creating, GitHub will show you commands. Copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/ai-assistant-hub.git
```

---

## 🚀 Push to GitHub

### Step 8: Add Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-assistant-hub.git
```
(Replace YOUR_USERNAME with your actual GitHub username)

### Step 9: Rename Branch
```bash
git branch -M main
```

### Step 10: Push!
```bash
git push -u origin main
```

You'll be prompted to login:
- Enter your GitHub username
- Enter your password (or Personal Access Token if using 2FA)

---

## 🎉 Done!

Your code is now on GitHub! 

Next step: Deploy to Vercel
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Add environment variables
5. Deploy!

---

## 🔄 Update Code (Later)

Whenever you make changes:
```bash
git add .
git commit -m "Your update message"
git push
```

---

## 💡 Quick Reference

```bash
# Initial setup (one time)
git init
git add .
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-assistant-hub.git
git branch -M main
git push -u origin main

# Updates (every time)
git add .
git commit -m "Update message"
git push
```

