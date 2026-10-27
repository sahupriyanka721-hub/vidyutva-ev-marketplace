import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discountAmount,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    shippingFee,
    taxAmount,
    grandTotal
  } = useCart();
  const { city, pincode } = useLocation();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#F0F4F8] min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-200 shadow-subtle space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#14532D] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">
            You don&apos;t have any spare parts or accessories in your cart yet. Explore our genuine catalog.
          </p>
          <Link
            to="/spare-parts"
            className="inline-block px-6 py-3 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl shadow-premium"
          >
            Shop Genuine Spare Parts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Shopping Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review selected spare parts and accessories before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items Table/List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-4">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.sparePart.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.sparePart.imageUrl}
                      alt={item.sparePart.name}
                      className="w-20 h-20 object-cover rounded-2xl bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.sparePart.categoryName} • SKU: {item.sparePart.sku}
                      </span>
                      <Link to={`/spare-parts/${item.sparePart.slug}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#14532D] leading-snug line-clamp-2">
                          {item.sparePart.name}
                        </h3>
                      </Link>
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                        Warranty: {item.sparePart.warrantyMonths} Months Replacement
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Unit Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.sparePart.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-black rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sparePart.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-black rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-gray-900 block">
                        ₹{(item.sparePart.sellingPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ₹{item.sparePart.sellingPrice.toLocaleString('en-IN')} each
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.sparePart.id)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <Link to="/spare-parts" className="hover:text-gray-900 font-semibold flex items-center gap-1">
                ← Continue Shopping
              </Link>
              <span>Free Delivery on orders above ₹1,999</span>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-5">
            <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            {/* Delivery address preview */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Delivery Pincode</span>
              <p className="font-semibold text-gray-800">{city} ({pincode})</p>
            </div>

            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-[#16A34A]" />
                    <span>Coupon: {appliedCoupon}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-600 font-semibold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. EVFIRST10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Itemized Calculation */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Estimated 18% GST (Included in Price)</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                <span>Total Payable</span>
                <span className="text-base text-[#14532D]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout/spare-parts')}
              className="w-full py-4 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
            </button>

            <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Guaranteed • 7-Day Replacement</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
