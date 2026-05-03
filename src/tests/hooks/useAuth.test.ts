import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import * as firebase from '../../lib/firebase';
import { getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { User, Auth } from 'firebase/auth';

// Mock dependencies
vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  onAuthStateChanged: vi.fn(() => vi.fn()), // Return a function by default
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'timestamp'),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, loading: true });
  });

  it('initializes with loading=true', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it('sets user when firebase user is detected', async () => {
    const mockUser = { uid: '123', displayName: 'Test User' } as User;
    (firebase.onAuthStateChanged as Mock).mockImplementation((_auth: Auth, callback: (user: User | null) => void) => {
      setTimeout(() => callback(mockUser), 0);
      return vi.fn();
    });

    (getDoc as Mock).mockResolvedValue({ exists: () => true } as DocumentSnapshot);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user?.uid).toBe(mockUser.uid);
      expect(result.current.loading).toBe(false);
    });
  });

  it('creates firestore document for new user', async () => {
    const mockUser = { uid: '456', displayName: 'New User', email: 'new@test.com', photoURL: 'url' } as User;
    (firebase.onAuthStateChanged as Mock).mockImplementation((_auth: Auth, callback: (user: User | null) => void) => {
      setTimeout(() => callback(mockUser), 0);
      return vi.fn();
    });

    (getDoc as Mock).mockResolvedValue({ exists: () => false } as DocumentSnapshot);

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
  });

  it('clears user when firebase user is null', async () => {
    useAuthStore.setState({ user: { uid: '123' } as unknown as User, loading: false });
    
    (firebase.onAuthStateChanged as Mock).mockImplementation((_auth: Auth, callback: (user: User | null) => void) => {
      setTimeout(() => callback(null), 0);
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it('calls firebase signInWithGoogle on signIn', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(firebase.signInWithGoogle).toHaveBeenCalled();
  });

  it('calls firebase signOut on signOut', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });

    expect(firebase.signOut).toHaveBeenCalled();
  });

  it('returns isAuthenticated=true when user exists', () => {
    useAuthStore.setState({ user: { uid: '123' } as unknown as User, loading: false });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });
});
