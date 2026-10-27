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
  Phone,
  Truck,
  Bike,
  Users,
  BatteryCharging,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../../data/seedData';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { city, pincode, openLocationModal } = useLocation();
  const { totalItemCount, openCartDrawer } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { comparedVehicleIds } = useCompare();

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      
      {/* 1. MAIN HEADER ROW */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Left: Mobile trigger, Brand Logo & Location selector */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-[#16A34A] hover:bg-gray-100 rounded-xl focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Brand Logo in Non-White Dark Oceanic Luxury Emblem */}
              <BrandLogo variant="header" />

              {/* Location Selector Pill */}
              <button
                onClick={openLocationModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-emerald-50 text-xs text-gray-800 border border-gray-200/90 hover:border-emerald-400 transition-all ml-1 shadow-2xs group"
                title="Change Delivery & Service Location"
              >
                <MapPin className="w-3.5 h-3.5 text-[#16A34A] group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Deliver to</span>
                  <span className="font-bold text-gray-900 max-w-[110px] truncate">
                    {city} ({pincode})
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
              </button>
            </div>

            {/* Center: Expansive Global Search Bar with Autocomplete */}
            <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search electric scooters, cargo autos, lithium batteries, fast chargers, SKUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-11 pr-24 py-2.5 text-xs sm:text-sm bg-gray-100/90 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#16A34A] rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 placeholder-gray-400 shadow-2xs"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-full transition-colors shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchQuery.trim() && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in duration-150 text-gray-900">
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
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
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
                              <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
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

            {/* Right: Quick Action CTAs & Utility Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Compare shortcut */}
              <Link
                to="/compare"
                className="p-2.5 text-gray-700 hover:text-[#16A34A] hover:bg-gray-100 rounded-xl transition-colors relative hidden sm:flex"
                title="Compare Vehicles"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {comparedVehicleIds.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {comparedVehicleIds.length}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/dashboard?tab=wishlist"
                className="p-2.5 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCartDrawer}
                className="p-2.5 text-gray-700 hover:text-[#16A34A] hover:bg-emerald-50 rounded-xl transition-colors relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#16A34A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Account / User Menu */}
              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#14532D] transition-all shadow-2xs"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#B7F34A]" />
                    <span>Sign In</span>
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
      </div>

      {/* 3. SECONDARY CATEGORY SUB-NAV (Leading E-Commerce Architecture) */}
      <div className="bg-gray-50/90 border-b border-gray-200/80 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-semibold text-gray-700">
            
            <div className="flex items-center space-x-6">
              <Link
                to="/vehicles?category=ELECTRIC_SCOOTER"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <Bike className="w-4 h-4 text-[#16A34A]" />
                <span>Electric Scooters</span>
              </Link>

              <Link
                to="/vehicles?category=ELECTRIC_PASSENGER_AUTO"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Passenger 3W Autos</span>
              </Link>

              <Link
                to="/vehicles?category=ELECTRIC_CARGO_AUTO"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Cargo 3W Delivery</span>
              </Link>

              <Link
                to="/spare-parts?category=cat-batteries"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>Lithium Batteries</span>
              </Link>

              <Link
                to="/spare-parts?category=cat-chargers"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <Zap className="w-4 h-4 text-[#16A34A]" />
                <span>Fast Chargers</span>
              </Link>

              <Link
                to="/spare-parts"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <span>Genuine Spares</span>
              </Link>

              <Link
                to="/service"
                className="flex items-center gap-1.5 hover:text-[#16A34A] transition-colors py-2"
              >
                <Wrench className="w-3.5 h-3.5 text-rose-600" />
                <span>Doorstep Van Service</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/test-drive"
                className="hover:text-[#16A34A] flex items-center gap-1 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Book Test Drive</span>
              </Link>

              <span className="text-gray-300">|</span>

              <Link
                to="/quotation"
                className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:from-emerald-700 hover:to-emerald-600 font-bold transition-all shadow-2xs text-[11px] flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                <span>Instant Quotation</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER MENU */}
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

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search EVs, genuine parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Category Shortcuts */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
            <Link
              to="/vehicles?category=ELECTRIC_SCOOTER"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <Bike className="w-4 h-4 text-[#16A34A]" /> Electric Scooters
            </Link>
            <Link
              to="/vehicles?category=ELECTRIC_PASSENGER_AUTO"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-600" /> Passenger Autos
            </Link>
            <Link
              to="/vehicles?category=ELECTRIC_CARGO_AUTO"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-600" /> Cargo 3-Wheelers
            </Link>
            <Link
              to="/spare-parts"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <BatteryCharging className="w-4 h-4 text-emerald-600" /> Spare Parts Hub
            </Link>
            <Link
              to="/test-drive"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-[#16A34A]" /> Book Test Drive
            </Link>
            <Link
              to="/service"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-800 border border-gray-100 flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-rose-600" /> Doorstep Service
            </Link>
            <Link
              to="/quotation"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" /> Get Instant Vehicle Quotation
            </Link>
          </div>

          {/* Direct helpline in mobile drawer */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <a
              href="tel:18002083846"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 py-2 px-4 rounded-xl border border-gray-200"
            >
              <Phone className="w-3.5 h-3.5 text-[#16A34A]" /> Toll-Free Helpline: 1800-208-3846
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
