import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bike, Wrench, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItemCount, openCartDrawer } = useCart();
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const currentPath = location.pathname;

  const isHome = currentPath === '/';
  const isVehicles = currentPath.startsWith('/vehicles');
  const isParts = currentPath.startsWith('/spare-parts');
  const isDashboard = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin');

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#D8E4F0] px-2 py-1.5 shadow-[0_-4px_20px_rgba(6,21,43,0.08)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </Link>

        {/* 2. Vehicles */}
        <Link
          to="/vehicles"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isVehicles ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bike className={`w-5 h-5 ${isVehicles ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Vehicles</span>
        </Link>

        {/* 3. Spare Parts */}
        <Link
          to="/spare-parts"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isParts ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Wrench className={`w-5 h-5 ${isParts ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Parts</span>
        </Link>

        {/* 4. Cart */}
        <button
          onClick={openCartDrawer}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-gray-900 transition-colors relative"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#16A34A] text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
        </button>

        {/* 5. Account / Login */}
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isDashboard ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-black">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[50px]">
              {user?.fullName?.split(' ')[0] || 'Account'}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal('/dashboard')}
            className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#16A34A] transition-colors"
          >
            <User className="w-5 h-5 stroke-2" />
            <span className="text-[10px] tracking-tight mt-0.5">Login</span>
          </button>
        )}

      </div>
    </nav>
  );
};
