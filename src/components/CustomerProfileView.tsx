import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Ticket, 
  Sparkles, 
  CreditCard, 
  Bell, 
  Heart, 
  ChevronRight, 
  Edit3, 
  Check, 
  Gift, 
  Film, 
  ShieldCheck, 
  Layers,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  LogOut,
  LogIn
} from 'lucide-react';
import { Booking, Currency, CustomerUser } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

interface CustomerProfileViewProps {
  currentCity: string;
  currentUser: CustomerUser | null;
  userBookings: Booking[];
  currency: Currency;
  onClose?: () => void;
  onOpenTickets: () => void;
  onSelectBookingTicket?: (booking: Booking) => void;
  onExploreMovies: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onUpdateUser?: (updated: CustomerUser) => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  currentCity,
  currentUser,
  userBookings,
  currency,
  onClose,
  onOpenTickets,
  onSelectBookingTicket,
  onExploreMovies,
  onOpenLogin,
  onLogout,
  onUpdateUser,
}) => {
  // User Profile State
  const [name, setName] = useState(currentUser?.name || 'Pradeep Kondaveeti');
  const [email, setEmail] = useState(currentUser?.email || 'kondaveetipradeep697@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [preferredFormat, setPreferredFormat] = useState(currentUser?.preferredFormat || 'Laser IMAX');
  const [preferredSeating, setPreferredSeating] = useState(currentUser?.preferredSeating || 'Row E-G (Center)');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      if (currentUser.preferredFormat) setPreferredFormat(currentUser.preferredFormat);
      if (currentUser.preferredSeating) setPreferredSeating(currentUser.preferredSeating);
    }
  }, [currentUser]);

  // Notification Preferences
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  const rate = CURRENCY_RATES[currency] || 1;
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : 'AED ';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);

    if (currentUser && onUpdateUser) {
      const updated: CustomerUser = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredFormat,
        preferredSeating
      };
      onUpdateUser(updated);
      try {
        localStorage.setItem('showsphere_customer_user', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const loyaltyPoints = currentUser?.loyaltyPoints || 1450;
  const loyaltyValue = Math.round((loyaltyPoints / 10) * rate);

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Compact Header with Gradient Avatar & Close */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top bar inside header */}
        <div className="flex items-center justify-between relative z-10 mb-3">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{currentUser?.isLoggedIn ? `CineClub ${currentUser.membershipTier}` : 'Guest Visitor'}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {currentUser?.isLoggedIn && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
                title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* User Mini Info */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-bold text-lg">
                {currentUser?.isLoggedIn ? (name.charAt(0) || 'U') : '?'}
              </div>
            </div>
            {currentUser?.isLoggedIn && (
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-xs">
                <Award className="w-3 h-3" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {currentUser?.isLoggedIn ? (
              <>
                <h2 className="text-base font-bold text-white leading-tight truncate">{name}</h2>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">{email}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" />
                    {currentCity}
                  </span>
                  <span>•</span>
                  <span>{phone}</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-base font-bold text-white leading-tight">Guest User</h2>
                <p className="text-[11px] text-slate-300 mt-0.5">Login with mobile or email to book tickets</p>
                <button
                  onClick={onOpenLogin}
                  className="mt-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] inline-flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Log In / Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loyalty Quick Pill */}
        {currentUser?.isLoggedIn && (
          <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
              <div className="text-[9px] font-bold text-amber-300 uppercase">CinePoints</div>
              <div className="font-extrabold text-white text-xs">{loyaltyPoints}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
              <div className="text-[9px] font-bold text-rose-300 uppercase">Bookings</div>
              <div className="font-extrabold text-white text-xs">{userBookings.length} Active</div>
            </div>
            <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
              <div className="text-[9px] font-bold text-emerald-300 uppercase">Free Snack</div>
              <div className="font-extrabold text-white text-xs">1 Popcorn</div>
            </div>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-2.5 mx-3 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* Content Body */}
      <div className="p-3.5 space-y-3 max-h-[58vh] overflow-y-auto no-scrollbar text-xs">
        {/* Not Logged In Banner */}
        {!currentUser?.isLoggedIn && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Login Required for Reservations</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              To lock seats, receive WhatsApp electronic passes, and earn CineClub loyalty discounts, please log in with your phone or email.
            </p>
            <button
              onClick={onOpenLogin}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Phone / Email</span>
            </button>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && currentUser?.isLoggedIn ? (
          <form onSubmit={handleSave} className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Phone (SMS & WhatsApp Pass)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Preferred Screen Format</label>
              <select
                value={preferredFormat}
                onChange={(e) => setPreferredFormat(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500"
              >
                <option value="Laser IMAX">Laser IMAX 3D</option>
                <option value="Dolby Atmos">Dolby Atmos (4K Laser)</option>
                <option value="4DX">4DX Motion Effects</option>
                <option value="ScreenX">ScreenX 270° Panoramic</option>
                <option value="VIP INSIGNIA">VIP INSIGNIA Recliner</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Quick Movie Tickets Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-rose-600" />
                  <span>My Movie Tickets</span>
                </span>
                <button
                  onClick={onOpenTickets}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All ({userBookings.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {userBookings.length === 0 ? (
                <div className="py-2 text-center text-slate-500 text-[11px]">
                  <p>No active movie tickets booked yet.</p>
                  <button
                    onClick={() => {
                      if (onClose) onClose();
                      onExploreMovies();
                    }}
                    className="mt-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Explore Movies
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {userBookings.slice(0, 2).map((bk) => (
                    <div
                      key={bk.id}
                      onClick={() => {
                        if (onSelectBookingTicket) onSelectBookingTicket(bk);
                        onOpenTickets();
                      }}
                      className="p-2 bg-white hover:bg-rose-50/50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={bk.media.posterUrl}
                          alt={bk.media.title}
                          className="w-8 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[11px] text-slate-900 truncate">{bk.media.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{bk.showtime.time} • {bk.venue.name}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                        {bk.seats.length} Seats
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Preferences */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Projection</div>
                <div className="font-bold text-slate-800 mt-0.5 truncate">{preferredFormat}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Seating Sweetspot</div>
                <div className="font-bold text-slate-800 mt-0.5 truncate">{preferredSeating}</div>
              </div>
            </div>

            {/* Quick WhatsApp Alert Toggle */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-slate-700 font-medium text-[11px] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant WhatsApp E-Tickets</span>
              </span>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 h-3.5 w-3.5"
              />
            </label>

            {/* Terms and Conditions Accordion */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-100/70 transition cursor-pointer"
              >
                <span className="text-slate-800 font-bold text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Terms & Conditions</span>
                </span>
                <span className="text-slate-400">
                  {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </button>

              {showTerms && (
                <div className="p-3 pt-1 border-t border-slate-200 text-[10px] text-slate-600 space-y-2.5 leading-relaxed bg-white animate-in fade-in">
                  <div>
                    <h5 className="font-bold text-slate-800">1. Ticket & Seat Reservations</h5>
                    <p className="text-slate-500">Tickets once confirmed are non-transferable and valid only for the designated date, showtime, and auditorium screen specified on the digital pass.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">2. Cancellation & Refund Policy</h5>
                    <p className="text-slate-500">Cancellations are accepted up to 2 hours before showtime. Refunds can be claimed as 75% to original payment method or 100% value in CinePoints credits.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">3. Age & Censor Certification</h5>
                    <p className="text-slate-500">Films rated 'A' (Adults Only) require mandatory government photo ID check at cinema entry. Entry will be denied to patrons below 18 years without refund.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">4. Food & Auditorium Regulations</h5>
                    <p className="text-slate-500">Outside food and beverages are strictly prohibited. In-seat dining orders are prepared fresh and served prior to the film or during the intermission interval.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">5. CineClub Loyalty Points</h5>
                    <p className="text-slate-500">CinePoints hold no cash surrender value and expire 12 months after accrual date. Points can be redeemed against tickets and concession snack counters.</p>
                  </div>
                  <div className="pt-1 text-[9px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                    <span>ShowSphere Booking Engine v4.2</span>
                    <span>Updated August 2026</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Actions: Log Out / Done */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        {currentUser?.isLoggedIn ? (
          <button
            onClick={onLogout}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In Now</span>
          </button>
        )}

        <button
          onClick={() => {
            if (onClose) onClose();
          }}
          className="px-3.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
