/**
 * AI Service Integration Module
 * Responsible for communicating with Gemini 2.0 Flash and handling chat persistence.
 */

import { GoogleGenerativeAI, Content, GenerativeModel } from '@google/generative-ai';
import { ChatMessage } from '../types/election';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { SYSTEM_PROMPT, BLOCKED_TERMS, AI_CONFIG } from '../constants';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Retrieves the pre-configured Gemini model with system instructions.
 * @returns {GenerativeModel} The configured generative model.
 */
const getModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({ 
    model: AI_CONFIG.MODEL_NAME, 
    systemInstruction: SYSTEM_PROMPT 
  });
};

/**
 * Validates a user prompt against a list of blocked terms.
 * @param {string} prompt The user input to validate.
 * @returns {{ safe: boolean; reason?: string }} Validation result.
 */
export const validatePrompt = (prompt: string): { safe: boolean; reason?: string } => {
  const lowerPrompt = prompt.toLowerCase();
  for (const term of BLOCKED_TERMS) {
    if (lowerPrompt.includes(term)) {
      return { safe: false, reason: `The prompt contains sensitive or blocked terms: "${term}".` };
    }
  }
  return { safe: true };
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
  const sanitized = prompt.replace(/<[^>]*>?/gm, '').trim().substring(0, AI_CONFIG.PROMPT_LIMIT);
  if (!sanitized) throw new Error('Please provide a valid question.');

  try {
    const model = getModel();
    const contents: Content[] = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

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
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
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
