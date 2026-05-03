# 🤝 Contributing to CivicIQ

We love your interest in making democracy more accessible! CivicIQ is a mission-driven project, and we welcome contributions that align with our core values of **neutrality, inclusivity, and technical excellence.**

---

## 📜 1. Code of Conduct
By participating in this project, you agree to maintain a professional and respectful environment. We strictly prohibit any partisan political bias, harassment, or non-inclusive behavior.

---

## 🐛 2. Reporting Issues
- **Bugs**: Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). Provide clear steps to reproduce and environment details.
- **Features**: Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md). Explain the civic impact of your suggestion.

---

## 🛠️ 3. Development Setup
1. **Fork** the repository.
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/CivicIQ.git`.
3. **Install Dependencies**: `npm install`.
4. **Environment Config**: Copy `.env.example` to `.env` and add your keys.
5. **Start Dev Server**: `npm run dev`.

---

## 🌿 4. Branching & Commits
We follow **Conventional Commits** for clear version history.

- **Branch Naming**:
  - `feat/` for new features.
  - `fix/` for bug fixes.
  - `docs/` for documentation updates.
  - `chore/` for maintenance.
  
- **Example Commit**: `feat: add Tamil support to language selector`

---

## ✅ 5. Pull Request Standards
To ensure the highest code quality, every PR must meet these criteria:
- [ ] **Tests Passing**: Run `npm test` and ensure 0 failures.
- [ ] **ESLint Clean**: Ensure `npm run lint` returns 0 warnings/errors.
- [ ] **Accessibility**: Verify no regressions in Lighthouse Accessibility score.
- [ ] **Documentation**: Update relevant `.md` files if adding new features.
- [ ] **Type Safety**: No `any` types or strict-mode violations.

---

## 🏛️ 6. Code Review Standards
We look for:
1. **Domain Engine Isolation**: Is complex logic in a stateless, testable engine (`src/engines`)?
2. **Separation of Concerns**: Is UI logic in a hook, and presentational logic in a component?
3. **DRY Principle**: Can this logic be shared?
4. **Performance**: Are expensive re-renders avoided via memoization or lazy loading?
5. **Security**: Is user input sanitized via `AIEngine`?
6. **Strict Typing**: Is the "Zero-Any" policy maintained?

---

**Thank you for helping us build the future of civic education!**
