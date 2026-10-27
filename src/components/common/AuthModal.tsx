import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, login, signup, authRedirectUrl } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9][0-9]{9}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setStep('OTP');
    // OTP auto-fills automatically for seamless verification
    setOtp('123456');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');

    let success = false;
    if (mode === 'SIGNUP') {
      success = await signup({
        fullName: fullName || 'EV Customer',
        phone,
        email: email || `${phone}@e-vahan.in`,
        city: city || 'New Delhi',
        pincode: pincode || '110001'
      });
    } else {
      const ok = await login(phone, otp);
      if (!ok) {
        setError('Verification failed. Please check OTP and try again');
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

        {/* Brand header with stylish dark badge logo (Never white background!) */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo variant="header" />
          </div>
          <h3 className="text-xl font-black text-gray-900">
            {mode === 'LOGIN' ? 'Welcome to E-VAHAN' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'LOGIN'
              ? 'Log in to track vehicle bookings, quotations & doorstep service'
              : 'Join India’s premier electric mobility platform'}
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@example.com"
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
                      placeholder="e.g. Bengaluru"
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
                      placeholder="560001"
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
                Indian Mobile Number
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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Get 6-Digit OTP</span>
              <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
              OTP sent to <strong>+91 {phone}</strong>
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-[#16A34A] font-bold ml-2 underline"
              >
                Change
              </button>
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

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <span>Verifying...</span> : <span>Verify & Continue</span>}
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
