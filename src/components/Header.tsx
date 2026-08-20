import React, { useState } from 'react';
import { 
  Film, 
  MapPin, 
  Search, 
  Sparkles, 
  Ticket, 
  ChevronDown,
  X,
  User
} from 'lucide-react';
import { Currency, Language, CustomerUser } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { MobileTab } from './MobileBottomNav';

interface HeaderProps {
  currentCity: string;
  onOpenCityDrawer: () => void;
  userLocation: any;
  isLocating: boolean;
  onDetectLocation: () => void;
  getDistanceToCity?: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  currency: Currency;
  onSelectCurrency: (curr: Currency) => void;
  bookedTicketsCount: number;
  onOpenWallet: () => void;
  onOpenAIConcierge: () => void;
  activeTab?: MobileTab;
  onSelectTab?: (tab: MobileTab) => void;
  currentUser?: CustomerUser | null;
  onOpenLogin?: () => void;
  onOpenProfile?: () => void;
  onOpenMetrics?: () => void;
  onOpenSupabase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCityDrawer,
  searchQuery,
  onSearchChange,
  currency,
  onSelectCurrency,
  bookedTicketsCount,
  onOpenWallet,
  onOpenAIConcierge,
  activeTab = 'explore',
  onSelectTab,
  currentUser,
  onOpenLogin,
  onOpenProfile,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showCurrDropdown, setShowCurrDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Primary Top Bar (Edge-to-Edge) */}
      <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-100">
        {/* Left: Brand Logo & City Picker */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={() => onSelectTab && onSelectTab('explore')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 hidden xs:inline">
              ShowSphere
            </span>
          </div>

          {/* City Selection Capsule */}
          <button
            onClick={onOpenCityDrawer}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="max-w-[85px] sm:max-w-[120px] truncate">{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
          </button>
        </div>

        {/* Center: Search Bar on Tablet & Desktop */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, languages, theaters, cast..."
              className="w-full bg-slate-100 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="md:hidden w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Movie Recommendation Assistant Button */}
          <button
            onClick={onOpenAIConcierge}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Ask AI Movie Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">AI Match</span>
          </button>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrDropdown(!showCurrDropdown)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <span>{currency}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
            </button>

            {showCurrDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1">
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCurrency(c);
                      setShowCurrDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                      currency === c ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-slate-400">{CURRENCY_RATES[c].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* My Tickets Button */}
          <button
            onClick={() => {
              if (onSelectTab) onSelectTab('passes');
              onOpenWallet();
            }}
            className="relative w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="My Tickets"
          >
            <Ticket className="w-4 h-4" />
            {bookedTicketsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow">
                {bookedTicketsCount}
              </span>
            )}
          </button>

          {/* User Sign In / Profile Avatar */}
          {currentUser?.isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition cursor-pointer"
              title="Customer Profile"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-xs font-bold hidden sm:inline truncate max-w-[80px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Search Input for Mobile */}
      {showSearchInput && (
        <div className="md:hidden px-3 py-2 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, languages, cast..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
