/* ============================================================
 * CyberSec Academy — app.js
 * Pure client-side SPA powered by localStorage.
 * Educational use only — aligned with EC-Council CEH,
 * CompTIA Security+, OWASP, NIST and CISA guidelines.
 * ============================================================ */

'use strict';

/* ── Utilities ─────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

const TOAST_TRANSITION_MS = 300; // must match CSS transition on .toast

function dismissToast(toast) {
  toast.classList.remove('show');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  // Fallback removal in case transitionend doesn't fire
  setTimeout(() => toast.remove(), TOAST_TRANSITION_MS + 100);
}

function showToast(msg, type = 'info', duration = 3500) {
  const container = $('toast-container');
  const toast = el('div', `toast toast-${type}`);
  toast.setAttribute('role', 'alert');

  const textSpan = el('span', 'toast-text');
  textSpan.textContent = msg;

  const closeBtn = el('button', 'toast-close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => dismissToast(toast));

  toast.appendChild(textSpan);
  toast.appendChild(closeBtn);

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => dismissToast(toast), duration);
}

function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ── Storage helpers ───────────────────────────────────────── */
const Store = {
  get: (key, def = null) => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; }
    catch { return def; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

/* ── Curriculum data ───────────────────────────────────────── */
const MODULES = [
  {
    id: 'networking',
    title: 'Networking Fundamentals',
    icon: '🌐',
    xp: 100,
    badge: { id: 'badge-networking', name: 'Network Ninja', icon: '🌐' },
    topics: [
      'OSI & TCP/IP Models',
      'IP Addressing & Subnetting',
      'Common Protocols (HTTP, DNS, DHCP, FTP)',
      'Network Scanning with nmap',
      'Packet Analysis with Wireshark',
    ],
    lessons: [
      {
        title: 'OSI & TCP/IP Models',
        content: `<h3>OSI & TCP/IP Models</h3>
<p>The <strong>OSI model</strong> (Open Systems Interconnection) describes network communication in 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.</p>
<p>The <strong>TCP/IP model</strong> condenses these into 4 layers: Network Access, Internet, Transport, Application.</p>
<ul>
  <li><strong>Layer 3 — Network:</strong> IP routing, ICMP.</li>
  <li><strong>Layer 4 — Transport:</strong> TCP (reliable, connection-oriented) and UDP (fast, connectionless).</li>
  <li><strong>Layer 7 — Application:</strong> HTTP, DNS, SMTP, FTP.</li>
</ul>
<p><em>Why it matters for security:</em> Attacks target specific layers — e.g., ARP spoofing (L2), IP spoofing (L3), TCP SYN floods (L4), SQL injection (L7).</p>`,
      },
      {
        title: 'IP Addressing & Subnetting',
        content: `<h3>IP Addressing & Subnetting</h3>
<p>IPv4 addresses are 32-bit numbers written as four octets (e.g., 192.168.1.1). A <strong>subnet mask</strong> defines which portion identifies the network versus hosts.</p>
<p>CIDR notation: <code>192.168.1.0/24</code> = 256 addresses, 254 usable hosts.</p>
<p>Private ranges (RFC 1918): <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>.</p>
<p><em>Security note:</em> Knowing the network layout helps during reconnaissance to map attack surface.</p>`,
      },
      {
        title: 'Network Scanning',
        content: `<h3>Network Scanning with nmap</h3>
<p><strong>nmap</strong> (Network Mapper) is the industry-standard tool for network discovery and security auditing.</p>
<pre><code># Basic host discovery
nmap -sn 192.168.1.0/24

# TCP SYN scan (stealth)
sudo nmap -sS -p 1-1000 192.168.1.1

# Service/version detection
nmap -sV -sC target.example.com</code></pre>
<p><strong>⚠️ Legal reminder:</strong> Only scan networks you own or have explicit written authorisation to test. Unauthorised scanning is illegal under the CFAA and equivalent laws.</p>`,
      },
    ],
    quiz: [
      { q: 'Which OSI layer handles IP routing?', a: 'Network (Layer 3)', opts: ['Physical (Layer 1)', 'Data Link (Layer 2)', 'Network (Layer 3)', 'Transport (Layer 4)'] },
      { q: 'What does TCP provide that UDP does not?', a: 'Reliable, ordered delivery', opts: ['Faster throughput', 'Reliable, ordered delivery', 'Broadcasting support', 'Lower latency'] },
      { q: 'What is the CIDR notation for a 24-bit subnet mask?', a: '/24', opts: ['/8', '/16', '/24', '/32'] },
      { q: 'Which nmap flag performs a TCP SYN (stealth) scan?', a: '-sS', opts: ['-sT', '-sU', '-sS', '-sV'] },
      { q: 'ARP spoofing attacks target which OSI layer?', a: 'Data Link (Layer 2)', opts: ['Physical (Layer 1)', 'Data Link (Layer 2)', 'Network (Layer 3)', 'Transport (Layer 4)'] },
    ],
  },
  {
    id: 'linux',
    title: 'Linux CLI Essentials',
    icon: '🐧',
    xp: 100,
    badge: { id: 'badge-linux', name: 'Linux Guru', icon: '🐧' },
    topics: [
      'File System & Permissions',
      'Essential Commands',
      'Users, Groups & sudo',
      'Processes & Services',
      'Log Analysis',
    ],
    lessons: [
      {
        title: 'File System & Permissions',
        content: `<h3>Linux File System & Permissions</h3>
<p>Linux uses a hierarchical file system rooted at <code>/</code>. Key directories:</p>
<ul>
  <li><code>/etc</code> — Configuration files</li>
  <li><code>/var/log</code> — System logs</li>
  <li><code>/home</code> — User home directories</li>
  <li><code>/tmp</code> — Temporary files (world-writable)</li>
</ul>
<p>Permissions use the format <code>rwxrwxrwx</code> (owner/group/others):</p>
<pre><code>chmod 755 script.sh   # rwxr-xr-x
chmod 644 file.txt    # rw-r--r--
chown root:root /etc/passwd</code></pre>
<p><em>Security note:</em> World-writable directories like <code>/tmp</code> are common targets for privilege escalation.</p>`,
      },
      {
        title: 'Essential Commands',
        content: `<h3>Essential Linux Commands</h3>
<pre><code># Navigation
pwd, ls -la, cd, find / -name "*.conf" 2>/dev/null

# File operations
cat, less, head, tail -f /var/log/syslog, grep, awk, sed

# Network
ifconfig / ip addr, netstat -tulpn, ss -tulpn, curl, wget

# System info
uname -a, whoami, id, ps aux, top/htop, df -h, free -h</code></pre>`,
      },
      {
        title: 'Privilege Escalation Basics',
        content: `<h3>Privilege Escalation Concepts</h3>
<p>Privilege escalation is a critical concept for both attackers and defenders. Understanding escalation paths helps harden systems.</p>
<p>Common misconfiguration checks (on systems you own):</p>
<pre><code># SUID binaries
find / -perm -4000 2>/dev/null

# Sudo rights
sudo -l

# Writable cron jobs
ls -la /etc/cron*</code></pre>
<p><strong>⚠️ Only perform these checks on systems you own or have explicit authorisation to test.</strong></p>`,
      },
    ],
    quiz: [
      { q: 'Which directory typically stores system logs in Linux?', a: '/var/log', opts: ['/etc/logs', '/var/log', '/tmp/log', '/home/log'] },
      { q: 'What permission does chmod 755 grant to the owner?', a: 'Read, write, execute', opts: ['Read only', 'Read and write', 'Read, write, execute', 'Execute only'] },
      { q: 'Which command shows currently logged-in user and UID?', a: 'id', opts: ['who', 'whoami', 'id', 'users'] },
      { q: 'What does the SUID bit do when set on an executable?', a: 'Runs as the file owner regardless of who executes it', opts: ['Makes the file read-only', 'Runs as the file owner regardless of who executes it', 'Allows group to write', 'Hides the file'] },
      { q: 'Which command displays open network ports and listening services?', a: 'ss -tulpn', opts: ['ls -la', 'ps aux', 'ss -tulpn', 'chmod 777'] },
    ],
  },
  {
    id: 'web-hacking',
    title: 'Web Application Hacking',
    icon: '🕸️',
    xp: 150,
    badge: { id: 'badge-web', name: 'Web Warrior', icon: '🕸️' },
    topics: [
      'OWASP Top 10',
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'CSRF & Broken Auth',
      'Burp Suite Fundamentals',
    ],
    lessons: [
      {
        title: 'OWASP Top 10',
        content: `<h3>OWASP Top 10 Web Vulnerabilities</h3>
<p>The <strong>OWASP Top 10</strong> is the standard reference for critical web application security risks:</p>
<ol>
  <li><strong>A01 – Broken Access Control</strong> — Enforcing least privilege</li>
  <li><strong>A02 – Cryptographic Failures</strong> — Protecting data at rest/transit</li>
  <li><strong>A03 – Injection</strong> — SQL, LDAP, OS command injection</li>
  <li><strong>A04 – Insecure Design</strong> — Security in design phase</li>
  <li><strong>A05 – Security Misconfiguration</strong> — Default creds, verbose errors</li>
  <li><strong>A06 – Vulnerable & Outdated Components</strong></li>
  <li><strong>A07 – Identification & Authentication Failures</strong></li>
  <li><strong>A08 – Software & Data Integrity Failures</strong></li>
  <li><strong>A09 – Security Logging & Monitoring Failures</strong></li>
  <li><strong>A10 – SSRF</strong> — Server-Side Request Forgery</li>
</ol>`,
      },
      {
        title: 'SQL Injection',
        content: `<h3>SQL Injection</h3>
<p>SQL injection (SQLi) occurs when user input is concatenated directly into SQL queries without parameterisation.</p>
<p><strong>Vulnerable code (PHP example):</strong></p>
<pre><code>// DANGEROUS — never do this
$query = "SELECT * FROM users WHERE username = '" . $_GET['user'] . "'";
</code></pre>
<p><strong>Classic payload:</strong> <code>' OR '1'='1</code></p>
<p><strong>Secure fix — use parameterised queries:</strong></p>
<pre><code>$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$_GET['user']]);</code></pre>
<p><em>Tools:</em> sqlmap (on authorised targets only), Burp Suite.</p>`,
      },
      {
        title: 'Cross-Site Scripting (XSS)',
        content: `<h3>Cross-Site Scripting (XSS)</h3>
<p>XSS allows attackers to inject malicious scripts into pages viewed by other users.</p>
<p><strong>Types:</strong></p>
<ul>
  <li><strong>Reflected:</strong> Payload in URL parameter, reflected back in response</li>
  <li><strong>Stored:</strong> Payload saved in database and served to all users</li>
  <li><strong>DOM-based:</strong> Payload executed via client-side JavaScript</li>
</ul>
<p><strong>Prevention:</strong> Encode output, use Content Security Policy (CSP), validate input.</p>
<pre><code>// CSP header example
Content-Security-Policy: default-src 'self'; script-src 'self'</code></pre>`,
      },
    ],
    quiz: [
      { q: 'What is the #1 OWASP Top 10 risk (2021)?', a: 'Broken Access Control', opts: ['Injection', 'Broken Access Control', 'XSS', 'Cryptographic Failures'] },
      { q: 'Which fix prevents SQL injection?', a: 'Parameterised queries', opts: ['Input length limit', 'HTTPS', 'Parameterised queries', 'WAF only'] },
      { q: 'Stored XSS differs from reflected XSS because…', a: 'The payload is saved to the server and served to all users', opts: ['It uses a different encoding', 'It targets the DOM only', 'The payload is saved to the server and served to all users', 'It requires a CSRF token'] },
      { q: 'What HTTP header helps mitigate XSS attacks?', a: 'Content-Security-Policy', opts: ['X-Frame-Options', 'Strict-Transport-Security', 'Content-Security-Policy', 'X-XSS-Protection'] },
      { q: 'SSRF stands for?', a: 'Server-Side Request Forgery', opts: ['Secure Socket Request Failure', 'Server-Side Request Forgery', 'SQL Scripted Response Format', 'Stored Script Response Framework'] },
    ],
  },
  {
    id: 'passwords',
    title: 'Password Security',
    icon: '🔑',
    xp: 100,
    badge: { id: 'badge-passwords', name: 'Key Master', icon: '🔑' },
    topics: [
      'Hashing vs Encryption',
      'Common Attacks (brute force, dictionary, rainbow tables)',
      'Password Cracking Tools',
      'Secure Password Policies',
      'Multi-Factor Authentication',
    ],
    lessons: [
      {
        title: 'Hashing vs Encryption',
        content: `<h3>Hashing vs Encryption</h3>
<p><strong>Hashing</strong> is a one-way function that produces a fixed-length digest. It cannot be reversed.</p>
<p><strong>Encryption</strong> is a two-way process — data can be decrypted with the right key.</p>
<p>Passwords should <em>always</em> be hashed (not encrypted) using a slow, salted algorithm:</p>
<ul>
  <li><strong>Good:</strong> bcrypt, scrypt, Argon2id</li>
  <li><strong>Weak (avoid for passwords):</strong> MD5, SHA-1, unsalted SHA-256</li>
</ul>
<pre><code># Example Argon2id hash (Python)
import argon2
ph = argon2.PasswordHasher()
hash = ph.hash("my_password")</code></pre>`,
      },
      {
        title: 'Password Attacks',
        content: `<h3>Common Password Attacks</h3>
<ul>
  <li><strong>Brute Force:</strong> Try every combination — slow but exhaustive</li>
  <li><strong>Dictionary Attack:</strong> Use wordlists (e.g., rockyou.txt)</li>
  <li><strong>Rainbow Table:</strong> Precomputed hash → plaintext mappings; defeated by salting</li>
  <li><strong>Credential Stuffing:</strong> Reuse breached credentials across sites</li>
  <li><strong>Password Spraying:</strong> Common passwords across many accounts</li>
</ul>
<p><em>Tools (for authorised testing only):</em> Hashcat, John the Ripper, Hydra.</p>`,
      },
      {
        title: 'Secure Password Policies',
        content: `<h3>Secure Password Policies & MFA</h3>
<p>NIST SP 800-63B recommendations:</p>
<ul>
  <li>Minimum 8 characters, 64+ character maximum</li>
  <li>Check against breached password lists</li>
  <li>Allow all printable characters (including spaces)</li>
  <li>Do <em>not</em> require periodic rotation without evidence of compromise</li>
</ul>
<p><strong>Multi-Factor Authentication (MFA):</strong> Combines something you <em>know</em> (password) + something you <em>have</em> (TOTP/hardware key) + something you <em>are</em> (biometric). MFA prevents 99.9% of automated attacks (Microsoft data).</p>`,
      },
    ],
    quiz: [
      { q: 'Which hashing algorithm is recommended for storing passwords?', a: 'Argon2id', opts: ['MD5', 'SHA-1', 'Argon2id', 'SHA-256'] },
      { q: 'What defeats rainbow table attacks?', a: 'Salting', opts: ['Longer passwords', 'Encryption', 'Salting', 'Faster hashing'] },
      { q: 'Password spraying differs from brute force because…', a: 'It tries common passwords across many accounts', opts: ['It uses rainbow tables', 'It cracks one account exhaustively', 'It tries common passwords across many accounts', 'It requires admin access'] },
      { q: 'NIST SP 800-63B recommends a minimum password length of?', a: '8 characters', opts: ['6 characters', '8 characters', '12 characters', '16 characters'] },
      { q: 'MFA combines knowledge, possession, and what third factor?', a: 'Inherence (biometrics)', opts: ['Location', 'Time', 'Inherence (biometrics)', 'Network access'] },
    ],
  },
  {
    id: 'social-eng',
    title: 'Social Engineering',
    icon: '🎭',
    xp: 100,
    badge: { id: 'badge-social', name: 'Mind Guard', icon: '🎭' },
    topics: [
      'Phishing & Spear Phishing',
      'Pretexting & Vishing',
      'Baiting & Tailgating',
      'Human Psychology in SE',
      'Defensive Awareness',
    ],
    lessons: [
      {
        title: 'Phishing Attacks',
        content: `<h3>Phishing & Spear Phishing</h3>
<p><strong>Phishing</strong> uses deceptive emails to trick users into revealing credentials or installing malware.</p>
<p><strong>Spear Phishing</strong> targets specific individuals with personalised content — highly effective.</p>
<p><strong>Indicators of phishing:</strong></p>
<ul>
  <li>Urgent/threatening language</li>
  <li>Mismatched or spoofed sender addresses</li>
  <li>Suspicious links (hover to inspect)</li>
  <li>Unexpected attachments</li>
</ul>
<p>Defences: Email filtering, DMARC/DKIM/SPF records, security awareness training.</p>`,
      },
      {
        title: 'Pretexting & Vishing',
        content: `<h3>Pretexting, Vishing & Smishing</h3>
<p><strong>Pretexting:</strong> Creating a fabricated scenario to extract information (e.g., impersonating IT support).</p>
<p><strong>Vishing (Voice Phishing):</strong> Phone-based social engineering — impersonating banks, tech support, or government officials.</p>
<p><strong>Smishing (SMS Phishing):</strong> Fraudulent text messages with malicious links.</p>
<p><em>Key principle:</em> Verify identity through official channels before disclosing sensitive information.</p>`,
      },
      {
        title: 'Human Psychology',
        content: `<h3>Psychological Principles in Social Engineering</h3>
<p>Robert Cialdini's principles of influence exploited by attackers:</p>
<ul>
  <li><strong>Authority:</strong> Impersonating executives or law enforcement</li>
  <li><strong>Urgency/Scarcity:</strong> "Act now or lose access"</li>
  <li><strong>Social Proof:</strong> "Everyone in your company has done this"</li>
  <li><strong>Reciprocity:</strong> Offering help first to create obligation</li>
  <li><strong>Liking:</strong> Building rapport before the attack</li>
</ul>
<p><strong>Defence:</strong> Security awareness training, clear verification procedures, "zero trust" culture.</p>`,
      },
    ],
    quiz: [
      { q: 'Spear phishing differs from general phishing because it…', a: 'Targets specific individuals with personalised content', opts: ['Uses SMS', 'Targets specific individuals with personalised content', 'Requires physical access', 'Only attacks email servers'] },
      { q: 'Which email authentication standard helps prevent sender spoofing?', a: 'DMARC/DKIM/SPF', opts: ['TLS/SSL', 'DMARC/DKIM/SPF', 'HTTPS', 'DNSSEC'] },
      { q: 'Vishing attacks use which communication channel?', a: 'Phone/Voice', opts: ['Email', 'SMS', 'Phone/Voice', 'Web browser'] },
      { q: 'Which Cialdini principle does an attacker exploit by saying "act now or lose access"?', a: 'Urgency/Scarcity', opts: ['Authority', 'Reciprocity', 'Urgency/Scarcity', 'Liking'] },
      { q: 'The best defence against social engineering is?', a: 'Security awareness training and verification procedures', opts: ['Antivirus software', 'Firewalls', 'Security awareness training and verification procedures', 'Encryption'] },
    ],
  },
  {
    id: 'malware',
    title: 'Malware Analysis',
    icon: '🦠',
    xp: 150,
    badge: { id: 'badge-malware', name: 'Virus Hunter', icon: '🦠' },
    topics: [
      'Types of Malware',
      'Static vs Dynamic Analysis',
      'Indicators of Compromise (IoC)',
      'Sandboxing',
      'Malware Defence',
    ],
    lessons: [
      {
        title: 'Types of Malware',
        content: `<h3>Types of Malware</h3>
<ul>
  <li><strong>Virus:</strong> Attaches to legitimate files; spreads when executed</li>
  <li><strong>Worm:</strong> Self-replicates across networks without user interaction</li>
  <li><strong>Trojan:</strong> Disguised as legitimate software</li>
  <li><strong>Ransomware:</strong> Encrypts victim data and demands payment</li>
  <li><strong>Rootkit:</strong> Hides attacker presence in OS kernel</li>
  <li><strong>Spyware/Keylogger:</strong> Silently monitors and exfiltrates data</li>
  <li><strong>Botnet/RAT:</strong> Remote Access Trojan for command-and-control</li>
</ul>`,
      },
      {
        title: 'Static vs Dynamic Analysis',
        content: `<h3>Malware Analysis Techniques</h3>
<p><strong>Static Analysis:</strong> Examining code without executing it.</p>
<ul>
  <li>Hash the sample (MD5/SHA256) and check VirusTotal</li>
  <li>Extract strings: <code>strings malware.exe | grep -i http</code></li>
  <li>Disassemble with Ghidra or IDA Free</li>
</ul>
<p><strong>Dynamic Analysis:</strong> Running the malware in an isolated environment.</p>
<ul>
  <li>Use a sandboxed VM (Cuckoo Sandbox, Any.run)</li>
  <li>Monitor file system, registry, and network changes</li>
  <li>Capture network traffic with Wireshark</li>
</ul>
<p><strong>Always analyse malware in an isolated, air-gapped environment.</strong></p>`,
      },
      {
        title: 'Indicators of Compromise',
        content: `<h3>Indicators of Compromise (IoCs)</h3>
<p>IoCs are forensic evidence that a system has been compromised:</p>
<ul>
  <li><strong>File-based:</strong> Suspicious file hashes, unexpected executables in <code>/tmp</code> or <code>%APPDATA%</code></li>
  <li><strong>Network-based:</strong> Connections to known C2 IPs/domains, unusual outbound traffic</li>
  <li><strong>Behavioural:</strong> New scheduled tasks, disabled AV/logs, registry autorun keys</li>
</ul>
<p>Threat intelligence feeds (MISP, AlienVault OTX) provide community-shared IoCs.</p>`,
      },
    ],
    quiz: [
      { q: 'Which malware type self-replicates across networks without user interaction?', a: 'Worm', opts: ['Virus', 'Worm', 'Trojan', 'Ransomware'] },
      { q: 'Static malware analysis involves…', a: 'Examining code without executing it', opts: ['Running it in a VM', 'Examining code without executing it', 'Monitoring network traffic', 'Checking antivirus logs'] },
      { q: 'What does a rootkit primarily do?', a: 'Hides attacker presence at the OS/kernel level', opts: ['Encrypts user files', 'Hides attacker presence at the OS/kernel level', 'Replicates via email', 'Steals credit card numbers'] },
      { q: 'IoC stands for?', a: 'Indicator of Compromise', opts: ['Internet of Capabilities', 'Indicator of Compromise', 'Index of Control', 'Intrusion of Code'] },
      { q: 'Cuckoo Sandbox is used for?', a: 'Dynamic malware analysis in an isolated environment', opts: ['Penetration testing', 'Dynamic malware analysis in an isolated environment', 'Password cracking', 'Network scanning'] },
    ],
  },
  {
    id: 'cryptography',
    title: 'Cryptography',
    icon: '🔐',
    xp: 150,
    badge: { id: 'badge-crypto', name: 'Crypto Cracker', icon: '🔐' },
    topics: [
      'Symmetric & Asymmetric Encryption',
      'Common Ciphers (AES, RSA, ECC)',
      'TLS/HTTPS',
      'Hashing & Digital Signatures',
      'Common Crypto Attacks',
    ],
    lessons: [
      {
        title: 'Symmetric vs Asymmetric',
        content: `<h3>Symmetric vs Asymmetric Encryption</h3>
<p><strong>Symmetric:</strong> Same key for encryption and decryption. Fast, but key distribution is a challenge.</p>
<ul><li>AES-256 (Advanced Encryption Standard) — current gold standard</li></ul>
<p><strong>Asymmetric:</strong> Key pair — public key encrypts, private key decrypts (or vice versa for signatures).</p>
<ul>
  <li>RSA-2048+ — widely used for key exchange and signatures</li>
  <li>ECC (Elliptic Curve Cryptography) — stronger security with shorter keys</li>
</ul>
<p>In practice (TLS): Asymmetric crypto secures the key exchange; symmetric crypto (AES) handles bulk data encryption.</p>`,
      },
      {
        title: 'TLS & HTTPS',
        content: `<h3>TLS/HTTPS</h3>
<p>TLS (Transport Layer Security) encrypts data in transit. HTTPS = HTTP over TLS.</p>
<p><strong>TLS 1.3 handshake (simplified):</strong></p>
<ol>
  <li>Client sends supported cipher suites</li>
  <li>Server sends certificate + public key</li>
  <li>Client verifies certificate against trusted CA</li>
  <li>Key exchange (ECDHE) → shared session key derived</li>
  <li>Bulk data encrypted with AES-GCM</li>
</ol>
<p><em>Security note:</em> Always use TLS 1.2+. Disable SSL 3.0, TLS 1.0, and weak ciphers (RC4, DES).</p>`,
      },
      {
        title: 'Classic Ciphers & Attacks',
        content: `<h3>Classic Ciphers & Modern Attacks</h3>
<p><strong>Caesar Cipher:</strong> Shift each letter by a fixed amount — easily broken by frequency analysis.</p>
<p><strong>Vigenère Cipher:</strong> Uses a keyword — stronger than Caesar but still breakable.</p>
<p><strong>Common modern crypto attacks:</strong></p>
<ul>
  <li><strong>Padding Oracle:</strong> Exploits error messages to decrypt ciphertext</li>
  <li><strong>Downgrade Attack:</strong> Forces use of weaker protocol (POODLE — SSL 3.0)</li>
  <li><strong>Timing Attack:</strong> Infers secrets from computation time differences</li>
  <li><strong>Birthday Attack:</strong> Hash collisions — motivation for SHA-256 over MD5</li>
</ul>`,
      },
    ],
    quiz: [
      { q: 'AES is an example of which type of encryption?', a: 'Symmetric', opts: ['Asymmetric', 'Symmetric', 'Hybrid', 'Hashing'] },
      { q: 'In TLS, what is the purpose of the server certificate?', a: 'Authenticate the server and share its public key', opts: ['Encrypt all data', 'Authenticate the server and share its public key', 'Store session cookies', 'Replace the password'] },
      { q: 'Which key encrypts data in asymmetric encryption?', a: 'Public key', opts: ['Private key', 'Public key', 'Session key', 'Symmetric key'] },
      { q: 'The Caesar cipher is broken by?', a: 'Frequency analysis', opts: ['Brute force only', 'Frequency analysis', 'Rainbow tables', 'XOR decryption'] },
      { q: 'ECC provides stronger security than RSA because…', a: 'It achieves equivalent security with much shorter key lengths', opts: ['It uses a symmetric algorithm', 'It achieves equivalent security with much shorter key lengths', 'It does not require certificates', 'It is faster on all hardware'] },
    ],
  },
  {
    id: 'wireless',
    title: 'Wireless Security',
    icon: '📡',
    xp: 100,
    badge: { id: 'badge-wireless', name: 'Signal Sentry', icon: '📡' },
    topics: [
      'Wi-Fi Standards & Protocols',
      'WEP / WPA / WPA2 / WPA3',
      'Evil Twin & Rogue AP',
      'Bluetooth & IoT Security',
      'Wireless Defence',
    ],
    lessons: [
      {
        title: 'Wi-Fi Security Standards',
        content: `<h3>Wi-Fi Security Standards</h3>
<ul>
  <li><strong>WEP (1997):</strong> Broken — use of RC4 with weak IV; crackable in minutes. Never use.</li>
  <li><strong>WPA (2003):</strong> Improved but still vulnerable to TKIP attacks.</li>
  <li><strong>WPA2 (2004):</strong> AES-CCMP encryption; KRACK vulnerability patched by OS updates.</li>
  <li><strong>WPA3 (2018):</strong> SAE (Simultaneous Authentication of Equals) replaces PSK handshake; protects against offline dictionary attacks.</li>
</ul>
<p><em>Recommendation:</em> Use WPA3 where possible; at minimum WPA2 with AES (not TKIP). Disable WPS.</p>`,
      },
      {
        title: 'Evil Twin & Rogue AP',
        content: `<h3>Evil Twin & Rogue Access Points</h3>
<p>An <strong>Evil Twin</strong> is a rogue Wi-Fi AP that mimics a legitimate network to intercept traffic.</p>
<p><strong>Attack flow:</strong></p>
<ol>
  <li>Attacker clones the SSID of a trusted network</li>
  <li>Broadcasts stronger signal to force clients to connect</li>
  <li>Performs MitM (Man-in-the-Middle) to intercept/modify traffic</li>
</ol>
<p><strong>Defences:</strong> VPN always-on policy, 802.1X enterprise authentication, HTTPS-only browsing, wireless intrusion detection (WIDS).</p>
<p><strong>⚠️ Setting up rogue APs without authorisation is illegal.</strong></p>`,
      },
      {
        title: 'Bluetooth & IoT',
        content: `<h3>Bluetooth & IoT Security</h3>
<p><strong>Bluetooth attacks:</strong></p>
<ul>
  <li><strong>Bluejacking:</strong> Sending unsolicited messages</li>
  <li><strong>Bluesnarfing:</strong> Unauthorised access to data via Bluetooth</li>
  <li><strong>BlueBorne:</strong> Remote code execution via Bluetooth (CVE-2017-0781)</li>
</ul>
<p><strong>IoT Security risks:</strong> Default credentials, unencrypted protocols, infrequent patching, physical access vulnerabilities.</p>
<p><strong>Mitigations:</strong> Change default passwords, segment IoT on separate VLAN, apply firmware updates, disable unused radios.</p>`,
      },
    ],
    quiz: [
      { q: 'Why is WEP considered insecure?', a: 'Weak IV implementation with RC4 allows cracking in minutes', opts: ['It uses too strong encryption', 'Weak IV implementation with RC4 allows cracking in minutes', 'It does not support AES', 'It requires WPS'] },
      { q: 'WPA3 improves security over WPA2 primarily through?', a: 'SAE (Simultaneous Authentication of Equals)', opts: ['Longer passwords', 'SAE (Simultaneous Authentication of Equals)', 'WPS simplification', 'Faster throughput'] },
      { q: 'An Evil Twin attack impersonates…', a: 'A legitimate Wi-Fi access point', opts: ['A DNS server', 'A legitimate Wi-Fi access point', 'An email server', 'A VPN gateway'] },
      { q: 'Bluesnarfing involves?', a: 'Unauthorised access to device data via Bluetooth', opts: ['Jamming Bluetooth signals', 'Sending unsolicited messages', 'Unauthorised access to device data via Bluetooth', 'Updating device firmware'] },
      { q: 'Best practice for IoT device security when first set up?', a: 'Change default credentials immediately', opts: ['Enable WPS', 'Keep default credentials', 'Change default credentials immediately', 'Disable firmware updates'] },
    ],
  },
  {
    id: 'ctf-training',
    title: 'CTF Training',
    icon: '🚩',
    xp: 150,
    badge: { id: 'badge-ctf', name: 'Flag Catcher', icon: '🚩' },
    topics: [
      'CTF Categories',
      'Steganography',
      'Reverse Engineering Basics',
      'Binary Exploitation Concepts',
      'OSINT Fundamentals',
    ],
    lessons: [
      {
        title: 'CTF Categories',
        content: `<h3>CTF Competition Categories</h3>
<p>Capture The Flag (CTF) competitions develop practical security skills through structured challenges:</p>
<ul>
  <li><strong>Web:</strong> SQLi, XSS, IDOR, SSRF, auth bypass</li>
  <li><strong>Forensics:</strong> File carving, memory dumps, network capture analysis</li>
  <li><strong>Cryptography:</strong> Breaking classical/modern ciphers, hash reversals</li>
  <li><strong>Steganography:</strong> Data hidden in images, audio, video</li>
  <li><strong>Reverse Engineering:</strong> Analysing compiled binaries with Ghidra/GDB</li>
  <li><strong>Binary Exploitation (Pwn):</strong> Buffer overflows, format strings, ROP chains</li>
  <li><strong>OSINT:</strong> Open-source intelligence gathering</li>
</ul>
<p><em>Platforms:</em> TryHackMe, HackTheBox, CTFtime.org, PicoCTF.</p>`,
      },
      {
        title: 'Steganography',
        content: `<h3>Steganography</h3>
<p>Steganography hides data inside other files (images, audio, video) without obvious detection.</p>
<p><strong>Common techniques:</strong></p>
<ul>
  <li>LSB (Least Significant Bit) in images</li>
  <li>Metadata hiding (EXIF data)</li>
  <li>Whitespace / invisible characters in text</li>
</ul>
<p><strong>Tools:</strong></p>
<pre><code>steghide extract -sf image.jpg
strings file.png | grep -i flag
exiftool photo.jpg
zsteg image.png  # PNG LSB analysis</code></pre>`,
      },
      {
        title: 'OSINT Fundamentals',
        content: `<h3>OSINT (Open-Source Intelligence)</h3>
<p>OSINT involves gathering information from publicly available sources:</p>
<ul>
  <li><strong>Google Dorking:</strong> <code>site:example.com filetype:pdf</code>, <code>intitle:"index of"</code></li>
  <li><strong>Shodan:</strong> Search for internet-connected devices and services</li>
  <li><strong>WHOIS / DNS:</strong> Domain registration and record lookups</li>
  <li><strong>Social Media:</strong> LinkedIn, Twitter, GitHub for employee/code intel</li>
  <li><strong>Wayback Machine:</strong> Historical website snapshots</li>
</ul>
<p><strong>⚠️ OSINT must only be conducted within the scope of an authorised engagement.</strong></p>`,
      },
    ],
    quiz: [
      { q: 'LSB steganography hides data in…', a: 'The least significant bits of pixel values', opts: ['File metadata', 'The least significant bits of pixel values', 'Encrypted headers', 'File checksums'] },
      { q: 'Which platform hosts beginner-friendly CTF rooms and learning paths?', a: 'TryHackMe', opts: ['Shodan', 'TryHackMe', 'VirusTotal', 'WHOIS'] },
      { q: 'Google Dork "site:example.com filetype:pdf" finds?', a: 'PDF files hosted on example.com', opts: ['All PDF files online', 'PDF files hosted on example.com', 'example.com DNS records', 'Cached images of example.com'] },
      { q: 'Shodan is used in OSINT to?', a: 'Search for internet-connected devices and services', opts: ['Crack passwords', 'Search for internet-connected devices and services', 'Analyse malware samples', 'Monitor social media'] },
      { q: 'In binary exploitation, a buffer overflow overwrites?', a: 'Adjacent memory regions beyond a buffer\'s boundary', opts: ['Hard disk sectors', 'Adjacent memory regions beyond a buffer\'s boundary', 'CPU registers only', 'Network packets'] },
    ],
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    icon: '🚨',
    xp: 150,
    badge: { id: 'badge-ir', name: 'First Responder', icon: '🚨' },
    topics: [
      'IR Lifecycle (NIST)',
      'Detection & Analysis',
      'Containment, Eradication & Recovery',
      'Digital Forensics Basics',
      'Post-Incident Review',
    ],
    lessons: [
      {
        title: 'NIST IR Lifecycle',
        content: `<h3>Incident Response Lifecycle (NIST SP 800-61)</h3>
<p>NIST defines four phases of incident response:</p>
<ol>
  <li><strong>Preparation:</strong> Policies, playbooks, tools, training, communication plans</li>
  <li><strong>Detection & Analysis:</strong> Identify incidents via SIEM, IDS/IPS, logs, alerts</li>
  <li><strong>Containment, Eradication & Recovery:</strong>
    <ul>
      <li>Short-term: Isolate affected systems</li>
      <li>Long-term: Remove malware, patch vulnerabilities</li>
      <li>Recovery: Restore services, verify integrity</li>
    </ul>
  </li>
  <li><strong>Post-Incident Activity:</strong> Lessons learned, report, update defences</li>
</ol>`,
      },
      {
        title: 'Digital Forensics',
        content: `<h3>Digital Forensics Basics</h3>
<p>Digital forensics preserves and analyses digital evidence following the <strong>chain of custody</strong>.</p>
<p><strong>Key principles:</strong></p>
<ul>
  <li>Preserve evidence integrity — work on forensic copies (dd, FTK Imager)</li>
  <li>Hash evidence before/after: <code>md5sum disk.img</code></li>
  <li>Document every action with timestamps</li>
</ul>
<p><strong>Evidence order of volatility (most to least):</strong></p>
<ol>
  <li>CPU registers & cache</li>
  <li>RAM / running processes</li>
  <li>Network connections</li>
  <li>Disk storage</li>
  <li>Backups / archives</li>
</ol>`,
      },
      {
        title: 'Containment & Recovery',
        content: `<h3>Containment, Eradication & Recovery</h3>
<p><strong>Containment strategies:</strong></p>
<ul>
  <li>Network isolation (VLAN, firewall rules, null routing)</li>
  <li>Account disablement / password resets</li>
  <li>Taking forensic snapshots before shutdown</li>
</ul>
<p><strong>Eradication:</strong> Remove malware, close vulnerabilities, patch systems, audit accounts.</p>
<p><strong>Recovery:</strong> Restore from clean backups, monitor closely for recurrence, validate with threat hunting.</p>
<p><em>Remember:</em> Document everything — your incident report may be used in legal proceedings.</p>`,
      },
    ],
    quiz: [
      { q: 'Which NIST publication covers Incident Response?', a: 'NIST SP 800-61', opts: ['NIST SP 800-53', 'NIST SP 800-61', 'NIST SP 800-171', 'NIST CSF'] },
      { q: 'What is the correct order of evidence collection by volatility?', a: 'RAM → Network connections → Disk', opts: ['Disk → RAM → Network', 'RAM → Network connections → Disk', 'Network → Disk → RAM', 'Disk → Network → RAM'] },
      { q: 'Chain of custody in forensics ensures?', a: 'Evidence integrity and admissibility in legal proceedings', opts: ['Faster analysis', 'Evidence integrity and admissibility in legal proceedings', 'Data encryption', 'Network isolation'] },
      { q: 'The first step when an incident is detected should be?', a: 'Contain the threat to prevent further spread', opts: ['Delete all logs', 'Shut down all systems immediately', 'Contain the threat to prevent further spread', 'Notify the media'] },
      { q: 'Post-incident reviews (lessons learned) primarily help with?', a: 'Improving future preparation and response capabilities', opts: ['Billing clients', 'Improving future preparation and response capabilities', 'Legal prosecution only', 'Recovering deleted files'] },
    ],
  },
  {
    id: 'hacker-types',
    title: 'Hacker Types & Ethics',
    icon: '🎩',
    xp: 150,
    badge: { id: 'badge-hacker-types', name: 'Hat Spotter', icon: '🎩' },
    topics: [
      'White Hat & Black Hat Hackers',
      'Red Hat, Blue Hat & Grey Hat',
      'Motivations & Legal Boundaries',
      'Ethics Scenarios: Choose Your Path',
      'Responsible Disclosure & Bug Bounties',
    ],
    lessons: [
      {
        title: 'White Hat & Black Hat Hackers',
        content: `<h3>White Hat & Black Hat Hackers</h3>
<p>The colour-coded "hat" terminology comes from old Western films — the hero wore a white hat, the villain a black one.</p>
<h4>🤍 White Hat (Ethical Hacker)</h4>
<ul>
  <li><strong>Who:</strong> Security professionals, penetration testers, bug bounty hunters</li>
  <li><strong>What they do:</strong> Find and report vulnerabilities with <em>explicit written authorisation</em></li>
  <li><strong>Legal status:</strong> Fully legal — contracted or employed</li>
  <li><strong>Goal:</strong> Improve security, protect organisations and users</li>
  <li><strong>Certifications:</strong> CEH, OSCP, CompTIA Security+</li>
</ul>
<h4>🖤 Black Hat (Malicious Hacker)</h4>
<ul>
  <li><strong>Who:</strong> Cybercriminals, ransomware operators, data thieves</li>
  <li><strong>What they do:</strong> Conduct <em>unauthorised</em> attacks for financial gain, espionage, or disruption</li>
  <li><strong>Legal status:</strong> Illegal — violates CFAA, Computer Misuse Act, and equivalent laws worldwide</li>
  <li><strong>Consequences:</strong> Federal prosecution, fines, imprisonment</li>
</ul>
<p><strong>Key distinction:</strong> The technical skills are identical — the difference is <em>authorisation and intent</em>.</p>`,
      },
      {
        title: 'Red Hat, Blue Hat & Grey Hat',
        content: `<h3>Red Hat, Blue Hat & Grey Hat Hackers</h3>
<h4>🩶 Grey Hat</h4>
<p>Grey hats operate in the ethical middle-ground. They may break into systems <em>without authorisation</em> to discover vulnerabilities, then notify the owner — sometimes demanding payment for the report.</p>
<p><strong>⚠️ Important:</strong> Even if their intent is to help, grey hat activity is <em>still illegal</em> — unauthorised access is a crime regardless of motivation.</p>
<h4>🔴 Red Hat (Vigilante Hacker)</h4>
<ul>
  <li>Red hats aggressively target and disrupt Black Hat hackers and cybercriminal infrastructure</li>
  <li>They may use offensive techniques (DDoS, counter-intrusion) against criminal systems</li>
  <li><strong>Legal status:</strong> Vigilante hacking is illegal in most jurisdictions even if targeting criminals</li>
  <li>The ethical path is to report criminal activity to authorities (CISA, FBI IC3, Europol)</li>
</ul>
<h4>🔵 Blue Hat (Pre-Release Security Tester)</h4>
<ul>
  <li>Outside security professionals invited to test a product <em>before its public release</em></li>
  <li>Commonly associated with Microsoft's Blue Hat security conferences</li>
  <li>Also informally used for individuals seeking revenge through hacking (non-professional)</li>
  <li><strong>Professional use:</strong> Fully legal, engaged under formal contract</li>
</ul>`,
      },
      {
        title: 'Ethics Scenarios: Choose Your Path',
        content: `<h3>Ethics Scenarios: Choose Your Path</h3>
<p>Understanding hacker types means nothing if you can't apply that knowledge to real situations. The following scenarios are designed to test your ethical reasoning.</p>
<h4>Scenario 1: The Accidental Discovery</h4>
<p>While shopping online, you notice the URL contains a user ID parameter. Changing it to another number displays another customer's order history.</p>
<p><strong>✅ White Hat response:</strong> Stop immediately, document the issue, and report it through the store's responsible disclosure / bug bounty programme. Do <em>not</em> access any further records.</p>
<p><strong>❌ Grey/Black Hat response:</strong> Continuing to access other records is an IDOR (Insecure Direct Object Reference) attack and constitutes unauthorised access.</p>
<h4>Scenario 2: The Open Wi-Fi</h4>
<p>You're at a café and discover the public Wi-Fi has no encryption. You intercept traffic and can see other users' credentials.</p>
<p><strong>✅ Ethical response:</strong> Disconnect. Notify the café owner. Intercepting others' traffic without consent is illegal under wiretap laws — even on an open network.</p>
<h4>Scenario 3: Criminal Infrastructure</h4>
<p>You discover a botnet C&C server. You have the skills to take it offline.</p>
<p><strong>✅ Correct response:</strong> Report to law enforcement (CISA, FBI IC3, NCSC) and share your evidence. Taking vigilante action — even against criminals — is itself illegal and could undermine prosecution.</p>
<h4>The Golden Rule</h4>
<p>Before any security action, ask: <strong>"Do I have explicit written authorisation to do this?"</strong> If the answer is no — stop, document, and report through legal channels.</p>`,
      },
    ],
    quiz: [
      {
        q: 'A penetration tester hired by a company to find and report vulnerabilities under a signed agreement is best described as:',
        a: 'White Hat',
        opts: ['Black Hat', 'Grey Hat', 'White Hat', 'Red Hat'],
      },
      {
        q: 'A hacker breaks into a company\'s server without permission, discovers a vulnerability, and notifies the owner — demanding payment for the report. This is:',
        a: 'Grey Hat — still illegal despite good intent',
        opts: [
          'White Hat — they reported it, so it is ethical',
          'Grey Hat — still illegal despite good intent',
          'Blue Hat — standard pre-release testing',
          'Red Hat — defending the internet',
        ],
      },
      {
        q: 'You find a zero-day vulnerability in widely used banking software. What is the correct White Hat action?',
        a: 'Report it privately to the vendor through their responsible disclosure process',
        opts: [
          'Sell it to the highest bidder on the dark web',
          'Post technical details publicly so everyone can protect themselves',
          'Report it privately to the vendor through their responsible disclosure process',
          'Exploit it to prove it is real, then report it',
        ],
      },
      {
        q: 'A Red Hat hacker discovers a Black Hat\'s attack server. What distinguishes the ethical path from vigilante action?',
        a: 'Reporting evidence to law enforcement rather than attacking the criminal\'s server directly',
        opts: [
          'Using stronger exploits than the criminal used',
          'Reporting evidence to law enforcement rather than attacking the criminal\'s server directly',
          'Notifying the criminal\'s ISP and waiting 24 hours',
          'Publishing the criminal\'s personal details online',
        ],
      },
      {
        q: 'What is the single most important question to ask before performing any security testing activity?',
        a: 'Do I have explicit written authorisation to test this system?',
        opts: [
          'Is the vulnerability serious enough to justify the test?',
          'Can I complete the test without being detected?',
          'Do I have explicit written authorisation to test this system?',
          'Will the results help improve the organisation\'s security?',
        ],
      },
    ],
  },
];

const ALL_BADGES = [
  ...MODULES.map((m) => m.badge),
  { id: 'badge-first-login', name: 'First Login', icon: '🎉' },
];

const LEVEL_THRESHOLDS = [
  { name: 'Rookie', min: 0 },
  { name: 'Apprentice', min: 200 },
  { name: 'Hacker', min: 500 },
  { name: 'Elite Hacker', min: 900 },
  { name: 'Cyber Ninja', min: 1400 },
];

function getLevel(xp) {
  let level = LEVEL_THRESHOLDS[0];
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.min) level = t;
  }
  return level.name;
}

