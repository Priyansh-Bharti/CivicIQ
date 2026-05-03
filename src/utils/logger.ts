/**
 * Application Logger Utility
 * Provides a standardized way to log messages, with automatic suppression of non-critical logs in production environments.
 */

class Logger {
  /** Indicates if the application is running in production mode. */
  private isProduction: boolean = import.meta.env.PROD;

  /**
   * Logs informational messages to the console if not in production.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.isProduction) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Logs warning messages to the console if not in production.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.isProduction) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Logs error messages to the console. These are always logged in development, but could be extended to external tracking in production.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  error(message: string, ...args: unknown[]): void {
    // In production, we might want to send these to an error tracking service like Sentry
    if (!this.isProduction) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

/**
 * Singleton instance of the Logger.
 */
export const logger = new Logger();
