import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Seat, SeatTier, Showtime, Venue, Currency } from '../types';
import { formatPrice, formatTimeRemaining, generateSeatsForShowtime } from '../utils/formatters';

interface SeatMap3DProps {
  showtime: Showtime;
  venue: Venue;
  currency: Currency;
  onProceedToFoodOrCheckout: (selectedSeats: Seat[], totalSeatPrice: number) => void;
  onBack: () => void;
}

export const SeatMap3D: React.FC<SeatMap3DProps> = ({
  showtime,
  venue,
  currency,
  onProceedToFoodOrCheckout,
  onBack,
}) => {
  const [seats, setSeats] = useState<Seat[]>(() => generateSeatsForShowtime(showtime));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  
  // Real-time lock state
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(0);
  const [lockError, setLockError] = useState<string | null>(null);
  const [userId] = useState<string>(() => `guest_user_${Math.random().toString(36).substring(2, 8)}`);

  // Periodic simulated seat lock updates from other concurrent users in Redis
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prev) => {
        const copy = [...prev];
        const randomIdx = Math.floor(Math.random() * copy.length);
        const target = copy[randomIdx];
        if (target && !selectedSeatIds.includes(target.id) && target.status !== 'booked') {
          if (target.status === 'available' && Math.random() < 0.15) {
            target.status = 'locked';
            target.lockedBy = 'Another guest online';
          } else if (target.status === 'locked' && Math.random() < 0.3) {
            target.status = 'available';
            target.lockedBy = undefined;
          }
        }
        return copy;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedSeatIds]);

  // Lock countdown timer
  useEffect(() => {
    if (lockTimeRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockTimeRemaining]);

  // Handle lock expiration
  useEffect(() => {
    if (lockTimeRemaining === 0 && selectedSeatIds.length > 0) {
      setSelectedSeatIds([]);
      setLockError('Your 8-minute seat hold has expired. Please re-select your preferred seats.');
    }
  }, [lockTimeRemaining, selectedSeatIds.length]);

  const toggleSeatSelection = async (seat: Seat) => {
    if (seat.status === 'booked') return;
    if (seat.status === 'locked' && seat.lockedBy !== userId && !selectedSeatIds.includes(seat.id)) {
      setLockError(`Seat ${seat.id} is temporarily held by another customer.`);
      setTimeout(() => setLockError(null), 3500);
      return;
    }

    setLockError(null);
    let newSelected: string[];

    if (selectedSeatIds.includes(seat.id)) {
      newSelected = selectedSeatIds.filter((id) => id !== seat.id);
      fetch('/api/seats/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showtimeId: showtime.id, seatIds: [seat.id], userId }),
      }).catch(console.error);
    } else {
      if (selectedSeatIds.length >= 8) {
        setLockError('Maximum 8 tickets allowed per transaction.');
        return;
      }
      newSelected = [...selectedSeatIds, seat.id];
      
      try {
        const res = await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            showtimeId: showtime.id,
            seatIds: [seat.id],
            userId,
            ttlMinutes: 8,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setLockError(data.error || 'Seat conflict detected. Please choose another.');
          return;
        }
        if (lockTimeRemaining === 0) {
          setLockTimeRemaining(8 * 60); // 8 minutes lock
        }
      } catch (err) {
        console.error('Seat lock request failed', err);
      }
    }

    setSelectedSeatIds(newSelected);
  };

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const totalSeatPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // Group seats by rows
  const rows = Array.from(new Set(seats.map((s) => s.row)));

  const getTierColor = (tier: SeatTier, status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-emerald-600 text-white font-bold border-emerald-700 ring-2 ring-emerald-400 shadow-sm scale-110 z-20';
    }
    if (status === 'booked') {
      return 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed';
    }
    if (status === 'locked') {
      return 'bg-amber-100 text-amber-800 border-amber-300 cursor-not-allowed animate-pulse';
    }

    switch (tier) {
      case 'vip':
        return 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 shadow-2xs';
      case 'primePlus':
        return 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300';
      case 'executive':
        return 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300';
      case 'classic':
      default:
        return 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 pb-28 pt-4 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top Navigation & Showtime Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer border border-slate-200"
            >
              &larr; Back
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {venue.name}
                </h2>
                <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono uppercase font-bold">
                  {showtime.format}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {showtime.screenName} • {showtime.date} • <span className="text-rose-600 font-bold">{showtime.time}</span> • {showtime.language}
              </p>
            </div>
          </div>

          {/* 3D vs 2D View Switch & Active Lock Timer */}
          <div className="flex items-center gap-2.5">
            {lockTimeRemaining > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Held: {formatTimeRemaining(lockTimeRemaining)}</span>
              </div>
            )}

            <button
              onClick={() => setIs3DMode(!is3DMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                is3DMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{is3DMode ? '3D Angle' : 'Flat Grid'}</span>
            </button>
          </div>
        </div>

        {/* Lock Error Alert */}
        {lockError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{lockError}</span>
          </div>
        )}

        {/* Screen Arch Representation */}
        <div className="relative py-3 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xl h-10 flex flex-col items-center">
            <div className="w-3/4 h-2.5 rounded-t-full bg-gradient-to-r from-rose-400 via-sky-400 to-rose-400 shadow-sm" />
            <div className="w-4/5 h-1 rounded-t-full bg-slate-300 mt-0.5" />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-1.5 font-semibold">
              Screen This Way
            </span>
          </div>
        </div>

        {/* Interactive Seating Grid Stage */}
        <div 
          className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 relative transition-all duration-500 overflow-x-auto shadow-sm ${
            is3DMode ? 'perspective-[900px]' : ''
          }`}
        >
          <div 
            className={`min-w-[640px] max-w-3xl mx-auto space-y-2.5 transition-transform duration-500 ${
              is3DMode ? 'rotate-x-[20deg] scale-[0.98]' : ''
            }`}
          >
            {rows.map((rowLetter, rIdx) => {
              const rowSeats = seats.filter((s) => s.row === rowLetter);
              const tier = rowSeats[0]?.tier || 'classic';
              const rowPrice = rowSeats[0]?.price || showtime.basePrices.classic;

              return (
                <div key={rowLetter} className="space-y-1">
                  {/* Tier Label Separator on first row of tier */}
                  {(rIdx === 0 || rIdx === 2 || rIdx === 5 || rIdx === 8) && (
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 pb-1 border-b border-slate-100">
                      <span className="uppercase tracking-wider font-bold">
                        {tier === 'vip' && '👑 VIP Recliners'}
                        {tier === 'primePlus' && '⭐ Prime Plus'}
                        {tier === 'executive' && '🎬 Executive'}
                        {tier === 'classic' && '🎟️ Classic'}
                      </span>
                      <span className="font-mono text-slate-700">
                        {formatPrice(rowPrice, currency)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5">
                    {/* Left Row Letter */}
                    <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">
                      {rowLetter}
                    </span>

                    {/* Seat Buttons */}
                    <div className="flex items-center gap-1.5">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const colorClass = getTierColor(seat.tier, seat.status, isSelected);

                        return (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeatSelection(seat)}
                            disabled={seat.status === 'booked'}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold transition flex items-center justify-center border cursor-pointer ${colorClass}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Row Letter */}
                    <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">
                      {rowLetter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">✓</span>
            <span className="font-semibold text-emerald-800">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300" />
            <span>Held</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-200" />
            <span className="text-slate-400">Sold</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      {selectedSeatIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-xl">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                Seats: <span className="font-bold text-slate-900">{selectedSeatIds.join(', ')}</span> ({selectedSeatIds.length})
              </div>
              <div className="text-lg font-black text-rose-600">
                {formatPrice(totalSeatPrice, currency)}
              </div>
            </div>

            <button
              onClick={() => onProceedToFoodOrCheckout(selectedSeats, totalSeatPrice)}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
