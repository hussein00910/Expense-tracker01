#!/usr/bin/env python3
"""
Driver for Expense-tracker01 (مصروفاتي).

Usage:
  python3 driver.py smoke       — test core logic (no display), exits 0 on success
  python3 driver.py screenshot  — launch GUI under Xvfb, save screenshot
"""

import sys
import os
import subprocess
import time
import signal
import tempfile

# Ensure project root is on path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

sys.path.insert(0, ROOT)


# ── Smoke mode ────────────────────────────────────────────────────────────────

BANK_SAMPLES = [
    ('ALRAJHI', 'تم الشراء بمبلغ 125.00 ريال لدى ستاربكس الرياض. الرصيد المتاح 3,450.75 ريال.', 125.00, 'debit', 'RAJHI'),
    ('SNB', 'SAR 250.00 deducted from your account at Amazon.sa. Available balance: SAR 1,200.50', 250.00, 'debit', 'SNB'),
    ('RIYAD', 'خُصم من حسابك 300.00 ريال لدى محطة أرامكو. رصيدك الحالي 2,100.00 ريال.', 300.00, 'debit', 'RIYAD'),
    ('ALINMA', 'عملية شراء بقيمة 85.50 ر.س من مطعم البيك. الرصيد: 950.25 ر.س', 85.50, 'debit', 'ALINMA'),
    ('SNB', 'SAR 5,000.00 credited to your account. Salary. Balance: SAR 6,200.50', 5000.00, 'credit', 'SNB'),
    ('SABB', 'SAR 199.00 deducted from your account at Netflix. Available balance SAR 800.00', 199.00, 'debit', 'SABB'),
    ('FAB', 'AED 150.00 debited from your account at Carrefour. Balance: AED 2,350.00', 150.00, 'debit', 'FAB'),
    ('EmiratesNBD', 'AED 3,500.00 credited to your account. Salary. Bal: AED 4,000.00', 3500.00, 'credit', 'EMIRATESNBD'),
]

CATEGORIZE_CASES = [
    ('ستاربكس', 'food'),
    ('أرامكو', 'fuel'),
    ('صيدلية النهدي', 'health'),
    ('نتفليكس', 'subscriptions'),
    ('أمازون', 'shopping'),
    ('رسوم كهرباء', 'bills'),
    ('شيء غريب', 'other'),
]


def check(label, ok):
    status = 'PASS' if ok else 'FAIL'
    print(f'  [{status}] {label}')
    return ok


def smoke():
    all_ok = True
    os.chdir(ROOT)

    print('\n── SMS Parser ──')
    from core.sms_parser import parse_sms
    for sender, body, exp_amount, exp_type, exp_bank in BANK_SAMPLES:
        result = parse_sms(body, sender)
        ok = (
            result is not None
            and abs(result['amount'] - exp_amount) < 0.01
            and result['type'] == exp_type
            and result['bank_id'] == exp_bank
        )
        all_ok &= check(f'{sender} {exp_amount} {exp_type}', ok)
        if not ok:
            print(f'    got: {result}')

    print('\n── Non-bank rejection ──')
    for sender, body, _ in [
        ('friend', 'يا عمر متى تيجي؟', None),
        ('OTP', 'رمز التحقق: 123456', None),
    ]:
        result = parse_sms(body, sender)
        all_ok &= check(f'reject "{body[:30]}"', result is None)

    print('\n── Categorizer ──')
    from core.categorizer import categorize
    for merchant, expected in CATEGORIZE_CASES:
        result = categorize(merchant, '')
        all_ok &= check(f'"{merchant}" → {expected}', result == expected)

    print('\n── Database (in-memory) ──')
    import core.database as db_module
    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as f:
        tmp_db = f.name
    db_module._DB_PATH = tmp_db
    db_module.Database._instance = None
    try:
        db = db_module.Database.get()
        from datetime import datetime
        tx = {
            'date': datetime.now().isoformat(),
            'amount': 99.50,
            'currency': 'SAR',
            'merchant': 'ستاربكس',
            'category': 'food',
            'bank_id': 'RAJHI',
            'raw_sms': 'test',
            'sms_address': 'ALRAJHI',
            'type': 'debit',
        }
        tx_id = db.insert_transaction(tx)
        all_ok &= check('insert_transaction returns int', isinstance(tx_id, int) and tx_id > 0)

        rows = db.get_transactions()
        all_ok &= check('get_transactions returns 1 row', len(rows) == 1)
        all_ok &= check('amount stored correctly', abs(rows[0]['amount'] - 99.50) < 0.01)
        all_ok &= check('category stored correctly', rows[0]['category'] == 'food')

        month = datetime.now().strftime('%Y-%m')
        summary = db.get_monthly_summary(month)
        all_ok &= check('monthly_summary total_debit', abs(summary['total_debit'] - 99.50) < 0.01)

        breakdown = db.get_category_breakdown(month)
        all_ok &= check('category_breakdown has food', any(r['category'] == 'food' for r in breakdown))

        db.set_budget('food', 500.0)
        all_ok &= check('get_budget round-trips', abs(db.get_budget('food') - 500.0) < 0.01)

        db.set_setting('language', 'ar')
        all_ok &= check('get_setting round-trips', db.get_setting('language') == 'ar')

        db.mark_sms_processed('sms-001')
        all_ok &= check('is_sms_processed returns True', db.is_sms_processed('sms-001'))
        all_ok &= check('is_sms_processed False for unknown', not db.is_sms_processed('sms-999'))

        db.close()
    finally:
        os.unlink(tmp_db)
        db_module._DB_PATH = None
        db_module.Database._instance = None

    print()
    if all_ok:
        print('✅ All smoke checks passed')
    else:
        print('❌ Some smoke checks failed')
    return all_ok


