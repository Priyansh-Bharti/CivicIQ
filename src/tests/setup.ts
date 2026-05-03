import React from 'react';
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock Framer Motion to avoid animation-related test hangs and handle all motion tags
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const customMotion = new Proxy(
    {},
    {
      get: (_target, key) => {
        return ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => 
          React.createElement(key as string, props, children);
      },
    }
  );

  return {
    ...actual,
    motion: customMotion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => 
      React.createElement(React.Fragment, null, children),
  };
});

// Global mock for Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  where: vi.fn(),
}));

// Global mock for Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return () => {};
  }),
  GoogleAuthProvider: class {},
}));

// Global mock for useTranslation
vi.mock('../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    changeLanguage: vi.fn(),
    dir: 'ltr'
  })
}));
