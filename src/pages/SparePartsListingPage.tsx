import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { SPARE_PARTS_DATA, VEHICLES_DATA } from '../data/seedData';
import { PartCard } from '../components/parts/PartCard';
import { useLocation } from '../context/LocationContext';

export const SparePartsListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city, pincode, openLocationModal } = useLocation();

  const initialCat = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedVehicleCompatibility, setSelectedVehicleCompatibility] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'DISCOUNT'>('POPULAR');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Categories list
  const categories = [
    { id: 'ALL', name: 'All Categories' },
    { id: 'cat-batteries', name: 'Batteries' },
    { id: 'cat-chargers', name: 'Battery Chargers' },
    { id: 'cat-controllers', name: 'Controllers' },
    { id: 'cat-braking', name: 'Braking Systems' },
    { id: 'cat-tyres', name: 'Tyres & Tubes' },
    { id: 'cat-electrical', name: 'Electrical Components' },
    { id: 'cat-lighting', name: 'Lighting' },
    { id: 'cat-accessories', name: 'Helmets & Accessories' },
  ];

  const filteredParts = useMemo(() => {
    return SPARE_PARTS_DATA.filter((p) => {
      // Category
      if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Compatibility filter
      if (selectedVehicleCompatibility !== 'ALL') {
        const isComp = p.compatibleVehicleIds.includes(selectedVehicleCompatibility);
        if (!isComp) return false;
      }

      // Price
      if (p.sellingPrice > maxPrice) return false;

      // In stock
      if (onlyInStock && p.stockQuantity <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'PRICE_DESC') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'DISCOUNT') {
        const discA = a.mrpPrice - a.sellingPrice;
        const discB = b.mrpPrice - b.sellingPrice;
        return discB - discA;
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, selectedVehicleCompatibility, maxPrice, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSelectedVehicleCompatibility('ALL');
    setMaxPrice(45000);
    setOnlyInStock(false);
    setSearchParams({});
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#14532D]">Spare Parts Marketplace</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Genuine EV Spare Parts Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                100% verified OEM components, lithium traction packs, fast chargers, tyres, and brake shoes.
              </p>
            </div>

            <button
              onClick={openLocationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-emerald-500 transition-colors shadow-subtle shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Delivering to: {city} ({pincode})</span>
              <span className="text-[#14532D] font-bold underline ml-1">Change</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-subtle mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by part name, SKU, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-2xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14532D]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vehicle Compatibility Filter Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold whitespace-nowrap">Filter for My EV:</span>
              <select
                value={selectedVehicleCompatibility}
                onChange={(e) => setSelectedVehicleCompatibility(e.target.value)}
                className="p-2 bg-emerald-50 text-[#14532D] border border-emerald-200 rounded-xl font-bold focus:outline-none"
              >
                <option value="ALL">All EV Models</option>
                {VEHICLES_DATA.map(v => (
                  <option key={v.id} value={v.id}>Compatible with {v.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
              >
                <option value="POPULAR">Most Popular</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="DISCOUNT">Biggest Discount</option>
              </select>
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-[#14532D] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredParts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              No genuine parts found matching this filter criteria
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Clear vehicle compatibility filter or search query to browse all available components.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