/* ── CTF Challenges ────────────────────────────────────────── */
const CTF_CHALLENGES = [
  {
    id: 'ctf1',
    title: 'Caesar Says',
    category: 'Cryptography',
    difficulty: 'Easy',
    icon: '🔤',
    xp: 50,
    description: 'Decode this Caesar cipher message. The flag is the decoded word (uppercase, no spaces).',
    hint: 'The alphabet shifts by 13 places — a very common rotation.',
    encoded: 'URYYBJBEYQ',
    flag: 'HELLOWORLD',
    explanation: 'ROT13 shifts each letter 13 places. U→H, R→E, Y→L, Y→L, B→O, J→W, B→O, E→R, Y→L, Q→D → HELLOWORLD',
  },
  {
    id: 'ctf2',
    title: 'Base Mystery',
    category: 'Encoding',
    difficulty: 'Easy',
    icon: '🔢',
    xp: 50,
    description: 'Decode this Base64-encoded string to find the flag.',
    hint: 'Base64 uses A-Z, a-z, 0-9, + and /. The result is a single word in uppercase.',
    encoded: 'Q1lCRVJTRUM=',
    flag: 'CYBERSEC',
    explanation: 'Base64 decode of "Q1lCRVJTRUM=" = "CYBERSEC"',
  },
  {
    id: 'ctf3',
    title: 'Hex Hunt',
    category: 'Forensics',
    difficulty: 'Medium',
    icon: '🔍',
    xp: 50,
    description: 'Convert this hex string to ASCII to reveal the flag.',
    hint: 'Each pair of hex digits represents one ASCII character.',
    encoded: '4854423230323646',
    flag: 'HTB2026F',
    explanation: '48=H, 54=T, 42=B, 32=2, 30=0, 32=2, 36=6, 46=F → HTB2026F',
  },
  {
    id: 'ctf4',
    title: 'XOR Secret',
    category: 'Cryptography',
    difficulty: 'Medium',
    icon: '⊕',
    xp: 50,
    description: 'The flag was XOR\'d with the key "A" (decimal 65). The resulting bytes (decimal) are: 9, 3, 18, 18, 15, 18. What is the flag?',
    hint: 'XOR each value with 65 to get the ASCII code, then convert to character.',
    encoded: '[9, 3, 18, 18, 15, 18]',
    flag: 'HBSSNS',
    explanation: 'XOR each value with 65 (key "A"): 9^65=72=H, 3^65=66=B, 18^65=83=S, 18^65=83=S, 15^65=78=N, 18^65=83=S → HBSSNS',
  },
  {
    id: 'ctf5',
    title: 'Hash Buster',
    category: 'Cryptography',
    difficulty: 'Hard',
    icon: '#️⃣',
    xp: 50,
    description: 'This MD5 hash corresponds to a common 4-digit PIN. Find the PIN. MD5: "e48e13207341b6bffb7fb1622282247b"',
    hint: 'The PIN is between 1000 and 9999. Think of a well-known hacker reference number.',
    encoded: 'e48e13207341b6bffb7fb1622282247b',
    flag: '1337',
    explanation: 'MD5("1337") = e48e13207341b6bffb7fb1622282247b. "1337" is leet-speak, a classic hacker reference.',
  },
];