# ── Screenshot mode ───────────────────────────────────────────────────────────

SHOT_PATH = '/tmp/shots/expense-tracker01.png'
DISPLAY = ':99'


def screenshot():
    print(f'\n── Launching app under Xvfb {DISPLAY} ──')
    os.makedirs('/tmp/shots', exist_ok=True)

    # Start Xvfb
    xvfb = subprocess.Popen(
        ['Xvfb', DISPLAY, '-screen', '0', '480x800x24'],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # Wait for Xvfb to be ready
    deadline = time.time() + 10
    while time.time() < deadline:
        r = subprocess.run(
            ['xdpyinfo', '-display', DISPLAY],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        if r.returncode == 0:
            break
        time.sleep(0.2)
    else:
        print('ERROR: Xvfb did not start within 10s')
        xvfb.terminate()
        return False

    print(f'  Xvfb up on {DISPLAY}')

    env = os.environ.copy()
    env['DISPLAY'] = DISPLAY
    env['KIVY_LOG_LEVEL'] = 'info'
    env['LIBGL_ALWAYS_SOFTWARE'] = '1'
    env['GALLIUM_DRIVER'] = 'llvmpipe'

    # Launch the app, capturing stdout+stderr so we can poll for startup
    log_path = '/tmp/kivy-app.log'
    logf = open(log_path, 'w')
    app = subprocess.Popen(
        [sys.executable, os.path.join(ROOT, 'main.py')],
        env=env,
        cwd=ROOT,
        stdout=logf,
        stderr=logf,
    )

    print('  App launched, waiting for main loop...')
    # Kivy writes an unbuffered log to ~/.kivy/logs/kivy_*.txt
    # Snapshot existing logs BEFORE the new run so we can find the new file
    import glob
    existing_logs = set(glob.glob('/root/.kivy/logs/kivy_*.txt'))
    kivy_log = None
    deadline = time.time() + 30
    while time.time() < deadline:
        if app.poll() is not None:
            logf.flush()
            log = open(log_path).read()[-1200:]
            print(f'ERROR: App exited early. Log:\n{log}')
            xvfb.terminate()
            return False
        # Find the new Kivy log file created by this run
        if not kivy_log:
            new_logs = set(glob.glob('/root/.kivy/logs/kivy_*.txt')) - existing_logs
            if new_logs:
                kivy_log = sorted(new_logs)[-1]
        if kivy_log:
            try:
                if 'Start application main loop' in open(kivy_log).read():
                    break
            except OSError:
                pass
        time.sleep(0.5)
    else:
        print('ERROR: App did not reach main loop within 30s')
        app.terminate()
        xvfb.terminate()
        return False

    time.sleep(3)  # allow first frame to render

    # Take screenshot (-o overwrites existing file)
    r = subprocess.run(
        ['scrot', '-o', SHOT_PATH],
        env=env,
        capture_output=True,
    )
    if r.returncode != 0:
        print(f'ERROR: scrot failed: {r.stderr.decode()}')
    else:
        size = os.path.getsize(SHOT_PATH)
        print(f'  Screenshot saved → {SHOT_PATH} ({size:,} bytes)')

    # Terminate app and Xvfb
    app.send_signal(signal.SIGTERM)
    try:
        app.wait(timeout=5)
    except subprocess.TimeoutExpired:
        app.kill()

    xvfb.terminate()
    xvfb.wait(timeout=5)

    if r.returncode == 0 and os.path.exists(SHOT_PATH):
        print('✅ Screenshot captured')
        return True
    return False


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'smoke'
    if mode == 'smoke':
        sys.exit(0 if smoke() else 1)
    elif mode == 'screenshot':
        sys.exit(0 if screenshot() else 1)
    else:
        print(f'Usage: driver.py [smoke|screenshot]')
        sys.exit(1)
