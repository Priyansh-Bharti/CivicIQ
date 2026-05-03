/**
 * Hero Section Component
 * Renders the primary landing page hero area with mission statement and primary call-to-actions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  /** Authentication status. */
  isAuthenticated?: boolean;
  /** Callback to initiate sign-in. */
  onSignIn?: () => Promise<void>;
  /** Callback to start the user journey. */
  onStartJourney?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Renders the main hero area of the landing page.
 * @returns {React.JSX.Element} The rendered hero section.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ 
  isAuthenticated, 
  onSignIn, 
  onStartJourney 
}): React.JSX.Element => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (isAuthenticated) {
      navigate('/timeline');
    } else if (onSignIn) {
      onSignIn();
    } else {
      navigate('/timeline');
    }
  };

  return (
    <section aria-labelledby="hero-heading" className="bg-navy min-h-[90vh] flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h1 
            id="hero-heading"
            variants={itemVariants}
            className="text-5xl md:text-7xl font-hero text-white leading-tight"
          >
            Democracy starts with <br />
            <span className="text-amber">understanding.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-body"
          >
            CivicIQ guides you through every step of the election process — from voter registration to final results.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
          >
            <button 
              onClick={handleAction}
              className="bg-amber text-navy px-8 py-4 rounded-md font-bold text-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber"
            >
              Explore the process
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              How it works
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
