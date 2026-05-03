/**
 * Main Footer Component
 * Displays branding, navigation links, and attribution at the bottom of every page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the application's footer section.
 * @returns {JSX.Element} The rendered footer.
 */
export const Footer: React.FC = (): JSX.Element => {
  return (
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
  );
};
