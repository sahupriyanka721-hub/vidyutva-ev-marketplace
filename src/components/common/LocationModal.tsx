import React, { useState } from 'react';
import { MapPin, X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { INDIAN_PINCODES } from '../../data/seedData';

export const LocationModal: React.FC = () => {
  const { city, pincode, isLocationModalOpen, closeLocationModal, setLocation, checkPincode } = useLocation();
  const [inputPin, setInputPin] = useState('');
  const [checkedResult, setCheckedResult] = useState<ReturnType<typeof checkPincode> | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocationModalOpen) return null;

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = inputPin.trim();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
      setCheckedResult(null);
      return;
    }
    setErrorMsg('');
    const res = checkPincode(pin);
    setCheckedResult(res);
  };

  const handleConfirmLocation = (c: string, p: string) => {
    setLocation(c, p);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeLocationModal}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#14532D]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Select Your Location</h3>
            <p className="text-xs text-gray-500">Check vehicle delivery, doorstep service & test drive coverage</p>
          </div>
        </div>

        {/* Current Selection */}
        <div className="mb-5 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Current Location</span>
            <p className="text-sm font-bold text-gray-900">{city} — <span className="font-mono">{pincode}</span></p>
          </div>
          <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
          </span>
        </div>

        {/* Enter PIN Code Form */}
        <form onSubmit={handlePincodeSubmit} className="mb-6">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Enter 6-Digit PIN Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 110001, 560001"
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value.replace(/\D/g, ''));
                setErrorMsg('');
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Verify
            </button>
          </div>
          {errorMsg && <p className="text-xs text-red-600 mt-1.5">{errorMsg}</p>}
        </form>

        {/* Verification Result Card */}
        {checkedResult && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">{checkedResult.city}, {checkedResult.state} ({checkedResult.pincode})</span>
              <button
                type="button"
                onClick={() => handleConfirmLocation(checkedResult.city, checkedResult.pincode)}
                className="text-xs font-semibold bg-[#14532D] text-white px-3 py-1.5 rounded-lg hover:bg-[#0d381e]"
              >
                Set as Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-3 pt-3 border-t border-emerald-100">
              <div className="flex items-center gap-1.5">
                {checkedResult.vehicleDelivery ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>Vehicle Delivery: {checkedResult.vehicleDelivery ? 'Available' : 'Dealership Pickup'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {checkedResult.doorstepService ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>Doorstep Service: {checkedResult.doorstepService ? 'Active' : 'Service Hub only'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {checkedResult.testDriveHome ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span>Doorstep Test Drive: {checkedResult.testDriveHome ? 'Free at Home' : 'At Dealership'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Spare Parts: {checkedResult.partsShippingExpress ? 'Express 24-48h' : 'Standard 3-5d'}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Nearest Hub: <span className="font-medium text-gray-800">{checkedResult.nearestDealership}</span>
            </p>
          </div>
        )}

        {/* Popular Cities Quick Select */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2.5">
            Or Quick Select Top EV Cities
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INDIAN_PINCODES.slice(0, 9).map((p) => (
              <button
                key={p.pincode}
                onClick={() => handleConfirmLocation(p.city, p.pincode)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  pincode === p.pincode
                    ? 'border-[#14532D] bg-emerald-50 text-[#14532D] font-bold ring-1 ring-[#14532D]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="font-semibold truncate">{p.city}</div>
                <div className="text-[11px] text-gray-500 font-mono">{p.pincode}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
