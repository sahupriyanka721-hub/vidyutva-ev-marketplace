import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'badge' | 'compact';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <Link
        to="/"
        className={`inline-flex items-center gap-2 group ${className}`}
        title="E-VAHAN"
      >
        <div className="relative p-2 rounded-2xl bg-gradient-to-br from-[#06152B] via-[#0B2545] to-[#081E3B] border border-emerald-500/40 shadow-md group-hover:border-emerald-400 transition-all">
          <img
            src="/logo-icon-light.png"
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
        className={`inline-flex items-center group ${className}`}
        title="E-VAHAN — Official EV Marketplace"
      >
        {/* Strictly NON-WHITE container: Luxury Midnight Oceanic Navy */}
        <div className="relative inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#030B17] via-[#0B2545] to-[#06152B] border border-emerald-500/40 shadow-xl group-hover:border-emerald-400/70 transition-all">
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="/logo-icon-light.png"
              alt="E-VAHAN"
              className="h-10 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex items-baseline font-black tracking-tight leading-none text-2xl">
            <span className="text-[#22C55E]">E-</span>
            <span className="text-white">VAHAN</span>
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
      title="E-VAHAN"
    >
      {/* 
        Luxury Automotive Emblem Badge
        Strictly NON-WHITE background: Deep Midnight Oceanic Navy (#06152B -> #0B2545)
        Clean Emblem + E-VAHAN Typography (Zero extra text underneath)
      */}
      <div className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#06152B] via-[#0B2545] to-[#081E3B] border border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20 group-hover:border-emerald-400 group-hover:shadow-[0_0_16px_rgba(22,163,74,0.4)] transition-all">
        
        {/* Pulsing Green Live Tech Dot */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F34A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
        </span>

        {/* Scooter & Leaf Emblem */}
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src="/logo-icon-light.png"
            alt="E-VAHAN"
            className="h-8 sm:h-9 w-auto object-contain transform group-hover:scale-105 transition-transform filter drop-shadow-[0_0_8px_rgba(34,197,94,0.45)]"
          />
        </div>

        {/* Brand Typography: Clean E-VAHAN */}
        <div className="flex items-baseline font-black tracking-tight leading-none text-xl sm:text-2xl pr-1">
          <span className="text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">E-</span>
          <span className="text-white">VAHAN</span>
        </div>
      </div>
    </Link>
  );
};
