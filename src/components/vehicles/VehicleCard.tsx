import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  Zap,
  Battery,
  Clock,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  Calendar
} from 'lucide-react';
import { VehicleItem } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface VehicleCardProps {
  vehicle: VehicleItem;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const { isVehicleWishlisted, toggleVehicleWishlist } = useWishlist();
  const { isVehicleInCompare, addVehicleToCompare, removeVehicleFromCompare } = useCompare();

  // Selected variant / color swatch
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = vehicle.variants[selectedVariantIndex] || vehicle.variants[0];
  const activeImage = currentVariant?.imageUrl || vehicle.images[0]?.url;

  const isWishlisted = isVehicleWishlisted(vehicle.id);
  const isInCompare = isVehicleInCompare(vehicle.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'ELECTRIC_SCOOTER': return 'Electric Scooter';
      case 'ELECTRIC_PASSENGER_AUTO': return 'Passenger Auto 3W';
      case 'ELECTRIC_CARGO_AUTO': return 'Cargo Delivery 3W';
      case 'ELECTRIC_LOADER': return 'Commercial Loader';
      default: return 'Electric Vehicle';
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#E3E9E4] hover:border-emerald-500/70 p-4 sm:p-5 transition-all duration-300 hover:shadow-elevated flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Bar: Category badge, Compare, Wishlist */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-[#14532D] border border-emerald-100">
            {getCategoryLabel(vehicle.category)}
          </span>

          <div className="flex items-center gap-1">
            {/* Compare Button */}
            <button
              onClick={() => {
                if (isInCompare) {
                  removeVehicleFromCompare(vehicle.id);
                } else {
                  addVehicleToCompare(vehicle.id);
                }
              }}
              className={`p-2 rounded-xl transition-all ${
                isInCompare
                  ? 'bg-[#0B2545] text-[#B7F34A] shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200/80 text-gray-600'
              }`}
              title={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
              aria-label="Toggle comparison"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleVehicleWishlist(vehicle.id)}
              className={`p-2 rounded-xl transition-all ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-gray-100 hover:bg-gray-200/80 text-gray-600'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image Gallery Preview */}
        <Link to={`/vehicles/${vehicle.modelSlug}`} className="block relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/10] mb-4">
          <img
            src={activeImage}
            alt={`${vehicle.name} - ${currentVariant?.colorName || ''}`}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />

          {/* Availability Status Badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#B7F34A]" />
            <span>{vehicle.inStock ? 'In Stock • Ready for Delivery' : '2-3 Weeks Waitlist'}</span>
          </div>

          {/* Token booking badge */}
          <div className="absolute top-2.5 right-2.5 bg-emerald-900/80 backdrop-blur-md text-[#B7F34A] text-[10px] font-bold px-2 py-0.5 rounded-md">
            Book at ₹{vehicle.bookingTokenAmount.toLocaleString('en-IN')}
          </div>
        </Link>

        {/* Color Swatches */}
        {vehicle.variants && vehicle.variants.length > 1 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-medium text-gray-400">Colours:</span>
            <div className="flex items-center gap-1.5">
              {vehicle.variants.map((variant, idx) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariantIndex === idx
                      ? 'ring-2 ring-[#14532D] scale-110 border-white'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: variant.colorHex }}
                  title={`${variant.colorName} (${variant.variantName})`}
                  aria-label={`Select ${variant.colorName}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 ml-1 truncate">
              {currentVariant?.colorName}
            </span>
          </div>
        )}

        {/* Vehicle Name & Brand */}
        <div className="mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {vehicle.brand}
          </span>
          <Link to={`/vehicles/${vehicle.modelSlug}`}>
            <h3 className="text-base font-bold text-gray-900 hover:text-[#14532D] transition-colors leading-tight">
              {vehicle.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {vehicle.tagline}
          </p>
        </div>

        {/* Ex-showroom Price & Subsidy Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              Ex-Showroom Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#14532D]">
                {formatPrice(vehicle.exShowroomPrice + (currentVariant?.priceDifference || 0))}
              </span>
            </div>
          </div>
          {vehicle.subsidyEstimate > 0 && (
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                ₹{vehicle.subsidyEstimate.toLocaleString('en-IN')} Subsidy
              </span>
              <span className="text-[10px] text-gray-400 block mt-0.5">FAME-II/State credit</span>
            </div>
          )}
        </div>

        {/* Verified Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-t border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Certified Range</span>
              <strong className="text-gray-900">{vehicle.certifiedRangeKm} km</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Battery className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Battery Capacity</span>
              <strong className="text-gray-900">{vehicle.batteryCapacityKwh} kWh</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Max Speed</span>
              <strong className="text-gray-900">{vehicle.topSpeedKmph} km/h</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block">Charging Time</span>
              <strong className="text-gray-900">{vehicle.chargingTimeHours} hrs</strong>
            </div>
          </div>
        </div>

        {/* Test condition & warranty disclaimer */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-4">
          <span className="truncate max-w-[180px]" title={vehicle.certifiedRangeCondition}>
            *Condition: {vehicle.certifiedRangeCondition}
          </span>
          <span className="font-semibold text-gray-600 flex items-center gap-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {vehicle.warrantyYears}Y / {vehicle.warrantyKm / 1000}k km
          </span>
        </div>
      </div>

      {/* Action Buttons Matrix */}
      <div className="space-y-2 pt-1">
        
        {/* Primary Row: View Details & Buy Now */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/vehicles/${vehicle.modelSlug}`}
            className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl text-center transition-colors"
          >
            View Details
          </Link>

          <Link
            to={`/checkout/vehicle/${vehicle.modelSlug}?variant=${currentVariant?.id || ''}`}
            className="py-2.5 px-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A]" />
          </Link>
        </div>

        {/* Secondary Row: Book Test Drive & Get Quotation */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/test-drive?vehicle=${vehicle.id}`}
            className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-[11px] font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
          >
            <Calendar className="w-3 h-3 text-[#16A34A]" />
            <span>Book Test Drive</span>
          </Link>

          <Link
            to={`/quotation?vehicle=${vehicle.id}`}
            className="py-2 px-2 bg-lime-50 hover:bg-lime-100 text-emerald-900 text-[11px] font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1"
          >
            <FileText className="w-3 h-3 text-emerald-700" />
            <span>Get Quotation</span>
          </Link>
        </div>

      </div>

    </div>
  );
};
