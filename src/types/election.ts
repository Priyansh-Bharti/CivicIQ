export type PhaseStatus = 'pending' | 'active' | 'completed';

export interface ElectionPhase {
  id: string;
  name: string;
  duration: string;
  description: string;
  keyActors: string[];
  steps: string[];
  status: PhaseStatus;
}

export interface TimelineState {
  phases: ElectionPhase[];
  currentPhaseId: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  phaseContext?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link?: string;
}

export interface UserProgress {
  userId: string;
  completedSteps: string[]; // step names or IDs
  completedChecklistItems: string[];
  currentPhaseId: string;
}
