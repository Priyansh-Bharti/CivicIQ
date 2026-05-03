/**
 * Timeline Panel Component
 * Orchestrates the display of election phases, coordinating between the list of nodes and the detail view.
 */

import React, { useEffect } from 'react';
import { TimelineNode } from './TimelineNode';
import { PhaseDetail } from './PhaseDetail';
import { useTimeline } from '../../hooks/useTimeline';
import { getPhaseById } from '../../lib/timelineEngine';
import { trackEvent } from '../../lib/analytics';

interface TimelinePanelProps {
  /** Callback to initiate an AI chat with specific context. */
  onAskCivicIQ: (context: string) => void;
  /** Optional ID of the phase to highlight initially. */
  initialPhaseId?: string;
}

/**
 * Renders a side-by-side view of the timeline nodes and the active phase's details.
 * @param {TimelinePanelProps} props Component properties.
 * @returns {JSX.Element} The rendered timeline panel.
 */
export const TimelinePanel: React.FC<TimelinePanelProps> = ({ onAskCivicIQ, initialPhaseId }): JSX.Element => {
  const { phases, activePhaseId, progress, setActivePhase } = useTimeline();
  
  useEffect(() => {
    if (initialPhaseId) {
      setActivePhase(initialPhaseId);
    }
  }, [initialPhaseId, setActivePhase]);

  const selectedPhase = getPhaseById(activePhaseId || '1', phases) || phases[0];

  useEffect(() => {
    if (selectedPhase) {
      trackEvent('phase_viewed', { 
        phase_id: selectedPhase.id, 
        phase_name: selectedPhase.name 
      });
    }
  }, [selectedPhase?.id, selectedPhase?.name]);

  /**
   * Manages keyboard navigation between timeline nodes.
   * @param {React.KeyboardEvent} e The keyboard event.
   * @param {number} index The current node index.
   */
  const handleKeyDown = (e: React.KeyboardEvent, index: number): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextPhase = phases[Math.min(index + 1, phases.length - 1)];
      setActivePhase(nextPhase.id);
      document.getElementById(`node-${nextPhase.id}`)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevPhase = phases[Math.max(index - 1, 0)];
      setActivePhase(prevPhase.id);
      document.getElementById(`node-${prevPhase.id}`)?.focus();
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-start">
      {/* Timeline List */}
      <div className="space-y-2" role="list" data-testid="timeline-nodes">
        {phases.map((phase, idx) => (
          <TimelineNode
            key={phase.id}
            phase={phase}
            index={idx}
            isActive={activePhaseId === phase.id}
            isCompleted={!!progress[phase.id]}
            onClick={setActivePhase}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      {/* Detail Panel */}
      <div className="lg:sticky lg:top-32 h-[calc(100vh-160px)] min-h-[500px]">
        <PhaseDetail 
          phase={selectedPhase} 
          onAskCivicIQ={onAskCivicIQ} 
        />
      </div>
    </div>
  );
};
