@echo off
:: unregister.cmd — Remove MD Viewer file association
:: Must run as Administrator

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Please run this script as Administrator.
    echo Right-click ^> Run as administrator
    pause
    exit /b 1
)

echo.
echo Removing MD Viewer file association...
echo.

reg delete "HKEY_CLASSES_ROOT\MDViewer.Markdown" /f >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.md\OpenWithProgids" /v "MDViewer.Markdown" /f >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.markdown\OpenWithProgids" /v "MDViewer.Markdown" /f >nul 2>&1

echo.
echo Done! MD Viewer association removed.
echo You may need to re-set the default app for .md files in Settings.
echo.
pause
