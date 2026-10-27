import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const HeroSection: React.FC = () => {
  const { city, pincode, openLocationModal } = useLocation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#06152B] via-[#0A2240] via-60% to-[#F8FAF8] pt-10 pb-20 sm:pt-14 sm:pb-24 border-b border-gray-200">
      
      {/* Background Ambient Aurora Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#B7F34A]/10 rounded-full filter blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B2545] border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse"></span>
              <span>India&apos;s Dedicated Electric Mobility Marketplace</span>
              <span className="text-slate-600">|</span>
              <button
                onClick={openLocationModal}
                className="hover:underline flex items-center gap-1 text-[#B7F34A]"
              >
                <MapPin className="w-3 h-3 text-[#B7F34A]" /> {city} ({pincode})
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
              Your Electric <br />
              <span className="text-[#22C55E] relative inline-block">
                Journey Starts Here.
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#B7F34A] rounded-full shadow-[0_0_10px_#B7F34A]"></span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover electric vehicles, get personalised quotations, book test drives and enjoy convenient doorstep service—all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/vehicles"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-500 hover:to-emerald-700 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </Link>

              <Link
                to="/quotation"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#0B2545] hover:bg-[#12396B] text-white text-sm font-bold rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Get a Quotation</span>
              </Link>

              <Link
                to="/test-drive"
                className="w-full sm:w-auto px-5 py-3.5 text-slate-200 hover:text-[#B7F34A] text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-4 h-4 text-[#B7F34A]" />
                <span>Book a Test Drive</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2 bg-[#0B2545]/60 p-2.5 rounded-xl border border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">100% Verified</h4>
                  <p className="text-[10px] text-slate-300">ARAI/FAME-II Certified</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-[#0B2545]/60 p-2.5 rounded-xl border border-slate-700/50">
                <Sparkles className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Zero Emission</h4>
                  <p className="text-[10px] text-slate-300">Up to 80% Running Savings</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-[#0B2545]/60 p-2.5 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Doorstep Van</h4>
                  <p className="text-[10px] text-slate-300">Service at Your Home</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality EV Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-[#B7F34A]/20 rounded-3xl filter blur-2xl -z-10 transform -rotate-1"></div>

              {/* Main Card */}
              <div className="bg-gradient-to-b from-[#0B2545] to-[#06152B] rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/30 relative overflow-hidden text-white">
                <div className="relative rounded-2xl overflow-hidden bg-[#06152B] aspect-video sm:aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
                    alt="Premium Electric Scooter Showcase"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured Flagship
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#06152B]/85 backdrop-blur-md text-[#B7F34A] border border-emerald-500/30 text-[11px] font-mono px-3 py-1 rounded-xl">
                    170 km Certified Range
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Electra Glide Pro
                    </h3>
                    <p className="text-xs text-slate-300">
                      Smart Connected Urban Electric Scooter
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ex-Showroom</span>
                    <span className="text-base sm:text-lg font-black text-[#22C55E]">
                      ₹1,29,999
                    </span>
                  </div>
                </div>

                {/* Micro Spec Bar */}
                <div className="mt-3.5 pt-3 border-t border-slate-700/60 grid grid-cols-3 text-center text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Top Speed</span>
                    <span className="font-bold text-white">95 km/h</span>
                  </div>
                  <div className="border-x border-slate-700/60">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Battery</span>
                    <span className="font-bold text-white">4.0 kWh</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Fast Charge</span>
                    <span className="font-bold text-[#B7F34A]">55 mins</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/vehicles/electra-glide-pro"
                    className="flex-1 py-2 bg-[#12396B] hover:bg-[#1A4D8C] text-white text-xs font-bold rounded-xl text-center transition-colors border border-blue-400/20"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/test-drive?vehicle=veh-eglide-pro"
                    className="flex-1 py-2 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-500 hover:to-emerald-700 text-white text-xs font-bold rounded-xl text-center transition-colors shadow-md"
                  >
                    Book Test Drive
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
