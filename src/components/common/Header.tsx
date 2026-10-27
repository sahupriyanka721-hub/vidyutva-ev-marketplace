import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Wrench,
  FileText,
  Clock,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../../data/seedData';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { city, pincode, openLocationModal } = useLocation();
  const { totalItemCount, openCartDrawer } = useCart();
  const { totalWishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close search/account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const q = searchQuery.toLowerCase().trim();
  const matchedVehicles = q
    ? VEHICLES_DATA.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedParts = q
    ? SPARE_PARTS_DATA.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-[#16A34A] hover:bg-gray-100 rounded-xl focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo Component: Strictly Non-White Background (Dark Oceanic Badge with Emerald Ring) */}
            <BrandLogo variant="header" />

            {/* Location Selector Pill (Desktop) */}
            <button
              onClick={openLocationModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/90 hover:bg-emerald-50 text-xs text-gray-800 border border-gray-200 hover:border-emerald-400 transition-all ml-1 shadow-sm"
              title="Change Delivery & Service Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-semibold max-w-[110px] truncate">{city}</span>
              <span className="text-gray-500 font-mono text-[11px]">({pincode})</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Global Search Bar with Autocomplete suggestions */}
          <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search electric scooters, cargo autos, spare parts, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-100/90 hover:bg-gray-100 focus:bg-white border border-gray-200/80 focus:border-[#16A34A] rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 placeholder-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Autocomplete Dropdown (Light Clean Theme) */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in duration-150 text-gray-900">
                {matchedVehicles.length === 0 && matchedParts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No electric vehicles or spare parts found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {matchedVehicles.length > 0 && (
                      <div className="p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Electric Vehicles
                        </div>
                        {matchedVehicles.map(v => (
                          <Link
                            key={v.id}
                            to={`/vehicles/${v.modelSlug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/70 transition-colors group"
                          >
                            <img
                              src={v.images[0]?.url || ''}
                              alt={v.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 group-hover:text-[#16A34A] truncate">
                                {v.name}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                {v.brand} • ₹{v.exShowroomPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              EV Model
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {matchedParts.length > 0 && (
                      <div className="p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Genuine Spare Parts
                        </div>
                        {matchedParts.map(p => (
                          <Link
                            key={p.id}
                            to={`/spare-parts/${p.id}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/70 transition-colors group"
                          >
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 group-hover:text-[#16A34A] truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                SKU: {p.sku} • ₹{p.sellingPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                              Spare Part
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
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
              Book Test Drive
            </Link>
            <Link to="/service" className="hover:text-[#16A34A] transition-colors">
              Book Service
            </Link>
            <Link
              to="/quotation"
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:from-emerald-700 hover:to-emerald-600 font-bold transition-all shadow-sm text-xs"
            >
              Get Quotation
            </Link>
          </nav>

          {/* Action Icons (Wishlist, Cart, Account) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Compare shortcut */}
            <Link
              to="/compare"
              className="p-2 text-gray-600 hover:text-[#16A34A] hover:bg-gray-100 rounded-full transition-colors hidden sm:flex"
              title="Compare Vehicles"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/dashboard?tab=wishlist"
              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCartDrawer}
              className="p-2 text-gray-700 hover:text-[#16A34A] hover:bg-emerald-50 rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div ref={accountRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#14532D] transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
                    {user?.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user?.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>Login</span>
                </button>
              )}

              {/* Account Dropdown Menu */}
              {accountDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150 text-gray-800">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-gray-500 font-mono truncate">{user?.phone}</p>
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
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 text-gray-800">
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
              Change
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search EVs, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Links */}
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
              Spare Parts Hub
            </Link>
            <Link
              to="/test-drive"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Book Test Drive
            </Link>
            <Link
              to="/service"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100"
            >
              Doorstep Service
            </Link>
            <Link
              to="/quotation"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white rounded-xl font-bold text-center"
            >
              Get Quotation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
