import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Translate } from '../components/ui/Translate';
import { Shield, Users, Lightbulb, CheckCircle } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-navy py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-hero font-bold text-white mb-6">
              <Translate text="Empowering Every Voter" />
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              <Translate text="CivicIQ is a non-partisan platform dedicated to making the complex world of elections simple, accessible, and transparent for everyone." />
            </p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-hero font-bold text-navy mb-6">
                <Translate text="Our Mission" />
              </h2>
              <p className="text-lg text-on-surface/80 mb-6 leading-relaxed">
                <Translate text="We believe that a healthy democracy depends on an informed electorate. CivicIQ provides clear, factual, and verified information about election processes, helping you navigate the journey from registration to results." />
              </p>
              <div className="space-y-4">
                {[
                  "Non-partisan and neutral information",
                  "Verified election procedures",
                  "Accessible and multilingual support",
                  "Privacy-first data handling"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-emerald w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-navy">
                      <Translate text={item} />
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-navy/5 rounded-3xl p-8 border border-navy/10"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Trusted", desc: "Official data" },
                  { icon: Users, title: "Inclusive", desc: "For everyone" },
                  { icon: Lightbulb, title: "Clear", desc: "No jargon" },
                  { icon: CheckCircle, title: "Actionable", desc: "Step-by-step" }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-white rounded-2xl shadow-sm">
                    <stat.icon className="w-8 h-8 text-amber mx-auto mb-2" />
                    <h3 className="font-bold text-navy"><Translate text={stat.title} /></h3>
                    <p className="text-xs text-on-surface/60"><Translate text={stat.desc} /></p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI & Innovation */}
        <section className="bg-navy/5 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-hero font-bold text-navy mb-8">
              <Translate text="Official Alignment & Standards" />
            </h2>
            <p className="text-lg text-on-surface/80 mb-10 leading-relaxed">
              <Translate text="CivicIQ is built in alignment with the Election Commission of India (ECI) procedures to ensure procedural accuracy. Our platform is strictly compliant with WCAG 2.1 AA standards, ensuring a truly inclusive experience for all users." />
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-navy/10 shadow-sm">
                <span className="w-3 h-3 bg-emerald rounded-full" />
                <span className="font-bold text-navy uppercase tracking-wider text-sm">
                  <Translate text="ECI Procedure Aligned" />
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-navy/10 shadow-sm">
                <span className="w-3 h-3 bg-amber rounded-full" />
                <span className="font-bold text-navy uppercase tracking-wider text-sm">
                  <Translate text="WCAG 2.1 AA Compliant" />
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy py-12 px-4 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-white/60">
          <p>© 2026 CivicIQ. <Translate text="Not an official government website. Verified for educational purposes only." /></p>
        </div>
      </footer>
    </div>
  );
};
