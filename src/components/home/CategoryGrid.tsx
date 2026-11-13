import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bike,
  Users,
  Truck,
  Layers,
  BatteryCharging,
  Zap,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { CategoryItem, SubCategoryItem } from '../../types';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);

  const loadCategories = () => {
    setCategories(storage.getCategories().filter(c => c.status === 'ACTIVE'));
    setSubCategories(storage.getSubCategories().filter(s => s.status === 'ACTIVE'));
  };

  useEffect(() => {
    loadCategories();
    // Live two-way synchronization: auto-reload when Admin updates categories
    const unsub = storage.onSync((key) => {
      if (key === 'catalog_categories' || key === 'catalog_subcategories') {
        loadCategories();
      }
    });
    return () => unsub();
  }, []);

  const getCategoryIcon = (type: string, name: string) => {
    const n = name.toLowerCase();
    if (n.includes('scooter') || n.includes('bike')) return Bike;
    if (n.includes('passenger') || n.includes('auto')) return Users;
    if (n.includes('cargo') || n.includes('commercial')) return Truck;
    if (n.includes('loader')) return Layers;
    if (n.includes('battery')) return BatteryCharging;
    if (n.includes('charger')) return Zap;
    if (n.includes('spare') || n.includes('motor')) return Cpu;
    return Sparkles;
  };

  const getCategoryLink = (cat: CategoryItem) => {
    if (cat.type === 'VEHICLE') {
      if (cat.name.toLowerCase().includes('scooter')) return '/vehicles?category=ELECTRIC_SCOOTER';
      if (cat.name.toLowerCase().includes('passenger')) return '/vehicles?category=ELECTRIC_PASSENGER_AUTO';
      if (cat.name.toLowerCase().includes('cargo')) return '/vehicles?category=ELECTRIC_CARGO_AUTO';
      if (cat.name.toLowerCase().includes('loader')) return '/vehicles?category=ELECTRIC_LOADER';
      return '/vehicles';
    }
    return '/spare-parts';
  };

  return (
    <section className="py-14 bg-[#F0F4F8] border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modular Marketplace Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select an electric mobility category to browse verified vehicles and genuine parts.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs font-bold text-[#14532D] hover:text-[#0d381e] flex items-center gap-1 hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16A34A]" />
          </Link>
        </div>

        {/* Dynamic Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.type, cat.name);
            const catSubs = subCategories.filter(s => s.categoryId === cat.id);
            const link = getCategoryLink(cat);

            return (
              <Link
                key={cat.id}
                to={link}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#E3E9E4] hover:border-emerald-500/80 p-3 sm:p-5 transition-all duration-300 hover:shadow-premium flex flex-col justify-between"
              >
                {/* Visual Thumbnail & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 group-hover:bg-[#14532D] text-[#14532D] group-hover:text-[#B7F34A] flex items-center justify-center transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {catSubs.length > 0 ? `${catSubs.length} Sub-types` : cat.type === 'VEHICLE' ? 'EV Models' : 'OEM Spares'}
                  </span>
                </div>

                <div className="h-24 sm:h-28 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#14532D] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
