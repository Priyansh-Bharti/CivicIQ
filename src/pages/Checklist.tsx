import { useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { ChatPanel } from '../components/chat/ChatPanel';
import { useChecklist } from '../hooks/useChecklist';
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

        <ChatPanel />
      </main>
    </div>
  );
};
