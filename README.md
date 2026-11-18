<<<<<<< HEAD
# Interactive Web Security Sandbox
**42 Amman / 42 Irbid &bull; Final Cybersecurity Project (Teams of 5)**  
*Build Window: 15–22 November 2026*  

[![Platform](https://img.shields.io/badge/Stack-Pure%20HTML%20%7C%20CSS%20%7C%20JS-blue)](#)
[![Pages](https://img.shields.io/badge/Pages-4%20(Max%205)-success)](#)
[![Backend](https://img.shields.io/badge/Backend-Zero%20(Pure%20Client--Side)-brightgreen)](#)
[![Audit](https://img.shields.io/badge/Word%20Limit-%3C400%20words%20per%20lab-success)](#)

---

## 🌐 Live Deployment & Repository Links
- **Live Deployed Demo:** `https://<YOUR-GITHUB-USERNAME>.github.io/<REPO-NAME>/web-security-sandbox/`
- **GitHub Repository:** `https://github.com/<YOUR-GITHUB-USERNAME>/<REPO-NAME>`
- **Submission Channel:** 42 Amman / 42 Irbid Discord Project Submissions

---

## 🎯 Project Overview
An interactive, browser-executable web security sandbox containing three hands-on security labs. Visitors select real-world attacker payloads, watch vulnerabilities execute live in the sandbox, switch to hardened defense mode, and observe the exact same payload get blocked.

### Key Architectural Highlights:
1. **Zero Backend / No Database / No Login:** Runs 100% locally in browser memory.
2. **Exactly 4 HTML Pages (Max 5):** `index.html`, `lab1.html`, `lab2.html`, `lab3.html`.
3. **Word Limits Respected:** Every lab page contains under 400 descriptive words.
4. **Safe Sandbox Execution:** No external redirects, no real credentials, and no external brand logos.

---

## 🧪 Our Three Labs

### 1. Clickjacking (UI Redressing)
- **OWASP Category:** `A05:2021 — Security Misconfiguration`
- **CWE:** `CWE-1021 (Improper Restriction of Rendered UI Layers or Frames)`
- **What it is:** An invisible, actionable UI layer is overlaid on top of a visible decoy button, tricking users into executing unintended actions without consent.
- **Interactive Feature:** Includes an Attacker Opacity Slider (0% stealth to 100% visible) to visualize the hidden malicious overlay.
- **The Defense:** Client-side frame-busting (`window.top !== window.self`) and Content Security Policy (`frame-ancestors 'none'`).

### 2. Open URL Redirection
- **OWASP Category:** `A01:2021 — Broken Access Control`
- **CWE:** `CWE-601 (URL Redirection to Untrusted Site)`
- **What it is:** The application takes a destination parameter (`?next=`) and redirects users without origin validation, allowing attackers to leverage trusted domains for phishing.
- **Interactive Feature:** Simulated browser viewport demonstrating transparent redirection to simulated phishing portals.
- **The Defense:** Strict allow-list regex (`^\/(?!\/)[a-zA-Z0-9_\-\/]+$`) restricting navigation exclusively to relative origin paths.

### 3. DOM Clobbering (Challenge Lab)
- **Framing:** Logic Corruption via DOM Property Collision (*OWASP DOM Clobbering Cheat Sheet*).
- **Mechanism:** Script-free, benign HTML input creates global `window` object collisions, overriding boolean variables and corrupting application logic.
- **Interactive Feature:** Live HTML comment sanitizer and injection sink that unlocks a restricted Admin Panel.
- **The Defense:** Primitive type checking (`typeof val === "boolean"`) and rejection of `HTMLElement` instances.

---

## 👥 Team Roles & Responsibilities

| Member | Primary Responsibility | Lab Ownership |
|---|---|---|
| **Member 1** | Clickjacking Lead | Researched, designed, and verified UI redressing mechanics & frame-busting. |
| **Member 2** | Open Redirect Lead & QA Lead | Implemented mock browser simulator and conducted cross-browser QA audits. |
| **Member 3** | DOM Clobbering Lead & JS Engine | Engineered the challenge lab and the shared sandbox state controller. |
| **Member 4** | Design System & UI/UX | Designed unified cyberpunk aesthetic, responsive grid, and interactive components. |
| **Member 5** | Presentation Lead & Q&A | Structured the 15-minute presentation script and prepared defense notes. |

---

## 🗣️ One-Sentence Team Cheat Sheet (For Any Member During Q&A)

- **Clickjacking:** *"An attacker overlays a transparent button over a decoy element so clicks land on a hidden privileged action; we fix it by enforcing CSP frame-ancestors 'none' and frame-busting guards."*
- **Open Redirect:** *"An unvalidated target parameter forwards users from a trusted URL into a phishing site; we fix it with an allow-list regex that permits only relative origin paths."*
- **DOM Clobbering:** *"Benign HTML tags create window-level naming collisions that trick scripts into treating DOM element objects as boolean true; we fix it with strict primitive type validation."*

---

## ⏱️ 15-Minute Presentation Structure & Rehearsal Timing

| Timestamp | Speaker | Topic | Key Demo Action |
|---|---|---|---|
| **00:00 – 02:00** | Member 5 | Introduction, mission premise, and zero-backend client-side architecture. | Show `index.html` navigation. |
| **02:00 – 05:30** | Member 1 | Lab 1: Clickjacking demo, 2009 Twitter incident, opacity slider demonstration. | Move slider to reveal overlay, trigger exploit, then toggle to Fixed. |
| **05:30 – 09:00** | Member 2 | Lab 2: Open Redirect demo, AmEx/Snapchat phishing cases, allow-list regex. | Fire `?next=` payload, show phishing landing, switch to Fixed mode. |
| **09:00 – 12:30** | Member 3 | Lab 3: DOM Clobbering demo, Gmail sanitization bypass, boolean type check. | Inject form markup, reveal admin panel, toggle to Fixed mode. |
| **12:30 – 14:00** | Member 4 | Design system, code quality, responsive accessibility, and 400-word caps. | Show live word-counter and clean CSS/JS architecture. |
| **14:00 – 15:00** | Member 5 | Summary, key lessons learned, and handover to evaluators. | Ready for Q&A. |
| **15:00 – 20:00** | All Members | 5-Minute Technical Q&A with 42 Staff / Evaluators. | Live answers. |

---

## 🚀 How to Run Locally

You can serve the sandbox with any static web server:

```bash
# Using Python 3:
cd web-security-sandbox
python3 -m http.server 8080

# Then open in your browser:
# http://localhost:8080
```
=======
# 🛡️ SecLabs — Interactive Web Security Labs

A front-end-only educational website featuring **three interactive security labs** where visitors can trigger real vulnerabilities, see the impact, and then apply the fix — all in the browser.

## 🔬 Labs

| # | Vulnerability | CWE | OWASP |
|---|---------------|-----|-------|
| 1 | **Clickjacking** | CWE-1021 | A05:2021 — Security Misconfiguration |
| 2 | **Open Redirect** | CWE-601 | A01:2021 — Broken Access Control |
| 3 | **DOM Clobbering** | CWE-79 | A03:2021 — Injection |

## 🚀 Getting Started

No build step, no backend, no dependencies.

```bash
# Option 1: Open directly in a browser
open index.html

# Option 2: Serve with any static server
python3 -m http.server 8080
# Then visit http://localhost:8080

# Option 3: Use VS Code Live Server
# Install the Live Server extension, right-click index.html → Open with Live Server
```

## 📁 Project Structure

```
/
├── index.html              # Home page — lab overview
├── lab1.html               # Clickjacking lab
├── lab2.html               # Open Redirect lab
├── lab3.html               # DOM Clobbering lab
├── README.md
└── assets/
    ├── js/
    │   ├── main.js          # Shared: nav, toast, utilities
    │   ├── lab1.js          # Clickjacking demo logic
    │   ├── lab2.js          # Open Redirect demo logic
    │   └── lab3.js          # DOM Clobbering demo logic
    ├── css/
    │   ├── style.css        # Global styles & design system
    │   ├── lab1.css         # Clickjacking-specific styles
    │   ├── lab2.css         # Open Redirect-specific styles
    │   └── lab3.css         # DOM Clobbering-specific styles
    └── images/              # (reserved for future use)
```

## 🎯 Each Lab Includes

1. **What it is** — Plain-English explanation with OWASP category and CWE number
2. **The vulnerable code** — 8–15 lines of realistic code with the dangerous line highlighted
3. **Try it** — 2–3 payload buttons that trigger the vulnerability in a live sandbox
4. **Why it matters** — Real-world impact with a cited incident
5. **The fix** — Fixed code with the fix line highlighted + a Vulnerable/Fixed toggle
6. **Sources** — OWASP, CWE, MDN, and research references

## 🛡️ Safety

- All demos are **client-side simulations** — no real attacks are performed
- No backend, no login, no database, no real credentials
- No real malicious code is executed
- No external sites are contacted during demos

## 💻 Tech Stack

- **HTML5** / **CSS3** / **Vanilla JavaScript**
- No frameworks, no build tools, no npm
- Google Fonts: Inter (UI) + JetBrains Mono (code)
- Fully responsive (mobile, tablet, desktop)

## 📄 License

Educational use only. All attacks are simulated for learning purposes.
>>>>>>> 3861762 (ahmad commit)