/* ── Simulated leaderboard players ─────────────────────────── */
const LEADERBOARD_BOTS = [
  { username: 'n3tz3r0', xp: 1700, modules: 11, badges: 12 },
  { username: 'xpl0it_hunter', xp: 1550, modules: 11, badges: 11 },
  { username: 'darkpulse99', xp: 1250, modules: 9, badges: 9 },
  { username: 'bytecrusher', xp: 1100, modules: 8, badges: 8 },
  { username: 'cipherqueen', xp: 950, modules: 7, badges: 7 },
  { username: 'r00tk1t_rex', xp: 850, modules: 6, badges: 6 },
  { username: 'hacktivist42', xp: 700, modules: 5, badges: 5 },
  { username: 'vuln_wizard', xp: 550, modules: 4, badges: 4 },
  { username: 'shellcode_sam', xp: 400, modules: 3, badges: 3 },
  { username: 'firewall_fred', xp: 250, modules: 2, badges: 2 },
];

/* ── Auth State ────────────────────────────────────────────── */
const Auth = {
  currentUser: () => Store.get('csa_current_user'),
  users: () => Store.get('csa_users', {}),

  register(username, email, password) {
    const users = Auth.users();
    const emailLower = email.toLowerCase();
    if (Object.values(users).find((u) => u.email === emailLower)) {
      return { ok: false, error: 'Email already registered.' };
    }
    if (Object.values(users).find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: 'Username already taken.' };
    }
    const id = 'u_' + Date.now();
    const user = {
      id,
      username,
      email: emailLower,
      // WARNING: btoa(encodeURIComponent(password)) is NOT cryptographically
      // secure — it is trivially reversible. This is intentional for a
      // zero-dependency, browser-only demo that stores no real personal data.
      // Do NOT use real passwords here, and do NOT copy this pattern into
      // production code. A real application must use bcrypt / Argon2id on the
      // server side.
      passwordHash: btoa(encodeURIComponent(password)),
      joinedDate: new Date().toISOString(),
      xp: 0,
      badges: ['badge-first-login'],
      modulesCompleted: [],
      ctfSolved: [],
      activity: [{ text: '🎉 Joined CyberSec Academy', time: new Date().toISOString() }],
      settings: { theme: 'dark', fontSize: 16, notifModules: true, notifXP: true, notifBadges: true },
    };
    users[id] = user;
    Store.set('csa_users', users);
    Store.set('csa_current_user', id);
    return { ok: true, user };
  },

  login(email, password) {
    const users = Auth.users();
    const emailLower = email.toLowerCase();
    const user = Object.values(users).find((u) => u.email === emailLower);
    if (!user) return { ok: false, error: 'No account found with that email.' };
    if (user.passwordHash !== btoa(encodeURIComponent(password))) {
      return { ok: false, error: 'Incorrect password.' };
    }
    Store.set('csa_current_user', user.id);
    return { ok: true, user };
  },

  logout() {
    Store.remove('csa_current_user');
  },

  getUser(id) {
    const uid = id || Auth.currentUser();
    if (!uid) return null;
    return Auth.users()[uid] || null;
  },

  saveUser(user) {
    const users = Auth.users();
    users[user.id] = user;
    Store.set('csa_users', users);
  },
};

