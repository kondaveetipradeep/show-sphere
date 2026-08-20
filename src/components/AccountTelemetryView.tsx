import React from 'react';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Zap, 
  Server, 
  Smartphone, 
  Cpu, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  User,
  Sparkles
} from 'lucide-react';
import { Currency } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

interface AccountTelemetryViewProps {
  currency: Currency;
  onSelectCurrency: (curr: Currency) => void;
  onOpenMetricsModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAIModal: () => void;
  bookedCount: number;
  onOpenWallet: () => void;
}

export const AccountTelemetryView: React.FC<AccountTelemetryViewProps> = ({
  currency,
  onSelectCurrency,
  onOpenMetricsModal,
  onOpenSupabaseModal,
  onOpenAIModal,
  bookedCount,
  onOpenWallet,
}) => {
  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto sm:max-w-3xl space-y-4 animate-in fade-in duration-200">
      {/* Mobile Profile Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rose-950/40">
            PK
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm">Pradeep Kondaveeti</h2>
            <p className="text-[11px] text-slate-400">kondaveetipradeep697@gmail.com</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono border border-rose-500/30">
                VIP Cinephile
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30">
                {bookedCount} Active Passes
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenWallet}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          View Passes
        </button>
      </div>

      {/* Currency Switcher */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Default Currency</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Live Stripe Multi-Currency</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {currencies.map((curr) => {
            const isSelected = currency === curr;
            return (
              <button
                key={curr}
                onClick={() => onSelectCurrency(curr)}
                className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-mono">{curr}</div>
                <div className="text-[9px] text-slate-500">{CURRENCY_RATES[curr].symbol}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Infrastructure & Sync Tools */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Cloud Infrastructure & Live Diagnostics
        </h3>

        {/* 1. Redis Cluster Card */}
        <button
          onClick={onOpenMetricsModal}
          className="w-full p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 flex items-center justify-between transition cursor-pointer text-left group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Activity className="w-5 h-5 group-hover:scale-110 transition" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Redis Distributed Locks</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                  0.7ms Latency
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Sub-millisecond concurrent seat holding engine & cache telemetry</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 2. Supabase Sync Card */}
        <button
          onClick={onOpenSupabaseModal}
          className="w-full p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 flex items-center justify-between transition cursor-pointer text-left group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Database className="w-5 h-5 group-hover:scale-110 transition" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Supabase Cloud Sync & Auth</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-mono">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">PostgreSQL cloud persistence, pass backup & real-time sync</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 3. Gemini 3.7 AI Matchmaker */}
        <button
          onClick={onOpenAIModal}
          className="w-full p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 flex items-center justify-between transition cursor-pointer text-left group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Gemini 3.7 AI Concierge</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono">
                  Smart Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Mood matchmaker, theater finder & live chat assistant</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-4 text-slate-600 text-[11px] font-mono space-y-1">
        <div>ShowSphere Mobile Native v2.8.4</div>
        <div>Built for iOS & Android Mobile PWA</div>
      </div>
    </div>
  );
};
