import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, ArrowRight, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { storage } from '../../services/storageService';
import { BrandItem } from '../../types';

export const BrandShowcaseSection: React.FC = () => {
  const [brands, setBrands] = useState<BrandItem[]>([]);

  const loadBrands = () => {
    setBrands(storage.getBrands().filter(b => b.status === 'ACTIVE'));
  };

  useEffect(() => {
    loadBrands();
    const unsub = storage.onSync((key) => {
      if (key === 'catalog_brands') {
        loadBrands();
      }
    });
    return () => unsub();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-[#16A34A] border border-emerald-200 mb-2">
              <Award className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Certified OEM Partnerships</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#06152B] tracking-tight">
              Explore Verified EV Brands & OEMs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Direct OEM warranty, genuine spare parts fitment, and state subsidy authorized manufacturers.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs font-bold text-[#16A34A] hover:text-emerald-800 flex items-center gap-1 hover:underline w-max"
          >
            <span>View All Partner Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[#F0F4F8] rounded-3xl p-5 sm:p-6 border border-gray-200/90 hover:border-emerald-400/80 transition-all duration-300 hover:shadow-premium flex flex-col justify-between group"
            >
              <div>
                {/* Brand Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 overflow-hidden p-1 flex items-center justify-center shadow-xs">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Fallback avatar if image doesn't load
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {brand.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> Verified OEM
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-gray-900 group-hover:text-[#16A34A] transition-colors">
                  {brand.name}
                </h3>
                <span className="text-[11px] text-gray-500 block mt-0.5 font-medium flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span>{brand.origin}</span>
                </span>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                  {brand.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200/80 px-2 py-0.5 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Warranty & Action */}
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {brand.warrantyPeriod}
                </span>
                <Link
                  to="/vehicles"
                  className="font-bold text-gray-700 group-hover:text-[#16A34A] inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
