import { useEffect } from 'react';
import { auth, db, onAuthStateChanged, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const useAuth = () => {
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore, if not create
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
        setUser(firebaseUser);
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
    } catch (error) {
      setLoading(false);
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
