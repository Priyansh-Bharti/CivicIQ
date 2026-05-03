/**
 * Journey Section Component
 * Renders an interactive horizontal scroll list of election phases.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ELECTION_PHASES } from '../../constants';

interface JourneySectionProps {
  /** Authentication status. */
  isAuthenticated?: boolean;
  /** Callback to initiate sign-in. */
  onSignIn?: () => Promise<void>;
}

/**
 * Renders a mini-timeline strip highlighting the user's election journey.
 * @returns {React.JSX.Element} The rendered journey section.
 */
export const JourneySection: React.FC<JourneySectionProps> = ({ 
  isAuthenticated, 
  onSignIn 
}): React.JSX.Element => {
  const navigate = useNavigate();

  const handlePhaseClick = (phaseId: string) => {
    if (isAuthenticated) {
      navigate('/timeline', { state: { phaseId } });
    } else if (onSignIn) {
      onSignIn();
    } else {
      navigate('/timeline');
    }
  };

  return (
    <section aria-labelledby="journey-heading" className="py-20 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="journey-heading" className="text-center text-sm font-bold text-indigo uppercase tracking-[0.2em] mb-10">
          Your election journey
        </h2>
        
        <div className="relative">
          <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth" role="list">
            {ELECTION_PHASES.map((phase, idx) => (
              <div key={phase.id} className="flex items-center gap-4 shrink-0" role="listitem">
                <button
                  onClick={() => { handlePhaseClick(phase.id); }}
                  className="bg-indigo text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-indigo/90 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo"
                >
                  {phase.name}
                </button>
                {idx < ELECTION_PHASES.length - 1 && (
                  <ArrowRight className="text-gray-300 w-5 h-5 shrink-0" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
