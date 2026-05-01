import { create } from 'zustand';
import { ElectionPhase } from '../types/election';
import { ELECTION_PHASES } from '../lib/constants';

interface TimelineState {
  phases: ElectionPhase[];
  activePhaseId: string | null;
  progress: Record<string, boolean>; // phaseId -> completed
  setPhases: (phases: ElectionPhase[]) => void;
  setActivePhaseId: (id: string | null) => void;
  setProgress: (progress: Record<string, boolean>) => void;
  markPhaseComplete: (id: string) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  phases: ELECTION_PHASES,
  activePhaseId: ELECTION_PHASES[0].id,
  progress: {},
  setPhases: (phases) => set({ phases }),
  setActivePhaseId: (id) => set({ activePhaseId: id }),
  setProgress: (progress) => set({ progress }),
  markPhaseComplete: (id) => set((state) => ({
    progress: { ...state.progress, [id]: true }
  })),
}));
