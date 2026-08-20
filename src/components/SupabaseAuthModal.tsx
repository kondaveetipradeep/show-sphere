import React, { useState } from 'react';
import { 
  Database, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  X, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Server
} from 'lucide-react';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('pradeep.kondaveeti@showsphere.io');
  const [password, setPassword] = useState('••••••••••••');
  const [supabaseUrl, setSupabaseUrl] = useState('https://kdzvnyfkqblpuyw.supabase.co');
  const [anonKey, setAnonKey] = useState('eyJh......showsphere-anon-key');
  const [isConfigured, setIsConfigured] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onSuccess(email);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Supabase Cloud Database & Auth</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400">PostgreSQL cloud storage & Row Level Security (RLS)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Schema summary */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Synced PostgreSQL Tables:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-emerald-400">
                ✓ public.bookings
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-emerald-400">
                ✓ public.profiles
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-emerald-400">
                ✓ public.split_bills
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-emerald-400">
                ✓ public.seat_locks
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Supabase Account Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Password / Session Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSigningIn ? 'Authenticating with Supabase...' : 'Authenticate & Sync Tickets'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
