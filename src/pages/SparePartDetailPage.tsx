import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Truck,
  RotateCcw,
  Zap,
  MapPin,
  Building,
  Plus,
  Minus
} from 'lucide-react';
import { SPARE_PARTS_DATA, VEHICLES_DATA } from '../data/seedData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';

export const SparePartDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isPartWishlisted, togglePartWishlist } = useWishlist();
  const { city, pincode } = useLocation();

  const part = SPARE_PARTS_DATA.find((p) => p.slug === slug || p.id === slug) || SPARE_PARTS_DATA[0];

  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isPartWishlisted(part.id);
  const discountPercent = Math.round(((part.mrpPrice - part.sellingPrice) / part.mrpPrice) * 100);

  // Compatibility Checker Interactive State
  const [checkerBrand, setCheckerBrand] = useState('ElectraMobility');
  const [checkerVehicleId, setCheckerVehicleId] = useState(VEHICLES_DATA[0].id);
  const [checkerYear, setCheckerYear] = useState('2026');
  const [hasChecked, setHasChecked] = useState(false);

  // Available models for selected brand in checker
  const brandModels = VEHICLES_DATA.filter(v => v.brand === checkerBrand);

  // Evaluate compatibility
  const isCompatible = part.compatibleVehicleIds.includes(checkerVehicleId);
  const isUniversal = part.compatibleVehicleIds.includes('Universal All Models') || part.compatibleVehicleNames.includes('Universal All Models');

  const handleCompatibilityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setHasChecked(true);
  };

  const handleAddToCart = () => {
    addItem(part, quantity);
  };

  const handleBuyNow = () => {
    addItem(part, quantity);
    navigate('/checkout/spare-parts');
  };

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/spare-parts" className="hover:text-gray-900">Spare Parts Hub</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D] truncate">{part.name}</span>
        </nav>

        {/* 2-Column Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle relative overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={part.imageUrl}
                alt={part.name}
                className="max-h-full max-w-full object-contain rounded-2xl"
              />
              
              <div className="absolute top-4 left-4 bg-emerald-50 text-[#14532D] border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>100% Genuine OEM Part</span>
              </div>

              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-[#14532D] text-[#B7F34A] text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Seller / Vendor Info Card (Section 10) */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 text-xs space-y-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Fulfillment & Warranty Partner
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#14532D]" />
                  {part.vendorName}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Verified EV Vendor
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Dispatched directly from factory central warehouse with tamper-evident OEM seals.
              </p>
            </div>
          </div>

          {/* Right Column: Pricing, Compatibility Checker & Purchasing */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & SKU */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {part.categoryName} • Brand: <strong className="text-gray-700">{part.brand}</strong>
                </span>
                <button
                  onClick={() => togglePartWishlist(part.id)}
                  className={`p-2 rounded-xl transition-all ${
                    isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {part.name}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-500">
                <span>SKU: <strong className="text-gray-800">{part.sku}</strong></span>
                <span>•</span>
                <span>Warranty: <strong className="text-emerald-700">{part.warrantyMonths} Months Replacement</strong></span>
                <span>•</span>
                <span>Returns: <strong className="text-emerald-700">{part.returnWindowDays}-Day Hassle-Free</strong></span>
              </div>
            </div>

            {/* Price & Stock Box */}
            <div className="p-5 bg-white rounded-3xl border border-gray-200 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Selling Price (Incl. 18% GST)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#14532D]">
                    ₹{part.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {part.mrpPrice > part.sellingPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{part.mrpPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  {part.stockQuantity > 5 ? `${part.stockQuantity} in Stock` : `Only ${part.stockQuantity} left!`}
                </span>
                <p className="text-[11px] text-gray-400 mt-1">Ready for same-day dispatch</p>
              </div>
            </div>

            {/* Delivery Timeline Check */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#16A34A]" />
                <span>Standard Delivery to <strong>{city} ({pincode})</strong></span>
              </div>
              <span className="font-bold text-[#14532D]">3-5 Business Days</span>
            </div>

            {/* MANDATORY: Interactive Vehicle Compatibility Checker Widget (Section 10) */}
            <div className="p-5 bg-white rounded-3xl border-2 border-emerald-500/40 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#14532D] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    Vehicle Compatibility Checker
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Check if this exact component fits your specific vehicle model and year.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCompatibilityCheck} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Brand */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Make / Brand</label>
                    <select
                      value={checkerBrand}
                      onChange={(e) => {
                        setCheckerBrand(e.target.value);
                        const match = VEHICLES_DATA.find(v => v.brand === e.target.value);
                        if (match) setCheckerVehicleId(match.id);
                        setHasChecked(false);
                      }}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold"
                    >
                      <option value="ElectraMobility">ElectraMobility</option>
                      <option value="Vidyut Motors">Vidyut Motors</option>
                      <option value="Shakti EV Commercials">Shakti EV Commercials</option>
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Model & Variant</label>
                    <select
                      value={checkerVehicleId}
                      onChange={(e) => {
                        setCheckerVehicleId(e.target.value);
                        setHasChecked(false);
                      }}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold"
                    >
                      {brandModels.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Manufacture Year</label>
                    <select
                      value={checkerYear}
                      onChange={(e) => {
                        setCheckerYear(e.target.value);
                        setHasChecked(false);
                      }}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold"
                    >
                      <option value="2026">2026 (Current)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-xl"
                >
                  Verify Compatibility Now
                </button>
              </form>

              {/* Verified Result Banner */}
              {hasChecked && (
                <div className="pt-2 animate-in fade-in">
                  {isCompatible || isUniversal ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-900 block font-bold">
                          ✓ Guaranteed 100% Compatible
                        </strong>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          This part matches factory electrical voltage, mechanical mountings, and dimensions for your vehicle based on verified manufacturer catalog data.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-900 block font-bold">
                          ✕ Not Compatible
                        </strong>
                        <p className="text-[11px] text-rose-800 mt-0.5">
                          This component does not fit or match voltage parameters for the selected vehicle. Contact support if you need assistance identifying an alternate part.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-gray-600 hover:text-black rounded"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(part.stockQuantity, quantity + 1))}
                    className="p-1 text-gray-600 hover:text-black rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-xs font-bold rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-premium transition-all"
                >
                  <span>Buy Now Online</span>
                  <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Description & Technical Specifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Product Description</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {part.description}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(part.specifications).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="font-semibold text-gray-600">{key}:</span>
                  <span className="font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
