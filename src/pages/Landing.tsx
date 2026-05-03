/**
 * Landing Page Component
 * Serves as the primary entry point for the application, highlighting key features and the mission statement.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  MessageSquare, 
  CheckSquare, 
  Shield, 
  Cloud, 
  Zap 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureCard } from '../components/landing/FeatureCard';
import { JourneySection } from '../components/landing/JourneySection';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

/**
 * Main Landing page component.
 * @returns {React.JSX.Element} The rendered landing page.
 */
export const Landing: React.FC = (): React.JSX.Element => {
  const { isAuthenticated, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main id="main-content" className="flex-grow">
        <HeroSection isAuthenticated={isAuthenticated} onSignIn={signInWithGoogle} />
        
        {/* Feature Cards Section */}
        <section id="features" aria-label="Features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              <FeatureCard 
                icon={<CalendarDays className="w-10 h-10 text-indigo" aria-hidden="true" />}
                title="Interactive timeline"
                description="Follow every election phase step by step, with plain-language explanations."
                delay={0}
              />
              <FeatureCard 
                icon={<MessageSquare className="w-10 h-10 text-indigo" aria-hidden="true" />}
                title="Ask CivicIQ"
                description="Get instant answers about any part of the process, powered by Gemini AI."
                delay={0.1}
              />
              <FeatureCard 
                icon={<CheckSquare className="w-10 h-10 text-indigo" aria-hidden="true" />}
                title="Civic readiness"
                description="Track your personal checklist so you are fully prepared on election day."
                delay={0.2}
              />
            </motion.div>
          </div>
        </section>

        <JourneySection isAuthenticated={isAuthenticated} onSignIn={signInWithGoogle} />

        {/* Tech Stack / Trust Bar */}
        <section aria-label="Technologies used" className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Zap className="w-5 h-5 text-indigo" aria-hidden="true" /> Gemini 2.0 Flash
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Cloud className="w-5 h-5 text-indigo" aria-hidden="true" /> Firebase
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Shield className="w-5 h-5 text-indigo" aria-hidden="true" /> Google Cloud Run
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Shield className="w-5 h-5 text-indigo" aria-hidden="true" /> WCAG 2.1 AA
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
