@echo off
echo.
echo ========================================
echo   Starting Your App with Network Access
echo ========================================
echo.
echo Your app will be available on your local network!
echo.
echo After it starts, look for:
echo   Network: http://YOUR_IP:5173
echo.
echo Share that URL with friends on the same WiFi!
echo.
pause
echo.

npm run dev -- --host

