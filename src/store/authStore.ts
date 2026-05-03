/**
 * Authentication State Management
 * Handles the global authentication state, user data, and session loading status.
 */

import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  /** The current Firebase user object or null if unauthenticated. */
  user: User | null;
  /** Indicates if an authentication session is currently being resolved. */
  loading: boolean;
  /** Sets the current user and stops the loading state. */
  setUser: (user: User | null) => void;
  /** Updates the authentication loading status. */
  setLoading: (loading: boolean) => void;
  /** Clears the user session and stops the loading state. */
  clearUser: () => void;
}

/**
 * Zustand store for managing application-wide authentication state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user: User | null): void => set({ user, loading: false }),
  setLoading: (loading: boolean): void => set({ loading }),
  clearUser: (): void => set({ user: null, loading: false }),
}));
