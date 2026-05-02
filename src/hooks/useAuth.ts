import { useEffect } from 'react';
import { auth, db, onAuthStateChanged, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut, handleRedirectResult } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useRateLimit } from './useSecurity';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const useAuth = () => {
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();
  const { checkLimit } = useRateLimit();

  useEffect(() => {
    // Handle redirect results on mount
    const handleRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };
    void handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set user immediately for UI responsiveness
        setUser(firebaseUser);
        
        try {
          // Sync with Firestore in background
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
          console.error('Firestore sync error:', error);
          // Don't clear user here, as auth is still valid
        }
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);

  const signIn = async () => {
    // Security: Check Rate Limit (Auth tier)
    const limit = checkLimit('auth');
    if (!limit.allowed) {
      alert('Too many sign-in attempts. Please try again in 15 minutes.');
      return;
    }

    setLoading(true);
    try {
      await firebaseSignIn();
    } catch (error: any) {
      setLoading(false);
      console.error('Sign in error:', error);
      
      // Security: Use generic error messages
      if (error.code === 'auth/unauthorized-domain') {
        alert('Authentication error: This domain is not authorized. Please check your configuration.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Authentication error: Popup blocked. Please enable popups or try again.');
      } else {
        alert('Sign-in failed. Please ensure you are using a valid account and try again.');
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
    } catch (error) {
      setLoading(false);
      throw error;
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
