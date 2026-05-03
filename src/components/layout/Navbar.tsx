/**
 * Main Navigation Component
 * Orchestrates the application's header, including branding and responsive navigation menus.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatStore } from '../../store/chatStore';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

/**
 * Renders the application logo.
 */
const Logo: React.FC = (): JSX.Element => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 7L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V17.01" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="#F59E0B"/>
  </svg>
);

/**
 * Main Navbar component with responsive behaviors.
 * @returns {JSX.Element} The rendered navbar.
 */
export const Navbar: React.FC = (): JSX.Element => {
  const { user, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { setIsOpen } = useChatStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-navy shadow-md"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber rounded-md px-2">
            <Logo />
            <span className="text-white font-hero text-xl font-bold tracking-tight">CivicIQ</span>
          </Link>

          <DesktopNav 
            isAuthenticated={isAuthenticated} 
            user={user} 
            onSignIn={signInWithGoogle} 
            onSignOut={signOut} 
            onOpenChat={() => setIsOpen(true)} 
          />

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-amber rounded-md"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <MobileNav 
        isOpen={isMobileMenuOpen} 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onSignIn={signInWithGoogle} 
        onSignOut={signOut} 
        onOpenChat={() => setIsOpen(true)}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </motion.nav>
  );
};
