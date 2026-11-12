import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Wrench,
  FileText,
  Clock,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { BrandLogo } from './BrandLogo';

/**
 * Section 3: GLOBAL HEADER AND NAVIGATION
 * Ultra-clean navbar with:
 * 1. Brand logo
 * 2. Universal location selector for any Indian city / PIN code
 * 3. Electric Scooters
 * 4. Electric Autos
 * 5. Spare Parts
 * 6. Book a Test Drive
 * 7. Book a Service
 * 8. Get a Quotation
 * 9. Wishlist
 * 10. Cart icon with item count
 * 11. Account / Login (with Admin Dashboard link)
 */
export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { city, pincode, openLocationModal } = useLocation();
  const { totalItemCount, openCartDrawer } = useCart();
  const { totalWishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8E4F0] shadow-xs transition-all">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 gap-2 sm:gap-4">
          
          {/* Left Cluster: Hamburger, Brand Logo & Location Selector */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 text-gray-700 hover:text-[#16A34A] hover:bg-gray-100 rounded-xl focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Logo in Non-White Luxury Emblem Badge */}
            <BrandLogo variant="header" />

            {/* Location selector for any city / PIN code (available on both mobile and desktop) */}
            <button
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gray-100 hover:bg-emerald-50 text-xs text-gray-800 border border-gray-200 hover:border-emerald-400 transition-all ml-1 shadow-2xs"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span className="font-bold max-w-[85px] sm:max-w-[120px] truncate">{city}</span>
              <span className="hidden sm:inline text-gray-500 font-mono text-[11px]">({pincode})</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-semibold text-gray-700">
            <Link to="/vehicles?category=ELECTRIC_SCOOTER" className="hover:text-[#16A34A] transition-colors">
              Electric Scooters
            </Link>
            
            <Link to="/vehicles?category=ELECTRIC_PASSENGER_AUTO" className="hover:text-[#16A34A] transition-colors">
              Electric Autos
            </Link>
            
            <Link to="/spare-parts" className="hover:text-[#16A34A] transition-colors">
              Spare Parts
            </Link>
            
            <Link to="/test-drive" className="hover:text-[#16A34A] transition-colors">
              Book a Test Drive
            </Link>
            
            <Link to="/service" className="hover:text-[#16A34A] transition-colors">
              Book a Service
            </Link>
            
            <Link
              to="/quotation"
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:from-emerald-700 hover:to-emerald-600 font-bold transition-all shadow-sm text-xs shrink-0"
            >
              Get a Quotation
            </Link>
          </nav>

          {/* Right Cluster: Wishlist, Cart, Account/Login */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Wishlist */}
            <Link
              to="/dashboard?tab=wishlist"
              className="p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart icon with item count */}
            <button
              onClick={openCartDrawer}
              className="p-2 text-gray-700 hover:text-[#16A34A] hover:bg-emerald-50 rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Dedicated Admin Portal Button */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#06152B] to-[#0B2545] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm shrink-0 border border-emerald-500/30"
              title="Central Admin Control Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Account / Login */}
            <div ref={accountRef} className="relative">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#14532D] transition-all shadow-2xs"
                  title={`Logged in as ${user.fullName}`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-black shrink-0">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="font-bold text-xs text-[#14532D] max-w-[100px] sm:max-w-[130px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('/dashboard')}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Account Dropdown Menu */}
              {accountDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150 text-gray-800">
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <p className="text-xs font-black text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-emerald-700 font-mono font-semibold truncate">+91 {user?.phone}</p>
                    {user?.email && <p className="text-[10px] text-gray-500 truncate">{user.email}</p>}
                  </div>

                  <Link
                    to="/dashboard?tab=overview"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" /> Dashboard Overview
                  </Link>
                  <Link
                    to="/dashboard?tab=vehicle-orders"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" /> My Vehicle Orders
                  </Link>
                  <Link
                    to="/dashboard?tab=parts-orders"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-600" /> Spare Parts Orders
                  </Link>
                  <Link
                    to="/dashboard?tab=test-drives"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" /> Test Drive Bookings
                  </Link>
                  <Link
                    to="/dashboard?tab=quotations"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" /> My Quotations
                  </Link>
                  <Link
                    to="/dashboard?tab=service-bookings"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <Wrench className="w-4 h-4 text-emerald-600" /> Doorstep Services
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/admin"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#16A34A]"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Central Admin Portal
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 text-gray-800 shadow-xl">
          {/* Mobile Location Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span className="font-semibold text-gray-800">{city} ({pincode})</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="text-[#16A34A] font-bold text-xs hover:underline"
            >
              Change Location
            </button>
          </div>

          {/* Links for Mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
            <Link
              to="/vehicles?category=ELECTRIC_SCOOTER"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Electric Scooters
            </Link>
            <Link
              to="/vehicles?category=ELECTRIC_PASSENGER_AUTO"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Electric Autos
            </Link>
            <Link
              to="/spare-parts"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Spare Parts
            </Link>
            <Link
              to="/test-drive"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Book a Test Drive
            </Link>
            <Link
              to="/service"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Book a Service
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 bg-emerald-50 text-[#14532D] rounded-xl hover:bg-emerald-100 border border-emerald-200 font-bold flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span>{isAuthenticated ? `Customer Panel (${user?.fullName?.split(' ')[0] || 'My Account'})` : 'Customer Login / Panel'}</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 bg-gradient-to-r from-[#06152B] via-[#0B2545] to-[#081E3B] text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-sm border border-emerald-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Central Admin Portal</span>
            </Link>
            <Link
              to="/quotation"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white rounded-xl font-bold text-center shadow-sm"
            >
              Get a Quotation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
