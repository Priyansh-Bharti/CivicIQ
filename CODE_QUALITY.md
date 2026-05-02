# CivicIQ Code Quality Standards 💎

This document outlines the architectural decisions, coding patterns, and quality standards followed in the CivicIQ codebase to ensure maintainability, scalability, and performance.

---

## 🏗️ 1. Architecture Decisions

| Decision | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React + TypeScript** | Provides a robust component model with strict type safety, reducing runtime errors and improving developer productivity. |
| **Build Tool** | **Vite** | Offers significantly faster hot module replacement (HMR) and build times compared to Webpack/CRA, utilizing native ES modules. |
| **State Mgmt** | **Zustand** | Chosen over Redux for its simplicity, smaller bundle size, and lack of boilerplate. It provides a clean, hook-based API that fits perfectly with React. |
| **Testing** | **Vitest** | Native Vite integration, much faster than Jest, and compatible with the Jest API, making the transition seamless. |

---

## 📂 2. Folder Structure

```text
src/
├── components/   # Atomic UI components (Layout, UI, Feature-specific)
│   ├── chat/     # Gemini AI chat interface components
│   ├── checklist/# Civic readiness checklist components
│   ├── layout/   # Global components like Navbar, Footer, Sidebar
│   ├── timeline/ # Interactive election phase components
│   └── ui/       # Reusable primitive components (Buttons, Inputs, etc.)
├── hooks/        # Custom React hooks (Business logic extraction)
├── lib/          # Service initializers and utility configurations (Firebase, Gemini)
├── pages/        # Route-level views and page compositions
├── store/        # Global state stores (Zustand)
├── tests/        # 150+ unit, integration, and security tests
├── types/        # Global TypeScript interfaces and enums
└── utils/        # Stateless helper functions and formatters
```

---

## 🔷 3. TypeScript Standards

- **Strict Mode**: `strict: true` is enabled in `tsconfig.json`.
- **No Implicit Any**: Use of `any` is strictly prohibited. All data structures must be explicitly typed.
- **Interface Driven**: All component props must be defined via interfaces placed directly above the component definition.
- **API Typing**: Every response from external services (Firebase, Gemini) is cast to a strict interface to ensure data integrity across the app.

---

## 🏷️ 4. Naming Conventions

- **Components**: `PascalCase` (e.g., `ChatPanel.tsx`, `ProgressRing.tsx`).
- **Hooks**: `camelCase` with `use` prefix (e.g., `useAuth.ts`, `useGemini.ts`).
- **Utils/Helpers**: `camelCase` (e.g., `formatDate.ts`, `validatePrompt.ts`).
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `ELECTION_PHASES`, `SUPPORTED_LANGUAGES`).
- **Files**: Matching the name of the primary export.

---

## 🧱 5. Component Design

- **Single Responsibility Principle (SRP)**: Each component should do one thing well.
- **Size Limit**: Components are ideally kept under **100-150 lines**. If a component grows larger, it is refactored into smaller sub-components.
- **Props Definition**:
  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
    variant: 'primary' | 'secondary';
  }
  export const Button = ({ label, onClick, variant }: ButtonProps) => { ... }
  ```

---

## 🪝 6. Custom Hooks Pattern

To keep components purely presentational, all **business logic**, side effects, and state orchestrations are extracted into custom hooks.
- **Components**: Focus on UI layout and passing props.
- **Hooks**: Handle data fetching, calculations, and interaction logic.

---

## 🛡️ 7. Error Handling Strategy

- **Graceful Failures**: All external API calls (Gemini, Firebase) are wrapped in `try/catch` blocks.
- **Privacy First**: We never expose stack traces or internal error details to the user.
- **Generic Messaging**: Users receive friendly, actionable messages (e.g., "Service is temporarily unavailable") while technical details are logged to internal telemetry only.

---

## 🧪 8. Testing Philosophy

CivicIQ maintains a high-quality baseline with **150+ tests**:
- **Unit Tests**: Coverage for all custom hooks, store logic, and utility functions.
- **Integration Tests**: Verification of end-to-end user journeys (e.g., "Sign-in -> Progress Tracking -> Chat").
- **Accessibility Tests**: Automated WCAG audits using `jest-axe` integrated into the test runner.
- **Security Tests**: Mocking API failures to ensure error sanitization.

---

## 🛠️ 9. Code Quality Tools

- **ESLint**: Configured with strict TypeScript and React rules to catch anti-patterns early.
- **Prettier**: Enforces consistent code formatting across the entire team.
- **Pre-commit Hooks**: (Husky/Lint-staged) Ensures only linted and passing code can be committed to the repository.

---

## ⚡ 10. Performance Patterns

- **Route Splitting**: `React.lazy()` and `Suspense` are used for all top-level routes to reduce initial bundle size.
- **Memoization**: `useMemo` and `useCallback` are used strategically for expensive computations or to prevent unnecessary re-renders of heavy components.
- **Firestore Optimization**: Indexed queries and selective data fetching to minimize read costs and latency.
- **Asset Loading**: Modern formats (WebP/SVG) and Vite's automated asset optimization.

---
**CivicIQ — Built for Stability, Designed for Inclusivity.**
