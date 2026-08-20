import React, { useEffect } from 'react';
import { 
  Ticket, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  X, 
  UtensilsCrossed,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, Currency } from '../types';

interface TicketPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  allBookings?: Booking[];
  onSelectBooking?: (booking: Booking) => void;
  currency?: Currency;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  isOpen,
  onClose,
  booking,
  allBookings = [],
  onSelectBooking,
}) => {
  useEffect(() => {
    if (isOpen && booking) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#0284c7', '#f59e0b', '#10b981'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-slate-900">
        {/* Top Status Bar */}
        <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Booking Confirmed & Seats Allocated</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Ticket Selector Tabs if user has multiple tickets */}
        {allBookings.length > 1 && (
          <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {allBookings.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => onSelectBooking && onSelectBooking(b)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  b.id === booking.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Ticket #{idx + 1}: {b.media.title.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Digital Boarding Pass Ticket */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Cinema Header */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 relative overflow-hidden shadow-2xs">
            <div className="flex gap-3">
              <img
                src={booking.media.posterUrl}
                alt={booking.media.title}
                className="w-16 h-24 rounded-xl object-cover shadow-xs border border-slate-200"
              />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold uppercase">
                    {booking.showtime.format}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {booking.showtime.language}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  {booking.media.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="line-clamp-1">{booking.venue.name}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {booking.showtime.screenName}
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative py-1 flex items-center">
              <div className="absolute -left-6 w-4 h-4 rounded-full bg-white border-r border-slate-200" />
              <div className="w-full border-t border-dashed border-slate-300" />
              <div className="absolute -right-6 w-4 h-4 rounded-full bg-white border-l border-slate-200" />
            </div>

            {/* Show info & Seats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Date</div>
                <div className="font-bold text-xs text-slate-900 mt-0.5">{booking.showtime.date}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Time</div>
                <div className="font-bold text-xs text-rose-600 mt-0.5">{booking.showtime.time}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Seats</div>
                <div className="font-bold text-xs text-emerald-700 font-mono mt-0.5">
                  {booking.seats.map((s) => s.id).join(', ')}
                </div>
              </div>
            </div>

            {/* Food Addons List if any */}
            {booking.foodItems.length > 0 && (
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <UtensilsCrossed className="w-3 h-3 text-rose-500" />
                  <span>Concessions Seat Delivery:</span>
                </div>
                <div className="text-slate-700 font-medium">
                  {booking.foodItems.map((f) => `${f.quantity}x ${f.item.name}`).join(' • ')}
                </div>
              </div>
            )}

            {/* QR Code and Barcode Box */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Booking ID</div>
                <div className="font-mono font-extrabold text-sm text-slate-900">{booking.bookingCode}</div>
                <div className="text-[10px] text-slate-500">Scan at entrance turnstile</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 p-1 rounded-lg border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-rose-200"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
