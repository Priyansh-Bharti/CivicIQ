/**
 * Election Data Types
 * Standardized interfaces and types for the application's core data structures.
 */

/** Possible statuses for an election phase. */
export type PhaseStatus = 'pending' | 'active' | 'completed';

/** Represents a major stage in the election process. */
export interface ElectionPhase {
  /** Unique identifier for the phase. */
  id: string;
  /** Human-readable name of the phase. */
  name: string;
  /** Typical timeframe or specific date for the phase. */
  duration: string;
  /** Detailed explanation of the phase's purpose. */
  description: string;
  /** Entities or groups involved in this phase. */
  keyActors: string[];
  /** Sequential steps or requirements within the phase. */
  steps: string[];
  /** Current completion status. */
  status: PhaseStatus;
}

/** Represents a single exchange in the AI chat. */
export interface ChatMessage {
  /** Unique identifier for the message. */
  id: string;
  /** The originator of the message. */
  role: 'user' | 'model';
  /** The text content of the message. */
  content: string;
  /** Unix timestamp of when the message was sent. */
  timestamp: number;
  /** Optional context about the election phase being discussed. */
  phaseContext?: string;
}

/** Represents an item in the user's civic preparation checklist. */
export interface ChecklistItem {
  /** Unique identifier for the item. */
  id: string;
  /** Short title of the requirement. */
  title: string;
  /** Detailed description of what needs to be done. */
  description: string;
  /** Completion status. */
  completed: boolean;
  /** Optional external link for more information. */
  link?: string;
}

/** Represents the aggregated progress of a user. */
export interface UserProgress {
  /** The unique ID of the user. */
  userId: string;
  /** Array of completed step identifiers. */
  completedSteps: string[];
  /** Array of completed checklist item identifiers. */
  completedChecklistItems: string[];
  /** The ID of the currently active or last viewed phase. */
  currentPhaseId: string;
}