/* ── Router ────────────────────────────────────────────────── */
const PRIVATE_PAGES = ['dashboard', 'modules', 'module-detail', 'ctf', 'leaderboard', 'profile', 'settings', 'certificate'];

const Router = {
  currentPage: 'landing',

  navigate(page, data = {}) {
    const user = Auth.getUser();
    if (PRIVATE_PAGES.includes(page) && !user) {
      showToast('Please sign in to access this page.', 'warning');
      Router.show('login');
      return;
    }
    Router.show(page, data);
  },

  show(page, data = {}) {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    const section = $(`page-${page}`);
    if (!section) return;
    section.classList.add('active');
    Router.currentPage = page;
    Router.updateNav();
    window.scrollTo(0, 0);
    // Page-specific rendering
    switch (page) {
      case 'dashboard': Render.dashboard(); break;
      case 'modules': Render.modulesList(); break;
      case 'module-detail': Render.moduleDetail(data.moduleId, data.lessonIndex || 0); break;
      case 'ctf': Render.ctf(); break;
      case 'leaderboard': Render.leaderboard(); break;
      case 'profile': Render.profile(); break;
      case 'settings': Render.settings(); break;
      case 'certificate': Render.certificate(); break;
    }
  },

  updateNav() {
    const user = Auth.getUser();
    const navLinks = document.querySelectorAll('[data-auth]');
    navLinks.forEach((link) => {
      const auth = link.getAttribute('data-auth');
      if (auth === 'private') {
        link.parentElement.style.display = user ? '' : 'none';
      } else if (auth === 'public') {
        link.parentElement.style.display = user ? 'none' : '';
      }
    });
    // Active nav link
    document.querySelectorAll('[data-page]').forEach((a) => {
      a.classList.remove('active');
      if (a.getAttribute('data-page') === Router.currentPage) a.classList.add('active');
    });
  },
};

