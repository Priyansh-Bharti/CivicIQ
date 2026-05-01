import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { app } from './firebase';

let analytics: Analytics | null = null;

export const initAnalytics = () => {
  try {
    // Only init in browser
    if (typeof window !== 'undefined' && app) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
  }
};

export const trackEvent = (name: string, params: Record<string, string | number | boolean> = {}) => {
  try {
    if (analytics) {
      logEvent(analytics, name, params);
    } else {
      console.warn(`Analytics not initialized. Would have tracked: ${name}`, params);
    }
  } catch (error) {
    console.error(`Failed to track event: ${name}`, error);
  }
};
