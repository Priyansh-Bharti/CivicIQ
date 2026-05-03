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

### (c) Business Logic Layer (Hooks)
- **Mechanism**: Custom React Hooks (`src/hooks`).
- **Responsibility**: All non-visual logic—calculating phase completion, handling AI stream parsing, and enforcing rate limits—is strictly contained here.

### (d) Data Access Layer (Abstractions)
- **Mechanism**: Service Libs (`src/lib`).
- **Responsibility**: Wraps external SDKs (Firebase, Gemini). This provides a **Repository Pattern** interface, allowing us to swap underlying services without modifying the UI or Hooks.

---

## 🔄 3. Key Data Flows

### User Authentication Flow
1. User clicks "Sign in with Google".
2. `useAuth` hook triggers `signInWithPopup` via `src/lib/firebase`.
3. Firebase return JWT; `authStore` updates.
4. Firestore listener initializes to sync user progress in real-time.

### AI Chat Flow
1. User submits query via `ChatInput`.
2. `useGemini` hook applies local sanitization and rate-limit checks.
3. Payload sent to the Cloud Run wrapper.
4. Gemini 2.0 Flash generates response with enforced `SYSTEM_PROMPT`.
5. Stream is parsed and appended to the `chatStore` for UI rendering.

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
