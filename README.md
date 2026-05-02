# CivicIQ 🗳️

> **Democracy is not a spectator sport.** CivicIQ is a high-fidelity, AI-powered election education platform designed to guide citizens through every phase of the democratic process.

![Cloud Run](https://img.shields.io/badge/Hosted-Google_Cloud_Run-4285F4?logo=google-cloud)
![Firebase](https://img.shields.io/badge/Auth%20%26%20DB-Firebase-FFCA28?logo=firebase)
![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-8E75B2?logo=google-gemini)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-success)
![Tests](https://img.shields.io/badge/Tests-166-brightgreen)

## Problem Statement
"Many citizens feel overwhelmed by the complexity of election cycles, leading to voter apathy or accidental disenfranchisement due to misunderstood procedures, deadlines, and requirements."

## How CivicIQ Solves It
CivicIQ transforms complex election data into a personalized, interactive journey. By breaking down the election cycle into six digestible phases, users can track their progress from registration to certification without being overwhelmed by technical jargon.

The platform integrates a grounded AI assistant, **CivicIQ**, which uses Gemini 2.5 Flash to answer specific procedural questions while adhering to strict neutrality guardrails. This ensures users get factual, non-partisan information exactly when they need it.

Finally, CivicIQ prioritizes inclusivity. With full WCAG 2.1 AA compliance and native multilingual support, we ensure that every citizen—regardless of ability or primary language—has equal access to the education required to participate in their democracy.

## Architecture
```text
[ Citizen ] <--> [ Vite / React PWA ] <--> [ Firebase Auth / Firestore ]
                        ^
                        |
            [ Google Cloud Run (Hosting) ]
                        |
            [ Gemini 2.5 Flash (Education) ]
                        |
            [ Cloud Translate (Localization) ]
```

## Tech Stack
| Category | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **AI / NLP** | Gemini 2.5 Flash (@google/generative-ai) |
| **Auth** | Firebase Authentication (Google OAuth) |
| **Database** | Cloud Firestore |
| **Analytics** | Firebase Analytics → BigQuery |
| **Translation**| Google Cloud Translate |
| **Hosting** | Google Cloud Run (Containerized with Docker/Nginx) |
| **Testing** | Vitest, React Testing Library |
| **CI/CD** | Google Cloud Build |

## Google Services Used
1. **Gemini 2.5 Flash**: Grounded, guardrailed AI education assistant.
2. **Firebase Auth**: Secure Google OAuth identity management.
3. **Cloud Firestore**: Real-time persistence for user phase progress and chat history.
4. **Cloud Translate**: Dynamic localization for 22 global languages with RTL support.
5. **BigQuery**: Advanced behavioral analytics via Firebase Export.
6. **Cloud Run / Build**: Serverless container orchestration and automated deployment.

## Evaluation Criteria
| Criterion | How We Meet It |
|---|---|
| **Technical Excellence** | 100% Type safety, 166 tests, 95+ Lighthouse scores. |
| **User Experience** | Stitch Design System (M3), fluid animations, glassmorphism. |
| **Accessibility** | Full WCAG 2.1 AA compliance, ARIA-enabled, keyboard-first. |
| **Impact** | Direct reduction in procedural voter friction. |

## Setup & Installation
1. Clone the repository: `git clone https://github.com/Priyansh-Bharti/CivicIQ.git`
2. Install dependencies: `npm install`
3. Configure environment: Create a `.env` file based on `.env.example`.
4. Start development: `npm run dev`

## Running Tests
```bash
npm test              # Run all tests
npm test -- --coverage # Generate coverage report
```

## Project Structure
```text
src/
├── components/   # Atomic UI components
├── hooks/        # Custom logic (Auth, Timeline, AI)
├── lib/          # Utilities (Firebase, Gemini, Analytics)
├── pages/        # Main route views
├── store/        # Global state (Zustand)
└── tests/        # 150+ unit & integration tests
```

## License
MIT License
