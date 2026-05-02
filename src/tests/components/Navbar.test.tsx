import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../../../src/components/layout/Navbar';
import { useAuth } from '../../../src/hooks/useAuth';

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

describe('Navbar Component', () => {
  it('renders sign-in button when logged out', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  it('renders user name when logged in', () => {
    (useAuth as any).mockReturnValue({
      user: { displayName: 'John Doe', photoURL: 'https://example.com/photo.jpg' },
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/John/i)).toBeInTheDocument();
  });

  it('has aria-label on nav element', () => {
    (useAuth as any).mockReturnValue({ user: null, isAuthenticated: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main Navigation');
  });

  it('renders the CivicIQ logo', () => {
    (useAuth as any).mockReturnValue({ user: null, isAuthenticated: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText('CivicIQ')).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    (useAuth as any).mockReturnValue({ user: null, isAuthenticated: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Checklist')).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    (useAuth as any).mockReturnValue({ 
      user: { displayName: 'John', photoURL: '' }, 
      isAuthenticated: true,
      signOut: vi.fn()
    });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    
    // Open profile menu
    const menuButton = screen.getByLabelText(/User menu/i);
    fireEvent.click(menuButton);
    
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  it('nav links have correct hrefs', () => {
    (useAuth as any).mockReturnValue({ user: null, isAuthenticated: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    expect(screen.getByText('Timeline').closest('a')).toHaveAttribute('href', '/timeline');
    expect(screen.getByText('Checklist').closest('a')).toHaveAttribute('href', '/checklist');
  });
});
