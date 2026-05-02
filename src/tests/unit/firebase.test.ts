import { describe, it, expect, vi } from 'vitest';
import { app, auth, db } from '../../lib/firebase';

describe('Firebase Configuration', () => {
  it('initializes firebase app', () => {
    expect(app).toBeDefined();
  });

  it('provides auth instance', () => {
    expect(auth).toBeDefined();
  });

  it('provides firestore instance', () => {
    expect(db).toBeDefined();
  });

  it('has correct project id from env', () => {
    // This depends on how import.meta.env is mocked
    expect(import.meta.env.VITE_FIREBASE_PROJECT_ID).toBeDefined();
  });

  it('has messaging sender id from env', () => {
    expect(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
  });
});
