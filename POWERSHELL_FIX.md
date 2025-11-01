# 🔧 PowerShell npm Fix

If you see `npm is not recognized` in PowerShell, use this fix:

## Quick Fix (Temporary - for this session only):

Copy and paste this in your PowerShell:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then run:
```powershell
npm run dev
```

---

## Permanent Fix (Recommended):

To make npm available permanently in PowerShell:

1. **Close your current PowerShell window**

2. **Open a NEW PowerShell window** (Windows will refresh PATH automatically)

3. **Verify npm works:**
   ```powershell
   npm --version
   ```

4. **If still not working**, restart your computer (Windows refreshes PATH on restart)

---

## Alternative: Use Command Prompt instead

If PowerShell keeps having issues, you can use **Command Prompt (cmd)** instead:

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd C:\Users\dell\Project
   ```
4. Run:
   ```cmd
   npm run dev
   ```

---

## Quick Reference:

- **PowerShell**: May need PATH refresh
- **Command Prompt**: Usually works without issues
- **Terminal (VS Code)**: Usually works (inherits PATH)

