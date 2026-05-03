/**
 * Profile Menu Component
 * Renders the user profile dropdown menu in the navigation bar.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { User } from '../../lib/firebase';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProfileMenuProps {
  /** Current user data. */
  user: User | null;
  /** Callback to initiate sign-out. */
  onSignOut: () => Promise<void>;
}

/**
 * Utility for merging Tailwind CSS classes efficiently.
 * @param {...ClassValue[]} inputs Array of class values.
 * @returns {string} Merged class string.
 */
const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

/**
 * Renders a dropdown menu with user profile actions.
 * @param {ProfileMenuProps} props Component properties.
 * @returns {React.JSX.Element} The rendered profile menu.
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onSignOut }): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User menu"
        className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
      >
        <img src={user?.photoURL || undefined} alt="" className="w-8 h-8 rounded-full border border-white/20" />
        <span className="font-medium">{user?.displayName?.split(' ')[0]}</span>
        <ChevronDown aria-hidden="true" className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-50 transition-colors">
              <UserIcon className="w-4 h-4" /> Profile
            </button>
            <button 
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 transition-colors border-t border-gray-100"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
