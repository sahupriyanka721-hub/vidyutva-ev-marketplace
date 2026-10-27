import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  Share2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Zap,
  Battery,
  Clock,
  Gauge,
  ShieldCheck,
  Download,
  Calendar,
  FileText,
  PhoneCall,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/seedData';
import { useLocation } from '../context/LocationContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export const VehicleDetailPage: React.FC = () => {
  const { modelSlug } = useParams<{ modelSlug: string }>();
  const navigate = useNavigate();
  const { city, pincode, checkPincode, setLocation } = useLocation();
  const { isVehicleWishlisted, toggleVehicleWishlist } = useWishlist();
  const { isVehicleInCompare, addVehicleToCompare, removeVehicleFromCompare } = useCompare();

  const vehicle = VEHICLES_DATA.find(
    (v) => v.modelSlug === modelSlug || v.id === modelSlug
  ) || VEHICLES_DATA[0];

  // Variant & Color Selection
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    vehicle.variants[0]?.id || ''
  );
  const activeVariant = vehicle.variants.find((v) => v.id === selectedVariantId) || vehicle.variants[0];

  // Image Gallery Selection & Zoom preview
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Delivery Pincode Checker state
  const [inputPincode, setInputPincode] = useState(pincode);
  const [pincodeCheckResult, setPincodeCheckResult] = useState<any>(null);

  // Active specs tab
  const [activeSpecGroup, setActiveSpecGroup] = useState<string>(
    vehicle.specifications[0]?.groupName || 'Performance'
  );

  const isWishlisted = isVehicleWishlisted(vehicle.id);
  const isInCompare = isVehicleInCompare(vehicle.id);

  // Calculations
  const exShowroom = vehicle.exShowroomPrice + (activeVariant?.priceDifference || 0);
  const subsidy = vehicle.subsidyEstimate;
  const rtoFee = vehicle.rtoEstimate;
  const insuranceFee = vehicle.insuranceEstimate;
  const estimatedOnRoadPrice = exShowroom - subsidy + rtoFee + insuranceFee;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^[1-9][0-9]{5}$/.test(inputPincode.trim())) {
      const res = checkPincode(inputPincode.trim());
      setPincodeCheckResult(res);
      setLocation(res.city, res.pincode);
    }
  };

  const imagesList = [
    { url: activeVariant?.imageUrl || vehicle.images[0]?.url, label: activeVariant?.colorName || 'Default' },
    ...vehicle.images.filter(img => img.url !== activeVariant?.imageUrl)
  ];

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-gray-900">Electric Vehicles</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">{vehicle.name}</span>
        </nav>

        {/* Top Product Section: Left Gallery, Right Details & Booking Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Gallery with Zoom & Angle selector */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div
              className="relative bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-subtle aspect-[16/11] cursor-zoom-in group"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={imagesList[activeImageIndex]?.url}
                alt={`${vehicle.name} - View ${activeImageIndex + 1}`}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'group-hover:scale-105'
                }`}
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-[#14532D] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  ARAI / IDC Certified
                </span>
                <span className="bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                  {activeVariant?.colorName} Edition
                </span>
              </div>

              {/* Stock Indicator */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{activeVariant?.stockCount} units available for dispatch</span>
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 bg-white/80 px-2 py-1 rounded-md">
                Click to {isZoomed ? 'Reset Zoom' : 'Zoom In'}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    activeImageIndex === idx
                      ? 'border-[#14532D] ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Spec Ribbon below image */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-subtle grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Range (IDC)</span>
                <span className="font-extrabold text-[#14532D] text-sm">{vehicle.certifiedRangeKm} km</span>
              </div>
              <div className="p-2 border-l border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Top Speed</span>
                <span className="font-extrabold text-gray-900 text-sm">{vehicle.topSpeedKmph} km/h</span>
              </div>
              <div className="p-2 border-l border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Battery Pack</span>
                <span className="font-extrabold text-gray-900 text-sm">{vehicle.batteryCapacityKwh} kWh</span>
              </div>
              <div className="p-2 border-l border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Home Charge</span>
                <span className="font-extrabold text-gray-900 text-sm">{vehicle.chargingTimeHours} hrs</span>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Variants, Pricing breakdown & Primary Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {vehicle.brand} • {vehicle.brandOrigin || 'India'}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (isInCompare) removeVehicleFromCompare(vehicle.id);
                      else addVehicleToCompare(vehicle.id);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                      isInCompare ? 'bg-[#14532D] text-[#B7F34A]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Compare"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleVehicleWishlist(vehicle.id)}
                    className={`p-2 rounded-xl transition-all ${
                      isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {vehicle.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                {vehicle.tagline}
              </p>
            </div>

            {/* Color & Variant Selector */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-subtle space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-800">
                  Selected Color: <strong className="text-[#14532D]">{activeVariant?.colorName}</strong>
                </span>
                <span className="text-gray-400 font-mono text-[11px]">
                  Real-world range: ~{activeVariant?.realWorldRangeKm} km
                </span>
              </div>

              <div className="flex items-center gap-3">
                {vehicle.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border-2 transition-all ${
                      selectedVariantId === variant.id
                        ? 'border-[#14532D] bg-emerald-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      {variant.colorName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown Card (Explicit separation of confirmed vs estimated) */}
            <div className="p-5 bg-white rounded-3xl border border-gray-200 shadow-subtle space-y-3.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Confirmed Ex-Showroom Price
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#14532D]">
                    ₹{exShowroom.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Refundable Token
                  </span>
                  <span className="text-sm font-bold text-gray-800 block mt-0.5">
                    ₹{vehicle.bookingTokenAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Itemized on-road breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Base Ex-Showroom</span>
                  <span className="font-semibold text-gray-800">₹{exShowroom.toLocaleString('en-IN')}</span>
                </div>
                {subsidy > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Applicable State/FAME-II Subsidy</span>
                    <span>-₹{subsidy.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated RTO Registration Charges</span>
                  <span>+₹{rtoFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comprehensive 1+4 Years Insurance Estimate</span>
                  <span>+₹{insuranceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>Estimated Total On-Road Price</span>
                  <span className="text-base text-[#14532D]">₹{estimatedOnRoadPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Legal clarity note */}
              <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                <span>
                  *On-road price is an indicative estimate based on regional state subsidies and RTO tariff. Confirmed tax invoice is finalized by the allocated dealer during registration.
                </span>
              </div>
            </div>

            {/* Delivery Availability by PIN Code */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-subtle">
              <span className="text-xs font-bold text-gray-800 block mb-1.5">
                Check Delivery & Dealership Serviceability
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code"
                    value={inputPincode}
                    onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-[#14532D]"
                  />
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-semibold rounded-xl"
                >
                  Verify
                </button>
              </form>

              {pincodeCheckResult && (
                <div className="mt-2.5 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{pincodeCheckResult.city} ({pincodeCheckResult.pincode})</span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ✓ Vehicle Delivery in ~{vehicle.deliveryEstimateDays} business days via {pincodeCheckResult.nearestDealership}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Buttons (Section 6) */}
            <div className="space-y-3 pt-2">
              
              {/* Buy Now & Book Test Drive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/checkout/vehicle/${vehicle.modelSlug}?variant=${selectedVariantId}`}
                  className="w-full py-4 bg-[#14532D] hover:bg-[#0d381e] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-premium transition-all hover:scale-[1.01]"
                >
                  <span>Buy Now Online</span>
                  <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                </Link>

                <Link
                  to={`/test-drive?vehicle=${vehicle.id}&variant=${selectedVariantId}`}
                  className="w-full py-4 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-sm font-bold rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#16A34A]" />
                  <span>Book Test Drive</span>
                </Link>
              </div>

              {/* Get Quotation & Contact Sales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/quotation?vehicle=${vehicle.id}`}
                  className="py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#14532D]" />
                  <span>Get Formal Quotation</span>
                </Link>

                <Link
                  to="/contact"
                  className="py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#14532D]" />
                  <span>Contact Dealer Sales</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

        {/* Technical Specifications Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Verified Technical Specifications
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Every spec benchmarked under standard ARAI automotive certification standards.
              </p>
            </div>

            {/* Spec Groups Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
              {vehicle.specifications.map((group) => (
                <button
                  key={group.groupName}
                  onClick={() => setActiveSpecGroup(group.groupName)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeSpecGroup === group.groupName
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {group.groupName}
                </button>
              ))}
            </div>
          </div>

          {/* Active Spec Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <tbody className="divide-y divide-gray-100 bg-white">
                {vehicle.specifications
                  .find((g) => g.groupName === activeSpecGroup)
                  ?.specs.map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-5 py-3.5 font-bold text-gray-700 w-1/3 sm:w-1/4">
                        {spec.key}
                      </td>
                      <td className="px-5 py-3.5 text-gray-900 font-medium">
                        {spec.value} {spec.unit || ''}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Specific FAQs */}
        {vehicle.faqs && vehicle.faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Frequently Asked Questions for {vehicle.name}
            </h2>
            <div className="space-y-3">
              {vehicle.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
