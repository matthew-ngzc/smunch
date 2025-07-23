# SMUNCH Telegram Bot

This bot helps users verify their Telegram accounts and interact with the SMUNCH food ordering system.

## 🛠️ One-Time Setup (First Run)

> Run these commands from the `telegram_bot/` directory.

### Option A: Manual Setup (for Linux/macOS or advanced users)

#### 1. Create a Virtual Environment

```bash
python -m venv venv
```

#### 2. Activate the Environment

* **Windows**:

  ```bash
  venv\Scripts\activate
  ```
* **macOS/Linux**:

  ```bash
  source venv/bin/activate
  ```

#### 3. Install Required Packages

```bash
pip install -r requirements.txt
```

### Option B: Automated Setup (Windows only)

Run the following file:

```bash
setup.bat
```

This will create the virtual environment and install all dependencies automatically.

---

## 🚀 Running the Bot

> These steps are for daily development or deployment.

### Option A: Manual Run (Cross-platform)

#### 1. Activate the Virtual Environment

* **Windows**:

  ```bash
  venv\Scripts\activate
  ```
* **macOS/Linux**:

  ```bash
  source venv/bin/activate
  ```

#### 2. Run the Bot

```bash
python tele_bot.py
```

#### 3. Stop the Bot

Use `Ctrl + C` in the terminal.

#### 4. Deactivate the Virtual Environment

```bash
deactivate
```

### Option B: Quick Run (Windows only)

Use the `.bat` launcher:

```bash
start_bot.bat
```

This will run the bot directly using the virtual environment's Python.

---

## 📦 Adding New Dependencies

If you install new Python packages:

### 1. Install the package

```bash
pip install <package-name>
```

### 2. Regenerate `requirements.txt`

You can do this manually:

```bash
# Windows
powershell -Command "Remove-Item requirements.txt"

# macOS/Linux
rm requirements.txt

# Then regenerate
pip freeze > requirements.txt
```

Or use the helper batch file (Windows only):

```bash
update_dependencies.bat
```

---
