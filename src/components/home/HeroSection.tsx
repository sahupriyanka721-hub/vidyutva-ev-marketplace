import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const HeroSection: React.FC = () => {
  const { city, pincode, openLocationModal } = useLocation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FB] via-[#F1F6FC] to-[#F0F4F8] pt-10 pb-20 sm:pt-14 sm:pb-24 border-b border-[#D8E4F0]">
      
      {/* Background Soft Bluish Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-200/25 rounded-full filter blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-950 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>India&apos;s Dedicated Electric Mobility Marketplace</span>
              <span className="text-gray-300">|</span>
              <button
                onClick={openLocationModal}
                className="hover:underline flex items-center gap-1 text-[#16A34A] font-bold"
              >
                <MapPin className="w-3 h-3 text-[#16A34A]" /> {city} ({pincode})
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#06152B] tracking-tight leading-tight sm:leading-none">
              Your Electric <br />
              <span className="text-[#16A34A] relative inline-block">
                Journey Starts Here.
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#B7F34A] rounded-full shadow-sm"></span>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover electric vehicles, get personalised quotations, book test drives and enjoy convenient doorstep service—all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/vehicles"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-premium hover:shadow-elevated transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </Link>

              <Link
                to="/quotation"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-emerald-50 text-[#06152B] text-sm font-bold rounded-2xl border-2 border-[#06152B] flex items-center justify-center gap-2 transition-all shadow-subtle"
              >
                <span>Get a Quotation</span>
              </Link>

              <Link
                to="/test-drive"
                className="w-full sm:w-auto px-5 py-3.5 text-gray-700 hover:text-[#16A34A] text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-4 h-4 text-[#16A34A]" />
                <span>Book a Test Drive</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-5 border-t border-gray-200/80 grid grid-cols-3 gap-1.5 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 bg-white/95 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#D5E3F0] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 sm:mt-0.5" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">100% Verified</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">ARAI Certified</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 bg-white/95 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#D5E3F0] shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#16A34A] shrink-0 sm:mt-0.5" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">Zero Emission</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">80% Savings</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 bg-white/95 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#D5E3F0] shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 sm:mt-0.5" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">Doorstep Van</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">Service at Home</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality EV Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100/70 to-[#B7F34A]/30 rounded-3xl filter blur-2xl -z-10 transform -rotate-1"></div>

              {/* Main Card (Light Theme) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-elevated border border-gray-200/80 relative overflow-hidden text-gray-900">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video sm:aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
                    alt="Premium Electric Scooter Showcase"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#14532D] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured Flagship
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-xl">
                    170 km Certified Range
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      Electra Glide Pro
                    </h3>
                    <p className="text-xs text-gray-500">
                      Smart Connected Urban Electric Scooter
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Ex-Showroom</span>
                    <span className="text-base sm:text-lg font-black text-[#16A34A]">
                      ₹1,29,999
                    </span>
                  </div>
                </div>

                {/* Micro Spec Bar */}
                <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-medium">Top Speed</span>
                    <span className="font-bold text-gray-800">95 km/h</span>
                  </div>
                  <div className="border-x border-gray-100">
                    <span className="block text-[10px] text-gray-400 uppercase font-medium">Battery</span>
                    <span className="font-bold text-gray-800">4.0 kWh</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-medium">Fast Charge</span>
                    <span className="font-bold text-[#16A34A]">55 mins</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/vehicles/electra-glide-pro"
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-xs font-bold rounded-xl text-center transition-colors border border-emerald-100"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/test-drive?vehicle=veh-eglide-pro"
                    className="flex-1 py-2 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl text-center transition-colors shadow-sm"
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
