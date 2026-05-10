import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false });
  });

  it('should initialize with null user', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should set user', () => {
    const user = { uid: '123', email: 'test@example.com', emailVerified: true, isAnonymous: false, metadata: {}, providerData: [], refreshToken: '', tenantId: null, delete: async () => {}, getIdToken: async () => '', getIdTokenResult: async () => ({} as any), reload: async () => {}, toJSON: () => ({}) } as any;
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
