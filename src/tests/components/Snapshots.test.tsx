import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../../../src/components/layout/Navbar';
import { Footer } from '../../../src/components/layout/Footer';
import { PhaseCard } from '../../../src/components/timeline/PhaseCard';
import { LanguageSwitcher } from '../../../src/components/ui/LanguageSwitcher';
import { useAuth } from '../../../src/hooks/useAuth';

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  })),
}));

describe('Component Snapshots', () => {
  it('Navbar matches snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Footer matches snapshot', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('LanguageSwitcher matches snapshot', () => {
    const { asFragment } = render(<LanguageSwitcher />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('PhaseCard matches snapshot (Pending)', () => {
    const phase = {
      id: '1',
      name: 'Phase 1',
      duration: '1 week',
      description: 'Test',
      keyActors: ['Test'],
      steps: ['Step 1'],
      status: 'pending' as const,
    };
    const { asFragment } = render(<PhaseCard phase={phase} isActive={false} isCompleted={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('PhaseCard matches snapshot (Active)', () => {
    const phase = {
      id: '1',
      name: 'Phase 1',
      duration: '1 week',
      description: 'Test',
      keyActors: ['Test'],
      steps: ['Step 1'],
      status: 'active' as const,
    };
    const { asFragment } = render(<PhaseCard phase={phase} isActive={true} isCompleted={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('PhaseCard matches snapshot (Completed)', () => {
    const phase = {
      id: '1',
      name: 'Phase 1',
      duration: '1 week',
      description: 'Test',
      keyActors: ['Test'],
      steps: ['Step 1'],
      status: 'completed' as const,
    };
    const { asFragment } = render(<PhaseCard phase={phase} isActive={false} isCompleted={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
