import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { VEHICLES_DATA } from '../../data/seedData';

export const CompareBar: React.FC = () => {
  const { comparedVehicleIds, removeVehicleFromCompare, clearCompare, maxVehicles } = useCompare();

  if (comparedVehicleIds.length === 0) {
    return (
      <div className="fixed bottom-16 md:bottom-5 right-4 z-40 animate-in fade-in">
        <Link
          to="/compare"
          className="px-4 py-2.5 rounded-full bg-[#06152B] text-white shadow-2xl hover:bg-[#0B2545] border border-emerald-500/40 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
          title="Compare EV Vehicles"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#B7F34A]" />
          <span>Compare Vehicles</span>
        </Link>
      </div>
    );
  }

  const comparedVehicles = comparedVehicleIds
    .map(id => VEHICLES_DATA.find(v => v.id === id || v.modelSlug === id))
    .filter(Boolean);

  return (
    <aside aria-label="Vehicle comparison dock" className="fixed bottom-14 md:bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl p-3 sm:p-4 animate-in slide-in-from-bottom-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#14532D] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">
              Vehicle Comparison ({comparedVehicles.length}/{maxVehicles})
            </h4>
            <p className="text-[10px] text-gray-500">Compare range, battery, top speed, and on-road pricing</p>
          </div>
        </div>

        {/* Thumbnail chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {comparedVehicles.map(v => v && (
            <div
              key={v.id}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-gray-100 rounded-xl border border-gray-200 text-xs shrink-0"
            >
              <img src={v.images[0].url} alt={v.name} className="w-6 h-6 object-cover rounded-md" />
              <span className="font-semibold text-gray-800 max-w-[120px] truncate">{v.name}</span>
              <button
                onClick={() => removeVehicleFromCompare(v.id)}
                className="text-gray-400 hover:text-rose-600 p-0.5 rounded-full"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2 py-1"
          >
            Clear All
          </button>
          <Link
            to="/compare"
            className="px-4 py-2 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A]" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
