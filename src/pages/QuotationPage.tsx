import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  User as UserIcon,
  Percent,
  Calendar,
  AlertCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/seedData';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storageService';
import { VehicleCategoryType, VehicleUsageType } from '../types';

export const QuotationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city: defaultCity, pincode: defaultPincode } = useLocation();

  const preselectedVehicleId = searchParams.get('vehicle');
  const initialVehicle = VEHICLES_DATA.find(v => v.id === preselectedVehicleId || v.modelSlug === preselectedVehicleId) || VEHICLES_DATA[0];

  // Form State
  const [customerType, setCustomerType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [name, setName] = useState(user?.fullName || 'Arjun Singhania');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [email, setEmail] = useState(user?.email || 'arjun.singhania@example.com');
  const [city, setCity] = useState(defaultCity);
  const [pincode, setPincode] = useState(defaultPincode);

  const [category, setCategory] = useState<VehicleCategoryType>(initialVehicle.category);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle.id);
  const [quantity, setQuantity] = useState<number>(1);
  const [usageType, setUsageType] = useState<VehicleUsageType>(initialVehicle.usageType);
  const [financeRequirement, setFinanceRequirement] = useState<boolean>(true);
  const [tradeInOldVehicle, setTradeInOldVehicle] = useState<boolean>(false);
  const [oldVehicleDetails, setOldVehicleDetails] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Result State
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available vehicles for chosen category
  const categoryVehicles = VEHICLES_DATA.filter(v => v.category === category);
  const activeVehicle = VEHICLES_DATA.find(v => v.id === selectedVehicleId) || categoryVehicles[0] || VEHICLES_DATA[0];

  // Bulk Discount tiers: 1-2 units: 0%, 3-5 units: ₹5,000/unit, 6-10 units: ₹8,000/unit, 11+ units: ₹12,000/unit
  const getBulkDiscountPerUnit = (qty: number) => {
    if (qty >= 11) return 12000;
    if (qty >= 6) return 8000;
    if (qty >= 3) return 5000;
    return 0;
  };

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const discountPerUnit = getBulkDiscountPerUnit(quantity);
    const totalBulkDiscount = discountPerUnit * quantity;
    const baseExShowroom = activeVehicle.exShowroomPrice * quantity;
    const totalSubsidy = activeVehicle.subsidyEstimate * quantity;
    const totalRto = activeVehicle.rtoEstimate * quantity;
    const totalInsurance = activeVehicle.insuranceEstimate * quantity;
    const grandTotal = baseExShowroom - totalBulkDiscount - totalSubsidy + totalRto + totalInsurance;

    setTimeout(() => {
      const quote = storage.createQuotation({
        userId: user?.id,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        customerType,
        companyName: customerType === 'BUSINESS' ? companyName : undefined,
        gstin: customerType === 'BUSINESS' ? gstin : undefined,
        city,
        pincode,
        vehicleId: activeVehicle.id,
        vehicleName: activeVehicle.name,
        vehicleCategory: activeVehicle.category,
        quantity,
        usageType,
        financeRequirement,
        tradeInOldVehicle,
        oldVehicleDetails: tradeInOldVehicle ? oldVehicleDetails : undefined,
        estimatedUnitPrice: activeVehicle.exShowroomPrice,
        estimatedBulkDiscount: totalBulkDiscount,
        estimatedSubsidyTotal: totalSubsidy,
        estimatedRtoTotal: totalRto,
        estimatedInsuranceTotal: totalInsurance,
        estimatedGrandTotal: grandTotal,
        notes: specialNotes
      });

      setGeneratedQuote(quote);
      setIsSubmitting(false);
    }, 600);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Get a Vehicle Quotation</span>
        </nav>

        {!generatedQuote ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-subtle space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Instant Proforma Estimator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Online Vehicle Quotation System
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Generate an itemised proforma docket for personal purchases, corporate tax benefits, or commercial bulk fleets.
              </p>
            </div>

            <form onSubmit={handleGenerateQuote} className="space-y-6">
              
              {/* 1. Buyer Profile Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Buyer Profile</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerType('INDIVIDUAL')}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      customerType === 'INDIVIDUAL'
                        ? 'border-[#14532D] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserIcon className="w-5 h-5 text-[#14532D]" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Individual Buyer</span>
                      <span className="text-[10px] text-gray-500">Personal & family use</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerType('BUSINESS')}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      customerType === 'BUSINESS'
                        ? 'border-[#14532D] bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#14532D]" />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Business / Fleet Owner</span>
                      <span className="text-[10px] text-gray-500">Commercial GST invoice & fleet discounts</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Business Extra Fields */}
              {customerType === 'BUSINESS' && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Enterprise Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Logistics LLP"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="07AAAAA0000A1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 2. Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
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
              </div>

              {/* 3. Category & Vehicle Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as VehicleCategoryType;
                      setCategory(newCat);
                      const matching = VEHICLES_DATA.find(v => v.category === newCat);
                      if (matching) setSelectedVehicleId(matching.id);
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="ELECTRIC_SCOOTER">Electric Scooters</option>
                    <option value="ELECTRIC_PASSENGER_AUTO">Electric Passenger Autos</option>
                    <option value="ELECTRIC_CARGO_AUTO">Electric Cargo 3W</option>
                    <option value="ELECTRIC_LOADER">Commercial Loaders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Model</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    {categoryVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} (₹{v.exShowroomPrice.toLocaleString('en-IN')})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold font-mono focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              {/* Bulk Discount Indicator */}
              {quantity >= 3 && (
                <div className="p-3 bg-emerald-100/70 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-700" />
                    Bulk Fleet Discount Unlocked!
                  </span>
                  <span className="font-mono font-bold text-[#14532D]">
                    ₹{getBulkDiscountPerUnit(quantity).toLocaleString('en-IN')} off per unit (Total savings: ₹{(getBulkDiscountPerUnit(quantity) * quantity).toLocaleString('en-IN')})
                  </span>
                </div>
              )}

              {/* 4. Location & Usage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Operating City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code</label>
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

              {/* 5. Checkboxes: Finance & Trade-in */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={financeRequirement}
                    onChange={(e) => setFinanceRequirement(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span className="font-semibold">I would like financing assistance / loan quotation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={tradeInOldVehicle}
                    onChange={(e) => setTradeInOldVehicle(e.target.checked)}
                    className="rounded text-[#14532D] focus:ring-[#14532D]"
                  />
                  <span className="font-semibold">I want to exchange an existing petrol/diesel vehicle (Trade-in)</span>
                </label>
              </div>

              {tradeInOldVehicle && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Existing Vehicle Details</label>
                  <input
                    type="text"
                    placeholder="Make, model, year of registration (e.g. Honda Activa 2018)"
                    value={oldVehicleDetails}
                    onChange={(e) => setOldVehicleDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              )}

              {/* Special notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Additional Requirements / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need fast charging hubs setup, custom company livery or fleet telematics integration"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#14532D] hover:bg-[#0d381e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium transition-all"
              >
                {isSubmitting ? (
                  <span>Generating Indicative Quotation...</span>
                ) : (
                  <>
                    <span>Generate Instant Quotation Docket</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* Quotation Result Page (Section 9) */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-elevated space-y-8 animate-in fade-in">
            
            {/* Header Docket info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  Ref: {generatedQuote.quotationNumber}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                  Official Indicative Quotation Docket
                </h2>
                <p className="text-xs text-gray-500">
                  Issued to: <strong className="text-gray-800">{generatedQuote.customerName}</strong> ({generatedQuote.customerType}) • Valid until {new Date(generatedQuote.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Print / Download buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrintQuote}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Docket</span>
                </button>
              </div>
            </div>

            {/* Clear disclaimer */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Indicative Quotation:</strong> All charges are computed from verified catalog tariffs and prevailing state EV policy subsidies for {generatedQuote.city}. Final billing invoice is generated upon dealer allocation.
              </span>
            </div>

            {/* Itemized Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 font-bold text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Rate</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="px-4 py-3">
                      <strong className="text-gray-900">{generatedQuote.vehicleName}</strong>
                      <span className="text-[11px] text-gray-500 block">Ex-showroom Base Price</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">{generatedQuote.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{generatedQuote.estimatedUnitPrice.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold">₹{(generatedQuote.estimatedUnitPrice * generatedQuote.quantity).toLocaleString('en-IN')}</td>
                  </tr>

                  {generatedQuote.estimatedBulkDiscount > 0 && (
                    <tr className="text-emerald-700 bg-emerald-50/40">
                      <td className="px-4 py-3 font-semibold">Commercial Bulk Fleet Discount</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right font-bold">-₹{generatedQuote.estimatedBulkDiscount.toLocaleString('en-IN')}</td>
                    </tr>
                  )}

                  {generatedQuote.estimatedSubsidyTotal > 0 && (
                    <tr className="text-emerald-700 bg-emerald-50/40">
                      <td className="px-4 py-3 font-semibold">Estimated State EV / FAME Subsidy Credit</td>
                      <td className="px-4 py-3 text-center">{generatedQuote.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{(generatedQuote.estimatedSubsidyTotal / generatedQuote.quantity).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold">-₹{generatedQuote.estimatedSubsidyTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  )}

                  <tr>
                    <td className="px-4 py-3">Mandatory RTO Registration & HSRP Number Plate</td>
                    <td className="px-4 py-3 text-center">{generatedQuote.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{(generatedQuote.estimatedRtoTotal / generatedQuote.quantity).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">₹{generatedQuote.estimatedRtoTotal.toLocaleString('en-IN')}</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3">Comprehensive Commercial / Personal EV Insurance (1+4 Years)</td>
                    <td className="px-4 py-3 text-center">{generatedQuote.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{(generatedQuote.estimatedInsuranceTotal / generatedQuote.quantity).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">₹{generatedQuote.estimatedInsuranceTotal.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300 text-sm font-black text-gray-900">
                  <tr>
                    <td colSpan={3} className="px-4 py-3.5 text-right uppercase">Estimated Grand Total (On-Road):</td>
                    <td className="px-4 py-3.5 text-right text-base text-[#14532D]">
                      ₹{generatedQuote.estimatedGrandTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions: Convert to Order & Dashboard */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setGeneratedQuote(null)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
              >
                Modify Parameters
              </button>

              <Link
                to={`/checkout/vehicle/${activeVehicle.modelSlug}`}
                className="px-6 py-3 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium"
              >
                <span>Convert to Online Order</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
