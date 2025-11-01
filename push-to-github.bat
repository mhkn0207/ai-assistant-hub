@echo off
echo.
echo ========================================
echo   Push to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/mhkn0207/ai-assistant-hub.git
echo.

echo Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Git is NOT installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script
    echo.
    echo Opening download page...
    start https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed!
git --version
echo.

echo ========================================
echo   Setting Up Repository
echo ========================================
echo.

if not exist ".git" (
    echo Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo Failed to initialize git.
        pause
        exit /b 1
    )
    echo ✅ Repository initialized
) else (
    echo ✅ Git repository already initialized
)
echo.

echo Checking Git configuration...
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Git user.name not set!
    echo Please set your name:
    git config --global user.name "mhkn0207"
    git config --global user.email "your.email@example.com"
    echo.
    echo Note: Update email in the script or run manually
)
echo.

echo Adding all files...
git add .
if %errorlevel% neq 0 (
    echo Failed to add files.
    pause
    exit /b 1
)
echo ✅ Files added
echo.

echo Checking for existing commits...
git log --oneline -1 >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating initial commit...
    git commit -m "Initial commit - AI Assistant Hub"
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️ Commit failed. Make sure Git is configured:
        echo   git config --global user.name "Your Name"
        echo   git config --global user.email "your@email.com"
        pause
        exit /b 1
    )
    echo ✅ Initial commit created
) else (
    echo ✅ Repository already has commits
)
echo.

echo ========================================
echo   Setting Up Remote
echo ========================================
echo.

git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Adding remote repository...
    git remote add origin https://github.com/mhkn0207/ai-assistant-hub.git
    echo ✅ Remote added
) else (
    echo Checking remote URL...
    git remote set-url origin https://github.com/mhkn0207/ai-assistant-hub.git
    echo ✅ Remote configured
)
echo.

echo ========================================
echo   Pushing to GitHub
echo ========================================
echo.

git branch -M main
echo ✅ Branch renamed to 'main'
echo.

echo Pushing to GitHub...
echo (You may be prompted for GitHub credentials)
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Push failed!
    echo.
    echo Possible reasons:
    echo 1. Not logged in to GitHub - use: git push -u origin main
    echo 2. Wrong credentials - check your GitHub username/password
    echo 3. Repository permissions - make sure you have access
    echo.
    echo Try manually: git push -u origin main
) else (
    echo.
    echo ========================================
    echo   ✅ SUCCESS! Code Pushed to GitHub!
    echo ========================================
    echo.
    echo Your code is now at:
    echo https://github.com/mhkn0207/ai-assistant-hub
    echo.
    echo Next: Deploy to Vercel!
    echo Go to: https://vercel.com
    echo.
)

pause

