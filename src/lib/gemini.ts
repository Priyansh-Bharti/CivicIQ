/**
 * AI Service Integration Module
 * Responsible for communicating with Gemini 2.0 Flash and handling chat persistence.
 */

import { GoogleGenerativeAI, Content, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ChatMessage } from '../types/election';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { BLOCKED_TERMS, AI_CONFIG } from '../constants';
import { SYSTEM_PROMPT } from '../constants/prompts';
import { AIEngine } from '../engines/AIEngine';
import { ENV } from '../utils/env';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

/**
 * Configure standard safety settings for the AI.
 */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
];

/**
 * Retrieves the pre-configured Gemini model.
 * Injects non-partisan system instructions and safety filters.
 * @returns {GenerativeModel} The configured generative model instance.
 */
const getModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({ 
    model: AI_CONFIG.MODEL_NAME, 
    systemInstruction: SYSTEM_PROMPT,
    safetySettings: SAFETY_SETTINGS,
  });
};

/**
 * Validates a user prompt using the AIEngine.
 * @param {string} prompt The user input to validate.
 * @returns {{ safe: boolean; reason?: string }} Validation result.
 */
export const validatePrompt = (prompt: string): { safe: boolean; reason?: string } => {
  return AIEngine.validateAndSanitize(prompt);
};

/**
 * Streams an answer from CivicIQ based on prompt and history.
 * @param {string} prompt The user's question.
 * @param {ChatMessage[]} history Previous messages in the session.
 * @param {string} [phaseContext] Optional context about the current election phase.
 * @yields {string} Chunks of the AI response.
 */
export async function* streamCivicAnswer(
  prompt: string, 
  history: ChatMessage[], 
  phaseContext?: string
): AsyncGenerator<string> {
  const { safe, sanitized, reason } = AIEngine.validateAndSanitize(prompt);
  if (!safe) throw new Error(reason || 'Invalid input.');

  try {
    const model = getModel();
    const contents: Content[] = AIEngine.formatHistory(history);

    const chat = model.startChat({
      history: contents,
      generationConfig: {
        maxOutputTokens: AI_CONFIG.MAX_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE,
      }
    });

    const fullPrompt = phaseContext 
      ? `Context: We are discussing the "${phaseContext}" phase.\nQuestion: ${sanitized}`
      : sanitized;

    const result = await chat.sendMessageStream(fullPrompt);
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    logger.error('Gemini error:', error);
    throw new Error('CivicIQ is temporarily unavailable. Please try again in a moment.');
  }
}

/**
 * Persists a chat message to Firestore.
 * @param {string} userId The unique identifier of the user.
 * @param {ChatMessage} message The message object to save.
 * @returns {Promise<void>}
 */
export const saveMessageToFirestore = async (userId: string, message: ChatMessage): Promise<void> => {
  try {
    await addDoc(collection(db, 'users', userId, 'chatHistory'), message);
  } catch (error) {
    logger.error('Error saving message to Firestore:', error);
  }
};

/**
 * Loads the chat history for a specific user from Firestore.
 * @param {string} userId The unique identifier of the user.
 * @returns {Promise<ChatMessage[]>} Array of retrieved chat messages.
 */
export const loadChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(collection(db, 'users', userId, 'chatHistory'), orderBy('timestamp', 'asc'));
    const snapshot: QuerySnapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ChatMessage);
  } catch (error) {
    logger.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Deletes all chat history for a specific user.
 * @param {string} userId The unique identifier of the user.
 * @returns {Promise<void>}
 */
export const clearChatHistory = async (userId: string): Promise<void> => {
  try {
    const q = query(collection(db, 'users', userId, 'chatHistory'));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    logger.error('Error clearing chat history:', error);
  }
};
