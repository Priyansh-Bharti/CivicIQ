import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, initialized: false });
  });

  it('should initialize with null user', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().initialized).toBe(false);
  });

  it('should set user', () => {
    const user = { uid: '123', email: 'test@example.com', emailVerified: true, isAnonymous: false, metadata: {}, providerData: [], refreshToken: '', tenantId: null, delete: async () => {}, getIdToken: async () => '', getIdTokenResult: async () => ({} as any), reload: async () => {}, toJSON: () => ({}) } as any;
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().initialized).toBe(true);
  });
});
