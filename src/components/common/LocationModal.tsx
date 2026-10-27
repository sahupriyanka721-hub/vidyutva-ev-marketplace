import React, { useState, useMemo } from 'react';
import { MapPin, X, CheckCircle2, Check } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { INDIAN_PINCODES } from '../../data/seedData';

export const LocationModal: React.FC = () => {
  const { city, pincode, isLocationModalOpen, closeLocationModal, setLocation, checkPincode } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live filtered locations based on user input (matching city name, state, or PIN code)
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return INDIAN_PINCODES.filter(
      p =>
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.pincode.includes(q)
    ).slice(0, 10);
  }, [searchQuery]);

  if (!isLocationModalOpen) return null;

  const handleSelectLocation = (selectedCity: string, selectedPin: string) => {
    setLocation(selectedCity, selectedPin);
    setSearchQuery('');
    setErrorMsg('');
    closeLocationModal();
  };

  // Submit any custom location (city name, town, locality or PIN code)
  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = searchQuery.trim();
    if (!val) {
      setErrorMsg('Please enter a city name, area, or PIN code');
      return;
    }

    // 1. If user typed a 6-digit Indian PIN code
    if (/^[1-9][0-9]{5}$/.test(val)) {
      const res = checkPincode(val);
      handleSelectLocation(res.city, res.pincode);
      return;
    }

    // 2. If user typed a city name matching a known hub
    const qLower = val.toLowerCase();
    const matched = INDIAN_PINCODES.find(
      p => p.city.toLowerCase() === qLower || p.city.toLowerCase().includes(qLower)
    );
    if (matched) {
      handleSelectLocation(matched.city, matched.pincode);
      return;
    }

    // 3. Any custom city, town, district, or area anywhere
    const formattedCity = val
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    handleSelectLocation(formattedCity, pincode || '110001');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLocationModal();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={closeLocationModal}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#14532D] shrink-0">
            <MapPin className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
              Select Delivery Location
            </h3>
            <p className="text-xs text-gray-500">
              Enter any city, area, or PIN code across India
            </p>
          </div>
        </div>

        {/* Current Active Location */}
        <div className="mb-4 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Current Active Location
              </span>
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                {city} — <span className="font-mono text-emerald-950 font-black">{pincode}</span>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#14532D] bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
            Active
          </span>
        </div>

        {/* Location Input Field (No Search Symbol) */}
        <form onSubmit={handleLocationSubmit} className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Enter City Name, Area or 6-Digit PIN Code
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              autoFocus
              placeholder="e.g. Mumbai, Ranchi, Patna, Lucknow, 400001, 800001..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-4 pr-28 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-[#16A34A] text-gray-900 placeholder-gray-400 font-medium"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Set Location
              </button>
            )}
          </div>
          {errorMsg && <p className="text-xs text-rose-600 mt-1 font-medium">{errorMsg}</p>}
        </form>

        {/* Scrollable Results Area */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          
          {/* Live Matching Results (if typing) */}
          {searchQuery.trim().length > 0 && (
            <div className="space-y-3">
              {/* Quick 1-click set for typed location */}
              <button
                type="button"
                onClick={() => handleLocationSubmit()}
                className="w-full text-left p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between hover:bg-emerald-100 transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      Use &quot;{searchQuery.trim()}&quot;
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Click to set as your delivery location
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#14532D] bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  Select →
                </span>
              </button>

              {filteredLocations.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Matching Locations ({filteredLocations.length})
                  </span>
                  <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white">
                    {filteredLocations.map((loc) => {
                      const isSelected = pincode === loc.pincode;
                      return (
                        <button
                          key={loc.pincode}
                          type="button"
                          onClick={() => handleSelectLocation(loc.city, loc.pincode)}
                          className={`w-full text-left p-3 flex items-center justify-between hover:bg-emerald-50/70 transition-colors ${
                            isSelected ? 'bg-emerald-50/90 text-emerald-950 font-bold' : 'text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#16A34A]' : 'text-gray-400'}`} />
                            <div>
                              <span className="text-xs sm:text-sm font-bold block">{loc.city}</span>
                              <span className="text-[11px] text-gray-500">
                                {loc.state} • PIN: <strong className="font-mono text-gray-800">{loc.pincode}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Tier {loc.tier} Delivery
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#16A34A] ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Select Top EV Cities (when not typing) */}
          {searchQuery.trim().length === 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Major EV City
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Doorstep Service Active
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDIAN_PINCODES.slice(0, 18).map((p) => {
                  const isCurrent = pincode === p.pincode;
                  return (
                    <button
                      key={p.pincode}
                      type="button"
                      onClick={() => handleSelectLocation(p.city, p.pincode)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isCurrent
                          ? 'border-[#14532D] bg-emerald-50 text-[#14532D] font-bold ring-2 ring-[#14532D]/30 shadow-xs'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 truncate">{p.city}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />}
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono block">PIN: {p.pincode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
