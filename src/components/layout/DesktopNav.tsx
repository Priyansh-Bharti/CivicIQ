/**
 * Desktop Navigation Component
 * Renders the navigation links and user profile menu for desktop screens.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ProfileMenu } from './ProfileMenu';
import { User } from '../../lib/firebase';

interface DesktopNavProps {
  /** Authentication status. */
  isAuthenticated: boolean;
  /** Current user data. */
  user: User | null;
  /** Callback to initiate sign-in. */
  onSignIn: () => Promise<void>;
  /** Callback to initiate sign-out. */
  onSignOut: () => Promise<void>;
  /** Callback to open the AI chat panel. */
  onOpenChat: () => void;
}

/**
 * Renders the horizontal navigation bar for large screens.
 * @param {DesktopNavProps} props Component properties.
 * @returns {React.JSX.Element} The rendered desktop navigation.
 */
export const DesktopNav: React.FC<DesktopNavProps> = ({ 
  isAuthenticated, 
  user, 
  onSignIn, 
  onSignOut, 
  onOpenChat 
}): React.JSX.Element => {
  return (
    <div className="hidden md:flex items-center gap-8">
      <LanguageSwitcher />
      <Link to="/timeline" className="text-white/80 hover:text-white transition-colors font-medium">Timeline</Link>
      <Link to="/checklist" className="text-white/80 hover:text-white transition-colors font-medium">Checklist</Link>
      <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">About</Link>
      <button 
        onClick={onOpenChat}
        className="flex items-center gap-2 bg-amber text-navy px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
      >
        <MessageSquare className="w-4 h-4" />
        Ask CivicIQ
      </button>
      
      {isAuthenticated ? (
        <ProfileMenu user={user} onSignOut={onSignOut} />
      ) : (
        <button
          onClick={onSignIn}
          className="border border-white text-white hover:bg-white/10 px-5 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};
