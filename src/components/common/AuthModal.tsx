import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CustomerUser } from '../../types';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, login, signup, authRedirectUrl, getRegisteredUser } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [matchedCustomer, setMatchedCustomer] = useState<CustomerUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
                    placeholder="e.g. Ramesh Kumar Sharma"
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
                    placeholder="ramesh.sharma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="110001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
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
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Quick-select registered accounts chip helpers for fast testing */}
            {mode === 'LOGIN' && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Registered Accounts (Tap to fill):</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { phone: '9876543210', name: 'Ramesh Sharma' },
                    { phone: '9810012345', name: 'Priya Verma' },
                    { phone: '9988776655', name: 'Amit Patel' },
                  ].map((acc) => (
                    <button
                      key={acc.phone}
                      type="button"
                      onClick={() => {
                        setPhone(acc.phone);
                        setError('');
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span className="font-mono">{acc.phone}</span>
                      <span className="text-gray-500 font-normal">({acc.name})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    <span>New Registration Karein (+91 {phone})</span>
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

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#16A34A]" />
          By proceeding, you agree to E-VAHAN&apos;s Terms of Service & Privacy Policy.
        </div>

      </div>
    </div>
  );
};
