/**
 * Automated Accessibility Tests
 * Uses jest-axe to run WCAG 2.1 AA compliance checks on core application components.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';

// Import components to test
import { Landing } from '../pages/Landing';
import { Timeline } from '../pages/Timeline';
import { Checklist } from '../pages/Checklist';
import { About } from '../pages/About';

// Extend expect for axe
expect.extend(toHaveNoViolations);

// Mock external hooks and stores
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { displayName: 'John Doe', photoURL: 'https://example.com/photo.jpg' },
    isAuthenticated: true,
    isLoading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn()
  })
}));

vi.mock('../store/languageStore', () => ({
  useLanguageStore: () => ({
    currentLanguage: 'en',
    setLanguage: vi.fn()
  })
}));

vi.mock('../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    changeLanguage: vi.fn(),
    dir: 'ltr'
  })
}));

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {}
}));

describe('Accessibility Standards (WCAG 2.1 AA)', () => {
  it('Landing Page should have no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Timeline Page should have no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Timeline />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Checklist Page should have no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Checklist />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('About Page should have no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
