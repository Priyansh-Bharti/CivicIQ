import { ChatMessage } from '../types/election';
import { BLOCKED_TERMS } from '../constants';
import { AI_ERROR_MESSAGE } from '../constants/prompts';

/** Maximum allowed prompt length in characters. */
const MAX_PROMPT_LENGTH = 500;

/** Minimum allowed prompt length in characters. */
const MIN_PROMPT_LENGTH = 2;

/**
 * Regex patterns for detecting prompt injection and jailbreak attempts.
 * These supplement the BLOCKED_TERMS blocklist.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(previous|prior|above|all)\s+(instructions?|prompts?|context)/gi,
  /system\s*prompt/gi,
  /you\s+are\s+now/gi,
  /act\s+as\s+(if\s+you\s+are|an?)\s/gi,
  /pretend\s+(you\s+are|to\s+be)/gi,
  /forget\s+(everything|your|all)\s/gi,
  /jailbreak/gi,
  /dan\s+mode/gi,
  /override\s+(safety|filter|system)/gi,
  /<script[\s\S]*?>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /\bon\w+\s*=/gi,        // onerror=, onclick=, etc.
  /<!--[\s\S]*?-->/g,      // HTML comments
];

/**
 * AI Engine
 * Orchestrates the preprocessing of user inputs and the post-processing of AI responses.
 * Implements multi-layer sanitization: length check → injection detection → blocklist → HTML strip.
 */
export class AIEngine {
  /**
   * Strips HTML/script tags and encodes dangerous characters from a string.
   * @param {string} input Raw user input.
   * @returns {string} The sanitized string.
   */
  private static stripDangerousContent(input: string): string {
    return input
      .replace(/<[^>]*>?/gm, '')           // strip HTML tags
      .replace(/&/g, '&amp;')               // encode ampersand
      .replace(/"/g, '&quot;')              // encode double quote
      .replace(/'/g, '&#x27;')              // encode single quote
      .replace(/\//g, '&#x2F;')            // encode forward slash
      .substring(0, MAX_PROMPT_LENGTH)
      .trim();
  }

  /**
   * Detects prompt injection and jailbreak patterns in a string.
   * @param {string} input Sanitized user input.
   * @returns {boolean} True if an injection pattern is found.
   */
  private static hasInjectionPattern(input: string): boolean {
    return INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Validates and sanitizes user input with multi-layer security.
   * @param {string} prompt Raw user input.
   * @returns {{ safe: boolean; sanitized: string; reason?: string }}
   */
  public static validateAndSanitize(prompt: string): { safe: boolean; sanitized: string; reason?: string } {
    /** Step 1: Strip HTML and encode special characters */
    const sanitized = AIEngine.stripDangerousContent(prompt);

    /** Step 2: Length validation */
    if (sanitized.length < MIN_PROMPT_LENGTH) {
      return { safe: false, sanitized, reason: 'Prompt too short' };
    }

    /** Step 3: Prompt injection / jailbreak detection */
    if (AIEngine.hasInjectionPattern(sanitized)) {
      return {
        safe: false,
        sanitized,
        reason: `Prompt injection detected. ${AI_ERROR_MESSAGE}`
      };
    }

    /** Step 4: Blocklist check */
    const lowerPrompt = sanitized.toLowerCase();
    const foundTerm = BLOCKED_TERMS.find(term => lowerPrompt.includes(term.toLowerCase()));
    if (foundTerm) {
      return {
        safe: false,
        sanitized,
        reason: `Your query contains sensitive or blocked terms. ${AI_ERROR_MESSAGE}`
      };
    }

    return { safe: true, sanitized };
  }

  /**
   * Formats chat history for the Gemini API.
   * @param {ChatMessage[]} messages Array of local chat messages.
   * @returns {{ role: string; parts: { text: string }[] }[]} Formatted history for the generative model.
   */
  public static formatHistory(messages: ChatMessage[]): { role: string; parts: { text: string }[] }[] {
    return messages
      .filter(m => m.content !== '...')
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
  }

  /**
   * Post-processes AI responses to ensure no sensitive or non-partisan terms are leaked.
   * This provides a "Double-Layer" of security on top of Gemini's internal filters.
   * @param {string} text The raw response from the AI.
   * @returns {string} The sanitized response.
   */
  public static sanitizeResponse(text: string): string {
    /** Mask any accidental mentions of blocked terms in the output */
    let sanitized = text;
    BLOCKED_TERMS.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '[RESTRICTED]');
    });
    return sanitized;
  }
}
