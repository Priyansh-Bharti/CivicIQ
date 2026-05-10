/**
 * Environment Configuration Validator
 * Ensures that all required environment variables are present and correctly formatted.
 */
import { logger } from './logger';

interface EnvConfig {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  GEMINI_API_KEY: string;
}

const REQUIRED_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GEMINI_API_KEY',
];

/**
 * Validates and returns the environment configuration.
 * @returns {EnvConfig} The validated environment configuration.
 */
export const validateEnv = (): EnvConfig => {
  const env = import.meta.env;
  const missing = REQUIRED_VARS.filter(key => !env[key]);

  if (missing.length > 0) {
    const errorMsg = `Critical Configuration Error: Missing required environment variables: ${missing.join(', ')}`;
    logger.error(errorMsg);
    if (env.PROD) throw new Error(errorMsg);
  }

  return {
    FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID,
    GEMINI_API_KEY: env.VITE_GEMINI_API_KEY,
  };
};

export const ENV = validateEnv();