/* ── Progress helpers ──────────────────────────────────────── */
const Progress = {
  addXP(user, amount, reason) {
    user.xp = (user.xp || 0) + amount;
    user.activity = user.activity || [];
    user.activity.unshift({ text: `⚡ +${amount} XP — ${reason}`, time: new Date().toISOString() });
    if (user.activity.length > 20) user.activity.pop();
    if (user.settings?.notifXP !== false) showToast(`+${amount} XP — ${reason}`, 'success');
    Auth.saveUser(user);
  },

  completeModule(user, moduleId) {
    user.modulesCompleted = user.modulesCompleted || [];
    if (user.modulesCompleted.includes(moduleId)) return false;
    user.modulesCompleted.push(moduleId);
    const mod = MODULES.find((m) => m.id === moduleId);
    if (mod) {
      Progress.addXP(user, mod.xp, `Completed module: ${mod.title}`);
      Progress.awardBadge(user, mod.badge.id, mod.badge.name);
    }
    user.activity.unshift({ text: `📚 Completed module: ${mod?.title}`, time: new Date().toISOString() });
    if (user.activity.length > 20) user.activity.pop();
    if (user.settings?.notifModules !== false) showToast(`🎉 Module "${mod?.title}" completed!`, 'success', 5000);
    Auth.saveUser(user);
    return true;
  },

  awardBadge(user, badgeId, badgeName) {
    user.badges = user.badges || [];
    if (user.badges.includes(badgeId)) return;
    user.badges.push(badgeId);
    if (user.settings?.notifBadges !== false) {
      showToast(`🏅 New badge: ${badgeName}!`, 'success', 4000);
    }
    user.activity.unshift({ text: `🏅 Earned badge: ${badgeName}`, time: new Date().toISOString() });
    if (user.activity.length > 20) user.activity.pop();
    Auth.saveUser(user);
  },

  solveCTF(user, ctfId) {
    user.ctfSolved = user.ctfSolved || [];
    if (user.ctfSolved.includes(ctfId)) return false;
    user.ctfSolved.push(ctfId);
    Progress.addXP(user, 50, `CTF: ${CTF_CHALLENGES.find((c) => c.id === ctfId)?.title}`);
    Auth.saveUser(user);
    return true;
  },

  overallPct(user) {
    const completed = (user.modulesCompleted || []).length;
    return Math.round((completed / MODULES.length) * 100);
  },
};

