/**
 * Firebase Initialization and Authentication Module
 * Configures the Firebase SDK and provides standardized auth utilities.
 */

import { initializeApp, FirebaseApp, FirebaseError } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  Auth,
  UserCredential
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { logger } from '../utils/logger';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Validates the Firebase configuration and logs missing keys.
 * @returns {void}
 */
const validateConfig = (): void => {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    logger.warn(`Firebase config is missing keys: ${missingKeys.join(', ')}. Check your .env file.`);
  }
};

validateConfig();

// Initialize Firebase services
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Signs in the user using Google OAuth via a popup, with a redirect fallback.
 * @returns {Promise<User | undefined>} The authenticated user object.
 * @throws {Error} If authentication fails.
 */
export const signInWithGoogle = async (): Promise<User | undefined> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        logger.info('Popup blocked, falling back to redirect...');
        await signInWithRedirect(auth, googleProvider);
        return undefined;
      }
    }
    logger.error('Error signing in with Google:', error);
    throw new Error('Authentication failed. Please try again.');
  }
};

/**
 * Handles the result of a Google sign-in redirect.
 * @returns {Promise<User | null | undefined>} The authenticated user or null.
 */
export const handleRedirectResult = async (): Promise<User | null | undefined> => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user;
  } catch (error) {
    logger.error('Error handling redirect result:', error);
    return null;
  }
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If sign-out fails.
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    logger.error('Error signing out:', error);
    throw new Error('Sign out failed. Please try again.');
  }
};

export { app, auth, db, onAuthStateChanged };
export type { User };
