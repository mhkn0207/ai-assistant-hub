@echo off
echo.
echo ========================================
echo   Building Your AI Assistant App...
echo ========================================
echo.

npm run build

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Please fix errors and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deploying to Firebase Hosting...
echo ========================================
echo.

firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo.
    echo Deployment failed! Make sure you're logged in: firebase login
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Your app is live! 🎉
echo ========================================
echo.
echo Check the URL above - share it with your friends!
echo.
pause

