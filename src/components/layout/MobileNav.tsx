/**
 * Mobile Navigation Component
 * Renders the collapsible navigation menu for small screens.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { User } from '../../lib/firebase';
import { useTranslation } from '../../hooks/useTranslation';

interface MobileNavProps {
  /** Visibility state of the mobile menu. */
  isOpen: boolean;
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
  /** Callback to close the mobile menu. */
  onClose: () => void;
}

/**
 * Renders a vertically stacked navigation menu for mobile devices.
 * @param {MobileNavProps} props Component properties.
 * @returns {React.JSX.Element} The rendered mobile navigation.
 */
export const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  isAuthenticated, 
  user, 
  onSignIn, 
  onSignOut, 
  onOpenChat,
  onClose
}): React.JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProtectedClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
      onClose();
    } else {
      onSignIn();
      onClose();
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-navy border-t border-white/10 overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            <button 
              onClick={() => { handleProtectedClick('/timeline'); }} 
              className="block w-full text-left text-white/80 py-2 text-lg"
            >
              {t('nav.timeline')}
            </button>
            <button 
              onClick={() => { handleProtectedClick('/checklist'); }} 
              className="block w-full text-left text-white/80 py-2 text-lg"
            >
              {t('nav.checklist')}
            </button>
            <Link to="/about" className="block text-white/80 py-2 text-lg" onClick={onClose}>About</Link>
            <button 
              onClick={() => { onOpenChat(); onClose(); }}
              className="w-full flex items-center gap-3 bg-amber text-navy px-4 py-3 rounded-lg font-bold"
            >
              <MessageSquare className="w-5 h-5" />
              {t('nav.askCivicIQ')}
            </button>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-white">
                    <img src={user?.photoURL || undefined} alt="" className="w-10 h-10 rounded-full" />
                    <span className="font-medium text-lg">{user?.displayName}</span>
                  </div>
                  <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left text-error py-2">
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onSignIn(); onClose(); }}
                  className="w-full border border-white text-white py-3 rounded-md font-medium"
                >
                  {t('nav.signIn')}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
