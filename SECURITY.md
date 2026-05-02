# CivicIQ Security Policy

This document outlines the security measures implemented in CivicIQ to ensure user safety, data integrity, and system stability.

## 1. Network & Infrastructure Security (Nginx)
The production environment uses a hardened Nginx configuration with the following headers:
- **Content-Security-Policy (CSP)**: Strict policy allowing only trusted sources for scripts, styles, and images. Prevents Cross-Site Scripting (XSS).
- **X-Frame-Options: DENY**: Prevents Clickjacking by disallowing the site from being embedded in frames.
- **X-Content-Type-Options: nosniff**: Prevents MIME-type sniffing attacks.
- **Referrer-Policy**: Set to `no-referrer-when-downgrade` to protect user privacy.
- **Permissions-Policy**: Explicitly disables access to camera, microphone, and geolocation.

## 2. API & Resource Protection
To prevent abuse and ensure fair resource allocation, a **3-tier Token Bucket Rate Limiter** is implemented on the client side:
- **General API calls**: 100 requests per 15 minutes.
- **Authentication attempts**: 20 requests per 15 minutes.
- **Gemini AI interactions**: 30 requests per 15 minutes.
State is persisted via `localStorage` to prevent simple bypass via page refresh.

## 3. Data Sanitization
All user-provided content is sanitized before reaching the Gemini AI engine:
- **HTML Stripping**: All HTML tags are removed to prevent injection.
- **Character Limiting**: Input is strictly capped at **500 characters**.
- **Whitespace Management**: Automatic trimming of all inputs.

## 4. Error Handling & Information Disclosure
The platform follows the "least information" principle for errors:
- **Generic Messaging**: All technical or internal errors from Firebase and Gemini are intercepted and replaced with user-friendly, non-descriptive messages.
- **No Stack Traces**: Internal stack traces and error codes are never exposed to the client UI.

## 5. Authentication & Identity
- **Authorized Domains**: Only pre-approved domains are allowed to initiate Firebase Authentication.
- **Secure Sessions**: User sessions are managed entirely through Firebase Auth's secure SDK.

---
*For security vulnerabilities, please contact the maintainers directly.*
