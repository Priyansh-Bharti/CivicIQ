/**
 * Authentication Hook
 * Orchestrates Firebase Authentication and Firestore user synchronization.
 */

import { useEffect } from 'react';
import { auth, db, onAuthStateChanged, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut, User } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useRateLimit } from './useSecurity';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { logger } from '../utils/logger';

interface AuthHookResult {
  /** The current authenticated user or null. */
  user: User | null;
  /** Indicates if an authentication operation is in progress. */
  loading: boolean;
  /** Initiates the Google authentication flow. */
  signInWithGoogle: () => Promise<void>;
  /** Signs out the current user. */
  signOut: () => Promise<void>;
  /** Convenience boolean for authentication status. */
  isAuthenticated: boolean;
}

/**
 * Custom hook for managing authentication state and actions.
 * @returns {AuthHookResult} The authentication state and methods.
 */
export const useAuth = (): AuthHookResult => {
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();
  const { checkLimit } = useRateLimit();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp(),
              progress: {},
            });
          }
        } catch (error) {
          logger.error('Firestore sync error:', error);
        }
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);

  /**
   * Initiates Google Sign-In with rate limiting.
   * @throws {Error} If sign-in fails.
   */
  const signIn = async (): Promise<void> => {
    const limit = checkLimit('AUTH');
    if (!limit.allowed) {
      logger.warn('Auth rate limit exceeded');
      return;
    }

    setLoading(true);
    try {
      await firebaseSignIn();
    } catch (error) {
      setLoading(false);
      logger.error('Sign in error:', error);
      const message = error instanceof Error ? error.message : 'Sign-in failed. Please try again.';
      throw new Error(message);
    }
  };

  /**
   * Signs out the current user.
   * @throws {Error} If sign-out fails.
   */
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut();
    } catch (error) {
      setLoading(false);
      logger.error('Sign out error:', error);
      throw new Error('Sign out failed. Please try again.');
    }
  };

  return {
    user,
    loading,
    signInWithGoogle: signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
