import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { TimelinePanel } from '../components/timeline/TimelinePanel';
import { ChatPanel } from '../components/chat/ChatPanel';
import { useChatStore } from '../store/chatStore';

export const Timeline = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPhaseId = searchParams.get('phase') || undefined;
  const { setIsOpen, setActiveContext } = useChatStore();

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-indigo font-bold mb-6 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-hero text-navy">The election process</h1>
              <span className="bg-indigo text-white text-xs px-3 py-1 rounded-full font-bold">6 PHASES</span>
            </div>
            
            <p className="text-xl text-on-surface/70 leading-relaxed font-body">
              Navigating a national election can feel overwhelming. This interactive guide breaks down the multi-month journey into six distinct stages, helping you track your progress and understand your role in each phase.
            </p>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-lg font-bold text-navy hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share your progress
          </button>
        </div>

        {/* Accessibility Announcement */}
        <div className="sr-only" aria-live="polite">
          Timeline updated. Current phase is active.
        </div>

        <TimelinePanel 
          onAskCivicIQ={(ctx) => {
            setActiveContext(ctx);
            setIsOpen(true);
          }} 
          initialPhaseId={initialPhaseId}
        />

        <ChatPanel />
      </main>
    </div>
  );
};
