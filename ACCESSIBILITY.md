# Accessibility Statement

CivicIQ is committed to ensuring digital accessibility for all citizens, regardless of ability. We aim for full compliance with **WCAG 2.1 Level AA** standards.

## Core Features
- **Semantic HTML**: We use standard HTML5 elements (`<main>`, `<nav>`, `<h1>`-`<h6>`, `<section>`) to provide a clear document structure for assistive technologies.
- **ARIA Implementation**: 
  - `aria-live="polite"` is used for chat updates and timeline transitions.
  - `role="log"` and `role="dialog"` manage the AI chat interface.
  - Descriptive `aria-label` and `aria-current` states help users understand their progress.
- **Keyboard Navigation**: 
  - The entire application is navigable via keyboard (`Tab`, `Enter`, `Space`).
  - Custom keyboard shortcuts (Arrow Keys) are implemented for the Election Timeline.
- **Focus Management**: 
  - Focus is automatically managed when opening/closing the Chat Panel.
  - A "Skip to Content" link is provided at the top of every page.
- **Visual Design**:
  - Color contrast ratios exceed WCAG AA requirements (minimum 4.5:1 for text).
  - Support for `prefers-reduced-motion` is implemented for all animations.

## Assistive Technology Testing
CivicIQ has been manually tested using:
- **VoiceOver** on macOS / iOS
- **NVDA** on Windows
- **Keyboard-only** interaction testing

## Language Accessibility
- Multilingual support for 5 languages: English, Spanish, French, German, and Vietnamese.
- Powered by Google Cloud Translate for accurate, real-time localized education.

## Known Limitations
- Complex SVG animations in the Timeline hero may be difficult for some screen readers to interpret; equivalent text descriptions are provided via ARIA labels.

## Feedback
We welcome your feedback on the accessibility of CivicIQ. Please let us know if you encounter accessibility barriers.
