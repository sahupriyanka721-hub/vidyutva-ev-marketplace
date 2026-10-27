import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Zap,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Lock
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/seedData';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storageService';

export const VehicleCheckoutPage: React.FC = () => {
  const { modelSlug } = useParams<{ modelSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { city: defaultCity, pincode: defaultPin } = useLocation();

  const vehicle = VEHICLES_DATA.find(
    (v) => v.modelSlug === modelSlug || v.id === modelSlug
  ) || VEHICLES_DATA[0];

  const variantParam = searchParams.get('variant');
  const initialVariant = vehicle.variants.find(v => v.id === variantParam) || vehicle.variants[0];

  // Steps: 1: Variant/Color, 2: Delivery Address, 3: Pricing & Accessories, 4: Financing Preference, 5: Payment Gateway, 6: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // Address
  const defaultAddress = user?.savedAddresses?.find(a => a.isDefault) || user?.savedAddresses?.[0];
  const [fullName, setFullName] = useState(defaultAddress?.fullName || user?.fullName || 'Arjun Singhania');
  const [phone, setPhone] = useState(defaultAddress?.phone || user?.phone || '9876543210');
  const [email, setEmail] = useState(user?.email || 'arjun.singhania@example.com');
  const [pincode, setPincode] = useState(defaultAddress?.pincode || defaultPin || '110001');
  const [city, setCity] = useState(defaultAddress?.city || defaultCity || 'New Delhi');
  const [state, setState] = useState(defaultAddress?.state || 'Delhi');
  const [streetAddress, setStreetAddress] = useState(defaultAddress?.line1 || 'B-42, Gulmohar Enclave');
  const [landmark, setLandmark] = useState(defaultAddress?.landmark || 'Opposite Green View Tower');

  // Purchase Preference: TOKEN_BOOKING | FULL_PAYMENT | FINANCE_LOAN
  const [purchasePreference, setPurchasePreference] = useState<'TOKEN_BOOKING' | 'FULL_PAYMENT' | 'FINANCE_LOAN'>('TOKEN_BOOKING');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [loanTenure, setLoanTenure] = useState<number>(36);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Accessory Catalog
  const ACCESSORY_OPTIONS = [
    { id: 'acc-helmet', name: 'ISI Certified Smart Connected Helmet', price: 2999 },
    { id: 'acc-cover', name: 'All-Weather UV & Waterproof Vehicle Cover', price: 999 },
    { id: 'acc-fast-chg', name: 'Home Heavy-Duty Fast Charging Wallbox Kit', price: 5499 },
  ];

  // Pricing calculations
  const exShowroom = vehicle.exShowroomPrice + selectedVariant.priceDifference;
  const subsidy = vehicle.subsidyEstimate;
  const rtoFee = vehicle.rtoEstimate;
  const insuranceFee = vehicle.insuranceEstimate;
  const accessoriesTotal = selectedAccessories.reduce((sum, id) => {
    const acc = ACCESSORY_OPTIONS.find(a => a.id === id);
    return sum + (acc ? acc.price : 0);
  }, 0);
  const totalOnRoad = exShowroom - subsidy + rtoFee + insuranceFee + accessoriesTotal;
  const bookingTokenAmount = vehicle.bookingTokenAmount;

  const payableNow = purchasePreference === 'TOKEN_BOOKING'
    ? bookingTokenAmount
    : purchasePreference === 'FULL_PAYMENT'
    ? totalOnRoad
    : bookingTokenAmount; // For loan, token is paid to lock in the chassis

  // Calculate monthly EMI estimate (assuming ~9.5% APR)
  const loanPrincipal = totalOnRoad - bookingTokenAmount;
  const monthlyRate = 0.095 / 12;
  const estimatedEmiMonthly = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
    (Math.pow(1 + monthlyRate, loanTenure) - 1)
  );

  const handleToggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    // Simulate Razorpay Gateway Server Verification
    const res = await storage.simulateRazorpayPayment({
      amount: payableNow,
      description: `E-VAHAN Booking: ${vehicle.name} (${selectedVariant.colorName})`,
      method: paymentMethod
    });

    const newOrder = storage.createVehicleOrder({
      userId: user?.id || 'usr-demo-001',
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: selectedVariant.imageUrl,
      variantName: selectedVariant.variantName,
      colorName: selectedVariant.colorName,
      colorHex: selectedVariant.colorHex,
      exShowroom,
      subsidyDiscount: subsidy,
      rtoFee,
      insuranceFee,
      deliveryFee: 0,
      totalOnRoad,
      paymentMode: purchasePreference,
      bookingAmountPaid: payableNow,
      balanceDue: Math.max(0, totalOnRoad - payableNow),
      financeDetails: purchasePreference === 'FINANCE_LOAN' ? {
        bankPreference: selectedBank,
        loanTenureMonths: loanTenure,
        estimatedEmiMonthly
      } : undefined,
      deliveryAddress: {
        fullName,
        phone,
        line1: streetAddress,
        landmark,
        city,
        state,
        pincode
      },
      paymentTransactionRef: res.transactionRef,
      paymentMethod: `${paymentMethod} (Razorpay Sandbox)`,
      status: 'BOOKING_CONFIRMED',
      allocatedDealer: `E-VAHAN Authorized Experience Hub, ${city}`
    });

    setConfirmedOrder(newOrder);
    setIsProcessingPayment(false);
    setCurrentStep(6);
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Checkout Header & Progress Indicator */}
        <div className="mb-8">
          <Link to={`/vehicles/${vehicle.modelSlug}`} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-3 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Vehicle Details
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Online Vehicle Purchase & Booking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete your booking in 5 verified steps. Allocates your unit from factory inventory.
          </p>

          {/* Stepper Wizard (Steps 1 to 5) */}
          {currentStep < 6 && (
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400">
              {[
                { s: 1, label: 'Variant' },
                { s: 2, label: 'Delivery' },
                { s: 3, label: 'Summary' },
                { s: 4, label: 'Financing' },
                { s: 5, label: 'Payment' }
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
          )}
        </div>

        {/* STEP 1: Select Model, Variant & Color */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <div className="flex items-center gap-3">
              <img src={selectedVariant.imageUrl} alt={vehicle.name} className="w-24 h-20 object-cover rounded-2xl bg-gray-100" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Step 1: Choose Variant
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{vehicle.name}</h3>
                <p className="text-xs text-gray-500">{vehicle.tagline}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700">Select Available Colour & Battery Variant</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedVariant.id === v.id
                        ? 'border-[#14532D] bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: v.colorHex }} />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{v.colorName}</span>
                        <span className="text-[11px] text-gray-500">{v.stockCount} units in stock</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#14532D]">
                      {v.priceDifference === 0 ? 'Standard' : `+₹${v.priceDifference.toLocaleString('en-IN')}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e] transition-colors"
              >
                <span>Continue to Delivery Address</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Delivery Location & Registration Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Step 2: Delivery & RTO Registration
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Buyer & Delivery Address</h3>
              </div>
              <button onClick={() => setCurrentStep(1)} className="text-xs text-gray-500 hover:underline">
                Back
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name (as per Aadhaar)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">10-Digit Mobile Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">House/Flat & Street Address</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                />
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
                <span>Continue to Price Summary</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Transparent Price Summary & Addons */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Step 3: Itemized Price Summary
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Review Exact Charges</h3>
              </div>
              <button onClick={() => setCurrentStep(2)} className="text-xs text-gray-500 hover:underline">
                Back
              </button>
            </div>

            {/* Optional Accessories */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Recommended Genuine Accessories (Optional)
              </label>
              <div className="space-y-2">
                {ACCESSORY_OPTIONS.map((acc) => {
                  const isChecked = selectedAccessories.includes(acc.id);
                  return (
                    <label
                      key={acc.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked ? 'border-emerald-500 bg-emerald-50/60' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAccessory(acc.id)}
                          className="rounded text-[#14532D] focus:ring-[#14532D]"
                        />
                        <span className="font-semibold text-gray-900">{acc.name}</span>
                      </div>
                      <span className="font-mono font-bold text-[#14532D]">+₹{acc.price.toLocaleString('en-IN')}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Verified Breakdown */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Vehicle Ex-Showroom ({vehicle.name} - {selectedVariant.colorName})</span>
                <span className="font-semibold text-gray-900">₹{exShowroom.toLocaleString('en-IN')}</span>
              </div>
              {subsidy > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>State EV / FAME-II Subsidy Credit</span>
                  <span>-₹{subsidy.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Mandatory RTO Registration & High-Security Plates (HSRP)</span>
                <span>+₹{rtoFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Comprehensive 1+4 Years EV Insurance</span>
                <span>+₹{insuranceFee.toLocaleString('en-IN')}</span>
              </div>
              {accessoriesTotal > 0 && (
                <div className="flex justify-between text-gray-800">
                  <span>Selected Genuine Accessories</span>
                  <span>+₹{accessoriesTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Home Doorstep Delivery & PDI</span>
                <span className="font-bold">FREE</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                <span>Total On-Road Estimated Payable</span>
                <span className="text-base text-[#14532D]">₹{totalOnRoad.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(2)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#0d381e]"
              >
                <span>Continue to Financing Option</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Purchase Preference (Token Booking vs Full Payment vs Loan Enquiry) */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Step 4: Payment Preference
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Choose How You Want to Pay</h3>
              </div>
              <button onClick={() => setCurrentStep(3)} className="text-xs text-gray-500 hover:underline">
                Back
              </button>
            </div>

            {/* 3 Options: Token, Full, Finance */}
            <div className="space-y-3">
              {/* Option A: Token Booking Amount */}
              <div
                onClick={() => setPurchasePreference('TOKEN_BOOKING')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  purchasePreference === 'TOKEN_BOOKING'
                    ? 'border-[#14532D] bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="purchasePref"
                      checked={purchasePreference === 'TOKEN_BOOKING'}
                      onChange={() => setPurchasePreference('TOKEN_BOOKING')}
                      className="text-[#14532D] focus:ring-[#14532D]"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Pay Refundable Booking Amount (₹{bookingTokenAmount.toLocaleString('en-IN')})
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Locks your vehicle chassis from inventory. Balance amount paid to dealer upon KYC & PDI.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#14532D] bg-emerald-100 px-2 py-0.5 rounded-md">
                    Most Popular
                  </span>
                </div>
              </div>

              {/* Option B: Full Payment */}
              <div
                onClick={() => setPurchasePreference('FULL_PAYMENT')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  purchasePreference === 'FULL_PAYMENT'
                    ? 'border-[#14532D] bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="purchasePref"
                      checked={purchasePreference === 'FULL_PAYMENT'}
                      onChange={() => setPurchasePreference('FULL_PAYMENT')}
                      className="text-[#14532D] focus:ring-[#14532D]"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Complete Full Payment Online (₹{totalOnRoad.toLocaleString('en-IN')})
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay total estimated on-road price upfront via UPI/Netbanking. Expedites vehicle dispatch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option C: Finance Loan Enquiry */}
              <div
                onClick={() => setPurchasePreference('FINANCE_LOAN')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  purchasePreference === 'FINANCE_LOAN'
                    ? 'border-[#14532D] bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="purchasePref"
                      checked={purchasePreference === 'FINANCE_LOAN'}
                      onChange={() => setPurchasePreference('FINANCE_LOAN')}
                      className="text-[#14532D] focus:ring-[#14532D]"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Apply for Low-Interest EV Loan / EMI
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay token amount now; loan executive will contact you for instant credit approval.
                      </p>
                    </div>
                  </div>
                </div>

                {purchasePreference === 'FINANCE_LOAN' && (
                  <div className="pt-3 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Preferred Lending Partner</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs"
                      >
                        <option value="HDFC Bank">HDFC Bank EV Loan</option>
                        <option value="State Bank of India (SBI)">SBI Green Car Loan</option>
                        <option value="ICICI Bank">ICICI Bank Auto Loan</option>
                        <option value="Bajaj Finserv">Bajaj Finserv Two-Wheeler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Loan Tenure</label>
                      <select
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs"
                      >
                        <option value={12}>12 Months (1 Year)</option>
                        <option value={24}>24 Months (2 Years)</option>
                        <option value={36}>36 Months (3 Years)</option>
                        <option value={48}>48 Months (4 Years)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 p-2.5 bg-emerald-100/60 rounded-xl text-[11px] text-emerald-900 flex justify-between items-center">
                      <span>Estimated Monthly EMI (at ~9.5% p.a.):</span>
                      <strong className="text-sm font-mono text-[#14532D]">₹{estimatedEmiMonthly.toLocaleString('en-IN')}/mo</strong>
                    </div>
                    <p className="sm:col-span-2 text-[10px] text-gray-500 italic">
                      *Finance enquiry submission is subject to bank credit verification and income eligibility.
                    </p>
                  </div>
                )}
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
                <span>Proceed to Payment (₹{payableNow.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Payment Gateway Simulation (Razorpay Sandbox) */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Step 5: Secure Payment
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Payment Gateway (Razorpay Sandbox)</h3>
              </div>
              <button onClick={() => setCurrentStep(4)} className="text-xs text-gray-500 hover:underline">
                Back
              </button>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Sandbox Test Mode Active</span>
              </div>
              <p className="text-[11px]">
                This is a verified test transaction. No real money will be charged to your bank account or card.
              </p>
            </div>

            {/* Amount Payable */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900">Amount Due Now</span>
                <p className="text-[11px] text-gray-500">
                  {purchasePreference === 'TOKEN_BOOKING' ? 'Refundable Booking Deposit' : 'Full On-Road Amount'}
                </p>
              </div>
              <span className="text-2xl font-black text-[#14532D]">
                ₹{payableNow.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700">Select Payment Instrument</label>
              
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="text-[#14532D] focus:ring-[#14532D]"
                />
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block">UPI Instant Payment</span>
                  <span className="text-[10px] text-gray-400">Google Pay, PhonePe, Paytm, BHIM QR</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="text-[#14532D] focus:ring-[#14532D]"
                />
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block">Credit / Debit Card</span>
                  <span className="text-[10px] text-gray-400">Visa, MasterCard, RuPay, Maestro</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === 'NETBANKING'}
                  onChange={() => setPaymentMethod('NETBANKING')}
                  className="text-[#14532D] focus:ring-[#14532D]"
                />
                <Building className="w-4 h-4 text-emerald-700" />
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block">Net Banking</span>
                  <span className="text-[10px] text-gray-400">HDFC, SBI, ICICI, Axis & 50+ Banks</span>
                </div>
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(4)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900">
                Back
              </button>
              <button
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="px-8 py-3.5 bg-[#14532D] hover:bg-[#0d381e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-premium"
              >
                {isProcessingPayment ? (
                  <span>Verifying Transaction...</span>
                ) : (
                  <>
                    <span>Pay ₹{payableNow.toLocaleString('en-IN')} via Razorpay Sandbox</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation Screen */}
        {currentStep === 6 && confirmedOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-elevated space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] block">
                Booking Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Thank You, {confirmedOrder.deliveryAddress.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Order Reference Number: <strong className="font-mono text-gray-900">{confirmedOrder.orderNumber}</strong>
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Vehicle Ordered</span>
                <strong className="text-sm font-bold text-gray-900">{confirmedOrder.vehicleName}</strong>
                <p className="text-[11px] text-gray-500 mt-0.5">Color: {confirmedOrder.colorName}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Payment Received</span>
                <strong className="text-sm font-bold text-[#14532D]">
                  ₹{confirmedOrder.bookingAmountPaid.toLocaleString('en-IN')} (Paid via {confirmedOrder.paymentMethod})
                </strong>
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">Ref: {confirmedOrder.paymentTransactionRef}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Delivery Address</span>
                <p className="text-gray-800 font-medium">
                  {confirmedOrder.deliveryAddress.line1}, {confirmedOrder.deliveryAddress.city} - {confirmedOrder.deliveryAddress.pincode}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned Dealership</span>
                <p className="text-gray-800 font-medium">{confirmedOrder.allocatedDealer}</p>
              </div>
            </div>

            {/* Next Steps Roadmap (Section 7) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                What Happens Next?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-mono text-[10px] text-emerald-700 font-bold block">01. DEALER CONTACT</span>
                  <p className="text-gray-600 mt-1">Your allocated dealer calls within 4 hours to verify KYC docs.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="font-mono text-[10px] text-gray-400 font-bold block">02. RTO REGISTRATION</span>
                  <p className="text-gray-600 mt-1">Transport department files high-security registration plates (HSRP).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="font-mono text-[10px] text-gray-400 font-bold block">03. PRE-DELIVERY INSPECTION</span>
                  <p className="text-gray-600 mt-1">40-Point electrical and mechanical check before loading.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="font-mono text-[10px] text-gray-400 font-bold block">04. DOORSTEP DELIVERY</span>
                  <p className="text-gray-600 mt-1">Vehicle delivered to your address with key handover.</p>
                </div>
              </div>
            </div>

            {/* Dashboard Redirect Action */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard?tab=vehicle-orders"
                className="px-6 py-3.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl text-center shadow-premium"
              >
                Track Order in Customer Dashboard
              </Link>
              <Link
                to="/vehicles"
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl text-center"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
