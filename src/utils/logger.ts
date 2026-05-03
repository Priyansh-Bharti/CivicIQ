/**
 * Application Logger Utility
 * Provides a standardized way to log messages, with automatic suppression of non-critical logs in production environments.
 */

class Logger {
  /** Indicates if the application is running in production mode. */
  private isProduction: boolean = import.meta.env.PROD;

  /**
   * Masks sensitive information in log arguments.
   * @param {unknown[]} args Arguments to mask.
   * @returns {unknown[]} Masked arguments.
   */
  private mask(args: unknown[]): unknown[] {
    return args.map(arg => {
      if (typeof arg === 'string') {
        // Mask emails
        return arg.replace(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***');
      }
      return arg;
    });
  }

  /**
   * Logs informational messages to the console if not in production.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.isProduction) {
      console.log(`[INFO] ${message}`, ...this.mask(args));
    }
  }

  /**
   * Logs warning messages to the console if not in production.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.isProduction) {
      console.warn(`[WARN] ${message}`, ...this.mask(args));
    }
  }

  /**
   * Logs error messages to the console.
   * @param {string} message The message to log.
   * @param {...unknown[]} args Additional context or data to include in the log.
   */
  error(message: string, ...args: unknown[]): void {
    if (!this.isProduction) {
      console.error(`[ERROR] ${message}`, ...this.mask(args));
    }
  }
}

/**
 * Singleton instance of the Logger.
 */
export const logger = new Logger();
