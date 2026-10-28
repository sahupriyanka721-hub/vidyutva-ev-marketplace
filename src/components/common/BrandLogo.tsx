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
  // Prominent, crisp logo display
  const imgSize = isFooter ? 'h-12 sm:h-16' : 'h-11 sm:h-14 md:h-16';

  return (
    <Link
      to="/"
      className={`inline-flex items-center group focus:outline-none ${className}`}
      title="E-VAHAN"
    >
      <img
        src="/logo.png"
        alt="E-VAHAN Logo"
        className={`${imgSize} w-auto object-contain transform group-hover:scale-105 transition-transform`}
      />
    </Link>
  );
};
