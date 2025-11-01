@echo off
echo.
echo ========================================
echo   Install Git and Push to GitHub
echo ========================================
echo.

echo Checking if Git is installed...
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
echo.
echo Current Git version:
git --version
echo.
echo ========================================
echo   Setting Up Repository
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Failed to initialize git.
    pause
    exit /b 1
)
echo ✅ Repository initialized
echo.

echo Step 2: Adding all files...
git add .
if %errorlevel% neq 0 (
    echo Failed to add files.
    pause
    exit /b 1
)
echo ✅ Files added
echo.

echo Step 3: Checking if this is first commit...
git log >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating initial commit...
    git commit -m "Initial commit - AI Assistant Hub"
    if %errorlevel% neq 0 (
        echo.
        echo Note: If you see errors about user.name/user.email:
        echo Run these commands first:
        echo   git config --global user.name "Your Name"
        echo   git config --global user.email "your@email.com"
        echo.
        pause
        exit /b 1
    )
    echo ✅ Initial commit created
) else (
    echo ✅ Repository already has commits
)
echo.

echo ========================================
echo   Ready to Push!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Create a GitHub repository:
echo    Go to: https://github.com/new
echo    Name: ai-assistant-hub
echo    DO NOT check "Add README"
echo    Click "Create repository"
echo.
echo 2. Copy the repository URL from GitHub
echo.
echo 3. Run these commands:
echo    git remote add origin YOUR_REPO_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo Or follow the instructions in: PUSH_TO_GITHUB_NOW.md
echo.
pause

