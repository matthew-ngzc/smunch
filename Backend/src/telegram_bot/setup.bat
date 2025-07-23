@echo off
REM ─────────────────────────────────────────────────────
REM SMUNCH Telegram Bot Setup Script
REM Run this once to set up the virtual environment
REM ─────────────────────────────────────────────────────

echo [INFO] Creating virtual environment...
python -m venv venv

IF ERRORLEVEL 1 (
  echo [ERROR] Failed to create virtual environment.
  pause
  exit /b 1
)

echo [INFO] Installing dependencies from requirements.txt...
venv\Scripts\python.exe -m pip install --upgrade pip
venv\Scripts\python.exe -m pip install -r requirements.txt

IF ERRORLEVEL 1 (
  echo [ERROR] Failed to install dependencies.
  pause
  exit /b 1
)

echo [INFO] Setup complete! You can now run start_bot.bat
pause
