# 🚀 Quick Start Script for PowerShell

## To Start the Dev Server:

Instead of just `npm run dev`, use this **one-liner** in PowerShell:

```powershell
cd C:\Users\dell\Project; $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm run dev
```

This will:
1. Navigate to your project
2. Refresh the PATH
3. Start the dev server

---

## Or Use Command Prompt Instead:

If PowerShell keeps having issues, use **Command Prompt (cmd)**:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Run:
   ```cmd
   cd C:\Users\dell\Project
   npm run dev
   ```

Command Prompt usually doesn't have PATH issues.

---

## Current Status:

✅ API key updated  
✅ API endpoint fixed (using v1 with gemini-1.5-flash)  
✅ Server should be starting  

**Check your terminal** - you should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Then test the Spotify AI - it should work now! 🎉

