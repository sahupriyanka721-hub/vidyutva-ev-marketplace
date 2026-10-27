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
  const imgSize = isFooter ? 'h-10 sm:h-12' : 'h-8 sm:h-11';

  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none ${className}`}
      title="E-VAHAN"
    >
      <div className="relative flex items-center justify-center p-1 rounded-2xl bg-white border border-[#D5E3F0] shadow-xs group-hover:border-emerald-400 group-hover:shadow-md transition-all">
        {/* Pulsing Green Live Tech Dot */}
        <span className="absolute -top-1 -right-1 flex h-2 sm:h-2.5 w-2 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F34A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#16A34A]"></span>
        </span>

        {/* User's Exact Circular EV Logo (Green E + Scooter + Leaf) */}
        <img
          src="/logo-user-transparent.png"
          alt="E-VAHAN Logo"
          className={`${imgSize} w-auto object-contain transform group-hover:scale-105 transition-transform`}
        />
      </div>
    </Link>
  );
};
