import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, Wrench } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#030B17] via-[#06152B] to-[#0B2545] text-white text-center relative overflow-hidden border-t border-emerald-500/20">
      
      {/* Decorative accent glow spheres */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-[#B7F34A]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B2545] text-xs font-bold text-[#B7F34A] border border-emerald-500/30 shadow-md">
          <Zap className="w-3.5 h-3.5" />
          <span>Zero Pollution • 80% Running Cost Savings</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ready to Switch to Electric?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of smart Indian riders and fleet owners reducing their carbon footprint and saving over ₹15,000 every month. Start your journey with verified EV models and guaranteed after-sales support.
        </p>

        {/* 3 Required Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/vehicles"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 fill-current text-[#B7F34A]" />
            <span>Explore Vehicles</span>
          </Link>

          <Link
            to="/quotation"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0B2545] hover:bg-[#12396B] text-white font-bold text-xs sm:text-sm rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Request a Quotation</span>
          </Link>

          <Link
            to="/service"
            className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <Wrench className="w-4 h-4 text-[#B7F34A]" />
            <span>Book a Service</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
