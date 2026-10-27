import React, { useState, useMemo } from 'react';
import { MapPin, X, CheckCircle2, Check } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { searchIndianCities, lookupCityOrPincode, ALL_INDIAN_CITIES } from '../../data/indianCitiesPincodes';

export const LocationModal: React.FC = () => {
  const { city, pincode, isLocationModalOpen, closeLocationModal, setLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live matching locations from comprehensive 289+ Indian cities and postal database
  const filteredLocations = useMemo(() => {
    return searchIndianCities(searchQuery, 12);
  }, [searchQuery]);

  // Real-time preview of exact city & PIN code resolution
  const resolvedPreview = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return lookupCityOrPincode(searchQuery.trim());
  }, [searchQuery]);

  if (!isLocationModalOpen) return null;

  const handleSelectLocation = (selectedCity: string, selectedPin: string) => {
    setLocation(selectedCity, selectedPin);
    setSearchQuery('');
    setErrorMsg('');
    closeLocationModal();
  };

  // Submit any city or PIN code
  const handleLocationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = searchQuery.trim();
    if (!val) {
      setErrorMsg('Please enter a city name or PIN code');
      return;
    }

    const resolved = lookupCityOrPincode(val);
    handleSelectLocation(resolved.city, resolved.pincode);
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
              Type any Indian city name — exact PIN code will be selected automatically
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
            Enter City Name or 6-Digit PIN Code
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              autoFocus
              placeholder="e.g. Darbhanga, Ranchi, Patna, Gorakhpur, Lucknow, 800001..."
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
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Set Location
              </button>
            )}
          </div>
          {errorMsg && <p className="text-xs text-rose-600 mt-1 font-medium">{errorMsg}</p>}
        </form>

        {/* Scrollable Results Area */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          
          {/* Live Resolved City + Exact PIN Confirmation Card (when typing) */}
          {resolvedPreview && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSelectLocation(resolvedPreview.city, resolvedPreview.pincode)}
                className="w-full text-left p-3.5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-500 flex items-center justify-between hover:bg-emerald-100/80 transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-emerald-950">
                        {resolvedPreview.city}
                      </span>
                      <span className="font-mono text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
                        PIN: {resolvedPreview.pincode}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                      {resolvedPreview.state} • Doorstep Delivery & Service Active
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-white bg-[#14532D] px-3 py-1.5 rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  Confirm →
                </span>
              </button>

              {/* Matching Hubs */}
              {filteredLocations.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Matching Locations ({filteredLocations.length})
                  </span>
                  <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-2xs">
                    {filteredLocations.map((loc) => {
                      const isSelected = pincode === loc.pincode;
                      return (
                        <button
                          key={`${loc.city}-${loc.pincode}`}
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
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                              {loc.pincode}
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
                  Select Major Indian City
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Doorstep Service Active
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { city: 'Patna', pincode: '800001' },
                  { city: 'Ranchi', pincode: '834001' },
                  { city: 'Darbhanga', pincode: '846004' },
                  { city: 'Muzaffarpur', pincode: '842001' },
                  { city: 'Gorakhpur', pincode: '273001' },
                  { city: 'Lucknow', pincode: '226001' },
                  { city: 'Kanpur', pincode: '208001' },
                  { city: 'Varanasi', pincode: '221001' },
                  { city: 'New Delhi', pincode: '110001' },
                  { city: 'Noida', pincode: '201301' },
                  { city: 'Mumbai', pincode: '400001' },
                  { city: 'Pune', pincode: '411001' },
                  { city: 'Bengaluru', pincode: '560001' },
                  { city: 'Hyderabad', pincode: '500001' },
                  { city: 'Kolkata', pincode: '700001' },
                  { city: 'Jaipur', pincode: '302001' },
                  { city: 'Ahmedabad', pincode: '380001' },
                  { city: 'Chandigarh', pincode: '160017' }
                ].map((p) => {
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