/* ── Render functions ──────────────────────────────────────── */
const Render = {
  dashboard() {
    const user = Auth.getUser();
    if (!user) return;
    const pct = Progress.overallPct(user);
    const level = getLevel(user.xp);

    $('welcome-name').textContent = sanitize(user.username);
    $('welcome-level').textContent = level;
    $('welcome-xp').textContent = user.xp;
    $('stat-xp').textContent = user.xp;
    $('stat-modules').textContent = `${user.modulesCompleted?.length || 0}/${MODULES.length}`;
    $('stat-badges').textContent = user.badges?.length || 0;
    $('stat-level').textContent = level;
    $('progress-pct').textContent = `${pct}%`;
    const bar = $('overall-progress-bar');
    bar.style.width = `${pct}%`;
    bar.parentElement.setAttribute('aria-valuenow', pct);

    // Sidebar
    const nav = $('sidebar-nav');
    nav.innerHTML = '';
    MODULES.forEach((mod) => {
      const done = user.modulesCompleted?.includes(mod.id);
      const li = el('li', `sidebar-item${done ? ' done' : ''}`);
      li.innerHTML = `<a href="#" data-module="${sanitize(mod.id)}" class="sidebar-link">${sanitize(mod.icon)} ${sanitize(mod.title)} ${done ? '<span class="done-check">✓</span>' : ''}</a>`;
      nav.appendChild(li);
    });

    // Module grid
    const grid = $('module-grid');
    grid.innerHTML = '';
    MODULES.forEach((mod) => {
      const done = user.modulesCompleted?.includes(mod.id);
      const card = el('div', `module-card${done ? ' completed' : ''}`);
      card.innerHTML = `
        <div class="module-card-icon">${sanitize(mod.icon)}</div>
        <h4 class="module-card-title">${sanitize(mod.title)}</h4>
        <div class="module-card-meta">${mod.topics.length} topics · ${sanitize(String(mod.xp))} XP</div>
        <div class="module-card-status">${done ? '✅ Completed' : '▶ Start'}</div>`;
      card.addEventListener('click', () => Router.navigate('module-detail', { moduleId: mod.id }));
      grid.appendChild(card);
    });

    // Activity
    const feed = $('activity-feed');
    feed.innerHTML = '';
    if (!user.activity?.length) {
      feed.innerHTML = '<div class="activity-empty">No activity yet. Start a module!</div>';
    } else {
      user.activity.slice(0, 8).forEach((a) => {
        const item = el('div', 'activity-item');
        const time = new Date(a.time);
        item.innerHTML = `<span>${sanitize(a.text)}</span><span class="activity-time">${time.toLocaleDateString()}</span>`;
        feed.appendChild(item);
      });
    }
  },

  modulesList() {
    const user = Auth.getUser();
    const list = $('modules-list');
    list.innerHTML = '';
    MODULES.forEach((mod) => {
      const done = user?.modulesCompleted?.includes(mod.id);
      const card = el('div', `module-list-card${done ? ' completed' : ''}`);
      card.innerHTML = `
        <div class="mlc-icon">${sanitize(mod.icon)}</div>
        <div class="mlc-body">
          <h3 class="mlc-title">${sanitize(mod.title)}</h3>
          <ul class="mlc-topics">${mod.topics.map((t) => `<li>${sanitize(t)}</li>`).join('')}</ul>
        </div>
        <div class="mlc-meta">
          <div class="mlc-xp">${sanitize(String(mod.xp))} XP</div>
          <div class="mlc-status">${done ? '✅ Done' : '▶ Start'}</div>
          <button class="btn btn-primary mlc-btn">${done ? 'Review' : 'Start'}</button>
        </div>`;
      card.querySelector('.mlc-btn').addEventListener('click', () =>
        Router.navigate('module-detail', { moduleId: mod.id }),
      );
      list.appendChild(card);
    });
  },

  moduleDetail(moduleId, lessonIndex = 0) {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) { Router.navigate('modules'); return; }
    const user = Auth.getUser();
    const content = $('module-content');

    // Sidebar
    const sidebarNav = $('sidebar-nav-detail');
    sidebarNav.innerHTML = '';
    MODULES.forEach((m) => {
      const done = user?.modulesCompleted?.includes(m.id);
      const li = el('li', `sidebar-item${m.id === moduleId ? ' active' : ''}${done ? ' done' : ''}`);
      li.innerHTML = `<a href="#" class="sidebar-link" data-module="${sanitize(m.id)}">${sanitize(m.icon)} ${sanitize(m.title)}${done ? ' ✓' : ''}</a>`;
      sidebarNav.appendChild(li);
    });

    // Lesson or quiz
    if (lessonIndex < mod.lessons.length) {
      const lesson = mod.lessons[lessonIndex];
      const isLast = lessonIndex === mod.lessons.length - 1;
      content.innerHTML = `
        <div class="module-detail-header">
          <span class="module-breadcrumb"><a href="#" data-page="modules">Modules</a> › ${sanitize(mod.icon)} ${sanitize(mod.title)}</span>
          <h2>${sanitize(lesson.title)}</h2>
          <div class="lesson-progress-dots">${mod.lessons.map((_, i) =>
            `<span class="dot-step${i === lessonIndex ? ' active' : i < lessonIndex ? ' done' : ''}"></span>`).join('')}
            <span class="dot-step quiz-dot${lessonIndex >= mod.lessons.length ? ' active' : ''}">Q</span>
          </div>
        </div>
        <div class="lesson-content">${lesson.content}</div>
        <div class="lesson-nav">
          ${lessonIndex > 0 ? `<button class="btn btn-ghost" id="prev-lesson">← Previous</button>` : '<span></span>'}
          <button class="btn btn-primary" id="next-lesson">${isLast ? 'Take Quiz →' : 'Next →'}</button>
        </div>`;

      $('next-lesson').addEventListener('click', () =>
        Render.moduleDetail(moduleId, lessonIndex + 1),
      );
      if (lessonIndex > 0) {
        $('prev-lesson').addEventListener('click', () =>
          Render.moduleDetail(moduleId, lessonIndex - 1),
        );
      }
    } else {
      // Quiz
      Render.quiz(mod, content, user);
    }

    // Sidebar clicks
    content.querySelectorAll('[data-page]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate(a.getAttribute('data-page'));
      });
    });
    sidebarNav.querySelectorAll('[data-module]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate('module-detail', { moduleId: a.getAttribute('data-module') });
      });
    });
  },

  quiz(mod, container, user) {
    const already = user?.modulesCompleted?.includes(mod.id);
    container.innerHTML = `
      <div class="module-detail-header">
        <span class="module-breadcrumb"><a href="#" data-page="modules">Modules</a> › ${sanitize(mod.icon)} ${sanitize(mod.title)}</span>
        <h2>📝 Quiz: ${sanitize(mod.title)}</h2>
        <p class="quiz-intro">Answer all ${mod.quiz.length} questions correctly to complete the module and earn <strong>${mod.xp} XP</strong> + badge!</p>
      </div>
      <form id="quiz-form" class="quiz-form" novalidate></form>
      <div id="quiz-result" class="quiz-result" hidden></div>`;

    const form = $('quiz-form');
    mod.quiz.forEach((q, qi) => {
      const fieldset = el('fieldset', 'quiz-question');
      fieldset.innerHTML = `<legend class="quiz-q-text">Q${qi + 1}. ${sanitize(q.q)}</legend>`;
      q.opts.forEach((opt, oi) => {
        const label = el('label', 'quiz-option');
        label.innerHTML = `<input type="radio" name="q${qi}" value="${sanitize(opt)}" required /> <span>${sanitize(opt)}</span>`;
        fieldset.appendChild(label);
      });
      form.appendChild(fieldset);
    });

    const submitBtn = el('button', 'btn btn-primary quiz-submit', 'Submit Answers');
    submitBtn.type = 'submit';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let correct = 0;
      mod.quiz.forEach((q, qi) => {
        const selected = form.querySelector(`input[name="q${qi}"]:checked`);
        const fieldset = form.querySelectorAll('.quiz-question')[qi];
        fieldset.querySelectorAll('.quiz-option').forEach((label) => {
          label.classList.remove('correct', 'wrong', 'missed');
          const val = label.querySelector('input').value;
          if (val === q.a) label.classList.add('correct');
          else if (selected && selected.value === val) label.classList.add('wrong');
        });
        if (selected && selected.value === q.a) correct++;
      });
      submitBtn.disabled = true;

      const pass = correct === mod.quiz.length;
      const result = $('quiz-result');
      result.hidden = false;
      result.className = `quiz-result ${pass ? 'pass' : 'fail'}`;
      result.innerHTML = pass
        ? `<h3>🎉 Perfect Score! (${correct}/${mod.quiz.length})</h3><p>You passed! Module completed.</p>`
        : `<h3>📖 Score: ${correct}/${mod.quiz.length}</h3><p>Review the highlighted answers above and try again.</p>`;

      if (pass && !already) {
        const freshUser = Auth.getUser();
        Progress.completeModule(freshUser, mod.id);
        result.innerHTML += `<p>+${mod.xp} XP earned! Badge unlocked: ${mod.badge.icon} ${sanitize(mod.badge.name)}</p>`;
        // Check for completion certificate
        if (freshUser.modulesCompleted?.length === MODULES.length) {
          showToast('🏆 All modules complete! Certificate unlocked!', 'success', 6000);
          const certBtn = el('button', 'btn btn-primary', '📜 View Certificate');
          certBtn.addEventListener('click', () => Router.navigate('certificate'));
          result.appendChild(certBtn);
        }
      }

      if (!pass) {
        const retry = el('button', 'btn btn-secondary quiz-retry', 'Try Again');
        retry.addEventListener('click', () => Render.moduleDetail(mod.id, mod.lessons.length));
        result.appendChild(retry);
      }

      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    container.querySelector('[data-page]')?.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigate(container.querySelector('[data-page]').getAttribute('data-page'));
    });
  },

  ctf() {
    const user = Auth.getUser();
    const grid = $('ctf-grid');
    grid.innerHTML = '';
    CTF_CHALLENGES.forEach((ch) => {
      const solved = user?.ctfSolved?.includes(ch.id);
      const card = el('div', `ctf-card${solved ? ' solved' : ''}`);
      card.innerHTML = `
        <div class="ctf-card-top">
          <div class="ctf-icon">${ch.icon}</div>
          <div class="ctf-meta">
            <span class="ctf-category">${sanitize(ch.category)}</span>
            <span class="ctf-difficulty diff-${ch.difficulty.toLowerCase()}">${sanitize(ch.difficulty)}</span>
          </div>
          <div class="ctf-xp">+${ch.xp} XP</div>
        </div>
        <h3 class="ctf-title">${sanitize(ch.title)}</h3>
        <p class="ctf-desc">${sanitize(ch.description)}</p>
        <div class="ctf-encoded"><code>${sanitize(ch.encoded)}</code></div>
        ${solved ? '<div class="ctf-solved-badge">✅ Solved!</div>' : `
          <details class="ctf-hint-toggle">
            <summary>💡 Show Hint</summary>
            <p class="ctf-hint">${sanitize(ch.hint)}</p>
          </details>
          <div class="ctf-submit">
            <input type="text" class="ctf-flag-input" placeholder="Enter flag (uppercase)" aria-label="Flag input for ${sanitize(ch.title)}" />
            <button class="btn btn-primary ctf-submit-btn">Submit Flag</button>
          </div>
          <div class="ctf-feedback" role="alert"></div>`}`;

      if (!solved) {
        const input = card.querySelector('.ctf-flag-input');
        const btn = card.querySelector('.ctf-submit-btn');
        const feedback = card.querySelector('.ctf-feedback');
        btn.addEventListener('click', () => {
          const val = input.value.trim().toUpperCase();
          if (val === ch.flag) {
            const freshUser = Auth.getUser();
            Progress.solveCTF(freshUser, ch.id);
            feedback.textContent = '';
            card.classList.add('solved');
            card.innerHTML += `<div class="ctf-solved-badge">✅ Solved! +50 XP</div><p class="ctf-explain"><strong>Explanation:</strong> ${sanitize(ch.explanation)}</p>`;
            Render.ctf(); // re-render
          } else {
            feedback.textContent = '❌ Incorrect flag. Try again!';
            feedback.className = 'ctf-feedback error';
            input.value = '';
          }
        });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
      }
      grid.appendChild(card);
    });
  },

  leaderboard() {
    const user = Auth.getUser();
    const tbody = $('leaderboard-body');
    tbody.innerHTML = '';

    const entries = [...LEADERBOARD_BOTS];
    if (user) {
      entries.push({
        username: user.username,
        xp: user.xp || 0,
        modules: user.modulesCompleted?.length || 0,
        badges: user.badges?.length || 0,
        isCurrentUser: true,
      });
    }
    entries.sort((a, b) => b.xp - a.xp);

    let userRank = 0;
    entries.forEach((entry, i) => {
      const rank = i + 1;
      const tr = el('tr', entry.isCurrentUser ? 'current-user-row' : '');
      const medals = ['🥇', '🥈', '🥉'];
      tr.innerHTML = `
        <td>${medals[i] || rank}</td>
        <td>${entry.isCurrentUser ? `<strong>${sanitize(entry.username)} (You)</strong>` : sanitize(entry.username)}</td>
        <td><span class="level-badge">${sanitize(getLevel(entry.xp))}</span></td>
        <td>${entry.xp}</td>
        <td>${entry.modules}/${MODULES.length}</td>
        <td>${entry.badges}</td>`;
      tbody.appendChild(tr);
      if (entry.isCurrentUser) userRank = rank;
    });

    const yourRank = $('your-rank');
    if (user && userRank) {
      yourRank.innerHTML = `<span>Your rank: <strong>#${userRank}</strong> of ${entries.length}</span>`;
    } else {
      yourRank.innerHTML = '';
    }
  },

  profile() {
    const user = Auth.getUser();
    if (!user) return;
    const pct = Progress.overallPct(user);
    const level = getLevel(user.xp);

    $('profile-avatar').textContent = sanitize(user.username.charAt(0).toUpperCase());
    $('profile-username').textContent = sanitize(user.username);
    $('profile-email').textContent = sanitize(user.email);
    $('profile-joined').textContent = new Date(user.joinedDate).toLocaleDateString();
    $('profile-level-badge').textContent = level;
    $('profile-xp-display').textContent = `${user.xp} XP`;
    $('profile-progress-pct').textContent = `${pct}%`;
    $('profile-progress-bar').style.width = `${pct}%`;
    $('profile-progress-bar').parentElement.setAttribute('aria-valuenow', pct);
    $('ps-modules').textContent = user.modulesCompleted?.length || 0;
    $('ps-badges').textContent = user.badges?.length || 0;
    $('ps-xp').textContent = user.xp;

    // Badges
    const badgeGrid = $('profile-badges-grid');
    badgeGrid.innerHTML = '';
    ALL_BADGES.forEach((b) => {
      const earned = user.badges?.includes(b.id);
      const item = el('div', `badge-item${earned ? ' earned' : ' locked'}`);
      item.setAttribute('title', b.name);
      item.innerHTML = `<div class="badge-icon">${earned ? b.icon : '🔒'}</div><div class="badge-name">${sanitize(b.name)}</div>`;
      badgeGrid.appendChild(item);
    });

    // Certificate
    const certDiv = $('profile-certs');
    if (user.modulesCompleted?.length === MODULES.length) {
      certDiv.innerHTML = `<div class="cert-unlocked"><p>🎉 Certificate earned! You completed all ${MODULES.length} modules.</p>
        <button class="btn btn-primary" id="view-cert-btn">📜 View Certificate</button></div>`;
      $('view-cert-btn').addEventListener('click', () => Router.navigate('certificate'));
    } else {
      const remaining = MODULES.length - (user.modulesCompleted?.length || 0);
      certDiv.innerHTML = `<p class="muted">Complete ${remaining} more module${remaining !== 1 ? 's' : ''} to earn your certificate.</p>`;
    }
  },

  settings() {
    const user = Auth.getUser();
    if (!user) return;
    const settings = user.settings || {};

    // Theme
    const isDark = (settings.theme || 'dark') === 'dark';
    $('theme-dark').classList.toggle('active', isDark);
    $('theme-light').classList.toggle('active', !isDark);

    // Font size
    $('font-size-select').value = settings.fontSize || 16;

    // Notifications
    $('notif-modules').checked = settings.notifModules !== false;
    $('notif-xp').checked = settings.notifXP !== false;
    $('notif-badges').checked = settings.notifBadges !== false;
  },

  certificate() {
    const user = Auth.getUser();
    if (!user) return;
    const completed = user.modulesCompleted?.length === MODULES.length;

    $('cert-name').textContent = sanitize(user.username);
    $('cert-date').textContent = completed
      ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Not yet completed';
    $('cert-id').textContent = `CSA-2026-${String(user.id.replace('u_', '')).slice(-5).padStart(5, '0')}`;
  },
};

