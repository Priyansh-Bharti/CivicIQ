import { useState, useEffect } from 'react';
import { TimelineNode } from './TimelineNode';
import { PhaseDetail } from './PhaseDetail';
import { useTimeline } from '../../hooks/useTimeline';
import { getPhaseById } from '../../lib/timelineEngine';
import { trackEvent } from '../../lib/analytics';

interface TimelinePanelProps {
  onAskCivicIQ: (context: string) => void;
  initialPhaseId?: string;
}

export const TimelinePanel = ({ onAskCivicIQ, initialPhaseId }: TimelinePanelProps) => {
  const { phases, activePhaseId, progress, setActivePhase } = useTimeline();
  
  useEffect(() => {
    if (initialPhaseId) {
      setActivePhase(initialPhaseId);
    }
  }, [initialPhaseId]);

  const selectedPhase = getPhaseById(activePhaseId || '1', phases) || phases[0];

  useEffect(() => {
    if (selectedPhase) {
      trackEvent('phase_viewed', { 
        phase_id: selectedPhase.id, 
        phase_name: selectedPhase.name 
      });
    }
  }, [selectedPhase?.id]);

  return (
    <div className="grid lg:grid-cols-[1fr_450px] gap-12 items-start">
      {/* Timeline List */}
      <div className="space-y-2">
        {phases.map((phase, idx) => (
          <TimelineNode
            key={phase.id}
            phase={phase}
            index={idx}
            isActive={activePhaseId === phase.id}
            isCompleted={!!progress[phase.id]}
            onClick={setActivePhase}
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
