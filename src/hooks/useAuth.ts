import { useEffect } from 'react';
import { auth, db, onAuthStateChanged, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut, handleRedirectResult } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const useAuth = () => {
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();

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
    setLoading(true);
    try {
      await firebaseSignIn();
    } catch (error: any) {
      setLoading(false);
      console.error('Sign in error:', error);
      
      // Provide user feedback for common errors
      if (error.code === 'auth/unauthorized-domain') {
        alert('This domain is not authorized for Firebase Auth. Please add it to your Firebase Console.');
      } else if (error.code === 'auth/operation-not-allowed') {
        alert('Google Sign-In is not enabled in your Firebase Console.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup blocked. The app will now try to redirect you.');
      } else {
        alert(`Sign in failed: ${error.message || 'Unknown error'}`);
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
