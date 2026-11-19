# Security Policy: AuraShield AI

## 🔒 Security Commitments
AuraShield AI is engineered following defense-in-depth principles to ensure the privacy, safety, and security of urban families and communities using the platform.

---

## 1. Supported Versions
| Version | Supported | Notes |
|---|:---:|---|
| `1.0.x` | ✅ Yes | Production release |

---

## 2. API Key Management & Zero-Leak Architecture
* **Zero Hardcoded Secrets:** No third-party API keys (e.g., Google Gemini) are committed into the repository or exposed in build artifacts.
* **Client-Side Storage:** When users provide custom Gemini API keys in the in-app Settings modal, keys are saved strictly to the client's browser `localStorage`.
* **No External Key Forwarding:** Telemetry and chat requests communicate directly with official endpoints (`generativelanguage.googleapis.com` and `air-quality-api.open-meteo.com`) without intermediary logging or proxy storage.
* **Zero-Config Fallback:** If no API key is supplied, AuraShield automatically transitions to an intelligent, deterministic local heuristic engine without failing or exposing errors.

---

## 3. Content Security Policy (CSP)
AuraShield enforces a strict Content Security Policy defined directly in `index.html`:
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://air-quality-api.open-meteo.com https://generativelanguage.googleapis.com; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';
```

---

## 4. Input Sanitization & Anti-Injection
* **Query Length Capping:** User chat inputs are trimmed and bounded to prevent buffer overload or token flooding.
* **Cross-Site Scripting (XSS) Prevention:** Markdown outputs are parsed safely using typed React components without `dangerouslySetInnerHTML`.
* **Zero User Tracking:** No sensitive medical records, pediatric details, or exact GPS coordinates are stored in external tracking databases.

---

## 5. Reporting a Vulnerability
If you discover a security vulnerability in AuraShield AI, please report it directly via GitHub issues or email `siddharth.nsit07@gmail.com`. All security inquiries receive a response within 24 hours.
