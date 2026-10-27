import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { VEHICLES_DATA } from '../../data/seedData';
import { VehicleCard } from '../vehicles/VehicleCard';

export const FeaturedVehiclesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SCOOTER' | 'PASSENGER_AUTO' | 'CARGO_LOADER'>('ALL');

  const filteredVehicles = VEHICLES_DATA.filter((v) => {
    if (activeTab === 'SCOOTER') return v.category === 'ELECTRIC_SCOOTER';
    if (activeTab === 'PASSENGER_AUTO') return v.category === 'ELECTRIC_PASSENGER_AUTO';
    if (activeTab === 'CARGO_LOADER') return v.category === 'ELECTRIC_CARGO_AUTO' || v.category === 'ELECTRIC_LOADER';
    return true;
  });

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Clean Mobility</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Featured Electric Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Compare certified electric two-wheelers and three-wheelers with transparent pricing, guaranteed range disclosures, and direct booking options.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto text-xs font-bold text-gray-600">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'ALL' ? 'bg-[#14532D] text-white shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              All Vehicles
            </button>
            <button
              onClick={() => setActiveTab('SCOOTER')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'SCOOTER' ? 'bg-[#14532D] text-white shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              Electric Scooters
            </button>
            <button
              onClick={() => setActiveTab('PASSENGER_AUTO')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'PASSENGER_AUTO' ? 'bg-[#14532D] text-white shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              Passenger Autos
            </button>
            <button
              onClick={() => setActiveTab('CARGO_LOADER')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'CARGO_LOADER' ? 'bg-[#14532D] text-white shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              Cargo & Loaders
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Bottom CTA to full listing */}
        <div className="mt-12 text-center">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-premium transition-all hover:scale-[1.02]"
          >
            <span>Explore Complete EV Catalog ({VEHICLES_DATA.length} Models)</span>
            <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
