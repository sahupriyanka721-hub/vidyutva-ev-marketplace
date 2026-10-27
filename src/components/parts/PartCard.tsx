import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { SparePartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface PartCardProps {
  part: SparePartItem;
}

export const PartCard: React.FC<PartCardProps> = ({ part }) => {
  const { addItem } = useCart();
  const { isPartWishlisted, togglePartWishlist } = useWishlist();

  const isWishlisted = isPartWishlisted(part.id);
  const discountPercent = Math.round(((part.mrpPrice - part.sellingPrice) / part.mrpPrice) * 100);

  return (
    <div className="group bg-white rounded-3xl border border-[#E3E9E4] hover:border-emerald-500/70 p-4 sm:p-5 transition-all duration-300 hover:shadow-elevated flex flex-col justify-between relative">
      
      <div>
        {/* Top badges: OEM Verified & Wishlist */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
            <span>OEM Genuine</span>
          </span>

          <button
            onClick={() => togglePartWishlist(part.id)}
            className={`p-2 rounded-xl transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
            }`}
            title="Add to Wishlist"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Thumbnail */}
        <Link to={`/spare-parts/${part.slug}`} className="block relative rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3.5">
          <img
            src={part.imageUrl}
            alt={part.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />

          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-[#14532D] text-[#B7F34A] text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
            SKU: {part.sku}
          </div>
        </Link>

        {/* Category & Name */}
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            {part.categoryName}
          </span>
          <Link to={`/spare-parts/${part.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#14532D] transition-colors line-clamp-2 leading-snug">
              {part.name}
            </h3>
          </Link>
        </div>

        {/* Compatibility info preview */}
        <div className="mb-3 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100/70 text-[11px] text-gray-600">
          <span className="font-semibold text-emerald-900 block text-[10px] uppercase">Fits Models:</span>
          <span className="truncate block font-medium text-gray-700">
            {part.compatibleVehicleNames.join(', ')}
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-base font-black text-[#14532D]">
              ₹{part.sellingPrice.toLocaleString('en-IN')}
            </span>
            {part.mrpPrice > part.sellingPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                ₹{part.mrpPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
            {part.stockQuantity > 5 ? 'In Stock' : `Only ${part.stockQuantity} Left`}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
        <Link
          to={`/spare-parts/${part.slug}`}
          className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl text-center transition-colors"
        >
          Details
        </Link>

        <button
          onClick={() => addItem(part, 1)}
          className="py-2.5 px-3 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#B7F34A]" />
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
};
