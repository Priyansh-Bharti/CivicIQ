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
import { ENV } from '../utils/env';
import { logger } from '../utils/logger';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

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
    logger.error('Error signing in with Google:', error);
    if (error instanceof FirebaseError && error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please enable popups and try again.');
    }
    throw new Error('Authentication failed. Please try again.');
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
