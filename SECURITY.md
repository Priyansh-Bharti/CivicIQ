# 🛡️ Security Policy & Implementation

## Security Philosophy: Defense in Depth
CivicIQ implements a **Defense in Depth** strategy, applying security controls at every layer of the stack—from the network transport layer to AI input validation. Our goal is to ensure that even if one layer is compromised, the platform remains resilient and user data remains protected.

---

## 🏗️ 1. Layered Security Architecture

| Layer | Threat Mitigated | Implementation Detail |
| :--- | :--- | :--- |
| **Network (HTTP)** | XSS, Clickjacking, MIME-Sniffing, DDoS | Hardened headers (HSTS, CSP, XFO) and dual-zone rate limiting in `nginx.conf`. |
| **Identity (Auth)** | Unauthorized Access, Session Hijacking | **Firebase Auth** (Google OAuth); hardened 10-req/15m limit for auth endpoints. |
| **Data (Firestore)** | Data Breach, Privilege Escalation | **Firebase Security Rules** enforcing strict owner-only access. |
| **Intelligence (AI)** | Prompt Injection, Jailbreaks, Abuse | 15+ regex injection patterns, HTML encoding, and 20-req/15m rate limit. |
| **Runtime (Heuristic)** | Anomaly / Bot Interactions | **SecurityEngine** anomaly scoring and heuristic behavioral analysis. |
| **Transport (TLS)** | Man-in-the-Middle (MITM) | Enforced HTTPS with 1-year HSTS and preload directives. |
| **Container (OS)** | Host Compromise | Non-root user in Docker; Alpine base; server tokens hidden in Nginx. |

---

## 🔐 2. Authentication & Authorization
We delegate identity management to **Firebase Authentication**, an industry leader in secure identity infrastructure.
- **Zero-Trust Auth**: All sessions are validated server-side (where applicable) or via Firebase's secure SDK.
- **Granular Permissions**: Our Firestore security rules ensure that users can **only** interact with their own data.

### Firestore Security Rules (Production)
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /chatHistory/{messageId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### 🤖 3. AI Safety & Hardened Guardrails
The AI Assistant is protected against complex prompt injection and abuse vectors through a multi-layered verification system.
- **Model-Level Safety**: Enforced `HarmBlockThreshold.BLOCK_LOW_AND_ABOVE` (strictest setting) across all 4 harm categories at the Gemini model configuration level.
- **Injection Detection Engine**: `AIEngine` integrates 15+ regex patterns designed to detect and block "DAN mode", "ignore instructions", system prompt exfiltration, and other common jailbreak signatures.
- **Multi-Layer Sanitization**:
  1. **HTML Stripping**: Removal of all dangerous tags (`<script>`, `<iframe>`, etc.).
  2. **Character Encoding**: Full HTML entity encoding for special characters (`&`, `<`, `>`, `"`, `'`, `/`) to prevent XSS.
  3. **Length Enforcement**: Hard truncation at 500 characters.
- **Dual-Zone Rate Limiting**:
  1. **Network (Nginx)**: 60 requests per minute global cap to mitigate DDoS.
  2. **Logic (SecurityEngine)**: Token-bucket limiting restricting AI requests to 20 per 15-minute window per user.
- **System Instructions**: The `SYSTEM_PROMPT` includes strict non-partisan and factual-only directives that the Gemini model is grounded to follow, with explicit "jailbreak-resistance" instructions.

---

## 📂 4. Data Privacy & Secrets Management
- **No PII Overload**: We only store essential metadata (email/uid) to facilitate authentication.
- **Secret Hygiene**: Zero API keys are hardcoded. All sensitive credentials (Gemini API keys, Firebase configs) are injected as **Environment Variables** during the Cloud Build process.
- **Environment Validation**: Our `ENV` utility (`src/utils/env.ts`) performs a strict validation of all required keys at application startup. If a critical key is missing, the application fails fast with a clear diagnostic, preventing silent failures and security misconfigurations.
- **Domain Restriction**: API keys are restricted via Google Cloud Console to only accept requests from authorized production domains.

---

## 🏗️ 5. Logic Engine Isolation
We implement a **Clean Architecture** approach by isolating sensitive logic into dedicated engines.
- **`AIEngine` Sanitization**: The core sanitization logic is decoupled from React, ensuring it can be tested in isolation and is not subject to UI-related vulnerabilities.
- **Case-Insensitive Heuristics**: Our heuristic filtering of 50+ sensitive terms is case-insensitive and executes *before* the prompt reaches the LLM service.

---

## 📦 5. Infrastructure Hardening (`nginx.conf`)
Our production Nginx configuration is hardened to enterprise standards:
- **Strict CSP**: `default-src 'self'` with no `unsafe-inline` scripts; frame-ancestors restricted to `none`.
- **HSTS Preload**: 1-year `max-age` with `includeSubDomains` and `preload` directives.
- **Access Control**: Explicitly blocks access to `.env`, `.git`, `.log`, `.sh`, and `.sql` files.
- **MIME Hardening**: Enforces `X-Content-Type-Options: nosniff`.
- **Server Privacy**: `server_tokens off` to hide server version and type.
- **Custom Error Pages**: Rate limit breaches serve a secure, generic 429 JSON response.

## 🏛️ 6. Runtime Anomaly Detection
The `SecurityEngine` provides heuristic behavioral monitoring:
- **Suspicion Scoring**: Each interaction is scored (0-100) based on input complexity, script fragments, and injection keywords.
- **Automatic Blocking**: Interactions exceeding a score of 40 are automatically blocked before reaching the AI model.
- **Non-Partisan Enforcement**: Uses a strict word-boundary regex blocklist to mask partisan terms in both input and AI output.

---

## 📋 6. Security Checklist
- [x] HTTPS enforced with HSTS.
- [x] Strict Content Security Policy (CSP) active.
- [x] X-Frame-Options set to DENY.
- [x] Firebase Security Rules verified.
- [x] AI input length and rate limits enforced.
- [x] Environment variables used for all secrets.
- [x] Non-root user in Docker container.
- [x] No sensitive logs in production.

---

## 🚨 7. Responsible Disclosure
Security is a continuous journey. If you discover a vulnerability, please report it to `security@civiciq.app`. We are committed to acknowledging and resolving all valid reports within 48 hours.

---

**CivicIQ implements security at every layer of the stack—from HTTP headers to AI input validation—making it resistant to the OWASP Top 10 threats.**
