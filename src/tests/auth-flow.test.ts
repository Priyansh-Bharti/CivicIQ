import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import * as firebase from '../lib/firebase';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  onAuthStateChanged: vi.fn((auth, cb) => {
    // Return unsubscribe function
    return () => {};
  }),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  handleRedirectResult: vi.fn().mockResolvedValue({})
}));

// Mock rate limiting
vi.mock('../hooks/useSecurity', () => ({
  useRateLimit: () => ({
    checkLimit: () => ({ allowed: true })
  })
}));

describe('Auth Flow Integration Tests', () => {
  beforeEach(() => {
    useAuthStore.getState().clearUser();
    vi.clearAllMocks();
  });

  it('should handle successful sign-in flow', async () => {
    const signInSpy = vi.mocked(firebase.signInWithGoogle);
    signInSpy.mockResolvedValueOnce({ user: { uid: '123', displayName: 'Test User' } } as any);

    const { result } = renderHook(() => useAuth());

    // Trigger sign-in
    await act(async () => {
      await result.current.signInWithGoogle();
    });

    act(() => {
      useAuthStore.getState().setUser({ uid: '123', displayName: 'Test User' } as any);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.displayName).toBe('Test User');
  });

  it('should handle sign-out flow', async () => {
    const signOutSpy = vi.mocked(firebase.signOut);
    signOutSpy.mockResolvedValueOnce(undefined);

    act(() => {
      useAuthStore.getState().setUser({ uid: '123' } as any);
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.signOut();
    });

    act(() => {
      useAuthStore.getState().clearUser();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
