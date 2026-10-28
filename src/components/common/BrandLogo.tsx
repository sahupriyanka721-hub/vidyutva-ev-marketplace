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
  // Noticeably larger, bold, and prominent logo size across header, footer & admin
  const imgSize = isFooter
    ? 'h-16 sm:h-20 md:h-24'
    : 'h-14 sm:h-16 md:h-20 lg:h-22';

  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none ${className}`}
      title="E-VAHAN"
    >
      <img
        src="/logo.png"
        alt="E-VAHAN Logo"
        className={`${imgSize} w-auto object-contain transform group-hover:scale-105 transition-transform drop-shadow-xs`}
      />
    </Link>
  );
};
