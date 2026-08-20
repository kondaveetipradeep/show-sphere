import React from 'react';
import { Film, MapPin, Ticket } from 'lucide-react';

export type MobileTab = 'explore' | 'theaters' | 'passes' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  ticketCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  ticketCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-3">
        {/* Tab 1: Movies (Explore) */}
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'explore'
              ? 'text-rose-600 font-bold bg-rose-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Movies</span>
        </button>

        {/* Tab 2: Cinemas */}
        <button
          onClick={() => onSelectTab('theaters')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'theaters'
              ? 'text-rose-600 font-bold bg-rose-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Cinemas</span>
        </button>

        {/* Tab 3: My Tickets */}
        <button
          onClick={() => onSelectTab('passes')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl relative transition cursor-pointer ${
            activeTab === 'passes'
              ? 'text-rose-600 font-bold bg-rose-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Ticket className="w-5 h-5 mb-0.5" />
            {ticketCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                {ticketCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">My Tickets</span>
        </button>
      </div>
    </nav>
  );
};
