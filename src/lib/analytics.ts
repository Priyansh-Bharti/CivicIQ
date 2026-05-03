/**
 * Behavioral Analytics Module
 * Wraps Firebase Analytics to provide standardized event tracking across the application.
 */

import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { app } from './firebase';
import { logger } from '../utils/logger';

let analytics: Analytics | null = null;

/**
 * Initializes Firebase Analytics if running in a browser environment.
 * @returns {void}
 */
export const initAnalytics = (): void => {
  try {
    if (typeof window !== 'undefined' && app) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    logger.error('Failed to initialize Firebase Analytics:', error);
  }
};

/**
 * Tracks a custom event with optional parameters.
 * @param {string} name The name of the event to track.
 * @param {Record<string, string | number | boolean>} [params={}] Key-value pairs of event parameters.
 * @returns {void}
 */
export const trackEvent = (
  name: string, 
  params: Record<string, string | number | boolean> = {}
): void => {
  try {
    if (analytics) {
      logEvent(analytics, name, params);
    } else {
      logger.info(`Analytics event triggered (not initialized): ${name}`, params);
    }
  } catch (error) {
    logger.error(`Failed to track event: ${name}`, error);
  }
};
