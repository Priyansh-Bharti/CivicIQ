/**
 * Feature Card Component
 * Renders an individual feature highlight with an icon and description.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  /** Icon element to display in the card. */
  icon: React.ReactNode;
  /** Primary title of the feature. */
  title: string;
  /** Detailed description of the feature. */
  description: string;
  /** Animation delay for stagger effects. */
  delay?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Renders a stylized feature card with hover animations.
 * @param {FeatureCardProps} props Component properties.
 * @returns {React.JSX.Element} The rendered feature card.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }): React.JSX.Element => (
  <motion.div 
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay}
    className="bg-white p-10 rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
  >
    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-navy mb-4">{title}</h2>
    <p className="text-on-surface/70 leading-relaxed font-body">
      {description}
    </p>
  </motion.div>
);
