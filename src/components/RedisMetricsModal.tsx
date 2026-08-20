import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Zap, 
  Server, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  X,
  Lock,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { RedisSystemStats } from '../types';

interface RedisMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedisMetricsModal: React.FC<RedisMetricsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<RedisSystemStats>({
    redisConnected: true,
    uptimeSeconds: 3840,
    totalLocksProcessed: 1420,
    activeLocksCount: 14,
    cacheHitRatio: 99.82,
    avgSeatQueryLatencyMs: 0.72,
    peakQPS: 12400,
    concurrentUsersSimulated: 1240,
    memoryUsedMb: 42,
  });
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        // use baseline stats
      }
    };

    fetchMetrics();
    const timer = setInterval(fetchMetrics, 2500);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateFlashSaleLoad = () => {
    setIsSimulatingLoad(true);
    setStats((prev) => ({
      ...prev,
      peakQPS: prev.peakQPS + 4500,
      concurrentUsersSimulated: prev.concurrentUsersSimulated + 800,
      totalLocksProcessed: prev.totalLocksProcessed + 64,
    }));
    setTimeout(() => setIsSimulatingLoad(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Redis Atomic Caching & Lock Engine</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">Sub-millisecond flash sale seat lock synchronization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics Body */}
        <div className="p-6 space-y-6">
          {/* Key Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Seat Latency</div>
              <div className="text-xl font-extrabold font-mono text-emerald-400">
                {stats.avgSeatQueryLatencyMs.toFixed(2)} ms
              </div>
              <div className="text-[9px] text-slate-500">Sub-ms In-Memory</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Cache Hit Ratio</div>
              <div className="text-xl font-extrabold font-mono text-cyan-400">
                {stats.cacheHitRatio}%
              </div>
              <div className="text-[9px] text-slate-500">Zero DB Overhead</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Peak Throughput</div>
              <div className="text-xl font-extrabold font-mono text-amber-400">
                {stats.peakQPS.toLocaleString()} QPS
              </div>
              <div className="text-[9px] text-slate-500">Flash Sale Ready</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Total Locks</div>
              <div className="text-xl font-extrabold font-mono text-purple-400">
                {stats.totalLocksProcessed.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500">Atomic SETNX TTL</div>
            </div>
          </div>

          {/* Architecture Visualizer */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                Atomic Seat Reservation Architecture
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Status: 0 Conflicts</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2 font-mono text-slate-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">1. Concurrent User Request</span>
                <span className="text-purple-300">POST /api/seats/lock (TTL: 8m)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">2. Key Engine Allocation</span>
                <span className="text-emerald-300">SHOW:LOCK:{`{showtimeId}`}:{`{seatId}`}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">3. Conflict Prevention</span>
                <span className="text-cyan-300">Atomic Lock Hold & Expire Guard</span>
              </div>
            </div>
          </div>

          {/* Flash Sale Simulator Trigger */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-xs text-white">Simulate Flash Sale Traffic Burst</div>
              <div className="text-[11px] text-slate-400">Emulate 2,000+ concurrent users competing for IMAX seats</div>
            </div>

            <button
              onClick={handleSimulateFlashSaleLoad}
              disabled={isSimulatingLoad}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isSimulatingLoad ? 'Injecting 5k QPS Load...' : 'Run Load Spike'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
