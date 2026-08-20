import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Mail, 
  User, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Ticket, 
  X, 
  AlertCircle,
  Film
} from 'lucide-react';
import { CustomerUser } from '../types';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  bookingBlockedNotice?: string | null;
  allowSkip?: boolean;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  bookingBlockedNotice,
  allowSkip = true,
}) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (loginMethod === 'phone') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number');
        return;
      }
    } else {
      if (!email.includes('@') || !email.includes('.')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(randomOtp);
      setStep('otp');
      setResendTimer(30);
      setOtp(['', '', '', '']);
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the complete 4-digit verification code');
      return;
    }

    // Accept generated code or fallback 8492 / 1234
    if (enteredOtp === generatedOtp || enteredOtp === '8492' || enteredOtp === '1234') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const loggedInUser: CustomerUser = {
          id: `usr_${Date.now()}`,
          name: name.trim() || 'Valued Guest',
          email: loginMethod === 'email' ? email.trim() : (email.trim() || `${phone.replace(/\D/g, '')}@showsphere.com`),
          phone: loginMethod === 'phone' ? phone.trim() : (phone.trim() || '+91 98765 43210'),
          city: 'Hyderabad',
          membershipTier: 'Gold',
          loyaltyPoints: 1450,
          isLoggedIn: true,
          preferredFormat: 'Laser IMAX',
          preferredSeating: 'Row E-G (Center Sweetspot)'
        };

        // Save to local storage for persistence
        try {
          localStorage.setItem('showsphere_customer_user', JSON.stringify(loggedInUser));
        } catch (err) {
          console.error(err);
        }

        onLoginSuccess(loggedInUser);
        onClose();
      }, 700);
    } else {
      setErrorMsg(`Invalid verification code. Use demo code "${generatedOtp}" or "8492"`);
    }
  };

  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
    setErrorMsg(null);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: CustomerUser = {
        id: 'usr_demo_8492',
        name: 'Pradeep Kondaveeti',
        email: 'kondaveetipradeep697@gmail.com',
        phone: '+91 98765 43210',
        city: 'Hyderabad',
        membershipTier: 'Gold',
        loyaltyPoints: 1450,
        isLoggedIn: true,
        preferredFormat: 'Laser IMAX',
        preferredSeating: 'Row E-G (Center Sweetspot)'
      };
      try {
        localStorage.setItem('showsphere_customer_user', JSON.stringify(demoUser));
      } catch (err) {
        console.error(err);
      }
      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden relative text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Branding Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                  <span>ShowSphere</span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">CineClub</span>
                </span>
                <p className="text-[10px] text-slate-300">Customer Ticketing Access</p>
              </div>
            </div>

            {allowSkip && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                title="Browse without login (booking disabled)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-4 relative z-10">
            <h2 className="text-xl font-black tracking-tight text-white">
              {step === 'details' ? 'Customer Sign In' : 'Verify Mobile OTP'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {step === 'details' 
                ? 'Enter your mobile number or email to book movie tickets, lock seats, and receive WhatsApp passes.'
                : `We sent a 4-digit code to ${loginMethod === 'phone' ? phone : email}`
              }
            </p>
          </div>
        </div>

        {/* Warning Notice if user tried to book without login */}
        {bookingBlockedNotice && (
          <div className="p-3 mx-4 mt-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Login Required to Book: </span>
              <span>{bookingBlockedNotice}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              {/* Method Switcher Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('phone');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mobile Number</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Email Address</span>
                </button>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Customer Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pradeep Kondaveeti"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition"
                />
              </div>

              {/* Input for Phone or Email */}
              {loginMethod === 'phone' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile Number (WhatsApp & SMS Tickets)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={14}
                      required
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition"
                  />
                </div>
              )}

              {/* Perks list */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CineClub Membership Privileges:</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Check className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Real-time seat locking & instant barcode boarding passes</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Check className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Earn 100 CinePoints per booking towards free popcorn</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Generating Verification Code...</span>
                ) : (
                  <>
                    <span>Continue & Get Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2 text-center">
                <label className="text-xs font-bold text-slate-700">Enter 4-Digit Verification Code</label>
                
                {/* 4 Digit Boxes */}
                <div className="flex justify-center gap-2.5 pt-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-13 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 focus:border-rose-600 focus:bg-white rounded-2xl outline-none transition shadow-2xs"
                    />
                  ))}
                </div>

                {/* Demo OTP Helper Chip */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-full text-[11px] font-bold transition cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Demo Code: <strong>{generatedOtp}</strong> (Click to Auto-fill)</span>
                  </button>
                </div>
              </div>

              {/* Resend Timer & Change Number */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setErrorMsg(null);
                  }}
                  className="font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Change Details
                </button>

                <div>
                  {resendTimer > 0 ? (
                    <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedOtp(newCode);
                        setResendTimer(30);
                      }}
                      className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              {/* Verify & Login Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Verifying & Signing In...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code & Complete Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo One-Tap Login */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                P
              </div>
              <span>1-Tap Quick Demo Login (Pradeep Kondaveeti)</span>
            </button>

            {allowSkip && (
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium transition cursor-pointer"
              >
                Continue as Guest (Booking requires login)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
