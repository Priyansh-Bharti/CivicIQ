# Security Policy

CivicIQ is built with a security-first mindset to ensure voter data privacy and platform integrity.

## API Key Management
- All sensitive credentials (Firebase, Gemini) are managed via environment variables.
- API keys are never committed to version control.
- A `.env.example` is provided for local development setup.

## Firebase Security Rules
- **Firestore**: User data is strictly isolated. Users can only read and write to their own document path (`users/{userId}/*`).
- **Authentication**: Google OAuth is used for secure, verified identity management.

## Content Security Policy (CSP)
- CSP is enforced via Nginx headers to prevent XSS and data injection.
- Policy restricts script, style, and image sources to known, trusted domains (Google, Firebase, GStatic).

## Rate Limiting
- **Client-Side**: Gemini API interactions are limited to a maximum of 10 requests per minute per user session to prevent API abuse.
- **Infrastructure**: Cloud Run provides basic DDoS protection and request filtering.

## Input Validation & Sanitization
- All user-provided chat prompts are validated client-side before processing.
- React's automatic escaping prevents most common XSS vectors.
- No use of `dangerouslySetInnerHTML` is permitted in the codebase.

## Prompt Injection Protection
- The core `SYSTEM_PROMPT` is injected programmatically and cannot be overridden by user input.
- User messages are treated as data, not instructions, by the underlying AI service.

## Dependency Audit
- Automated `npm audit` is performed during every CI/CD cycle.
- Deployments are automatically blocked if high or critical vulnerabilities are detected.

## Reporting a Vulnerability
Please do not report security vulnerabilities through public GitHub issues. Instead, contact the maintainers directly.
