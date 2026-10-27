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
  const isFooter = variant === 'footer';
  // Larger, prominent logo in navbar & footer as requested
  const imgSize = isFooter ? 'h-12 sm:h-16' : 'h-11 sm:h-14 md:h-16';

  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none ${className}`}
      title="E-VAHAN"
    >
      {/* 
        Strictly NON-WHITE background: Premium Light Bluish Frosted Badge
        Matches the website's light-bluish theme perfectly
      */}
      <div className="relative flex items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-gradient-to-br from-[#E2ECF7] via-[#EBF3FB] to-[#D8E6F5] border border-[#BFD7ED] shadow-xs group-hover:border-emerald-400 group-hover:shadow-[0_0_16px_rgba(22,163,74,0.3)] transition-all">
        {/* Pulsing Green Live Tech Dot */}
        <span className="absolute -top-1 -right-1 flex h-2 sm:h-2.5 w-2 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F34A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#16A34A]"></span>
        </span>

        {/* User's Exact Circular EV Logo (Green E + Scooter + Leaf) with Light Bluish Foundation */}
        <img
          src="/logo-custom-bluish.png"
          alt="E-VAHAN Logo"
          className={`${imgSize} w-auto object-contain transform group-hover:scale-105 transition-transform`}
        />
      </div>
    </Link>
  );
};
