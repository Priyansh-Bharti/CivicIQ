import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from '../../../src/components/layout/Navbar';
import { Footer } from '../../../src/components/layout/Footer';
import { LanguageSwitcher } from '../../../src/components/ui/LanguageSwitcher';
import { PhaseCard } from '../../../src/components/timeline/PhaseCard';

expect.extend(toHaveNoViolations);

vi.mock('../../../src/hooks/useAuth', () => ({
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
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LanguageSwitcher should have no accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PhaseCard should have no accessibility violations', async () => {
    const phase = {
      id: '1',
      name: 'Phase 1',
      duration: '1 week',
      description: 'Test',
      keyActors: ['Test'],
      steps: ['Step 1'],
      status: 'pending' as const,
    };
    const { container } = render(<PhaseCard phase={phase} isActive={false} isCompleted={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
