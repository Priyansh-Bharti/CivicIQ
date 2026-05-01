import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  Users, 
  Megaphone, 
  Check, 
  BarChart2, 
  Trophy,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ElectionPhase } from '../../types/election';

interface PhaseDetailProps {
  phase: ElectionPhase;
  onAskCivicIQ: (context: string) => void;
}

const IconMap: Record<string, any> = {
  '1': UserCheck,
  '2': Users,
  '3': Megaphone,
  '4': Check,
  '5': BarChart2,
  '6': Trophy,
};

export const PhaseDetail = ({ phase, onAskCivicIQ }: PhaseDetailProps) => {
  const Icon = IconMap[phase.id] || UserCheck;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full"
      >
        <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo/10 rounded-2xl flex items-center justify-center text-indigo">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-hero text-navy">{phase.name}</h2>
              <span className="text-indigo font-bold">{phase.duration}</span>
            </div>
          </div>

          <p className="text-lg text-on-surface/80 leading-relaxed mb-8">
            {phase.description}
          </p>

          <div className="space-y-8">
            {/* Key Actors */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Key Actors</h4>
              <div className="flex flex-wrap gap-2">
                {phase.keyActors.map((actor, idx) => (
                  <span key={idx} className="bg-navy/5 text-navy px-3 py-1 rounded-full text-sm font-medium">
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Steps in this phase</h4>
              <ol className="space-y-4">
                {phase.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-on-surface/90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Important Note */}
            <div className="bg-amber/5 border-l-4 border-amber p-4 flex gap-3">
              <AlertCircle className="text-amber w-5 h-5 shrink-0" />
              <div className="text-sm">
                <span className="font-bold text-navy block mb-1">Important Note</span>
                <p className="text-on-surface/80">
                  Participation in this phase is critical for ensuring your voice is heard in the final results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => onAskCivicIQ(phase.name)}
            className="w-full bg-amber text-navy py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-md"
          >
            <MessageSquare className="w-5 h-5" />
            Ask CivicIQ about this phase
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
