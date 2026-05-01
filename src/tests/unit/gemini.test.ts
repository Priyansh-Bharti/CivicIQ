import { describe, it, expect } from 'vitest';
import { validatePrompt } from '../../lib/gemini';

describe('Gemini Validation Logic', () => {
  it('blocks party names', () => {
    expect(validatePrompt('Tell me about the Republican party').safe).toBe(false);
    expect(validatePrompt('Why should I vote for Democrats?').safe).toBe(false);
    expect(validatePrompt('BJP candidates').safe).toBe(false);
  });

  it('blocks candidate names', () => {
    expect(validatePrompt('What is Trump doing?').safe).toBe(false);
    expect(validatePrompt('Biden policies').safe).toBe(false);
  });

  it('blocks profanity', () => {
    expect(validatePrompt('This is shit').safe).toBe(false);
  });

  it('passes neutral election questions', () => {
    expect(validatePrompt('How do I register to vote?').safe).toBe(true);
    expect(validatePrompt('What is the deadline for mail-in ballots?').safe).toBe(true);
    expect(validatePrompt('Tell me about the counting process').safe).toBe(true);
  });
});
