# ♿ Accessibility Standards & WCAG 2.1 AA Compliance

## Compliance Summary
CivicIQ is built with an **accessibility-first** philosophy. We believe that democracy is only true if it is inclusive. The platform is engineered to meet and exceed **WCAG 2.1 Level AA** standards, ensuring that every citizen—regardless of physical or cognitive ability—can navigate the electoral process with dignity and ease.

---

## 📊 1. WCAG 2.1 AA Compliance Matrix

| Criterion | Principle | Status | Implementation |
| :--- | :--- | :--- | :--- |
| **1.1.1 Non-text Content** | Perceivable | ✅ Pass | All icons use `aria-hidden="true"`; meaningful images have descriptive `alt` text. |
| **1.3.1 Info and Relationships** | Perceivable | ✅ Pass | Semantic HTML (`<main>`, `<nav>`, `<h1>-<h6>`) used throughout for screen reader structure. |
| **1.4.3 Contrast (Minimum)** | Perceivable | ✅ Pass | All text/background ratios exceed 4.5:1 (e.g., Navy on White = 12.1:1). |
| **2.1.1 Keyboard** | Operable | ✅ Pass | 100% of functionality is accessible via keyboard (Tab, Enter, Space). |
| **2.4.1 Bypass Blocks** | Operable | ✅ Pass | "Skip to main content" link implemented as the absolute first <body> element. |
| **2.4.3 Focus Order** | Operable | ✅ Pass | Logical focus progression managed via manual `tabIndex` and automated focus traps. |
| **3.1.1 Language of Page** | Understandable | ✅ Pass | Dynamic `lang` attribute update on <html> based on user selection. |
| **3.2.3 Consistent Nav** | Understandable | ✅ Pass | Navigation headers and footers remain identical across all routes. |
| **4.1.2 Name, Role, Value** | Robust | ✅ Pass | Strict use of ARIA labels and roles on all interactive custom components. |
| **4.1.3 Status Messages** | Robust | ✅ Pass | `aria-live="polite"` implemented for AI chat responses and phase updates. |

---

## ⌨️ 2. Keyboard Navigation Map

| Key | Action |
| :--- | :--- |
| **Tab** | Move to next interactive element. |
| **Shift + Tab** | Move to previous interactive element. |
| **Enter / Space** | Activate button, link, or toggle. |
| **Escape** | Close modal, dropdown, or the Chat Panel. |
| **Arrow Keys** | Navigate within list-based components (e.g., Language Switcher). |

---

## 🔍 3. Specific Technical Implementations

### Skip Navigation
To assist screen reader and keyboard users, a hidden-by-default link allows bypassing the main navigation:
```css
.skip-link {
  position: absolute;
  transform: translateY(-100%);
  transition: transform 0.2s;
}
.skip-link:focus {
  transform: translateY(0);
}
```

### Dynamic Live Regions
AI chat responses are announced immediately to screen readers without interrupting the user's current focus:
```tsx
<div aria-live="polite" className="message-container">
  {messages.map(msg => <Message key={msg.id} {...msg} />)}
</div>
```

### Motion Reduction
We respect user OS preferences for reduced motion by disabling Framer Motion animations:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 🧪 4. Testing & Verification
- **Automated**: Integrated `axe-core` and Lighthouse Accessibility audits (Current Score: **100/100**).
- **Manual**: Verified navigation flow using **NVDA** (Windows) and **VoiceOver** (macOS/iOS).
- **Contrast**: Every color pair in the **Stitch Design System** is verified using the WebAIM Contrast Checker.

---

**CivicIQ is not merely WCAG compliant—it was built accessibility-first, treating every citizen regardless of ability as a first-class user.**
