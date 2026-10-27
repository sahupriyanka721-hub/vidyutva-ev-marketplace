import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { storage } from '../services/storageService';

export const SparePartsCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discountAmount, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { city: defaultCity, pincode: defaultPin } = useLocation();

  const [fullName, setFullName] = useState(user?.fullName || 'Arjun Singhania');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [streetAddress, setStreetAddress] = useState('B-42, Gulmohar Enclave');
  const [city, setCity] = useState(defaultCity);
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState(defaultPin);
  const [deliverySpeed, setDeliverySpeed] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="bg-[#F8FAF8] min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-subtle space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">
            Add genuine OEM batteries, chargers, brake pads or tyres to proceed with checkout.
          </p>
          <Link
            to="/spare-parts"
            className="inline-block px-6 py-2.5 bg-[#14532D] text-white text-xs font-bold rounded-xl"
          >
            Browse Spare Parts
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = deliverySpeed === 'EXPRESS' ? 150 : (subtotal >= 1999 ? 0 : 99);
  const finalPayable = Math.max(0, subtotal - discountAmount) + shippingCost;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.18);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const paymentRes = await storage.simulateRazorpayPayment({
      amount: finalPayable,
      description: `E-VAHAN Spare Parts Purchase (${items.length} items)`,
      method: paymentMethod
    });

    const newOrder = storage.createSparePartsOrder({
      userId: user?.id || 'usr-demo-001',
      items: items.map(i => ({
        partId: i.sparePart.id,
        name: i.sparePart.name,
        sku: i.sparePart.sku,
        imageUrl: i.sparePart.imageUrl,
        unitPrice: i.sparePart.sellingPrice,
        quantity: i.quantity
      })),
      subtotal,
      shippingFee: shippingCost,
      discountAmount,
      taxAmount,
      grandTotal: finalPayable,
      deliveryAddress: {
        fullName,
        phone,
        line1: streetAddress,
        city,
        state,
        pincode
      },
      deliverySpeed,
      paymentMethod: `${paymentMethod} (Razorpay Sandbox)`,
      paymentTransactionRef: paymentRes.transactionRef
    });

    setConfirmedOrder(newOrder);
    clearCart();
    setIsProcessing(false);
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/spare-parts" className="hover:text-gray-900">Spare Parts</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Secure Checkout</span>
        </nav>

        {!confirmedOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Delivery Address & Payment Method Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Shipping & Payment Details
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Genuine parts dispatched within 24 hours in tamper-evident sealed packing.
                </p>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Contact & Address */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    1. Delivery Address
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Speed Selection */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    2. Delivery Speed
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${deliverySpeed === 'STANDARD' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingSpeed"
                          checked={deliverySpeed === 'STANDARD'}
                          onChange={() => setDeliverySpeed('STANDARD')}
                          className="text-[#14532D]"
                        />
                        <div>
                          <strong className="block text-gray-900">Standard Surface</strong>
                          <span className="text-[10px] text-gray-500">3-5 business days</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#14532D]">{subtotal >= 1999 ? 'FREE' : '₹99'}</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${deliverySpeed === 'EXPRESS' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingSpeed"
                          checked={deliverySpeed === 'EXPRESS'}
                          onChange={() => setDeliverySpeed('EXPRESS')}
                          className="text-[#14532D]"
                        />
                        <div>
                          <strong className="block text-gray-900">Express Air Courier</strong>
                          <span className="text-[10px] text-gray-500">24-48 hours</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">₹150</span>
                    </label>
                  </div>
                </div>

                {/* Payment Instrument (Razorpay Sandbox) */}
                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    3. Payment Instrument (Razorpay Sandbox)
                  </span>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-[#14532D]"
                    />
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>UPI (Google Pay, PhonePe, Paytm, QR)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-[#14532D]"
                    />
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Credit / Debit Card (Visa, RuPay, MasterCard)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="text-[#14532D]"
                    />
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Net Banking (All Indian Scheduled Banks)</span>
                  </label>
                </div>

                {/* Pay button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#14532D] hover:bg-[#0d381e] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-premium"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <>
                        <span>Pay ₹{finalPayable.toLocaleString('en-IN')} (Sandbox Mode)</span>
                        <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Items Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                Order Items ({items.length})
              </h3>

              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto space-y-2">
                {items.map(item => (
                  <div key={item.sparePart.id} className="pt-2 flex items-center gap-3 text-xs">
                    <img src={item.sparePart.imageUrl} alt={item.sparePart.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50 border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <strong className="text-gray-900 block truncate">{item.sparePart.name}</strong>
                      <span className="text-[10px] text-gray-400">Qty: {item.quantity} • SKU: {item.sparePart.sku}</span>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      ₹{(item.sparePart.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Estimated 18% GST (Included)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-base text-[#14532D]">₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Return Policy Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  7-Day Return/Replacement eligibility if part is damaged or incompatible based on verified catalog checker.
                </span>
              </div>
            </div>

          </div>
        ) : (
          /* Spare Parts Order Confirmation Screen */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-elevated space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Order #{confirmedOrder.orderNumber} Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                Thank you for your spare parts order!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Your order is being packed at the central warehouse and queued for dispatch.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Amount Paid</span>
                <strong className="text-base text-[#14532D]">₹{confirmedOrder.grandTotal.toLocaleString('en-IN')}</strong>
                <p className="text-[10px] text-gray-400 font-mono">Ref: {confirmedOrder.paymentTransactionRef}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Delivery Speed</span>
                <strong className="text-gray-900">{confirmedOrder.deliverySpeed} ({confirmedOrder.courierTracking?.carrierName})</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Shipping Address</span>
                <p className="text-gray-800">{confirmedOrder.deliveryAddress.line1}, {confirmedOrder.deliveryAddress.city} - {confirmedOrder.deliveryAddress.pincode}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Status</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">CONFIRMED (PACKING)</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard?tab=parts-orders"
                className="px-6 py-3 bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-premium hover:bg-[#0d381e]"
              >
                Track Shipment in Dashboard
              </Link>
              <Link
                to="/spare-parts"
                className="px-6 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
