@echo off
echo.
echo ========================================
echo   Setting Up GitHub Repository
echo ========================================
echo.

echo Step 1: Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo Git is installed! ✓
echo.

echo Step 2: Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Failed to initialize git repository.
    pause
    exit /b 1
)

echo.
echo Step 3: Adding all files...
git add .
if %errorlevel% neq 0 (
    echo Failed to add files.
    pause
    exit /b 1
)

echo.
echo Step 4: Creating initial commit...
git commit -m "Initial commit - AI Assistant Hub"
if %errorlevel% neq 0 (
    echo.
    echo NOTE: If you see "nothing to commit", files are already committed.
    echo This is OK - continue to next step!
    echo.
    pause
)

echo.
echo ========================================
echo   ✓ Git Repository Ready!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to: https://github.com/new
echo 2. Create a new repository (don't add README)
echo 3. Copy the repository URL
echo 4. Run these commands:
echo.
echo    git remote add origin YOUR_REPO_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo Then go to https://vercel.com and import your repo!
echo.
pause

