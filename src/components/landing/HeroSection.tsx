/**
 * Hero Section Component
 * Renders the primary landing page hero area with mission statement and primary call-to-actions.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

interface HeroSectionProps {
  /** Authentication status. */
  isAuthenticated?: boolean;
  /** Callback to initiate sign-in. */
  onSignIn?: () => Promise<void>;
  /** Callback to start the user journey. */
  onStartJourney?: () => void;
}

/**
 * Renders the main hero area of the landing page.
 * Respects prefers-reduced-motion for accessibility.
 * @returns {React.JSX.Element} The rendered hero section.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ 
  isAuthenticated, 
  onSignIn, 
  onStartJourney 
}): React.JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Respect user's OS-level animation preference (defensive for SSR/test environments)
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    []
  );

  const containerVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { staggerChildren: 0.1 }
    }
  }), [prefersReducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 }
    }
  }), [prefersReducedMotion]);

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
            {t('hero.title').split('understanding').length > 1 ? (
              <>
                Democracy starts with <br />
                <span className="text-amber">understanding.</span>
              </>
            ) : t('hero.title')}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-body"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
          >
            <button 
              onClick={handleAction}
              className="bg-amber text-navy px-8 py-4 rounded-md font-bold text-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber"
            >
              {t('hero.cta.explore')}
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })}
              className="border border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              {t('hero.cta.howItWorks')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
