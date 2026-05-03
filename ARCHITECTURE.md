# 🏛️ Technical Architecture & System Design

## System Design Philosophy
The architecture of CivicIQ was designed with the same rigor as a production-grade enterprise application. It prioritizes **decoupling**, **unidirectional data flow**, and **separation of concerns**. By isolating business logic from the UI, we ensure the platform is both testable and resilient to changes in external service providers.

---

## 🏗️ 1. High-Level Architecture Diagram

```text
[ Citizen / User ]
       |
       v
[ Vite / React PWA ] <---- [ Zustand State Management ]
       |
       |-- (Auth) ----> [ Firebase Authentication ]
       |-- (Data) ----> [ Cloud Firestore ]
       |-- (AI) ------> [ Google Cloud Run (Backend Wrapper) ]
                           |
                           |-- [ Gemini 2.0 Flash API ]
                           |-- [ Cloud Translate API ]
```

---

## 📂 2. Layer-by-Layer Breakdown

### (a) Presentation Layer (UI)
- **Framework**: React 18 (Functional Components).
- **Styling**: Tailwind CSS v4 for utility-first, highly-performant styling.
- **Motion**: Framer Motion for high-fidelity, hardware-accelerated animations.

### (b) State Layer (Data Management)
- **Engine**: **Zustand**.
- **Role**: Manages user authentication state, current election phase, and the local cache of AI conversations. Chosen for its minimal boilerplate and atomic update capabilities.

### (c) Domain Logic Engine Layer (Pure Logic)
- **Engine**: Stateless Logic Engines (`src/engines`).
- **Responsibility**: The "Pure Heart" of the application. Handles complex business rules, mathematical calculations, and security sanitization in a test-isolated environment.
- **SecurityEngine**: Handles anomaly scoring, XSS-safe HTML sanitization, and token-bucket rate limiting logic.
- **AIEngine**: Orchestrates prompt sanitization, character encoding, and multi-pattern injection detection.
- **TranslationEngine**: High-performance i18n resolver for millisecond-latency localization.
- **Why**: Decoupling logic from the React lifecycle ensures 100% testability and stability.

### (d) Business Logic Layer (Orchestration)
- **Mechanism**: Custom React Hooks (`src/hooks`).
- **Responsibility**: Orchestrates data flow between the Engines, the State Layer, and the UI.

### (e) Data Access Layer (Abstractions)
- **Mechanism**: Service Libs (`src/lib`).
- **Responsibility**: Wraps external SDKs (Firebase, Gemini). Implements the **Repository Pattern** to decouple the application from third-party infrastructure.

---

## 🔄 3. Key Data Flows

### User Authentication Flow
1. User clicks "Sign in with Google".
2. `useAuth` hook triggers `signInWithPopup` via `src/lib/firebase`.
3. Firebase return JWT; `authStore` updates.
4. Firestore listener initializes to sync user progress in real-time.

### AI Chat Flow
1. User submits query via `ChatInput`.
2. `useGemini` hook triggers `AIEngine` for multi-layer sanitization (HTML strip, encoding) and injection detection.
3. `SecurityEngine` checks rate limits and calculates suspicion scores.
4. Payload sent to the Cloud Run wrapper.
5. Gemini 2.0 Flash generates response with enforced `SYSTEM_PROMPT`.
6. `AIEngine` masks any partisan terms in the response via word-boundary blocklist.
7. Stream is parsed and appended to the `chatStore` for UI rendering.

---

## 🎯 4. Applied Design Patterns
- **Observer Pattern**: Utilized via Firestore's `onSnapshot` for real-time progress synchronization.
- **Error Boundary Pattern**: Implemented at the route level to isolate component failures and ensure application-wide stability.
- **Strategy Pattern**: Implemented in our Multilingual engine to handle RTL (Urdu, Arabic) vs LTR (Hindi, English) layouts dynamically.
- **Custom Hook Pattern**: Every major feature is encapsulated in a hook, providing a clean API for the presentation layer.

---

## 💎 5. Technology Selection Rationale

| Choice | Alternatives Considered | Why This Wins |
| :--- | :--- | :--- |
| **Gemini 2.0 Flash** | GPT-4o, Claude 3.5 | Superior latency and tighter integration with the GCP ecosystem. |
| **Zustand** | Redux, Context API | Zero boilerplate and better performance for atomic state updates. |
| **Cloud Run** | GKE, App Engine | Scale-to-zero cost efficiency and simpler CI/CD integration. |
| **Vite** | Webpack, Create React App | Near-instant hot module replacement (HMR) and leaner build output. |

---

**The architecture of CivicIQ was designed with the same rigor as a production-grade enterprise application, not as a prototype.**
