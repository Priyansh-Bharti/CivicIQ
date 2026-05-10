/**
 * Authentication Hook
 * Orchestrates Firebase Authentication and Firestore user synchronization.
 */

import { useEffect, useCallback } from 'react';
import { auth, db, onAuthStateChanged, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut, User } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useRateLimit } from './useSecurity';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { logger } from '../utils/logger';

interface AuthHookResult {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const syncUserProfile = async (firebaseUser: User): Promise<void> => {
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
  } catch (error) { logger.error('Firestore user profile sync error:', error); }
};

export const useAuth = (): AuthHookResult => {
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();
  const { checkLimit } = useRateLimit();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncUserProfile(firebaseUser);
      } else { clearUser(); }
      setLoading(false);
    });
    return () => { unsubscribe(); };
  }, [setUser, clearUser, setLoading]);

  const signIn = useCallback(async (): Promise<void> => {
    if (!checkLimit('AUTH').allowed) return;
    setLoading(true);
    try { await firebaseSignIn(); } catch (error) {
      setLoading(false);
      logger.error('Sign in error:', error);
      throw new Error(error instanceof Error ? error.message : 'Sign-in failed.');
    }
  }, [checkLimit, setLoading]);

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    try { await firebaseSignOut(); } catch (error) {
      setLoading(false);
      logger.error('Sign out error:', error);
      throw new Error('Sign out failed.');
    }
  }, [setLoading]);

  return { user, loading, signInWithGoogle: signIn, signOut, isAuthenticated: !!user };
};
