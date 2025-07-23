# SMUNCH Telegram Bot

This bot helps users verify their Telegram accounts and interact with the SMUNCH food ordering system.

## 🛠️ One-Time Setup (First Run)

> Run these commands from the `telegram_bot/` directory.

### 1. Create a Virtual Environment

```bash
python -m venv venv
```

### 2. Activate the Environment

* **Windows**:

  ```bash
  venv\Scripts\activate
  ```
* **macOS/Linux**:

  ```bash
  source venv/bin/activate
  ```

### 3. Install Required Packages

```bash
pip install -r requirements.txt
```

---

## 🚀 Running the Bot

> These steps are for daily development or deployment.

### 1. Activate the Virtual Environment

* **Windows**:

  ```bash
  venv\Scripts\activate
  ```
* **macOS/Linux**:

  ```bash
  source venv/bin/activate
  ```

### 2. Run the Bot

```bash
python tele_bot.py
```

### 3. Stop the Bot

Use `Ctrl + C` in the terminal.

### 4. Deactivate the Virtual Environment

```bash
deactivate
```

---

## 📦 Adding New Dependencies

If you install new Python packages:

### 1. Install the package

```bash
pip install <package-name>
```

### 2. Regenerate `requirements.txt`

```bash
# Windows
powershell -Command "Remove-Item requirements.txt"

# macOS/Linux
rm requirements.txt

# Then regenerate
pip freeze > requirements.txt
```

---
