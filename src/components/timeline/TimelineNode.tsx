/**
 * Timeline Node Component
 * Renders an individual node in the election process timeline, reflecting its current state (active, completed, or pending).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ElectionPhase } from '../../types/election';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes efficiently.
 * @param {...ClassValue[]} inputs Array of class values.
 * @returns {string} Merged class string.
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface TimelineNodeProps {
  /** The election phase data. */
  phase: ElectionPhase;
  /** The sequential index of the phase. */
  index: number;
  /** Indicates if this phase is currently selected. */
  isActive: boolean;
  /** Indicates if the user has completed this phase. */
  isCompleted: boolean;
  /** Callback to handle phase selection. */
  onClick: (id: string) => void;
  /** Optional keyboard event handler for navigation. */
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

/**
 * Renders a stylized indicator and label for a timeline phase.
 * @param {TimelineNodeProps} props Component properties.
 * @returns {React.JSX.Element} The rendered timeline node.
 */
export const TimelineNode: React.FC<TimelineNodeProps> = ({ 
  phase, 
  index, 
  isActive, 
  isCompleted, 
  onClick, 
  onKeyDown 
}): React.JSX.Element => {
  return (
    <div 
      id={`node-${phase.id}`}
      className="relative flex gap-6 pb-12 last:pb-0 group"
      role="listitem"
      tabIndex={0}
      onClick={() => onClick(phase.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(phase.id);
        }
        if (onKeyDown) {
          onKeyDown(e);
        }
      }}
      aria-label={`Phase ${index + 1}: ${phase.name}, ${isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}`}
      aria-current={isActive ? 'step' : undefined}
    >
      {/* Connector Line */}
      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200 group-last:hidden" />

      {/* Indicator Circle */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={cn(
          "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
          isCompleted 
            ? "bg-emerald border-emerald text-white" 
            : isActive 
              ? "bg-white border-indigo text-indigo" 
              : "bg-white border-gray-300 text-gray-400"
        )}
      >
        {isCompleted ? (
          <Check className="w-6 h-6" />
        ) : isActive ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-indigo/20"
            />
            <span className="text-lg font-bold">{index + 1}</span>
          </>
        ) : (
          <span className="text-lg font-bold">{index + 1}</span>
        )}
      </motion.div>

      {/* Phase Info */}
      <div className={cn(
        "flex flex-col gap-1 transition-opacity",
        !isActive && !isCompleted && "opacity-60 group-hover:opacity-100"
      )}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-indigo uppercase tracking-wider">{phase.duration}</span>
          {isCompleted && (
            <span className="bg-emerald/10 text-emerald text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Completed</span>
          )}
          {isActive && (
            <span className="bg-indigo/10 text-indigo text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
          )}
        </div>
        <h3 className={cn(
          "text-xl font-hero transition-colors",
          isActive ? "text-navy" : "text-on-surface"
        )}>
          {phase.name}
        </h3>
      </div>
    </div>
  );
};
