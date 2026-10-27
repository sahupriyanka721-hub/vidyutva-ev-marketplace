import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Building,
  User as UserIcon,
  Phone,
  Star,
  Check,
  X,
  FileText
} from 'lucide-react';
import { SERVICE_CATEGORIES, VEHICLES_DATA } from '../data/seedData';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storageService';
import { VehicleCategoryType } from '../types';

export const ServiceBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city: defaultCity, pincode: defaultPincode, serviceability } = useLocation();

  // Wizard state: 1: Location, 2: Vehicle, 3: Service Type, 4: Issue & Urgency, 5: Appointment & Mode, 6: Summary & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Location
  const [pincode, setPincode] = useState(searchParams.get('pincode') || defaultPincode);
  const [city, setCity] = useState(defaultCity);
  const [address, setAddress] = useState('B-42, Gulmohar Enclave, Near Community Park');
  const [customerName, setCustomerName] = useState(user?.fullName || 'Arjun Singhania');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '9876543210');

  // Step 2: Vehicle
  const initialVehicleId = searchParams.get('vehicle') || VEHICLES_DATA[0].id;
  const matchedVeh = VEHICLES_DATA.find(v => v.id === initialVehicleId) || VEHICLES_DATA[0];
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategoryType>(matchedVeh.category);
  const [vehicleBrand, setVehicleBrand] = useState(matchedVeh.brand);
  const [vehicleModel, setVehicleModel] = useState(matchedVeh.name);
  const [vehicleRegNo, setVehicleRegNo] = useState('DL-01-EV-4422');
  const [purchaseYear, setPurchaseYear] = useState('2024');

  // Step 3: Service Type
  const initialServiceKey = searchParams.get('service') || 'PERIODIC_MAINTENANCE';
  const [selectedServiceKey, setSelectedServiceKey] = useState(initialServiceKey);
  const activeService = SERVICE_CATEGORIES.find(s => s.key === selectedServiceKey) || SERVICE_CATEGORIES[0];

  // Step 4: Problem & Urgency
  const [problemDescription, setProblemDescription] = useState('Routine 40-point safety check and front brake inspection.');
  const [urgency, setUrgency] = useState<'STANDARD' | 'PRIORITY' | 'EMERGENCY_BREAKDOWN'>('STANDARD');
  const [symptoms, setSymptoms] = useState<string[]>(['Brake Noise']);

  // Step 5: Appointment & Mode
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [appointmentDate, setAppointmentDate] = useState(searchParams.get('date') || tomorrow.toISOString().split('T')[0]);
  const [appointmentSlot, setAppointmentSlot] = useState(searchParams.get('slot') || '10:00 AM - 12:00 PM');
  const [serviceMode, setServiceMode] = useState<'DOORSTEP' | 'SERVICE_CENTRE'>('DOORSTEP');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedService, setConfirmedService] = useState<any>(null);

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = storage.createServiceBooking({
        userId: user?.id || 'usr-demo-001',
        serviceCategoryKey: activeService.key,
        serviceCategoryName: activeService.name,
        vehicleType: vehicleCategory,
        vehicleBrand,
        vehicleModel,
        vehicleRegNo,
        serviceMode,
        urgency,
        problemDescription: `${problemDescription}. Symptoms observed: ${symptoms.join(', ')}`,
        appointmentDate,
        appointmentSlot,
        customerName,
        customerPhone,
        pincode,
        city,
        addressLine: `${address}, ${city} - ${pincode}`,
        baseFee: activeService.baseEstimatePrice,
        inspectionFee: 299,
        totalApprovedAmount: 299,
        isCustomerApproved: false
      });

      setConfirmedService(newBooking);
      setIsSubmitting(false);
      setCurrentStep(6);
    }, 800);
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Doorstep EV Servicing</span>
        </nav>

        {currentStep < 6 && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Doorstep EV Service & Diagnostics
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Mobile EV service vans equipped with diagnostic scanners, genuine spare parts, and certified technicians.
            </p>

            {/* Stepper */}
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400">
              {[
                { s: 1, label: 'Location' },
                { s: 2, label: 'Vehicle' },
                { s: 3, label: 'Service' },
                { s: 4, label: 'Issue' },
                { s: 5, label: 'Schedule' }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      currentStep >= item.s
                        ? 'bg-[#14532D] text-white shadow-sm'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > item.s ? <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" /> : item.s}
                  </div>
                  <span className={`hidden sm:inline ${currentStep >= item.s ? 'text-gray-900 font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {item.s < 5 && <div className="w-8 sm:w-12 h-0.5 bg-gray-200 hidden sm:block"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Customer Location & Pincode Coverage */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Step 1: Check Doorstep Service Coverage
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (For Van Coordination)</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Service PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Service Address (Where Van Will Park)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House number, Society name, Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>
            </div>

            {/* Coverage status banner */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>
                  Doorstep Mobile Van Coverage for <strong>{city} ({pincode})</strong>:
                </span>
              </div>
              <span className="font-bold text-[#14532D] bg-emerald-100 px-2.5 py-1 rounded-full">
                ACTIVE & DISPATCH-READY
              </span>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e]"
              >
                <span>Continue to Vehicle Details</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Step 2: Enter Vehicle Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Category</label>
                <select
                  value={vehicleCategory}
                  onChange={(e) => setVehicleCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                >
                  <option value="ELECTRIC_SCOOTER">Electric Scooter</option>
                  <option value="ELECTRIC_PASSENGER_AUTO">Passenger Auto (3W)</option>
                  <option value="ELECTRIC_CARGO_AUTO">Cargo Delivery 3W</option>
                  <option value="ELECTRIC_LOADER">Industrial Loader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Make / Brand</label>
                <input
                  type="text"
                  required
                  value={vehicleBrand}
                  onChange={(e) => setVehicleBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Registration Plate (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. DL-01-EV-1234"
                  value={vehicleRegNo}
                  onChange={(e) => setVehicleRegNo(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Year of Purchase</label>
                <select
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022 or Older</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(1)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e]"
              >
                <span>Continue to Service Package</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Service Type Selection */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Step 3: Select Service Package
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_CATEGORIES.map((srv) => (
                <div
                  key={srv.key}
                  onClick={() => setSelectedServiceKey(srv.key)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedServiceKey === srv.key
                      ? 'border-[#14532D] bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{srv.name}</span>
                      <span className="text-xs font-mono font-black text-[#14532D]">
                        ₹{srv.baseEstimatePrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {srv.shortDescription}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 font-mono">
                    Est Duration: ~{srv.estimatedMinutes} mins
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(2)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e]"
              >
                <span>Continue to Issue Details</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Problem Description & Urgency */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Step 4: Describe Symptoms & Urgency
            </span>

            {/* Quick Symptom Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Common Symptoms (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Brake Noise / Sponginess',
                  'Range Dropped Significantly',
                  'Charging Cuts Off Early',
                  'Vibration at High Speed',
                  'Loose Throttle',
                  'Headlamp / Indicator Flickering',
                  'Speedometer Error Code'
                ].map((sym) => {
                  const isChecked = symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-[#14532D] bg-[#14532D] text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description of the Issue</label>
              <textarea
                rows={3}
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Service Urgency</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUrgency('STANDARD')}
                  className={`p-3 rounded-xl border text-left ${urgency === 'STANDARD' ? 'border-[#14532D] bg-emerald-50 font-bold' : 'border-gray-200'}`}
                >
                  <span className="block text-gray-900">Standard</span>
                  <span className="text-[10px] text-gray-500">Within 48 hours</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('PRIORITY')}
                  className={`p-3 rounded-xl border text-left ${urgency === 'PRIORITY' ? 'border-[#14532D] bg-emerald-50 font-bold' : 'border-gray-200'}`}
                >
                  <span className="block text-gray-900">Priority</span>
                  <span className="text-[10px] text-gray-500">Next 24 hours</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('EMERGENCY_BREAKDOWN')}
                  className={`p-3 rounded-xl border text-left ${urgency === 'EMERGENCY_BREAKDOWN' ? 'border-rose-500 bg-rose-50 font-bold text-rose-900' : 'border-gray-200'}`}
                >
                  <span className="block">SOS Breakdown</span>
                  <span className="text-[10px] text-rose-600">Immediate dispatch</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(3)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e]"
              >
                <span>Continue to Appointment</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Appointment Schedule & Approval Policy */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Step 5: Schedule Date & Appointment Mode
            </span>

            {/* Service Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setServiceMode('DOORSTEP')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 ${
                  serviceMode === 'DOORSTEP' ? 'border-[#14532D] bg-emerald-50/50' : 'border-gray-200'
                }`}
              >
                <Truck className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs text-gray-900">Doorstep Mobile Service Van</strong>
                  <span className="text-[11px] text-gray-500">Technician visits your location with tools.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setServiceMode('SERVICE_CENTRE')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 ${
                  serviceMode === 'SERVICE_CENTRE' ? 'border-[#14532D] bg-emerald-50/50' : 'border-gray-200'
                }`}
              >
                <Building className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs text-gray-900">Authorized Workshop Hub</strong>
                  <span className="text-[11px] text-gray-500">Ride in directly to our certified workshop.</span>
                </div>
              </button>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  min={tomorrow.toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time Slot</label>
                <select
                  value={appointmentSlot}
                  onChange={(e) => setAppointmentSlot(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#14532D]"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Mid-day)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Strict Additional Repair Policy Notice (Section 11) */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                Customer Approval Guarantee
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Initial doorstep diagnostic inspection fee is <strong>₹299</strong>. The service partner is strictly prohibited from commencing any paid part replacement or additional repair without your digital approval on your live customer dashboard.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(4)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={handleBookService}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#14532D] hover:bg-[#0d381e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-premium"
              >
                {isSubmitting ? (
                  <span>Assigning Service Van...</span>
                ) : (
                  <>
                    <span>Confirm Doorstep Service Booking</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation Screen */}
        {currentStep === 6 && confirmedService && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-elevated space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Service Request ID: {confirmedService.bookingNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                Service Booking Scheduled!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Technician van has been queued for your appointment on <strong>{confirmedService.appointmentDate} ({confirmedService.appointmentSlot})</strong>.
              </p>
            </div>

            {/* Summary */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Service Package</span>
                <strong className="text-gray-900">{confirmedService.serviceCategoryName}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Vehicle</span>
                <strong className="text-gray-900">{confirmedService.vehicleBrand} {confirmedService.vehicleModel}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Service Address</span>
                <p className="text-gray-800">{confirmedService.addressLine}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Assigned Technician</span>
                <p className="text-gray-800 font-bold">{confirmedService.technician?.name} ({confirmedService.technician?.vanNumber})</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard?tab=service-bookings"
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-premium hover:bg-[#0d381e]"
              >
                Track Live Van & Review Technician Reports
              </Link>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
