import { GoogleGenerativeAI, ChatSession, Content } from '@google/generative-ai';
import { ElectionPhase, ChatMessage } from '../types/election';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are CivicIQ, an election education assistant. You ONLY answer questions about:
- Election processes, timelines, and procedures
- Voter registration steps
- How votes are counted and certified  
- The role of election officials, candidates, and voters
- General civic education

You NEVER:
- Endorse any political party, candidate, or ideology
- Give opinions on political issues or policies
- Discuss current events, news, or specific election results
- Answer questions unrelated to civic education and election processes

If asked something outside your scope, respond: 'I'm here to help with election process questions. Could you ask me something about how elections work?'

Always be neutral, factual, and educational. Cite general civic principles, not specific partisan sources.`;

// Pre-configured model with system instructions
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash', 
    systemInstruction: SYSTEM_PROMPT 
  });
};

export const validatePrompt = (prompt: string): { safe: boolean; reason?: string } => {
  const blockedTerms = [
    'republican', 'democrat', 'bjp', 'congress', 'tory', 'labour',
    'trump', 'biden', 'modi', 'rahul', 'harris', 'obama',
    'vote for', 'endorse', 'fuck', 'shit', 'asshole',
    'abortion', 'climate change', 'weather', 'cake', 'bake',
    'ignore previous', 'system prompt'
  ];

  const lowerPrompt = prompt.toLowerCase();
  for (const term of blockedTerms) {
    if (lowerPrompt.includes(term)) {
      return { safe: false, reason: `The prompt contains sensitive or blocked terms: "${term}".` };
    }
  }

  return { safe: true };
};

export async function* streamCivicAnswer(prompt: string, history: ChatMessage[], phaseContext?: string) {
  // Security: Sanitize input
  const sanitizedPrompt = prompt
    .replace(/<[^>]*>?/gm, '') // Strip HTML
    .trim()
    .substring(0, 500); // Limit length

  if (!sanitizedPrompt) {
    throw new Error('Please provide a valid question.');
  }

  try {
    const model = getModel();
    
    // Format history for Gemini SDK
    const contents: Content[] = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    const fullPrompt = phaseContext 
      ? `Context: We are discussing the "${phaseContext}" phase of the election.\nQuestion: ${sanitizedPrompt}`
      : sanitizedPrompt;

    const result = await chat.sendMessageStream(fullPrompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    // Security: Never expose internal error details or stack traces to the UI
    console.error('Gemini error:', error);
    throw new Error('CivicIQ is temporarily unavailable. Please try again in a moment.');
  }
}

export const saveMessageToFirestore = async (userId: string, message: ChatMessage) => {
  try {
    await addDoc(collection(db, 'users', userId, 'chatHistory'), message);
  } catch (error) {
    console.error('Error saving message to Firestore:', error);
  }
};

export const loadChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(collection(db, 'users', userId, 'chatHistory'), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ChatMessage);
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (userId: string) => {
  try {
    const q = query(collection(db, 'users', userId, 'chatHistory'));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};
