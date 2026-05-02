import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon, ChevronDown, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatStore } from '../../store/chatStore';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 7L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17V17.01" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="#F59E0B"/>
  </svg>
);

export const Navbar = () => {
  const { user, signInWithGoogle, signOut, isAuthenticated } = useAuth();
  const { setIsOpen } = useChatStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-navy shadow-md"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber rounded-md px-2">
            <Logo />
            <span className="text-white font-hero text-xl font-bold tracking-tight">CivicIQ</span>
          </Link>

          {/* Right Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <LanguageSwitcher />
            <Link to="/timeline" className="text-white/80 hover:text-white transition-colors font-medium">Timeline</Link>
            <Link to="/checklist" className="text-white/80 hover:text-white transition-colors font-medium">Checklist</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">About</Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-amber text-navy px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              <MessageSquare className="w-4 h-4" />
              Ask CivicIQ
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-expanded={isProfileOpen}
                  aria-label="User menu"
                  className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
                >
                  <img src={user?.photoURL || undefined} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                  <span className="font-medium">{user?.displayName?.split(' ')[0]}</span>
                  <ChevronDown aria-hidden="true" className={cn("w-4 h-4 transition-transform", isProfileOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
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
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="border border-white text-white hover:bg-white/10 px-5 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber"
              >
                Sign in with Google
              </button>
            )}
          </div>

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

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link 
                to="/timeline" 
                className="block text-white/80 py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Timeline
              </Link>
              <Link 
                to="/checklist" 
                className="block text-white/80 py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Checklist
              </Link>
              <Link 
                to="/about" 
                className="block text-white/80 py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <button 
                onClick={() => { setIsOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 bg-amber text-navy px-4 py-3 rounded-lg font-bold"
              >
                <MessageSquare className="w-5 h-5" />
                Ask CivicIQ
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
                    <button 
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left text-error py-2"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}
                    className="w-full border border-white text-white py-3 rounded-md font-medium"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
