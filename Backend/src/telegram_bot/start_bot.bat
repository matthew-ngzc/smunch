@echo off
REM ───────────────────────────────────────────────────────
REM SMUNCH Telegram Bot Launcher
REM Runs the bot using the virtual environment's Python
REM ───────────────────────────────────────────────────────

echo [INFO] Checking Python version inside venv...
venv\Scripts\python.exe --version

echo [INFO] Confirming Python executable path...
venv\Scripts\python.exe -c "import sys; print('Running from:', sys.executable)"

echo [INFO] Running Telegram bot...
venv\Scripts\python.exe tele_bot.py

echo [INFO] Bot stopped. Press any key to exit.
pause
