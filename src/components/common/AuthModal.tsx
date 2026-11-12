import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CustomerUser } from '../../types';
import { BrandLogo } from './BrandLogo';
import { lookupCityOrPincode, ALL_INDIAN_CITIES } from '../../data/indianCitiesPincodes';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, login, signup, authRedirectUrl, getRegisteredUser } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [matchedCustomer, setMatchedCustomer] = useState<CustomerUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset all modal fields whenever the modal is closed so old phone/OTP is NEVER retained
  useEffect(() => {
    if (!isAuthModalOpen) {
      setPhone('');
      setOtp('');
      setFullName('');
      setEmail('');
      setCity('');
      setPincode('');
      setError('');
      setMatchedCustomer(null);
      setStep('PHONE');
      setLoading(false);
    }
  }, [isAuthModalOpen]);

  // When city is selected or typed, automatically determine and populate its PIN code
  const handleCityChange = (val: string) => {
    setCity(val);
    const trimmed = val.trim();
    if (trimmed.length >= 2) {
      const entry = lookupCityOrPincode(trimmed);
      if (entry && entry.pincode && !entry.city.startsWith('PIN ')) {
        setPincode(entry.pincode);
        if (error.includes('PIN')) setError('');
      }
    }
  };

  // If PIN is entered first, auto-populate the corresponding city if empty
  const handlePincodeChange = (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setPincode(cleanPin);
    if (cleanPin.length === 6) {
      const entry = lookupCityOrPincode(cleanPin);
      if (entry && entry.city && !entry.city.startsWith('PIN ') && !city) {
        setCity(entry.city);
      }
    }
  };

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').trim();
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      setError('Kripya 10-digit valid Indian mobile number enter karein');
      return;
    }

    if (mode === 'LOGIN') {
      const registered = getRegisteredUser(cleanPhone);
      if (!registered) {
        setError(`❌ Mobile number +91 ${cleanPhone} registered nahi hai. Kripya pehle 'New Registration' karein.`);
        return;
      }
      setMatchedCustomer(registered);
    } else {
      const existing = getRegisteredUser(cleanPhone);
      if (existing) {
        setError(`⚠️ Mobile number +91 ${cleanPhone} already registered hai (${existing.fullName}). Kripya 'Login with OTP' karein.`);
        return;
      }
    }

    setError('');
    setStep('OTP');
    // OTP auto-fills automatically for seamless verification
    setOtp('123456');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Kripya 6-digit verification code enter karein');
      return;
    }
    setLoading(true);
    setError('');

    let success = false;
    if (mode === 'SIGNUP') {
      success = await signup({
        fullName: fullName.trim() || 'EV Customer',
        phone: phone.replace(/\D/g, '').trim(),
        email: email.trim() || `${phone.replace(/\D/g, '').trim()}@e-vahan.in`,
        city: city.trim() || 'New Delhi',
        pincode: pincode.trim() || '110001'
      });
    } else {
      const ok = await login(phone, otp);
      if (!ok) {
        setError('Verification failed. Kripya registered mobile number aur OTP check karein.');
        setLoading(false);
        return;
      }
      success = true;
    }

    setLoading(false);
    if (success) {
      closeAuthModal();
      // Customer login hone ke baad customer panel automatically open hota hai
      const destination = authRedirectUrl || '/dashboard';
      navigate(destination);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo variant="header" />
          </div>
          <h3 className="text-xl font-black text-gray-900">
            {mode === 'LOGIN' ? 'Registered Customer Login' : 'New Customer Registration'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'LOGIN'
              ? 'Enter your registered mobile number to open your customer panel'
              : 'Register to unlock your personal EV customer portal & bookings'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setStep('PHONE');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'LOGIN' ? 'bg-[#0B2545] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Login with OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGNUP');
              setStep('PHONE');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'SIGNUP' ? 'bg-[#0B2545] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Step 1: Phone / Details */}
        {step === 'PHONE' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            {mode === 'SIGNUP' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      list="signup-cities-list"
                      required
                      placeholder="e.g. Darbhanga, Patna..."
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium"
                    />
                    <datalist id="signup-cities-list">
                      {ALL_INDIAN_CITIES.map((c) => (
                        <option key={`${c.city}-${c.pincode}`} value={c.city}>
                          {c.city} ({c.state} - {c.pincode})
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="6-digit PIN"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                    {city && pincode && (
                      <p className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">Auto-PIN: {pincode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {mode === 'LOGIN' ? 'Registered Indian Mobile Number' : 'Indian Mobile Number'} <span className="text-rose-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs font-bold text-gray-600">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-left animate-in fade-in duration-150">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 font-medium leading-relaxed">{error}</p>
                </div>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('SIGNUP');
                      setStep('PHONE');
                      setError('');
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Naya Account Banayein (New Registration){phone ? ` (+91 ${phone})` : ''}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A]" />
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{mode === 'LOGIN' ? 'Verify & Get OTP' : 'Continue with OTP'}</span>
              <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              {mode === 'LOGIN' && matchedCustomer && (
                <div className="flex items-center gap-1.5 font-black text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Customer: {matchedCustomer.fullName}</span>
                </div>
              )}
              {mode === 'SIGNUP' && fullName && (
                <div className="flex items-center gap-1.5 font-black text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>New Customer: {fullName}</span>
                </div>
              )}
              <div className="text-[11px] text-emerald-700 flex items-center justify-between">
                <span>OTP sent to <strong>+91 {phone}</strong></span>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-[#16A34A] font-bold underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Verification code guidance */}
            <div className="flex items-center justify-between text-xs text-gray-500 py-0.5">
              <span>SMS verification code:</span>
              <span className="text-[#16A34A] font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-filled (123456)</span>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Enter 6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="1 2 3 4 5 6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-center tracking-widest font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <span>Verifying...</span> : <span>Open Customer Panel</span>}
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Are you an Administrator?</span>
          <Link
            to="/admin"
            onClick={closeAuthModal}
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Admin Portal Login →</span>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#16A34A]" />
          By proceeding, you agree to E-VAHAN&apos;s Terms of Service & Privacy Policy.
        </div>

      </div>
    </div>
  );
};
