import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { SPARE_PARTS_DATA } from '../../data/seedData';
import { PartCard } from '../parts/PartCard';

export const SparePartsPreview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredParts = SPARE_PARTS_DATA.filter(p => {
    if (activeCategory === 'ALL') return true;
    return p.categoryId === activeCategory;
  });

  return (
    <section className="py-16 bg-[#F0F4F8] border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified OEM Spares</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Spare Parts & Accessories Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Equip your electric vehicle with genuine batteries, smart chargers, controllers, brake pads and CEAT EV tyres with guaranteed fitment.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === 'ALL' ? 'bg-[#14532D] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              All Spares
            </button>
            <button
              onClick={() => setActiveCategory('cat-batteries')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === 'cat-batteries' ? 'bg-[#14532D] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              Batteries
            </button>
            <button
              onClick={() => setActiveCategory('cat-chargers')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === 'cat-chargers' ? 'bg-[#14532D] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              Chargers
            </button>
            <button
              onClick={() => setActiveCategory('cat-braking')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === 'cat-braking' ? 'bg-[#14532D] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              Brakes
            </button>
            <button
              onClick={() => setActiveCategory('cat-tyres')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === 'cat-tyres' ? 'bg-[#14532D] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              Tyres
            </button>
          </div>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredParts.slice(0, 8).map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>

        {/* Explore all CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/spare-parts"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#14532D] hover:bg-[#0d381e] text-white text-xs sm:text-sm font-bold shadow-premium transition-all hover:scale-[1.02]"
          >
            <span>Explore All Genuine Spare Parts & Check Compatibility</span>
            <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
