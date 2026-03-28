@echo off
:: register.cmd — Register .md files to open with MD Viewer web app
:: Must run as Administrator

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Please run this script as Administrator.
    echo Right-click ^> Run as administrator
    pause
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
:: Remove trailing backslash for clean path
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

set "CMD_PATH=%SCRIPT_DIR%\open-md.cmd"

echo.
echo ========================================
echo  MD Viewer - Windows File Association
echo ========================================
echo.
echo Script path: %CMD_PATH%
echo.

:: Step 1: Register ProgId in HKCR
echo [1/3] Registering file type in registry...
reg add "HKEY_CLASSES_ROOT\.md" /ve /d "MDViewer.Markdown" /f >nul
reg add "HKEY_CLASSES_ROOT\.markdown" /ve /d "MDViewer.Markdown" /f >nul
reg add "HKEY_CLASSES_ROOT\MDViewer.Markdown" /ve /d "Markdown Document (MD Viewer)" /f >nul
reg add "HKEY_CLASSES_ROOT\MDViewer.Markdown\DefaultIcon" /ve /d "shell32.dll,70" /f >nul
reg add "HKEY_CLASSES_ROOT\MDViewer.Markdown\shell\open\command" /ve /d "\"%CMD_PATH%\" \"%%1\"" /f >nul

:: Step 2: Use assoc/ftype as backup
echo [2/3] Setting assoc and ftype...
assoc .md=MDViewer.Markdown >nul 2>&1
assoc .markdown=MDViewer.Markdown >nul 2>&1
ftype MDViewer.Markdown="%CMD_PATH%" "%%1" >nul 2>&1

:: Step 3: Register in OpenWithProgids so it appears in "Open with" menu
echo [3/3] Adding to Open With list...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.md\OpenWithProgids" /v "MDViewer.Markdown" /t REG_NONE /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.markdown\OpenWithProgids" /v "MDViewer.Markdown" /t REG_NONE /f >nul 2>&1

echo.
echo Registry and file association updated!
echo.
echo ========================================
echo  IMPORTANT: Complete the setup
echo ========================================
echo.
echo Windows 11 requires manual confirmation for default apps.
echo Please follow these steps:
echo.
echo   1. Right-click any .md file in File Explorer
echo   2. Select "Open with" ^> "Choose another app"
echo   3. Scroll down and click "More apps" or "Look for another app"
echo   4. Browse to: %CMD_PATH%
echo   5. Check "Always use this app to open .md files"
echo   6. Click OK
echo.
echo Alternatively:
echo   Settings ^> Apps ^> Default apps ^> search ".md" ^> select MD Viewer
echo.
pause
