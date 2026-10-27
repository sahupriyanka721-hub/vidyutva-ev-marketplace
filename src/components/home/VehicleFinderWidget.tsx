import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sliders, ArrowRight, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { VEHICLES_DATA } from '../../data/seedData';
import { VehicleCard } from '../vehicles/VehicleCard';

export const VehicleFinderWidget: React.FC = () => {
  const [category, setCategory] = useState<string>('ALL');
  const [usageType, setUsageType] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(400000);
  const [dailyKm, setDailyKm] = useState<number>(60);
  const [minRange, setMinRange] = useState<number>(80);
  const [chargingPref, setChargingPref] = useState<string>('ALL');
  const [preferredCity, setPreferredCity] = useState<string>('New Delhi');
  const [financeRequired, setFinanceRequired] = useState<string>('ANY');

  // Filter logic
  const matchedVehicles = VEHICLES_DATA.filter((v) => {
    if (category !== 'ALL' && v.category !== category) return false;
    if (usageType !== 'ALL' && v.usageType !== usageType) return false;
    if (v.exShowroomPrice > maxBudget) return false;
    if (v.certifiedRangeKm < minRange) return false;
    if (chargingPref === 'FAST' && !v.fastChargingTimeMin) return false;
    return true;
  });

  const resetFilters = () => {
    setCategory('ALL');
    setUsageType('ALL');
    setMaxBudget(400000);
    setDailyKm(60);
    setMinRange(80);
    setChargingPref('ALL');
    setPreferredCity('New Delhi');
    setFinanceRequired('ANY');
  };

  return (
    <section className="py-16 bg-[#F0F4F8] border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Interactive Matchmaker</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Find the Right EV for Your Needs
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Filter by your daily running kilometres, budget, commercial requirements, and charging preferences to find your optimal electric vehicle.
          </p>
        </div>

        {/* Finder Interactive Control Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E9E4] shadow-premium mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Vehicle Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="ALL">All Categories</option>
                <option value="ELECTRIC_SCOOTER">Electric Scooters</option>
                <option value="ELECTRIC_PASSENGER_AUTO">Electric Passenger Autos (3W)</option>
                <option value="ELECTRIC_CARGO_AUTO">Electric Cargo 3-Wheelers</option>
                <option value="ELECTRIC_LOADER">Commercial Loaders</option>
              </select>
            </div>

            {/* 2. Usage Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Personal or Commercial Usage
              </label>
              <select
                value={usageType}
                onChange={(e) => setUsageType(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="ALL">Any Usage</option>
                <option value="PERSONAL">Personal / Daily Commute</option>
                <option value="COMMERCIAL">Commercial / Passenger & Delivery</option>
                <option value="FLEET">Heavy Industrial Fleet</option>
              </select>
            </div>

            {/* 3. Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700">Max Budget</label>
                <span className="text-xs font-mono font-bold text-[#14532D]">
                  ₹{(maxBudget / 100000).toFixed(1)} Lakh
                </span>
              </div>
              <input
                type="range"
                min={70000}
                max={400000}
                step={10000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#14532D] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>₹70k</span>
                <span>₹4.0L</span>
              </div>
            </div>

            {/* 4. Expected Daily Kilometres */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700">Daily Running (km)</label>
                <span className="text-xs font-mono font-bold text-[#14532D]">{dailyKm} km/day</span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={10}
                value={dailyKm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDailyKm(val);
                  setMinRange(val + 10);
                }}
                className="w-full accent-[#14532D] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>20 km</span>
                <span>150 km</span>
              </div>
            </div>

            {/* 5. Required Range */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Required Range per Charge
              </label>
              <select
                value={minRange}
                onChange={(e) => setMinRange(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value={80}>80+ km Range</option>
                <option value={100}>100+ km Range</option>
                <option value={130}>130+ km Range</option>
                <option value={160}>160+ km Long Range</option>
              </select>
            </div>

            {/* 6. Charging Preference */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Charging Preference
              </label>
              <select
                value={chargingPref}
                onChange={(e) => setChargingPref(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="ALL">Any Charging Type</option>
                <option value="FAST">Supports Fast Charging (&lt; 90m)</option>
                <option value="HOME">Standard 5A Home Charging</option>
              </select>
            </div>

            {/* 7. Preferred City */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Preferred City
              </label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="New Delhi">New Delhi / NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            {/* 8. Finance Requirement */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Finance / EMI Preference
              </label>
              <select
                value={financeRequired}
                onChange={(e) => setFinanceRequired(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="ANY">Full Payment or EMI</option>
                <option value="YES">Need Low-EMI Financing (&lt; ₹3,999/mo)</option>
                <option value="CASH">Direct Upfront Purchase</option>
              </select>
            </div>

          </div>

          {/* Reset Action & Summary */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-gray-600">
              Found <strong className="text-[#14532D] font-bold">{matchedVehicles.length}</strong> matching vehicles for your profile in <strong>{preferredCity}</strong>
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>

        {/* Matched Vehicles Display */}
        {matchedVehicles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 p-6">
            <h4 className="text-base font-bold text-gray-800 mb-1">
              No vehicles found matching these specific parameters
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Try adjusting the max budget or daily kilometre requirement to view available models.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {matchedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
