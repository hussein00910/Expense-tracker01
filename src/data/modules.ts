import type { SecurityModule } from "../types";

export const MODULES: SecurityModule[] = [
  {
    id: "recon",
    name: "Reconnaissance",
    icon: "radar",
    description: "Gather information about targets through network scanning, domain queries, DNS lookups, email harvesting, subdomain discovery, and asset mapping.",
    color: "#00ff41",
    tools: [
      { id: "nmap", moduleId: "recon", name: "Nmap", description: "Network scanning and host discovery", commandTemplate: "nmap {flags} {target}", params: [{ name: "target", label: "Target IP / Hostname", placeholder: "192.168.1.1 or example.com", required: true, type: "text" }, { name: "flags", label: "Scan Flags", placeholder: "-sV -sC", required: false, type: "text", defaultValue: "-sV" }] },
      { id: "whois", moduleId: "recon", name: "WHOIS Lookup", description: "Domain registration and ownership information", commandTemplate: "whois {domain}", params: [{ name: "domain", label: "Domain", placeholder: "example.com", required: true, type: "text" }] },
      { id: "dns-lookup", moduleId: "recon", name: "DNS Lookup", description: "Query DNS records for a domain", commandTemplate: "dig {type} {domain}", params: [{ name: "domain", label: "Domain", placeholder: "example.com", required: true, type: "text" }, { name: "type", label: "Record Type", placeholder: "A", required: false, type: "select", options: ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"], defaultValue: "A" }] },
      { id: "theharvester", moduleId: "recon", name: "theHarvester", description: "Email harvesting and OSINT gathering", commandTemplate: "theHarvester -d {domain} -b {source} -l {limit}", params: [{ name: "domain", label: "Domain", placeholder: "example.com", required: true, type: "text" }, { name: "source", label: "Source", placeholder: "google", required: false, type: "select", options: ["google", "bing", "linkedin", "twitter", "all"], defaultValue: "google" }, { name: "limit", label: "Result Limit", placeholder: "100", required: false, type: "number", defaultValue: "100" }] },
      { id: "sublist3r", moduleId: "recon", name: "Sublist3r", description: "Fast subdomains enumeration tool", commandTemplate: "sublist3r -d {domain} -t {threads}", params: [{ name: "domain", label: "Domain", placeholder: "example.com", required: true, type: "text" }, { name: "threads", label: "Threads", placeholder: "10", required: false, type: "number", defaultValue: "10" }] },
      { id: "shodan", moduleId: "recon", name: "Shodan", description: "Internet-connected device search engine", commandTemplate: "shodan search {query} --fields ip_str,port,org", params: [{ name: "query", label: "Search Query", placeholder: "apache country:US", required: true, type: "text" }] },
    ],
  },
  {
    id: "scanning",
    name: "Scanning",
    icon: "magnify-scan",
    description: "Perform comprehensive network and vulnerability scanning with advanced NSE scripts, web server scanning, and application vulnerability detection.",
    color: "#00d4ff",
    tools: [
      { id: "nmap-nse", moduleId: "scanning", name: "Nmap NSE", description: "Advanced scanning with Nmap Scripting Engine", commandTemplate: "nmap --script {script} -p {ports} {target}", params: [{ name: "target", label: "Target", placeholder: "192.168.1.0/24", required: true, type: "text" }, { name: "script", label: "NSE Script", placeholder: "vuln", required: false, type: "select", options: ["vuln", "auth", "discovery", "default", "safe", "exploit"], defaultValue: "vuln" }, { name: "ports", label: "Ports", placeholder: "1-1000", required: false, type: "text", defaultValue: "1-1000" }] },
      { id: "nikto", moduleId: "scanning", name: "Nikto", description: "Web server vulnerability scanner", commandTemplate: "nikto -h {host} -p {port}", params: [{ name: "host", label: "Host URL", placeholder: "http://example.com", required: true, type: "text" }, { name: "port", label: "Port", placeholder: "80", required: false, type: "number", defaultValue: "80" }] },
      { id: "openvas", moduleId: "scanning", name: "OpenVAS", description: "Full-featured vulnerability scanner", commandTemplate: "openvas-start && gvm-cli socket --xml '<create_task><name>{name}</name><target>{target}</target></create_task>'", params: [{ name: "target", label: "Target IP", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "name", label: "Scan Name", placeholder: "My Scan", required: false, type: "text", defaultValue: "Quick Scan" }] },
    ],
  },
  {
    id: "exploitation",
    name: "Exploitation",
    icon: "bug",
    description: "Execute penetration testing with industry-standard frameworks, SQL injection testing, and searchable exploit databases.",
    color: "#ff3333",
    tools: [
      { id: "metasploit", moduleId: "exploitation", name: "Metasploit", description: "Industry-standard penetration testing framework", commandTemplate: "msfconsole -q -x 'use {module}; set RHOSTS {target}; set RPORT {port}; run'", params: [{ name: "target", label: "Target IP", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "module", label: "Module Path", placeholder: "exploit/multi/handler", required: true, type: "text" }, { name: "port", label: "Port", placeholder: "4444", required: false, type: "number", defaultValue: "4444" }] },
      { id: "sqlmap", moduleId: "exploitation", name: "SQLMap", description: "Automatic SQL injection and database takeover tool", commandTemplate: "sqlmap -u \"{url}\" --dbs --level={level} --risk={risk}", params: [{ name: "url", label: "Target URL", placeholder: "http://example.com/page?id=1", required: true, type: "text" }, { name: "level", label: "Test Level (1-5)", placeholder: "1", required: false, type: "number", defaultValue: "1" }, { name: "risk", label: "Risk Level (1-3)", placeholder: "1", required: false, type: "number", defaultValue: "1" }] },
      { id: "exploitdb", moduleId: "exploitation", name: "ExploitDB", description: "Search the Exploit Database for known vulnerabilities", commandTemplate: "searchsploit {query} --json", params: [{ name: "query", label: "Search Query", placeholder: "Apache 2.4.49", required: true, type: "text" }] },
    ],
  },
  {
    id: "passwords",
    name: "Passwords",
    icon: "lock-open",
    description: "Test password security through brute force attacks, hash cracking, password generation, and multi-protocol authentication testing.",
    color: "#ffcc00",
    tools: [
      { id: "hydra", moduleId: "passwords", name: "Hydra", description: "Fast and flexible online password cracking", commandTemplate: "hydra -l {user} -P {wordlist} {target} {protocol} -t {threads}", params: [{ name: "target", label: "Target IP", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "protocol", label: "Protocol", placeholder: "ssh", required: true, type: "select", options: ["ssh", "ftp", "http-post-form", "rdp", "telnet", "smtp", "pop3", "imap"] }, { name: "user", label: "Username", placeholder: "admin", required: true, type: "text" }, { name: "wordlist", label: "Wordlist Path", placeholder: "/usr/share/wordlists/rockyou.txt", required: true, type: "text" }, { name: "threads", label: "Threads", placeholder: "16", required: false, type: "number", defaultValue: "16" }] },
      { id: "hashcat", moduleId: "passwords", name: "Hashcat", description: "Advanced GPU-based hash cracking tool", commandTemplate: "hashcat -m {mode} -a {attack} {hashfile} {wordlist}", params: [{ name: "hashfile", label: "Hash / Hash File", placeholder: "5f4dcc3b5aa765d61d8327deb882cf99", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/rockyou.txt", required: true, type: "text" }, { name: "mode", label: "Hash Mode", placeholder: "0", required: false, type: "select", options: ["0 (MD5)", "100 (SHA1)", "1400 (SHA256)", "1800 (SHA512crypt)", "3200 (bcrypt)"], defaultValue: "0 (MD5)" }, { name: "attack", label: "Attack Mode", placeholder: "0", required: false, type: "select", options: ["0 (Dictionary)", "3 (Brute-force)", "6 (Hybrid)"], defaultValue: "0 (Dictionary)" }] },
      { id: "john", moduleId: "passwords", name: "John the Ripper", description: "Classic password cracker with auto-detection", commandTemplate: "john {hashfile} --wordlist={wordlist} --format={format}", params: [{ name: "hashfile", label: "Hash File Path", placeholder: "/tmp/hashes.txt", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/rockyou.txt", required: false, type: "text", defaultValue: "/usr/share/wordlists/rockyou.txt" }, { name: "format", label: "Hash Format", placeholder: "auto", required: false, type: "select", options: ["auto", "md5", "sha1", "sha256", "bcrypt", "ntlm"], defaultValue: "auto" }] },
      { id: "crackstation", moduleId: "passwords", name: "CrackStation", description: "Online hash lookup and password generation", commandTemplate: "curl -s 'https://crackstation.net/api/?hash={hash}&format=json'", params: [{ name: "hash", label: "Hash to Crack", placeholder: "5f4dcc3b5aa765d61d8327deb882cf99", required: true, type: "text" }] },
      { id: "medusa", moduleId: "passwords", name: "Medusa", description: "Speedy parallel network login auditor", commandTemplate: "medusa -h {target} -u {user} -P {wordlist} -M {module} -t {threads}", params: [{ name: "target", label: "Target IP", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "user", label: "Username", placeholder: "admin", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/rockyou.txt", required: true, type: "text" }, { name: "module", label: "Protocol Module", placeholder: "ssh", required: false, type: "select", options: ["ssh", "ftp", "http", "rdp", "telnet", "smtp"], defaultValue: "ssh" }, { name: "threads", label: "Threads", placeholder: "10", required: false, type: "number", defaultValue: "10" }] },
    ],
  },
  {
    id: "web",
    name: "Web Security",
    icon: "web",
    description: "Analyze web applications with directory enumeration, SQL injection detection, fuzzing, and HTTP request manipulation.",
    color: "#ff8c00",
    tools: [
      { id: "gobuster", moduleId: "web", name: "Gobuster", description: "Directory and DNS busting tool", commandTemplate: "gobuster dir -u {url} -w {wordlist} -t {threads} -x {extensions}", params: [{ name: "url", label: "Target URL", placeholder: "http://example.com", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/dirb/common.txt", required: false, type: "text", defaultValue: "/usr/share/wordlists/dirb/common.txt" }, { name: "extensions", label: "Extensions", placeholder: "php,html,txt", required: false, type: "text", defaultValue: "php,html" }, { name: "threads", label: "Threads", placeholder: "30", required: false, type: "number", defaultValue: "30" }] },
      { id: "sqlmap-web", moduleId: "web", name: "SQLMap Web", description: "SQL injection detection and exploitation", commandTemplate: "sqlmap -u \"{url}\" --forms --crawl={depth} --batch", params: [{ name: "url", label: "Target URL", placeholder: "http://example.com", required: true, type: "text" }, { name: "depth", label: "Crawl Depth", placeholder: "2", required: false, type: "number", defaultValue: "2" }] },
      { id: "ffuf", moduleId: "web", name: "ffuf", description: "Fast web fuzzer for content discovery", commandTemplate: "ffuf -u {url}/FUZZ -w {wordlist} -t {threads} -mc {codes}", params: [{ name: "url", label: "Target URL", placeholder: "http://example.com", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/dirb/common.txt", required: false, type: "text", defaultValue: "/usr/share/wordlists/dirb/common.txt" }, { name: "threads", label: "Threads", placeholder: "50", required: false, type: "number", defaultValue: "50" }, { name: "codes", label: "Match Codes", placeholder: "200,301,302", required: false, type: "text", defaultValue: "200,301,302" }] },
      { id: "burpsuite", moduleId: "web", name: "Burp Suite", description: "HTTP proxy and web application testing platform", commandTemplate: "burpsuite --project-file={project} --config-file={config}", params: [{ name: "target", label: "Target URL", placeholder: "http://example.com", required: true, type: "text" }, { name: "project", label: "Project File", placeholder: "/tmp/project.burp", required: false, type: "text", defaultValue: "/tmp/burp-project.burp" }, { name: "config", label: "Config File", placeholder: "/tmp/config.json", required: false, type: "text", defaultValue: "/tmp/burp-config.json" }] },
    ],
  },
  {
    id: "phishing",
    name: "Phishing",
    icon: "fish",
    description: "Simulate phishing attacks for security awareness training and social engineering assessments.",
    color: "#9b59b6",
    tools: [
      { id: "gophish", moduleId: "phishing", name: "GoPhish", description: "Open-source phishing simulation framework", commandTemplate: "gophish --config {config}", params: [{ name: "campaign", label: "Campaign Name", placeholder: "Security Awareness Test", required: true, type: "text" }, { name: "targets", label: "Target Emails (comma-separated)", placeholder: "user@example.com", required: true, type: "text" }, { name: "template", label: "Email Template", placeholder: "password-reset", required: false, type: "select", options: ["password-reset", "security-alert", "account-verification", "prize-notification"], defaultValue: "password-reset" }, { name: "config", label: "Config File", placeholder: "/etc/gophish/config.json", required: false, type: "text", defaultValue: "/etc/gophish/config.json" }] },
      { id: "set", moduleId: "phishing", name: "SET Toolkit", description: "Social Engineering Toolkit for advanced phishing", commandTemplate: "setoolkit -interactive -method {method} -target {target}", params: [{ name: "target", label: "Target URL / Email", placeholder: "http://example.com", required: true, type: "text" }, { name: "method", label: "Attack Method", placeholder: "website-clone", required: false, type: "select", options: ["website-clone", "credential-harvester", "spear-phishing", "java-applet"], defaultValue: "website-clone" }] },
    ],
  },
  {
    id: "wireless",
    name: "Wireless",
    icon: "wifi",
    description: "Test wireless network security through packet analysis, WiFi penetration testing, and WPS vulnerability assessment.",
    color: "#1abc9c",
    tools: [
      { id: "wireshark", moduleId: "wireless", name: "Wireshark", description: "Network packet analyzer and protocol dissector", commandTemplate: "tshark -i {interface} -w {output} -a duration:{duration}", params: [{ name: "interface", label: "Interface", placeholder: "wlan0", required: true, type: "text" }, { name: "output", label: "Output File", placeholder: "/tmp/capture.pcap", required: false, type: "text", defaultValue: "/tmp/capture.pcap" }, { name: "duration", label: "Duration (seconds)", placeholder: "60", required: false, type: "number", defaultValue: "60" }] },
      { id: "aircrack", moduleId: "wireless", name: "Aircrack-ng", description: "WiFi network security auditing suite", commandTemplate: "aircrack-ng -w {wordlist} -b {bssid} {capfile}", params: [{ name: "capfile", label: "Capture File (.cap)", placeholder: "/tmp/capture-01.cap", required: true, type: "text" }, { name: "bssid", label: "Target BSSID", placeholder: "AA:BB:CC:DD:EE:FF", required: true, type: "text" }, { name: "wordlist", label: "Wordlist", placeholder: "/usr/share/wordlists/rockyou.txt", required: false, type: "text", defaultValue: "/usr/share/wordlists/rockyou.txt" }] },
      { id: "reaver", moduleId: "wireless", name: "Reaver", description: "WPS PIN brute force vulnerability assessment", commandTemplate: "reaver -i {interface} -b {bssid} -v{verbose}", params: [{ name: "interface", label: "Monitor Interface", placeholder: "wlan0mon", required: true, type: "text" }, { name: "bssid", label: "Target BSSID", placeholder: "AA:BB:CC:DD:EE:FF", required: true, type: "text" }, { name: "verbose", label: "Verbose Mode", placeholder: "v", required: false, type: "select", options: ["v (verbose)", "vv (very verbose)", " (silent)"], defaultValue: "v (verbose)" }] },
    ],
  },
  {
    id: "network",
    name: "Network",
    icon: "lan",
    description: "Perform network analysis and manipulation with packet capture, traffic analysis, ARP spoofing, and network tunneling.",
    color: "#3498db",
    tools: [
      { id: "tcpdump", moduleId: "network", name: "tcpdump", description: "Command-line packet capture and analysis", commandTemplate: "tcpdump -i {interface} {filter} -w {output} -c {count}", params: [{ name: "interface", label: "Interface", placeholder: "eth0", required: true, type: "text" }, { name: "filter", label: "BPF Filter", placeholder: "port 80 and host 192.168.1.1", required: false, type: "text" }, { name: "output", label: "Output File", placeholder: "/tmp/capture.pcap", required: false, type: "text", defaultValue: "/tmp/capture.pcap" }, { name: "count", label: "Packet Count", placeholder: "1000", required: false, type: "number", defaultValue: "1000" }] },
      { id: "wireshark-net", moduleId: "network", name: "Wireshark Analysis", description: "Deep traffic analysis and protocol decoding", commandTemplate: "tshark -r {capfile} -Y \"{filter}\" -T fields -e {fields}", params: [{ name: "capfile", label: "Capture File", placeholder: "/tmp/capture.pcap", required: true, type: "text" }, { name: "filter", label: "Display Filter", placeholder: "http.request.method == POST", required: false, type: "text" }, { name: "fields", label: "Fields to Extract", placeholder: "ip.src ip.dst http.host", required: false, type: "text", defaultValue: "ip.src ip.dst" }] },
      { id: "arpspoof", moduleId: "network", name: "arpspoof", description: "ARP cache poisoning for MitM attacks", commandTemplate: "arpspoof -i {interface} -t {target} {gateway}", params: [{ name: "interface", label: "Interface", placeholder: "eth0", required: true, type: "text" }, { name: "target", label: "Target IP", placeholder: "192.168.1.100", required: true, type: "text" }, { name: "gateway", label: "Gateway IP", placeholder: "192.168.1.1", required: true, type: "text" }] },
      { id: "chisel", moduleId: "network", name: "Chisel", description: "Fast TCP/UDP tunnel over HTTP with SSH encryption", commandTemplate: "chisel {mode} {server}:{port} {local}:{remote}", params: [{ name: "mode", label: "Mode", placeholder: "client", required: true, type: "select", options: ["client", "server"] }, { name: "server", label: "Server Address", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "port", label: "Server Port", placeholder: "8080", required: false, type: "number", defaultValue: "8080" }, { name: "local", label: "Local Port", placeholder: "127.0.0.1:1080", required: false, type: "text", defaultValue: "127.0.0.1:1080" }, { name: "remote", label: "Remote Port", placeholder: "0.0.0.0:socks", required: false, type: "text", defaultValue: "0.0.0.0:socks" }] },
      { id: "netcat", moduleId: "network", name: "netcat", description: "Swiss army knife for TCP/UDP networking", commandTemplate: "nc {flags} {host} {port}", params: [{ name: "host", label: "Host / IP", placeholder: "192.168.1.1", required: true, type: "text" }, { name: "port", label: "Port", placeholder: "4444", required: true, type: "number" }, { name: "flags", label: "Flags", placeholder: "-lvnp", required: false, type: "text", defaultValue: "-v" }] },
    ],
  },
  {
    id: "forensics",
    name: "Forensics",
    icon: "microscope",
    description: "Conduct digital forensics investigations through binary analysis, string extraction, steganography detection, metadata examination, and memory analysis.",
    color: "#e67e22",
    tools: [
      { id: "ghidra", moduleId: "forensics", name: "Ghidra", description: "NSA software reverse engineering framework", commandTemplate: "analyzeHeadless {project_dir} {project_name} -import {binary} -postScript {script}", params: [{ name: "binary", label: "Binary File Path", placeholder: "/tmp/malware.exe", required: true, type: "text" }, { name: "project_dir", label: "Project Directory", placeholder: "/tmp/ghidra_projects", required: false, type: "text", defaultValue: "/tmp/ghidra_projects" }, { name: "project_name", label: "Project Name", placeholder: "AnalysisProject", required: false, type: "text", defaultValue: "AnalysisProject" }, { name: "script", label: "Post Script", placeholder: "PrintASMScript.java", required: false, type: "text", defaultValue: "PrintASMScript.java" }] },
      { id: "strings", moduleId: "forensics", name: "strings", description: "Extract readable strings from binary files", commandTemplate: "strings -n {minlen} {file} | grep -i '{pattern}'", params: [{ name: "file", label: "File Path", placeholder: "/tmp/file.bin", required: true, type: "text" }, { name: "minlen", label: "Minimum String Length", placeholder: "4", required: false, type: "number", defaultValue: "4" }, { name: "pattern", label: "Filter Pattern", placeholder: "password", required: false, type: "text" }] },
      { id: "stegdetect", moduleId: "forensics", name: "StegDetect", description: "Detect steganographic content in images", commandTemplate: "stegdetect -t {types} {image}", params: [{ name: "image", label: "Image File Path", placeholder: "/tmp/image.jpg", required: true, type: "text" }, { name: "types", label: "Detection Types", placeholder: "jopi", required: false, type: "text", defaultValue: "jopi" }] },
      { id: "exiftool", moduleId: "forensics", name: "ExifTool", description: "Read, write, and edit metadata in files", commandTemplate: "exiftool {flags} {file}", params: [{ name: "file", label: "File Path", placeholder: "/tmp/document.jpg", required: true, type: "text" }, { name: "flags", label: "Options", placeholder: "-all", required: false, type: "select", options: ["-all (show all)", "-GPS* (GPS data)", "-Author (author info)", "-CreateDate (dates)", "-json (JSON output)"], defaultValue: "-all (show all)" }] },
      { id: "volatility", moduleId: "forensics", name: "Volatility", description: "Advanced memory forensics framework", commandTemplate: "volatility -f {dumpfile} --profile={profile} {plugin}", params: [{ name: "dumpfile", label: "Memory Dump File", placeholder: "/tmp/memdump.mem", required: true, type: "text" }, { name: "profile", label: "OS Profile", placeholder: "Win10x64_19041", required: false, type: "select", options: ["Win10x64_19041", "Win7SP1x64", "WinXPSP3x86", "LinuxUbuntu20_04x64"], defaultValue: "Win10x64_19041" }, { name: "plugin", label: "Plugin", placeholder: "pslist", required: false, type: "select", options: ["pslist", "pstree", "cmdline", "netscan", "malfind", "dlllist", "filescan"], defaultValue: "pslist" }] },
    ],
  },
];

export function getModule(id: string): SecurityModule | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getTool(moduleId: string, toolId: string) {
  return getModule(moduleId)?.tools.find((t) => t.id === toolId);
}
