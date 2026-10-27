import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
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
    grandTotal,
    totalItemCount
  } = useCart();

  const { pincode, city } = useLocation();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout/spare-parts');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#14532D] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Spare Parts Cart</h3>
                <p className="text-xs text-gray-500">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery to Pincode Indicator */}
          <div className="px-4 py-2 bg-emerald-50 text-[11px] font-medium text-emerald-900 border-b border-emerald-100 flex items-center justify-between">
            <span>Delivering to: <strong className="font-semibold">{city} ({pincode})</strong></span>
            <span className="text-[#16A34A] font-bold">Standard 3-5 Days</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h4>
                <p className="text-xs text-gray-500 mb-6">
                  Explore our verified genuine EV batteries, fast chargers, brake pads, tyres and accessories.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/spare-parts');
                  }}
                  className="px-5 py-2.5 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-[#0d381e] transition-colors"
                >
                  Browse Spare Parts
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.sparePart.id}
                  className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all shadow-subtle"
                >
                  <img
                    src={item.sparePart.imageUrl}
                    alt={item.sparePart.name}
                    className="w-18 h-18 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                    style={{ width: '4.5rem', height: '4.5rem' }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          {item.sparePart.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.sparePart.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 -mr-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        SKU: {item.sparePart.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.sparePart.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-black rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.sparePart.id, item.quantity + 1)}
                          disabled={item.quantity >= item.sparePart.stockQuantity}
                          className="p-1 text-gray-600 hover:text-black disabled:opacity-30 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{(item.sparePart.sellingPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200/80 bg-gray-50/60 space-y-3.5">
              
              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Coupon: {appliedCoupon}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. EVFIRST10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-gray-800 hover:bg-black text-white text-xs font-semibold rounded-xl"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Estimated 18% GST (Included in MRP)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-base text-[#14532D]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Free shipping banner */}
              {subtotal < 1999 && (
                <p className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                  Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more to unlock <strong>FREE Delivery</strong>!
                </p>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout • Genuine OEM Replacement Guarantee</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
