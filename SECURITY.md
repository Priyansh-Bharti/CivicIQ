# 🛡️ Security Policy & Implementation

## Security Philosophy: Defense in Depth
CivicIQ implements a **Defense in Depth** strategy, applying security controls at every layer of the stack—from the network transport layer to AI input validation. Our goal is to ensure that even if one layer is compromised, the platform remains resilient and user data remains protected.

---

## 🏗️ 1. Layered Security Architecture

| Layer | Threat Mitigated | Implementation Detail |
| :--- | :--- | :--- |
| **Network (HTTP)** | XSS, Clickjacking, MIME-Sniffing | Strict security headers (CSP, HSTS, XFO) in `nginx.conf`. |
| **Identity (Auth)** | Unauthorized Access, Session Hijacking | **Firebase Auth** with Google OAuth 2.0; zero passwords stored. |
| **Data (Firestore)** | Data Breach, Privilege Escalation | **Firebase Security Rules** enforcing owner-only read/write access. |
| **Intelligence (AI)** | Prompt Injection, API Abuse | Input sanitization, 500-char limits, and 3-tier rate limiting. |
| **Transport (TLS)** | Man-in-the-Middle (MITM) | Enforced HTTPS via Cloud Run Load Balancer with HSTS. |
| **Container (OS)** | Host Compromise | Non-root user execution in Docker; minimal Alpine base image. |

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

## 🤖 3. AI Safety & Guardrails
The AI Assistant is protected against common prompt injection and abuse vectors through a multi-layered verification system.
- **Model-Level Safety**: Enforced `HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE` for Harassment, Hate Speech, Sexually Explicit, and Dangerous content at the Gemini model configuration level.
- **Heuristic Sanitization**: All user input is stripped of HTML tags, restricted to 500 characters, and passed through a case-insensitive "Sensitive Term" filter.
- **3-Tier Rate Limiting**: A sophisticated token-bucket algorithm in the `useSecurity` hook restricts AI requests to 30 per 15-minute window per user, preventing DDoS and API exhaustion.
- **System Instructions**: The `SYSTEM_PROMPT` includes strict non-partisan and factual-only directives that the Gemini model is grounded to follow.

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

## 📦 5. Container & Infrastructure Security
- **Rootless Docker**: Our `Dockerfile` switches to a non-privileged user immediately after setup, preventing potential host system escalations.
- **Generic Error Masking**: Coupled with **Global Error Boundaries**, production environments are configured to mask internal stack traces, providing users only with safe, generic error messages while logging raw data to a secure, private log sink.

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
