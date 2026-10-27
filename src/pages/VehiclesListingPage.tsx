import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  MapPin
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/seedData';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { useLocation } from '../context/LocationContext';
import { VehicleItem } from '../types';

export const VehiclesListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city, pincode, openLocationModal } = useLocation();

  // URL Query Params Initializers
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  // Local Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedUsage, setSelectedUsage] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [minRange, setMinRange] = useState<number>(0);
  const [minBattery, setMinBattery] = useState<number>(0);
  const [maxChargingHours, setMaxChargingHours] = useState<number>(10);
  const [selectedWarranty, setSelectedWarranty] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'RANGE_DESC' | 'POPULARITY' | 'NEWEST'>('POPULARITY');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Unique Brands list
  const availableBrands = useMemo(() => {
    return Array.from(new Set(VEHICLES_DATA.map(v => v.brand)));
  }, []);

  // Filtered & Sorted vehicles
  const filteredVehicles = useMemo(() => {
    return VEHICLES_DATA.filter((v) => {
      // Category
      if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          v.name.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Brand
      if (selectedBrand !== 'ALL' && v.brand !== selectedBrand) return false;

      // Usage Type
      if (selectedUsage !== 'ALL' && v.usageType !== selectedUsage) return false;

      // Price Range
      if (v.exShowroomPrice > maxPrice) return false;

      // Driving Range
      if (v.certifiedRangeKm < minRange) return false;

      // Battery Capacity
      if (v.batteryCapacityKwh < minBattery) return false;

      // Charging Time
      if (v.chargingTimeHours > maxChargingHours) return false;

      // Warranty
      if (selectedWarranty > 0 && v.warrantyYears < selectedWarranty) return false;

      // Stock
      if (onlyInStock && !v.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.exShowroomPrice - b.exShowroomPrice;
      if (sortBy === 'PRICE_DESC') return b.exShowroomPrice - a.exShowroomPrice;
      if (sortBy === 'RANGE_DESC') return b.certifiedRangeKm - a.certifiedRangeKm;
      if (sortBy === 'NEWEST') return b.isFeatured ? 1 : -1;
      return b.certifiedRangeKm - a.certifiedRangeKm; // Popularity default
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedBrand,
    selectedUsage,
    maxPrice,
    minRange,
    minBattery,
    maxChargingHours,
    selectedWarranty,
    onlyInStock,
    sortBy
  ]);

  const resetAllFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedUsage('ALL');
    setMaxPrice(400000);
    setMinRange(0);
    setMinBattery(0);
    setMaxChargingHours(10);
    setSelectedWarranty(0);
    setOnlyInStock(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    searchQuery.trim() !== '' ||
    selectedBrand !== 'ALL' ||
    selectedUsage !== 'ALL' ||
    maxPrice < 400000 ||
    minRange > 0 ||
    minBattery > 0 ||
    maxChargingHours < 10 ||
    selectedWarranty > 0 ||
    onlyInStock;

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#14532D]">Electric Vehicles</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Electric Vehicles Catalog
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {filteredVehicles.length} certified electric scooters, passenger autos, and cargo vehicles.
              </p>
            </div>

            {/* City serviceability quick button */}
            <button
              onClick={openLocationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-emerald-500 transition-colors shrink-0 shadow-subtle"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Location: {city} ({pincode})</span>
              <span className="text-[#14532D] font-bold underline ml-1">Change</span>
            </button>
          </div>
        </div>

        {/* Top Controls: Search Bar, Category quick pills, Sort, Grid/List view */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-subtle mb-6 space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search models, brands (e.g. Electra, Yatri, Cargo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532D]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Views */}
            <div className="flex items-center justify-between lg:justify-end gap-3">
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700"
              >
                <Filter className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-gray-100 border-none rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                >
                  <option value="POPULARITY">Most Popular</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="RANGE_DESC">Highest Range (km)</option>
                  <option value="NEWEST">Newest / Featured</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`p-1.5 rounded-lg ${viewMode === 'GRID' ? 'bg-white text-[#14532D] shadow-xs' : 'text-gray-400 hover:text-gray-800'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`p-1.5 rounded-lg ${viewMode === 'LIST' ? 'bg-white text-[#14532D] shadow-xs' : 'text-gray-400 hover:text-gray-800'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Quick Category Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ALL' ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('ELECTRIC_SCOOTER')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ELECTRIC_SCOOTER' ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Electric Scooters
            </button>
            <button
              onClick={() => setSelectedCategory('ELECTRIC_PASSENGER_AUTO')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ELECTRIC_PASSENGER_AUTO' ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Passenger Autos
            </button>
            <button
              onClick={() => setSelectedCategory('ELECTRIC_CARGO_AUTO')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ELECTRIC_CARGO_AUTO' ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cargo 3-Wheelers
            </button>
            <button
              onClick={() => setSelectedCategory('ELECTRIC_LOADER')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ELECTRIC_LOADER' ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Industrial Loaders
            </button>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100 text-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Active Filters:</span>
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                  Category: {selectedCategory.replace('ELECTRIC_', '')}
                  <button onClick={() => setSelectedCategory('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrand !== 'ALL' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice < 400000 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                  Under ₹{(maxPrice / 100000).toFixed(1)}L
                  <button onClick={() => setMaxPrice(400000)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {minRange > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                  Range &gt; {minRange} km
                  <button onClick={() => setMinRange(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {onlyInStock && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                  In Stock Only
                  <button onClick={() => setOnlyInStock(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 ml-auto"
              >
                <RotateCcw className="w-3 h-3" /> Clear All Filters
              </button>
            </div>
          )}

        </div>

        {/* Main 2-Column Layout: Sidebar Filters + Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-5 border border-gray-200/80 shadow-subtle space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#14532D]" />
                <h3 className="text-sm font-bold text-gray-900">Filter Specifications</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Manufacturer / Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="ALL">All Brands</option>
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Usage Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Usage Purpose</label>
              <select
                value={selectedUsage}
                onChange={(e) => setSelectedUsage(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="ALL">All Usage</option>
                <option value="PERSONAL">Personal Commute</option>
                <option value="COMMERCIAL">Commercial / Fleet</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Max Ex-Showroom</span>
                <span className="font-mono text-[#14532D]">₹{(maxPrice / 100000).toFixed(1)} Lakh</span>
              </div>
              <input
                type="range"
                min={70000}
                max={400000}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#14532D] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹70k</span>
                <span>₹4.0 Lakh</span>
              </div>
            </div>

            {/* Min Range Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Minimum Certified Range
              </label>
              <select
                value={minRange}
                onChange={(e) => setMinRange(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#14532D]"
              >
                <option value={0}>Any Range</option>
                <option value={100}>100+ km</option>
                <option value={130}>130+ km</option>
                <option value={150}>150+ km</option>
              </select>
            </div>

            {/* Min Battery Capacity */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Min Battery Capacity
              </label>
              <select
                value={minBattery}
                onChange={(e) => setMinBattery(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#14532D]"
              >
                <option value={0}>Any Capacity</option>
                <option value={3.0}>3.0+ kWh</option>
                <option value={4.0}>4.0+ kWh</option>
                <option value={8.0}>8.0+ kWh (Commercial 3W)</option>
              </select>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#14532D] focus:ring-[#14532D] w-4 h-4"
                />
                <span>In Stock & Ready for Immediate Delivery</span>
              </label>
            </div>

          </aside>

          {/* Main Products Grid Area */}
          <main className="lg:col-span-9">
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-[#14532D] flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No Electric Vehicles Matched Your Filters
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                  Try adjusting the maximum budget, range threshold, or clear the search keyword.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'GRID' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
