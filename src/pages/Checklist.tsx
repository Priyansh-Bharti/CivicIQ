import { useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { ChatPanel } from '../components/chat/ChatPanel';
import { useChecklist } from '../hooks/useChecklist';
import { useChatStore } from '../store/chatStore';
import { ChecklistItem } from '../components/checklist/ChecklistItem';
import { ProgressRing } from '../components/checklist/ProgressRing';
import { trackEvent } from '../lib/analytics';

export const Checklist = () => {
  const { items, toggleItem, completionPercentage, completedCount, totalCount } = useChecklist();

  useEffect(() => {
    trackEvent('page_viewed', { page_name: 'Checklist' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-navy text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="max-w-xl relative z-10">
              <h1 className="text-4xl md:text-5xl font-hero mb-4">Your Civic Readiness</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Voting is a process, not just a day. Work through this checklist to ensure you're fully prepared and informed before heading to the polls.
              </p>
            </div>

            <div className="relative z-10 shrink-0 bg-white p-4 rounded-2xl shadow-lg">
              <ProgressRing percentage={completionPercentage} />
              <p className="text-center text-navy font-bold text-sm mt-2 uppercase tracking-widest">
                {completedCount} of {totalCount}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-4">
            {items.map(item => (
              <ChecklistItem 
                key={item.id} 
                item={item} 
                onToggle={toggleItem} 
              />
            ))}
          </div>
        </div>

        {/* Missed Deadline Feature */}
        <section className="bg-amber/5 border border-amber/20 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-amber/10 p-4 rounded-xl">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-hero text-navy mb-2">Missed a deadline?</h2>
              <p className="text-on-surface/70 text-sm mb-4">
                Don't worry, many election processes have contingency plans. Select a phase below to see what steps you can still take.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Voter Registration', 'Mail-in Request', 'Election Day'].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => {
                      const { setIsOpen, setActiveContext } = useChatStore.getState();
                      setActiveContext(`I missed the ${phase} deadline. What can I do now?`);
                      setIsOpen(true);
                    }}
                    className="bg-white border border-amber/30 px-4 py-2 rounded-lg text-xs font-bold text-navy hover:bg-amber/10 transition-colors shadow-sm"
                  >
                    Missed {phase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ChatPanel />
      </main>
    </div>
  );
};
