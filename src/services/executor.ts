import type { SecurityTool, ExecutionResult } from "../types";

const SIMULATED_OUTPUTS: Record<string, (params: Record<string, string>) => string> = {
  nmap: (p) => `Starting Nmap 7.94\nNmap scan report for ${p.target}\nHost is up (0.0023s latency).\nPORT     STATE SERVICE     VERSION\n22/tcp   open  ssh         OpenSSH 8.9p1\n80/tcp   open  http        Apache httpd 2.4.52\n443/tcp  open  https       Apache httpd 2.4.52\n3306/tcp open  mysql       MySQL 8.0.35\nNmap done: 1 IP address (1 host up) scanned in 14.32 seconds`,
  whois: (p) => `Domain Name: ${p.domain?.toUpperCase()}\nRegistrar: GoDaddy.com, LLC\nCreation Date: 1997-09-15T04:00:00Z\nRegistry Expiry Date: 2028-09-14T04:00:00Z\nName Server: NS1.EXAMPLE.COM\nDNSSEC: unsigned`,
  "dns-lookup": (p) => `; <<>> DiG 9.18.18 <<>> ${p.type || "A"} ${p.domain}\n;; ANSWER SECTION:\n${p.domain}.     300 IN  ${p.type || "A"}   93.184.216.34\n${p.domain}.     300 IN  ${p.type || "A"}   93.184.216.119\n;; Query time: 42 msec`,
  theharvester: (p) => `theHarvester 4.4.4\n[*] Target: ${p.domain}\n[*] Searching ${p.source || "google"}...\n[*] Emails found:\nadmin@${p.domain}\ninfo@${p.domain}\nsupport@${p.domain}\n[*] Hosts found:\nwww.${p.domain}: 93.184.216.34\nmail.${p.domain}: 93.184.216.40\n[*] Total results: 5`,
  sublist3r: (p) => `Sublist3r v1.0\n[-] Enumerating subdomains for ${p.domain}\n[-] Total Unique Subdomains Found: 8\nwww.${p.domain}\nmail.${p.domain}\napi.${p.domain}\ndev.${p.domain}\nstaging.${p.domain}\nblog.${p.domain}\ncdn.${p.domain}\nvpn.${p.domain}`,
  shodan: (p) => `Shodan Search: "${p.query}"\nTotal Results: 1,247\n\nIP: 93.184.216.34\n  Open Ports: 80, 443, 8080\n  Vulns: CVE-2021-44228\n\nIP: 104.21.45.123\n  Open Ports: 80, 443\n  Vulns: None`,
  "nmap-nse": (p) => `Nmap NSE Scan - Script: ${p.script || "vuln"}\nTarget: ${p.target}\n\n80/tcp  open  http\n| http-shellshock: VULNERABLE (CVE-2014-6271)\n\n443/tcp open  https\n| ssl-heartbleed: VULNERABLE (CVE-2014-0160)\n|   Risk factor: High`,
  nikto: (p) => `Nikto v2.1.6\n+ Target: ${p.host}:${p.port || 80}\n+ Server: Apache/2.4.52 (Ubuntu)\n+ /: X-Frame-Options header not present\n+ /admin/: This might be interesting\n+ /wp-login.php: WordPress login found\n+ 7916 requests: 9 item(s) reported`,
  openvas: (p) => `OpenVAS Scan: ${p.name || "Quick Scan"}\nTarget: ${p.target}\n\nHIGH   CVE-2021-44228 - Log4Shell (CVSS: 10.0)\nMEDIUM CVE-2022-22965 - Spring4Shell (CVSS: 5.9)\nLOW    CVE-2023-25690 - Apache HTTP (CVSS: 3.7)\nSummary: 1 High, 1 Medium, 1 Low`,
  metasploit: (p) => `metasploit v6.3.44\n\nmsf6 > use ${p.module || "exploit/multi/handler"}\nmsf6 > set RHOSTS ${p.target}\nmsf6 > run\n[*] Started handler on 0.0.0.0:${p.port || 4444}\n[*] Meterpreter session 1 opened\nmeterpreter > sysinfo\nOS: Windows 10 (10.0 Build 19041)`,
  sqlmap: (p) => `sqlmap 1.7.11\n[*] Testing: ${p.url}\n[*] GET parameter 'id' is vulnerable (boolean-based blind)\nback-end DBMS: MySQL >= 8.0\navailable databases:\n[*] information_schema\n[*] webapp_db`,
  exploitdb: (p) => `ExploitDB Results for: "${p.query}"\n\n51374 | 2023-11-15 | Linux  | Remote | ${p.query} - RCE\n51289 | 2023-09-20 | Windows| Local  | ${p.query} - LPE\n50987 | 2023-07-14 | Multi  | DoS    | ${p.query} - DoS`,
  hydra: (p) => `Hydra v9.5\n[DATA] attacking ${p.protocol || "ssh"}://${p.target}\n[22][${p.protocol || "ssh"}] host: ${p.target} login: ${p.user} password: password123\n[22][${p.protocol || "ssh"}] host: ${p.target} login: root password: toor\n2 valid passwords found`,
  hashcat: (p) => `hashcat v6.2.6\nHash-mode: ${(p.mode || "0 (MD5)").split(" ")[0]}\n\n${p.hashfile}:password123\n\nStatus: Cracked\nSpeed: 12,844 MH/s`,
  john: (p) => `John the Ripper\nLoaded 1 password hash (${p.format || "auto"})\n\npassword123 (hash)\nletmein     (hash2)\n\n2 passwords cracked`,
  crackstation: (p) => `CrackStation Results\nHash: ${p.hash}\nType: MD5\nResult: FOUND\nPassword: "password123"\nCracked in: 0.002 seconds`,
  medusa: (p) => `Medusa v2.2\n[${p.module || "ssh"}] Host: ${p.target} User: ${p.user} Password: password (1/100)\n[${p.module || "ssh"}] Host: ${p.target} User: ${p.user} Password: 123456 (2/100)\nACCOUNT FOUND: Password123! (3/100)`,
  gobuster: (p) => `Gobuster v3.6\nUrl: ${p.url}\nThreads: ${p.threads || 30}\n\n/index.html (200) [12392]\n/admin (301) [316]\n/login.php (200) [4521]\n/.htaccess (403) [277]\n/wp-login.php (200) [7892]\n/phpmyadmin (200) [10240]\nFinished`,
  "sqlmap-web": (p) => `sqlmap - Target: ${p.url}\nParameter: id (GET) - boolean-based blind\nParameter: id (GET) - time-based blind\nParameter: id (GET) - UNION query (4 cols)\navailable databases: information_schema, webapp, users`,
  ffuf: (p) => `ffuf v2.1.0\n\n[200] admin       [Size: 4521]\n[200] login       [Size: 1024]\n[301] uploads     [Size: 0]\n[200] dashboard   [Size: 8901]\n[403] .htaccess   [Size: 277]\n\nProgress: [4614/4614] :: 1200 req/sec :: 4s`,
  burpsuite: (p) => `Burp Suite Pro v2023.10.3\nTarget: ${p.target}\n\n[HIGH] Cross-site scripting (reflected)\n  URL: ${p.target}/search?q=<script>\n[HIGH] SQL injection\n  URL: ${p.target}/api/v1/users?id=1'`,
  gophish: (p) => `GoPhish v0.12.1\nCampaign: ${p.campaign}\nTargets: ${(p.targets || "").split(",").length} emails\nTemplate: ${p.template || "password-reset"}\n\nEmails Sent: ${(p.targets || "").split(",").length}\nDashboard: http://127.0.0.1:3333`,
  set: (p) => `Social-Engineer Toolkit\nMethod: ${p.method || "website-clone"}\nTarget: ${p.target}\n\n[*] Cloning website...\n[*] Credential harvester active at http://192.168.1.100/\nCaptured: username=admin&password=admin123`,
  wireshark: (p) => `Capturing on '${p.interface || "wlan0"}'\n 1  0.000000 192.168.1.100 > 192.168.1.1  TCP [SYN]\n 2  0.001234 192.168.1.1   > 192.168.1.100 TCP [SYN,ACK]\n 3  0.002100 192.168.1.100 > 192.168.1.1  HTTP GET /\n\n${p.duration || 60}s capture complete. 1,243 packets.`,
  aircrack: (p) => `Aircrack-ng 1.7\n[00:00:05] 12345/14344392 keys tested (2345.67 k/s)\n\nKEY FOUND! [ Password123 ]\n\nMaster Key: A1 B2 C3 D4 E5 F6 A7 B8`,
  reaver: (p) => `Reaver v1.6.5\n[+] Waiting for beacon from ${p.bssid}\n[+] Trying pin "12345670"\n[+] WPS PIN: '12345670'\n[+] WPA PSK: 'TargetWifiPassword!'\n[+] AP SSID: 'TARGET_WIFI'`,
  tcpdump: (p) => `tcpdump on ${p.interface || "eth0"}\n14:05:23 IP 192.168.1.100.54321 > 192.168.1.1.80: [S]\n14:05:23 IP 192.168.1.1.80 > 192.168.1.100.54321: [S.]\n14:05:23 IP 192.168.1.100.54321 > 192.168.1.1.80: GET / HTTP/1.1\n${p.count || 1000} packets captured`,
  "wireshark-net": (p) => `tshark -r ${p.capfile}\nFilter: ${p.filter || "(none)"}\n\n1 0.000 192.168.1.100 > 192.168.1.1  TCP [SYN]\n2 0.001 192.168.1.1   > 192.168.1.100 TCP [SYN,ACK]\n3 0.002 192.168.1.100 > 93.184.216.34 HTTP GET /`,
  arpspoof: (p) => `arpspoof -i ${p.interface || "eth0"} -t ${p.target} ${p.gateway}\nResolving ${p.target}...\n${p.interface || "eth0"}: arp reply ${p.gateway} is-at aa:bb:cc:dd:ee:ff\n[ARP poisoning active]\nPackets sent: 47`,
  chisel: (p) => `chisel ${p.mode || "client"} connecting to ${p.server || "192.168.1.1"}:${p.port || 8080}\nConnected (Latency 3.45ms)\nTunnel: ${p.local || "127.0.0.1:1080"} -> ${p.remote || "0.0.0.0:socks"}\nSOCKS5 proxy active`,
  netcat: (p) => `Connection to ${p.host} ${p.port} succeeded!\nNcat: Connected to ${p.host}:${p.port}.\n\nid\nuid=0(root) gid=0(root) groups=0(root)`,
  ghidra: (p) => `Ghidra 11.0.3 - Analyzing: ${p.binary}\n\nFUNCTION: main (0x00401000)\n  PUSH EBP\n  MOV  EBP,ESP\n  CALL authenticate_user\n\nStrings:\n  0x402010: "Enter password: "\n  0x402025: "Access granted"\n  0x402035: "Access denied"`,
  strings: (p) => `Strings in: ${p.file} (min: ${p.minlen || 4})\n${p.pattern ? `Filter: "${p.pattern}"` : ""}\n\n/bin/sh\nGLIBC_2.17\n${p.pattern || "password"}=admin123\ndatabase_${p.pattern || "password"}=P@ssw0rd!\napi_token=eyJhbGciOiJIUzI1NiIs`,
  stegdetect: (p) => `stegdetect ${p.image}\n${p.image} : jsteg(***)\n\nMethod: JSteg | Confidence: HIGH\nHidden data: YES | Payload: ~2.3 KB`,
  exiftool: (p) => `ExifTool 12.70\nFile: ${p.file?.split("/").pop() || "file"}\nGPS Latitude: 40 deg 42' 51.67" N\nGPS Longitude: 74 deg 0' 23.06" W\nCamera: iPhone 15 Pro\nDate: 2024:06:09 12:34:56\nAuthor: John Doe`,
  volatility: (p) => `Volatility 3 - Plugin: ${p.plugin || "pslist"}\nProfile: ${p.profile || "Win10x64_19041"}\n\nPID  PPID  Name          Threads\n4    0     System        107\n532  524   services.exe  9\n848  532   malware.exe   5\n1024 532   explorer.exe  45`,
};

