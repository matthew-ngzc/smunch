@echo off
REM Activate virtual env and regenerate requirements.txt

call venv\Scripts\activate

echo [INFO] Deleting old requirements.txt...
del requirements.txt

echo [INFO] Freezing dependencies...
pip freeze > requirements.txt

echo [INFO] Done.
pause
