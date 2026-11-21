import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  Building,
  Home
} from 'lucide-react';
import { INDIAN_PINCODES } from '../data/seedData';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storageService';

export const TestDrivePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city: defaultCity, pincode: defaultPincode, serviceability } = useLocation();

  const vehicles = storage.getVehicles();
  const vehicleParam = searchParams.get('vehicle');
  const initialVehicle = vehicles.find(v => v.id === vehicleParam || v.modelSlug === vehicleParam) || vehicles[0];

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle?.id || '');
  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId) || initialVehicle;

  const [testDriveMode, setTestDriveMode] = useState<'DOORSTEP' | 'DEALERSHIP'>('DOORSTEP');
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [city, setCity] = useState(defaultCity);
  const [pincode, setPincode] = useState(defaultPincode);
  const [address, setAddress] = useState('');
  
  // Date selection (disallow past dates, only next 14 days)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 14);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState(minDate);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [notes, setNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  // Available Time Slots (Simulated capacity check)
  const TIME_SLOTS = [
    { slot: '10:00 AM - 11:30 AM', available: true },
    { slot: '11:30 AM - 01:00 PM', available: true },
    { slot: '02:00 PM - 03:30 PM', available: true },
    { slot: '04:00 PM - 05:30 PM', available: true },
    { slot: '05:30 PM - 07:00 PM', available: false }, // simulated booked slot
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9][0-9]{9}$/.test(customerPhone.trim())) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = storage.createTestDriveBooking({
        userId: user?.id,
        vehicleId: currentVehicle.id,
        vehicleName: currentVehicle.name,
        vehicleImage: currentVehicle.images[0]?.url,
        customerName,
        customerPhone,
        customerEmail,
        city,
        pincode,
        testDriveMode,
        dealershipName: serviceability.nearestDealership,
        preferredDate,
        timeSlot,
        notes,
      });

      setBookingConfirmed(newBooking);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Book a Test Drive</span>
        </nav>

        {!bookingConfirmed ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-subtle space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Complimentary & Sanitized</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Schedule a Test Drive
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Experience the quiet power and smooth acceleration of our electric vehicles. Choose home doorstep visit or visit our nearest experience centre.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Vehicle Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Vehicle to Test Drive
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        selectedVehicleId === v.id
                          ? 'border-[#14532D] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={v.images[0].url} alt={v.name} className="w-12 h-10 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-900 block truncate">{v.name}</span>
                        <span className="text-[10px] text-gray-500">{v.certifiedRangeKm} km range</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Test Drive Mode (Doorstep vs Dealership) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Test Drive Location Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTestDriveMode('DOORSTEP')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      testDriveMode === 'DOORSTEP'
                        ? 'border-[#14532D] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Home className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Doorstep Test Drive (At Your Address)</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Our EV mobility specialist brings the vehicle directly to your residence or office.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestDriveMode('DEALERSHIP')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      testDriveMode === 'DEALERSHIP'
                        ? 'border-[#14532D] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Dealership Experience Hub</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Visit {serviceability.nearestDealership} with full charging infrastructure tours.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Customer Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Indian Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value.replace(/\D/g, ''));
                      setPhoneError('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#14532D]"
                  />
                  {phoneError && <p className="text-xs text-rose-600 mt-1">{phoneError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City & PIN Code</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>

                {testDriveMode === 'DOORSTEP' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Doorstep Address</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat number, building name, street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                    />
                  </div>
                )}
              </div>

              {/* 4. Date & Time Slot (Prevent past dates) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Select Date (Next 14 Days)
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    max={maxDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Select Available Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#14532D]"
                  >
                    {TIME_SLOTS.map((s, idx) => (
                      <option key={idx} value={s.slot} disabled={!s.available}>
                        {s.slot} {s.available ? '' : '(Slot Fully Booked)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please bring two helmets for my spouse and me, or gate pass requirements"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              {/* Driving license requirement */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Please have your valid Indian Two-Wheeler / Commercial Driving License ready for physical or DigiLocker verification prior to riding.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#14532D] hover:bg-[#0d381e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium transition-all"
              >
                {isSubmitting ? (
                  <span>Checking Dealer Slot Availability...</span>
                ) : (
                  <>
                    <span>Confirm Test Drive Booking</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-elevated space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Booking ID: {bookingConfirmed.bookingNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                Test Drive Confirmed!
              </h2>
              <p className="text-xs text-gray-500">
                A confirmation SMS & WhatsApp have been queued to <strong>+91 {bookingConfirmed.customerPhone}</strong>
              </p>
            </div>

            {/* Docket summary */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Vehicle</span>
                <strong className="text-gray-900 text-sm">{bookingConfirmed.vehicleName}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Date & Time Slot</span>
                <strong className="text-gray-900">{bookingConfirmed.preferredDate} ({bookingConfirmed.timeSlot})</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Location Mode</span>
                <p className="text-gray-800">{bookingConfirmed.testDriveMode === 'DOORSTEP' ? `Doorstep Delivery at ${address}` : bookingConfirmed.dealershipName}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Status</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">CONFIRMED</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to="/dashboard?tab=test-drives"
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-premium hover:bg-[#0d381e]"
              >
                View in Customer Dashboard (Reschedule / Cancel)
              </Link>
              <button
                onClick={() => setBookingConfirmed(null)}
                className="px-6 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Book Another Test Drive
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
