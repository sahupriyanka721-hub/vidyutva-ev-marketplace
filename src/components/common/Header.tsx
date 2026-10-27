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
  ShieldCheck,
  Wrench,
  FileText,
  Clock,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../../data/seedData';
import { BrandLogo } from './BrandLogo';

/**
 * Section 3: GLOBAL HEADER AND NAVIGATION
 * Strictly contains the 12 required items:
 * 1. Brand logo
 * 2. Location selector for city and PIN code
 * 3. Search bar with autocomplete
 * 4. Electric Scooters
 * 5. Electric Autos
 * 6. Spare Parts
 * 7. Book a Test Drive
 * 8. Book a Service
 * 9. Get a Quotation
 * 10. Account / Login
 * 11. Wishlist
 * 12. Cart icon with item count
 */
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

  // Filtered autocomplete search results
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8E4F0] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-3">
          
          {/* Item 1: Brand logo & Mobile Hamburger */}
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

            {/* Item 2: Location selector for city and PIN code */}
            <button
              onClick={openLocationModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-emerald-50 text-xs text-gray-800 border border-gray-200 hover:border-emerald-400 transition-all ml-1 shadow-2xs"
              title="Change City and PIN Code"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-bold max-w-[100px] truncate">{city}</span>
              <span className="text-gray-500 font-mono text-[11px]">({pincode})</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Item 3: Search bar with autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-sm lg:max-w-md relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search scooters, autos, parts, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#16A34A] rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 placeholder-gray-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Autocomplete Dropdown */}
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
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
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
                            <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
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

          {/* Items 4, 5, 6, 7, 8, 9: Core Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-semibold text-gray-700">
            {/* Item 4 */}
            <Link to="/vehicles?category=ELECTRIC_SCOOTER" className="hover:text-[#16A34A] transition-colors">
              Electric Scooters
            </Link>
            
            {/* Item 5 */}
            <Link to="/vehicles?category=ELECTRIC_PASSENGER_AUTO" className="hover:text-[#16A34A] transition-colors">
              Electric Autos
            </Link>
            
            {/* Item 6 */}
            <Link to="/spare-parts" className="hover:text-[#16A34A] transition-colors">
              Spare Parts
            </Link>
            
            {/* Item 7 */}
            <Link to="/test-drive" className="hover:text-[#16A34A] transition-colors">
              Book a Test Drive
            </Link>
            
            {/* Item 8 */}
            <Link to="/service" className="hover:text-[#16A34A] transition-colors">
              Book a Service
            </Link>
            
            {/* Item 9 */}
            <Link
              to="/quotation"
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:from-emerald-700 hover:to-emerald-600 font-bold transition-all shadow-sm text-xs shrink-0"
            >
              Get a Quotation
            </Link>
          </nav>

          {/* Items 10, 11, 12: Account/Login, Wishlist, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Item 11: Wishlist */}
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

            {/* Item 12: Cart icon with item count */}
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

            {/* Item 10: Account / Login */}
            <div ref={accountRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#14532D] transition-all shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
                    {user?.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate">{user?.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Account Dropdown Menu (Includes Direct Admin Panel Link) */}
              {accountDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150 text-gray-800">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-gray-500 font-mono truncate">{user?.phone}</p>
                  </div>
                  
                  {/* Admin Portal Link */}
                  <Link
                    to="/admin"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Panel</span>
                    <span className="ml-auto text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">
                      STAFF
                    </span>
                  </Link>

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

      {/* Mobile Quick Location & Search Strip */}
      <div className="md:hidden px-3 py-2 bg-[#F4F8FC] border-t border-[#DCE8F2] flex items-center gap-2">
        <button
          onClick={openLocationModal}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#D5E3F0] text-[11px] font-bold text-gray-800 shadow-2xs"
          title="Change City"
        >
          <MapPin className="w-3 h-3 text-[#16A34A]" />
          <span className="max-w-[75px] truncate">{city}</span>
        </button>
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            placeholder="Search scooters, autos, parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D5E3F0] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>
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

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search electric scooters, autos, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

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
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-purple-50 text-purple-800 rounded-xl hover:bg-purple-100 border border-purple-200 font-bold"
            >
              ⚡ Admin Panel
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
