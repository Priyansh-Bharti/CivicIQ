import React from 'react';
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock window.matchMedia (not available in jsdom)
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock Framer Motion to avoid animation-related test hangs and handle all motion tags
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const customMotion = new Proxy(
    {},
    {
      get: (_target, key) => {
        return ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => {
          const {
            initial, animate, exit, transition, variants,
            whileHover, whileTap, whileInView, layout, layoutId,
            viewport, onViewportEnter, onViewportLeave, style,
            ...validProps
          } = props;
          return React.createElement(key as string, validProps, children);
        };
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
  onSnapshot: vi.fn(() => () => {}),
}));

// Global mock for Firebase App
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

// Global mock for Firebase Auth - auth object MUST have currentUser
const mockAuth = { currentUser: null };

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, cb) => {
    cb(null);
    return () => {};
  }),
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
}));

// Global mock for @google/generative-ai including required enums
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      startChat: vi.fn(() => ({
        sendMessageStream: vi.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'Mocked response' };
          })()
        })
      })),
    }))
  })),
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT'
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE'
  }
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
