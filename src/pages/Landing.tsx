import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  MessageSquare, 
  CheckSquare, 
  ArrowRight, 
  Shield, 
  Cloud, 
  Zap 
} from 'lucide-react';
import { ELECTION_PHASES } from '../lib/constants';
import { Navbar } from '../components/layout/Navbar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
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

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
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
                onClick={() => navigate('/timeline')}
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

      {/* Feature Cards Section */}
      <section id="features" aria-label="Features" className="py-24 bg-background">
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
            />
            <FeatureCard 
              icon={<MessageSquare className="w-10 h-10 text-indigo" aria-hidden="true" />}
              title="Ask CivicIQ"
              description="Get instant answers about any part of the process, powered by Gemini AI."
            />
            <FeatureCard 
              icon={<CheckSquare className="w-10 h-10 text-indigo" aria-hidden="true" />}
              title="Civic readiness"
              description="Track your personal checklist so you are fully prepared on election day."
            />
          </motion.div>
        </div>
      </section>

      {/* Mini Timeline Strip */}
      <section aria-labelledby="journey-heading" className="py-20 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="journey-heading" className="text-center text-sm font-bold text-indigo uppercase tracking-[0.2em] mb-10">Your election journey</h2>
          
          <div className="relative">
            <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth" role="list">
              {ELECTION_PHASES.map((phase, idx) => (
                <div key={phase.id} className="flex items-center gap-4 shrink-0" role="listitem">
                  <button
                    onClick={() => navigate('/timeline', { state: { phaseId: phase.id } })}
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

      {/* Trust Bar */}
      <section aria-label="Technologies used" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Zap className="w-5 h-5" aria-hidden="true" /> Gemini AI
            </div>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Cloud className="w-5 h-5" aria-hidden="true" /> Firebase
            </div>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Shield className="w-5 h-5" aria-hidden="true" /> Google Cloud Run
            </div>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Shield className="w-5 h-5" aria-hidden="true" /> WCAG 2.1 AA
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber rounded-sm flex items-center justify-center font-bold text-navy">C</div>
                <span className="text-2xl font-hero font-bold">CivicIQ</span>
              </div>
              <p className="text-white/60 max-w-md font-body">
                CivicIQ is an educational platform dedicated to making the democratic process accessible to every citizen.
              </p>
            </div>
            <div className="md:text-right">
              <div className="flex md:justify-end gap-8 mb-8">
                <Link to="/timeline" className="text-white/80 hover:text-white">Timeline</Link>
                <Link to="/checklist" className="text-white/80 hover:text-white">Checklist</Link>
                <Link to="/about" className="text-white/80 hover:text-white">About</Link>
              </div>
              <p className="text-sm text-white/40">
                Built for the Hack2Skill PromptWars Competition
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    variants={itemVariants}
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

// Simple internal Link mock if needed, but we use useNavigate/native a mostly.
// Actually Link is from react-router-dom
import { Link } from 'react-router-dom';