/* ── Typing animation ──────────────────────────────────────── */
function startTypingAnimation() {
  const el = $('typing-text');
  if (!el) return;
  const phrases = [
    'Master Ethical Hacking',
    'Learn Penetration Testing',
    'Defend Cyber Systems',
    'Crack the CTF Challenges',
    'Earn Your Certification',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  tick();
}

/* ── Event wiring ──────────────────────────────────────────── */
function wireEvents() {
  // Global data-page navigation
  document.body.addEventListener('click', (e) => {
    const anchor = e.target.closest('[data-page]');
    if (!anchor) return;
    e.preventDefault();
    Router.navigate(anchor.getAttribute('data-page'));
  });

  // Global data-module clicks (sidebar)
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('[data-module]');
    if (!link || link.closest('#module-content')) return; // handled separately
    e.preventDefault();
    Router.navigate('module-detail', { moduleId: link.getAttribute('data-module') });
  });

  // Logout
  $('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
    Router.updateNav();
    Router.show('landing');
    showToast('Signed out successfully.', 'info');
  });

  // Hamburger menu
  const hamburger = $('hamburger');
  const navLinks = $('nav-links');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  // Close menu on nav link click
  navLinks.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });

  // Dismiss disclaimer
  $('dismiss-disclaimer').addEventListener('click', () => {
    $('disclaimer-banner').style.display = 'none';
    Store.set('csa_disclaimer_dismissed', true);
  });
  if (Store.get('csa_disclaimer_dismissed')) {
    $('disclaimer-banner').style.display = 'none';
  }

  // Ethics modal (footer link)
  $('footer-ethics-link').addEventListener('click', (e) => {
    e.preventDefault();
    const modal = $('ethics-modal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('ethics-modal-close-btn').focus();
  });
  $('ethics-modal-close-btn').addEventListener('click', () => closeModal('ethics-modal'));
  document.querySelector('#ethics-modal .modal-overlay')?.addEventListener('click', () => closeModal('ethics-modal'));
  document.querySelector('#ethics-modal .modal-close')?.addEventListener('click', () => closeModal('ethics-modal'));

  function closeModal(id) {
    $(id).hidden = true;
    document.body.style.overflow = '';
  }

  // Sign-up form
  $('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = $('signup-username').value.trim();
    const email = $('signup-email').value.trim();
    const password = $('signup-password').value;
    const confirm = $('signup-confirm').value;
    const ethics = $('agree-ethics').checked;
    let valid = true;

    const setErr = (id, msg) => { $(id).textContent = msg; if (msg) valid = false; };
    setErr('err-username', username.length < 3 ? 'Username must be at least 3 characters.' : '');
    setErr('err-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email address.' : '');
    setErr('err-password', password.length < 8 ? 'Password must be at least 8 characters.' : '');
    setErr('err-confirm', password !== confirm ? 'Passwords do not match.' : '');
    setErr('err-ethics', !ethics ? 'You must agree to ethical use.' : '');

    if (!valid) return;

    const res = Auth.register(username, email, password);
    if (!res.ok) {
      setErr('err-email', res.error);
      return;
    }
    showToast(`Welcome to CyberSec Academy, ${username}! 🎉`, 'success');
    Router.show('dashboard');
    Router.updateNav();
    Render.dashboard();
  });

  // Login form
  $('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('login-email').value.trim();
    const password = $('login-password').value;
    let valid = true;

    const setErr = (id, msg) => { $(id).textContent = msg; if (msg) valid = false; };
    setErr('err-login-email', !email ? 'Enter your email.' : '');
    setErr('err-login-password', !password ? 'Enter your password.' : '');
    if (!valid) return;

    const res = Auth.login(email, password);
    $('login-error').textContent = res.ok ? '' : res.error;
    if (!res.ok) return;

    showToast(`Welcome back, ${res.user.username}!`, 'success');
    Router.show('dashboard');
    Router.updateNav();
    Render.dashboard();
  });

  // Continue learning button
  $('continue-learning-btn').addEventListener('click', () => {
    const user = Auth.getUser();
    const next = MODULES.find((m) => !user?.modulesCompleted?.includes(m.id));
    Router.navigate('module-detail', { moduleId: next ? next.id : MODULES[0].id });
  });

  // Settings: theme
  document.querySelectorAll('[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      const user = Auth.getUser();
      if (user) {
        user.settings = user.settings || {};
        user.settings.theme = theme;
        Auth.saveUser(user);
      }
      Store.set('csa_theme', theme);
      document.querySelectorAll('[data-theme]').forEach((b) =>
        b.classList.toggle('active', b.getAttribute('data-theme') === theme),
      );
    });
  });

  // Settings: font size
  $('font-size-select').addEventListener('change', () => {
    const size = $('font-size-select').value;
    document.documentElement.style.fontSize = `${size}px`;
    const user = Auth.getUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.fontSize = parseInt(size, 10);
      Auth.saveUser(user);
    }
    Store.set('csa_font_size', size);
  });

  // Settings: notifications
  $('notif-modules').addEventListener('change', () => {
    const user = Auth.getUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.notifModules = $('notif-modules').checked;
      Auth.saveUser(user);
    }
  });
  $('notif-xp').addEventListener('change', () => {
    const user = Auth.getUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.notifXP = $('notif-xp').checked;
      Auth.saveUser(user);
    }
  });
  $('notif-badges').addEventListener('change', () => {
    const user = Auth.getUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.notifBadges = $('notif-badges').checked;
      Auth.saveUser(user);
    }
  });

  // Settings: change password
  $('change-password-btn').addEventListener('click', () => {
    $('change-password-form').hidden = false;
    $('change-password-btn').hidden = true;
  });
  $('cancel-password-btn').addEventListener('click', () => {
    $('change-password-form').hidden = true;
    $('change-password-btn').hidden = false;
    $('new-password').value = '';
    $('confirm-new-password').value = '';
    $('password-change-msg').textContent = '';
  });
  $('save-password-btn').addEventListener('click', () => {
    const np = $('new-password').value;
    const cp = $('confirm-new-password').value;
    const msg = $('password-change-msg');
    if (np.length < 8) { msg.textContent = 'Password must be at least 8 characters.'; msg.className = 'form-msg error'; return; }
    if (np !== cp) { msg.textContent = 'Passwords do not match.'; msg.className = 'form-msg error'; return; }
    const user = Auth.getUser();
    if (user) {
      user.passwordHash = btoa(encodeURIComponent(np));
      Auth.saveUser(user);
      msg.textContent = '✅ Password updated successfully.';
      msg.className = 'form-msg success';
      $('new-password').value = '';
      $('confirm-new-password').value = '';
    }
  });

  // Settings: reset progress
  $('reset-progress-btn').addEventListener('click', () => {
    if (!confirm('Reset all progress? This will clear your XP, badges, and module completions.')) return;
    const user = Auth.getUser();
    if (user) {
      user.xp = 0;
      user.badges = ['badge-first-login'];
      user.modulesCompleted = [];
      user.ctfSolved = [];
      user.activity = [{ text: '🔄 Progress reset', time: new Date().toISOString() }];
      Auth.saveUser(user);
      showToast('Progress reset.', 'info');
      Render.settings();
    }
  });

  // Settings: delete account
  $('delete-account-btn').addEventListener('click', () => {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return;
    const uid = Auth.currentUser();
    const users = Auth.users();
    delete users[uid];
    Store.set('csa_users', users);
    Auth.logout();
    Router.updateNav();
    Router.show('landing');
    showToast('Account deleted.', 'info');
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal:not([hidden])').forEach((m) => {
        m.hidden = true;
        document.body.style.overflow = '';
      });
    }
  });
}

/* ── Bootstrap ─────────────────────────────────────────────── */
function init() {
  // Restore persisted theme
  const savedTheme = Store.get('csa_theme') || Auth.getUser()?.settings?.theme || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Restore font size
  const savedFontSize = Store.get('csa_font_size') || Auth.getUser()?.settings?.fontSize || 16;
  document.documentElement.style.fontSize = `${savedFontSize}px`;

  wireEvents();
  startTypingAnimation();
  Router.updateNav();

  // If already logged in, start on dashboard
  if (Auth.getUser()) {
    Router.show('dashboard');
    Render.dashboard();
  } else {
    Router.show('landing');
  }
}

document.addEventListener('DOMContentLoaded', init);
