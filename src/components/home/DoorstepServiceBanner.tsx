import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { SERVICE_CATEGORIES, VEHICLES_DATA } from '../../data/seedData';

export const DoorstepServiceBanner: React.FC = () => {
  const navigate = useNavigate();
  const { city, pincode, serviceability, openLocationModal } = useLocation();

  const [inputPincode, setInputPincode] = useState(pincode);
  const [selectedVehicle, setSelectedVehicle] = useState('veh-eglide-pro');
  const [selectedServiceKey, setSelectedServiceKey] = useState('PERIODIC_MAINTENANCE');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState('10:00 AM - 12:00 PM');

  const activeService = SERVICE_CATEGORIES.find(s => s.key === selectedServiceKey) || SERVICE_CATEGORIES[0];

  const handleBookServiceRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/service?pincode=${encodeURIComponent(inputPincode)}&vehicle=${encodeURIComponent(selectedVehicle)}&service=${encodeURIComponent(selectedServiceKey)}&date=${encodeURIComponent(preferredDate)}&slot=${encodeURIComponent(preferredSlot)}`);
  };

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#06152B] via-[#0B2545] to-[#030B17] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl -z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B7F34A]/10 rounded-full filter blur-3xl -z-0 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#B7F34A] border border-white/10">
                <Wrench className="w-3.5 h-3.5" />
                <span>Doorstep EV Maintenance Van</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Expert EV Service, <br />
                <span className="text-[#B7F34A]">At Your Doorstep.</span>
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Skip the workshop queues. Our certified EV technicians arrive in fully equipped mobile service vans to inspect, calibrate, and service your electric vehicle right at your parking lot.
              </p>

              {/* Coverage notice */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B7F34A] shrink-0" />
                  <span>
                    Service availability: <strong className="text-white">{city} ({pincode})</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-200">
                  {serviceability.doorstepService ? (
                    <span className="flex items-center gap-1 text-[#B7F34A]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Doorstep Mobile Van is Active in your area
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5" /> Hub inspection available; Doorstep expanding soon
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#B7F34A]" /> 40-Point Digital Scan
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" /> No Hidden Charges
                </span>
              </div>
            </div>

            {/* Right Interactive Quick Booking Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Schedule Doorstep Service
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Select your vehicle and problem type for instant indicative pricing.
              </p>

              <form onSubmit={handleBookServiceRedirect} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Pincode & City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Service PIN Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={inputPincode}
                        onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                      />
                    </div>
                  </div>

                  {/* Select Vehicle */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Select Vehicle Model
                    </label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                    >
                      {VEHICLES_DATA.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choose Service Type */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Choose Service Package
                    </label>
                    <select
                      value={selectedServiceKey}
                      onChange={(e) => setSelectedServiceKey(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                    >
                      {SERVICE_CATEGORIES.map(s => (
                        <option key={s.key} value={s.key}>
                          {s.name} — Indicative Fee: ₹{s.baseEstimatePrice} ({s.estimatedMinutes} mins)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Available Time Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                </div>

                {/* Indicative Pricing Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      {activeService.name}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Standard doorstep diagnosis & labour estimate
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#14532D]">
                      ₹{activeService.baseEstimatePrice}
                    </span>
                    <span className="text-[10px] text-gray-400 block">+ GST if applicable</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <span>Continue Booking Doorstep Service</span>
                  <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
