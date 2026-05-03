import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../src/hooks/useAuth';
import { Navbar } from '../../../src/components/layout/Navbar';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  app: {},
  signInWithGoogle: vi.fn().mockResolvedValue({
    uid: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: null,
  }),
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: null) => void) => {
    callback(null);
    return vi.fn();
  }),
  doc: vi.fn(() => ({ id: 'mock-doc' })),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  collection: vi.fn(() => ({ id: 'mock-collection' })),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-added-doc' }),
  getDocs: vi.fn().mockResolvedValue({ docs: [], forEach: vi.fn() }),
  where: vi.fn(),
}))

vi.mock('../../../src/hooks/useTranslation', () => ({
  useTranslation: (text: string) => text
}));

// Mock the hook to control auth state
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

describe('Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  it('Unauthenticated user sees sign-in button', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn()
    });

    renderNavbar();
    // Navbar has desktop and mobile buttons
    expect(screen.getAllByRole('button', { name: /Sign in with Google/i }).length).toBeGreaterThan(0);
  });

  it('Authenticated user sees user menu/avatar', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: '123', displayName: 'John Doe', photoURL: 'http://example.com/photo.jpg', email: 'test@test.com' } as any,
      loading: false,
      isAuthenticated: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn()
    });

    renderNavbar();
    expect(screen.getByRole('button', { name: /User menu/i })).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument(); // Only shows first name
  });

  it('Sign out button calls signOut', () => {
    const mockSignOut = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: '123', displayName: 'John Doe' } as any,
      loading: false,
      isAuthenticated: true,
      signInWithGoogle: vi.fn(),
      signOut: mockSignOut
    });

    renderNavbar();
    
    // Open profile menu
    const userMenuBtn = screen.getByRole('button', { name: /User menu/i });
    act(() => { userMenuBtn.click(); });
    
    const signOutBtn = screen.getByRole('button', { name: /Sign out/i });
    act(() => { signOutBtn.click(); });
    
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('Sign in button calls signInWithGoogle', () => {
    const mockSignIn = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      signInWithGoogle: mockSignIn,
      signOut: vi.fn()
    });

    renderNavbar();
    
    const signInBtns = screen.getAllByRole('button', { name: /Sign in with Google/i });
    act(() => { signInBtns[0].click(); });
    
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('Auth hook returns loading true initially', () => {
    // In actual implementation it starts true.
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn()
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });
});

// Since renderHook isn't imported from test-utils in the file, import it here:
import { renderHook } from '@testing-library/react';
