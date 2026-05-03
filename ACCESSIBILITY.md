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
  - A **Skip to Main Content** link is available as the first interactive element. It uses a CSS-driven transform animation (`translateY`) to remain hidden until focused, ensuring it doesn't clutter the visual layout while remaining fully accessible to keyboard users.
  - The skip link points to `id="main-content"`, which wraps all primary application routes in `App.tsx`.
- **Dynamic Content**:
  - `aria-live="polite"` is used for AI chat responses, phase transitions, and language changes to ensure screen readers announce updates without interrupting the user.
- **Imagery & Iconography**:
  - All decorative icons (Lucide icons) are marked with `aria-hidden="true"` to reduce screen reader noise.
  - Meaningful images, such as user profile photos, use descriptive `alt` text containing the user's name or purpose.
- **Visual Design**:
  - Color contrast ratios exceed WCAG AA requirements (minimum 4.5:1 for text).
  - Support for `prefers-reduced-motion` is implemented for all animations.

## Assistive Technology Testing
CivicIQ has been manually tested using:
- **VoiceOver** on macOS / iOS
- **NVDA** on Windows
- **Keyboard-only** interaction testing

## Language Accessibility
- Multilingual support for 22 global languages, categorized by region for easy access.
- Full RTL (Right-to-Left) support for Arabic and Urdu, ensuring a native browsing experience.
- Dynamic `lang` and `dir` attributes are automatically applied to the document root for assistive technology compatibility.
- Powered by Google Cloud Translate for accurate, real-time localized education.

## Known Limitations
- Complex SVG animations in the Timeline hero may be difficult for some screen readers to interpret; equivalent text descriptions are provided via ARIA labels.

## Feedback
We welcome your feedback on the accessibility of CivicIQ. Please let us know if you encounter accessibility barriers.
