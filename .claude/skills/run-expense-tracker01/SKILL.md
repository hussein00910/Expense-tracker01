---
name: run-expense-tracker01
description: Build, run, and drive Expense-tracker01 (مصروفاتي). Use when asked to start the app, take a screenshot, run tests, verify SMS parsing, test transaction logic, or confirm a change works in the running app.
---

Expense-tracker01 is a KivyMD Python mobile app that tracks bank transactions extracted from SMS messages (Arabic UI, targets Android). On a headless Linux container it is driven via `driver.py`, which has two modes: **smoke** (tests core business logic with no display) and **screenshot** (launches the full GUI under Xvfb).

All paths below are relative to `Expense-tracker01/`.

## Prerequisites

```bash
# System packages
apt-get install -y xvfb scrot x11-utils python3-dev mesa-utils libgl1-mesa-dri

# Python packages — NOTE: KivyMD 1.2.0 in requirements.txt is incompatible;
# install the 2.x master branch instead
pip3 install kivy==2.3.0 pillow==10.2.0
pip3 install "https://github.com/kivymd/KivyMD/archive/master.zip"
```

## Run (agent path)

### Smoke — test core business logic (no display needed)

```bash
python3 .claude/skills/run-expense-tracker01/driver.py smoke
# Runs 27 checks: SMS parser × 8 banks, 2 non-bank rejections,
# 7 categorizer cases, 10 database round-trips.
# Exits 0 on success.
```

### Screenshot — launch full GUI and capture

```bash
python3 .claude/skills/run-expense-tracker01/driver.py screenshot
# Screenshot saved → /tmp/shots/expense-tracker01.png
# Requires: Xvfb, scrot, x11-utils, Mesa llvmpipe all installed.
```

## Run (human path)

On a machine with a real display:

```bash
cd Expense-tracker01
python3 main.py
```

A 480×800 dark-themed window opens. The splash screen appears briefly while SMS sync runs (mock data on desktop), then the dashboard is shown.

## Tests

```bash
python3 tests/test_sms_parser.py
# 8 bank samples + 3 non-bank rejections + 7 categorizer tests — all pass
```

## Gotchas

- **KivyMD 1.2.0 is unusable here.** `requirements.txt` pins 1.2.0 but the app uses APIs introduced in 2.0 (`MDNavigationBar`, `MDNavigationItemIcon/Label`). Install from master. The compat shim at `ui/kivymd_compat.py` bridges the remaining 1.x-style button/progress-bar names.

- **Font styles changed in MD3.** `H3`, `H6`, `Subtitle1`, `Caption`, `Body1/2` are all gone in KivyMD 2.0. They have been replaced with `Headline`, `Title`, `Label`, `Body` across all screen files via a one-time sed pass.

- **Mesa software rendering required.** Xvfb has no GPU; Kivy renders black without `LIBGL_ALWAYS_SOFTWARE=1 GALLIUM_DRIVER=llvmpipe`. The driver sets both automatically.

- **MTDev warning is non-fatal.** `OSError: libmtdev.so.1: cannot open shared object file` appears in every startup; Kivy continues without it. Ignore it.

- **Clipboard errors are non-fatal.** `xclip` / `xsel` not found → `CRITICAL Cutbuffer` warning. The app works fine without them.

- **Kivy logs go to `~/.kivy/logs/`, not stdout.** The driver polls `~/.kivy/logs/kivy_*.txt` to detect startup; it snapshot-compares before/after launch to find the new file.

- **Desktop SMS mock mode.** On non-Android, `sms_reader.py` returns 8 hardcoded sample transactions. The DB is written to `~/expense_tracker.db`, not app storage.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ModuleNotFoundError: No module named 'kivymd.uix.navigationbar'` | KivyMD 1.2.0 installed. Run: `pip3 install "https://github.com/kivymd/KivyMD/archive/master.zip"` |
| `KeyError: 'H3'` at startup | Old font_style name. All screen files already patched; if new code adds old names, replace with `Headline`/`Title`/`Body`/`Label`. |
| `ImportError: cannot import name 'MDFlatButton'` | Import from `ui.kivymd_compat` instead of `kivymd.uix.button`. |
| Screenshot is all-black (1 KB) | Mesa not installed or `LIBGL_ALWAYS_SOFTWARE` not set. Run the `apt-get` + env lines above. |
| `ERROR: App did not reach main loop within 30s` | Likely crash before startup. Check `~/.kivy/logs/kivy_*.txt` latest file for the actual error. |
| `Server is already active for display 99` | Stale lock file. Run: `rm -f /tmp/.X99-lock; pkill -9 Xvfb` |
