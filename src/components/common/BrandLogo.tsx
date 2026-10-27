import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'badge' | 'compact';
  className?: string;
  showPillars?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  showPillars = true,
}) => {
  if (variant === 'compact') {
    return (
      <Link
        to="/"
        className={`inline-flex items-center gap-2 group ${className}`}
        title="E-VAHAN — Home"
      >
        <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-[#06152B] via-[#0B2545] to-[#081E3B] border border-emerald-500/40 shadow-md group-hover:border-emerald-400 transition-all">
          <img
            src="/logo-light.png"
            alt="E-VAHAN"
            className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(22,163,74,0.4)]"
          />
        </div>
      </Link>
    );
  }

  if (variant === 'footer') {
    return (
      <Link
        to="/"
        className={`inline-flex flex-col gap-2 group ${className}`}
        title="E-VAHAN — India's Premier EV Marketplace"
      >
        {/* Dark container: Never plain white! */}
        <div className="relative inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#030B17] via-[#081E3B] to-[#06152B] border border-emerald-500/30 shadow-xl group-hover:border-emerald-400/60 transition-all">
          <div className="relative shrink-0">
            <img
              src="/logo-light.png"
              alt="E-VAHAN Official Logo"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(34,197,94,0.45)]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline font-black tracking-tight leading-none text-xl sm:text-2xl">
              <span className="text-[#22C55E]">E-</span>
              <span className="text-white">VAHAN</span>
            </div>
            {showPillars && (
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider">
                <span className="px-1.5 py-0.5 rounded bg-[#0B2545] text-blue-200 border border-blue-400/30">
                  New EV
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#B7F34A] text-[#06152B]">
                  Spare Parts
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#0B2545] text-blue-200 border border-blue-400/30">
                  Service
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Header & Default variant
  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none ${className}`}
      title="E-VAHAN — New EV | Spare Parts | Service"
    >
      {/* 
        Ultra-Premium Dark Glassmorphic Badge 
        Strictly NON-WHITE background as required: 
        Deep Midnight Navy (#06152B -> #0B2545) with vibrant emerald aura & glowing border 
      */}
      <div className="relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#06152B]/95 via-[#0B2545]/90 to-[#081E3B]/95 border border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(22,163,74,0.35)] transition-all">
        
        {/* Pulsing Green Live Tech Dot */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F34A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
        </span>

        {/* Logo Graphic */}
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src="/logo-light.png"
            alt="E-VAHAN Emblem"
            className="h-9 sm:h-10 w-auto object-contain transform group-hover:scale-105 transition-transform filter drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
          />
        </div>

        {/* Brand Typography & 3 Pillars from Logo */}
        <div className="flex flex-col text-left">
          <div className="flex items-baseline font-black tracking-tight leading-none text-lg sm:text-xl">
            <span className="text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">E-</span>
            <span className="text-white">VAHAN</span>
          </div>

          {showPillars && (
            <div className="hidden sm:flex items-center gap-1 mt-1 text-[8px] font-bold uppercase tracking-wider">
              <span className="px-1.5 py-0.5 rounded bg-[#12396B]/80 text-blue-200 border border-blue-400/40">
                New EV
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#B7F34A] text-[#06152B] font-extrabold shadow-sm">
                Spare Parts
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#12396B]/80 text-blue-200 border border-blue-400/40">
                Service
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
