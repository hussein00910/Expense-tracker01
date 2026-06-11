#!/usr/bin/env python3
"""
Unified Toolkit Backend Server
Run on Kali Linux:
  pip install flask flask-cors
  python server.py

Then in the app: Settings -> Backend Server URL -> http://<your-kali-ip>:5000
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import shlex
import time
import os

app = Flask(__name__)
CORS(app)

ALLOWED_BASE_COMMANDS = {
    "nmap", "whois", "dig", "theHarvester", "sublist3r", "shodan",
    "nikto", "gvm-cli",
    "msfconsole", "sqlmap", "searchsploit",
    "hydra", "hashcat", "john", "curl", "medusa",
    "gobuster", "ffuf",
    "tshark", "aircrack-ng", "reaver",
    "tcpdump", "arpspoof", "chisel", "nc",
    "volatility", "strings", "stegdetect", "exiftool",
    "analyzeHeadless",
}


def is_safe_command(command: str) -> bool:
    try:
        parts = shlex.split(command)
        if not parts:
            return False
        base = os.path.basename(parts[0])
        return base in ALLOWED_BASE_COMMANDS
    except Exception:
        return False


@app.route("/ping")
def ping():
    return jsonify({"status": "ok", "version": "1.0.0"})


@app.route("/execute", methods=["POST"])
def execute():
    data = request.get_json(force=True) or {}
    command = data.get("command", "").strip()

    if not command:
        return jsonify({"output": "Error: no command provided", "exit_code": 1}), 400

    if not is_safe_command(command):
        base = os.path.basename(command.split()[0]) if command else "unknown"
        return jsonify({
            "output": f"Error: '{base}' is not in the allowed command list",
            "exit_code": 1,
        }), 403

    try:
        start = time.time()
        result = subprocess.run(
            shlex.split(command),
            capture_output=True,
            text=True,
            timeout=30,
        )
        output = result.stdout or result.stderr or "[command produced no output]"
        return jsonify({
            "output": output,
            "exit_code": result.returncode,
            "duration_ms": int((time.time() - start) * 1000),
        })
    except subprocess.TimeoutExpired:
        return jsonify({"output": "Error: command timed out (30s limit)", "exit_code": 124})
    except FileNotFoundError as e:
        return jsonify({
            "output": f"Error: tool not found\n{e}\nIs it installed on this system?",
            "exit_code": 127,
        })
    except Exception as e:
        return jsonify({"output": f"Error: {e}", "exit_code": 1})


if __name__ == "__main__":
    print("=" * 50)
    print("  Unified Toolkit Backend v1.0.0")
    print("  Listening on http://0.0.0.0:5000")
    print("  Configure app: Settings -> Backend Server URL")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False)