function buildCommand(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (cmd, [key, val]) => cmd.replace(new RegExp(`\\{${key}\\}`, "g"), val || ""),
    template
  );
}

function getSimulatedDelay(toolId: string): number {
  const delays: Record<string, number> = {
    nmap: 2000, "nmap-nse": 2500, nikto: 1800, openvas: 3000,
    metasploit: 2200, sqlmap: 1600, exploitdb: 800,
    hydra: 1500, hashcat: 1200, john: 1000, crackstation: 400, medusa: 1300,
    gobuster: 1700, "sqlmap-web": 1600, ffuf: 1400, burpsuite: 2000,
    gophish: 900, set: 1100,
    wireshark: 1500, aircrack: 2800, reaver: 3200,
    tcpdump: 1300, "wireshark-net": 1000, arpspoof: 900, chisel: 700, netcat: 600,
    ghidra: 2400, strings: 700, stegdetect: 800, exiftool: 500, volatility: 2000,
  };
  return delays[toolId] ?? 1000;
}

export async function executeCommand(
  tool: SecurityTool,
  params: Record<string, string>
): Promise<ExecutionResult> {
  const startTime = Date.now();
  await new Promise((r) => setTimeout(r, getSimulatedDelay(tool.id)));
  const outputFn = SIMULATED_OUTPUTS[tool.id];
  const output = outputFn
    ? outputFn(params)
    : `[+] Executing: ${tool.name}\n[+] Params: ${JSON.stringify(params, null, 2)}\n[+] Completed successfully.`;
  return {
    command: buildCommand(tool.commandTemplate, params),
    output,
    duration: Date.now() - startTime,
    exitCode: 0,
  };
}
