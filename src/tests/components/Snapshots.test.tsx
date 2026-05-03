import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
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
    const { asFragment } = render(<BrowserRouter><Footer /></BrowserRouter>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('LanguageSwitcher matches snapshot', () => {
    const { asFragment } = render(<LanguageSwitcher />);
    expect(asFragment()).toMatchSnapshot();
  });
});
