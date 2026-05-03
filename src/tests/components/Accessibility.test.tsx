import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

expect.extend(toHaveNoViolations);

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  })),
}));

describe('Component Level Accessibility', () => {
  it('Navbar should have no accessibility violations', async () => {
    const { container } = render(<BrowserRouter><Navbar /></BrowserRouter>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Footer should have no accessibility violations', async () => {
    const { container } = render(<BrowserRouter><Footer /></BrowserRouter>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LanguageSwitcher should have no accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
