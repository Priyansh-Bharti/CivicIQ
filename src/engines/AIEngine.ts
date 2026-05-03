import { ChatMessage } from '../types/election';
import { BLOCKED_TERMS } from '../constants';
import { AI_ERROR_MESSAGE } from '../constants/prompts';

/**
 * AI Engine
 * Orchestrates the preprocessing of user inputs and the post-processing of AI responses.
 */
export class AIEngine {
  /**
   * Sanitizes user input to prevent injection and filter sensitive terms.
   * @param {string} prompt Raw user input.
   * @returns {{ safe: boolean; sanitized: string; reason?: string }}
   */
  public static validateAndSanitize(prompt: string): { safe: boolean; sanitized: string; reason?: string } {
    const sanitized = prompt.replace(/<[^>]*>?/gm, '').substring(0, 500).trim();
    
    if (sanitized.length < 2) {
      return { safe: false, sanitized, reason: 'Prompt too short' };
    }

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
        role: m.role === 'assistant' ? 'model' : m.role,
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
    let sanitized = text;
    
    // Heuristic: Mask any accidental mentions of blocked terms in the output
    BLOCKED_TERMS.forEach(term => {
      const regex = new RegExp(term, 'gi');
      sanitized = sanitized.replace(regex, '[RESTRICTED]');
    });

    return sanitized;
  }
}
