# 🛡️ CyberSec Academy

**An interactive, gamified cybersecurity education platform — 100% client-side, no backend required.**

> ⚖️ **For Educational Use Only.** All techniques and tools discussed are intended exclusively for ethical, legal, and authorized use. Unauthorized access to computer systems is illegal under the Computer Fraud and Abuse Act (CFAA), UK Computer Misuse Act, EU Directive 2013/40/EU, and equivalent laws worldwide.

---

## 🚀 Live Demo

Open `index.html` in any modern browser — no server needed.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📚 **10 Learning Modules** | Networking, Linux CLI, Web Hacking, Password Security, Social Engineering, Malware Analysis, Cryptography, Wireless Security, CTF Training, Incident Response |
| 📝 **50+ Quiz Questions** | 5 questions per module with instant feedback and highlighted correct answers |
| 🚩 **5 CTF Challenges** | Caesar cipher, Base64, Hex, XOR, and MD5 hash-cracking challenges |
| ⚡ **XP & Levelling System** | Earn XP for completing modules and solving CTF challenges |
| 🏅 **11 Badges** | One badge per module + First Login badge |
| 🏆 **Leaderboard** | Ranked leaderboard with simulated community members |
| 📜 **Certificate** | Printable Certificate of Completion after finishing all 10 modules |
| 🎨 **Dark / Light Theme** | Persistent theme preference |
| ⚙️ **Settings** | Font size, notifications, password change, progress reset |
| 🔒 **Client-side Auth** | localStorage-based accounts (no data leaves your browser) |

---

## 📚 Curriculum

All modules are aligned with industry standards:
- **EC-Council CEH** (Certified Ethical Hacker)
- **CompTIA Security+**
- **OWASP Testing Guide**
- **NIST Cybersecurity Framework (SP 800-61, SP 800-63B)**
- **CISA (Cybersecurity and Infrastructure Security Agency) guidelines**

### Modules

1. 🌐 **Networking Fundamentals** — OSI/TCP-IP, subnetting, nmap, Wireshark
2. 🐧 **Linux CLI Essentials** — Permissions, commands, privilege escalation concepts
3. 🕸️ **Web Application Hacking** — OWASP Top 10, SQLi, XSS, CSRF
4. 🔑 **Password Security** — Hashing algorithms, attack types, NIST policies, MFA
5. 🎭 **Social Engineering** — Phishing, pretexting, vishing, psychology
6. 🦠 **Malware Analysis** — Malware types, static/dynamic analysis, IoCs
7. 🔐 **Cryptography** — AES, RSA, ECC, TLS, classic cipher attacks
8. 📡 **Wireless Security** — WEP/WPA/WPA3, Evil Twin, Bluetooth, IoT
9. 🚩 **CTF Training** — Steganography, reverse engineering, OSINT
10. 🚨 **Incident Response** — NIST IR lifecycle, digital forensics, chain of custody

---

## 🏁 Getting Started

### Option 1 — Open directly

```bash
# Clone the repo
git clone https://github.com/dhkiller350/cybersec-academy.git

# Open in browser
open cybersec-academy/index.html
```

### Option 2 — Local HTTP server (recommended)

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`.

---

## 🗂️ Project Structure

```
cybersec-academy/
├── index.html      # Single-page application shell (631 lines)
├── styles.css      # Dark/light theme, animations, responsive layout
├── app.js          # All application logic — auth, router, modules, CTF
├── .gitignore
└── LICENSE         # MIT
```

No build tools, no dependencies, no CDN JavaScript. Just three files.

---

## 🔒 Privacy & Security

- All user data is stored **exclusively in your browser's `localStorage`**.
- No data is sent to any server.
- Passwords are base64-encoded (this is a **demo app** — do not use real credentials).
- This platform is designed for local / educational use only.

---

## ⚖️ Ethical Use Policy

CyberSec Academy teaches offensive security techniques **exclusively** for:

✅ Educational and learning purposes  
✅ Systems you own or have explicit **written** permission to test  
✅ Authorized penetration testing engagements  
✅ Defensive security research  
✅ Certification preparation (CEH, Security+, OSCP)  

❌ **Unauthorized computer access is a criminal offence worldwide.**

Report vulnerabilities responsibly via [CISA's Coordinated Vulnerability Disclosure process](https://www.cisa.gov/coordinated-vulnerability-disclosure-process).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-module`
3. Commit changes: `git commit -m 'Add: forensics module'`
4. Push: `git push origin feature/new-module`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*🎓 For Educational Use Only · © 2026 CyberSec Academy*
