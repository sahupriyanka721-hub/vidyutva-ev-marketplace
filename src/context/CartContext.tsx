import React, { createContext, useContext, useState, useEffect } from 'react';
import { SparePartCartItem, SparePartItem } from '../types';
import { VALID_COUPONS } from '../data/seedData';

interface CartContextType {
  items: SparePartCartItem[];
  addItem: (part: SparePartItem, qty?: number) => void;
  removeItem: (partId: string) => void;
  updateQuantity: (partId: string, qty: number) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<SparePartCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('evahan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('evahan_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (part: SparePartItem, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.sparePart.id === part.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, part.stockQuantity);
        return prev.map((i) =>
          i.sparePart.id === part.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { sparePart: part, quantity: Math.min(qty, part.stockQuantity) }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeItem = (partId: string) => {
    setItems((prev) => prev.filter((i) => i.sparePart.id !== partId));
  };

  const updateQuantity = (partId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(partId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.sparePart.id === partId) {
          return { ...i, quantity: Math.min(qty, i.sparePart.stockQuantity) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.sparePart.sellingPrice * item.quantity, 0);

  // Calculate discounts
  let discountAmount = 0;
  if (appliedCoupon) {
    const coupon = VALID_COUPONS.find(c => c.code.toUpperCase() === appliedCoupon.toUpperCase());
    if (coupon) {
      if (coupon.discountPercent) {
        const raw = (subtotal * coupon.discountPercent) / 100;
        discountAmount = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      } else if (coupon.flatDiscount) {
        discountAmount = Math.min(coupon.flatDiscount, subtotal);
      }
    }
  }

  // Shipping is FREE for orders above ₹1,999, else ₹150
  const shippingFee = subtotal === 0 || subtotal >= 1999 ? 0 : 150;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  // 18% GST included or broken down
  const taxAmount = Math.round(taxableAmount * 0.18);
  const grandTotal = Math.round(taxableAmount + shippingFee);

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const match = VALID_COUPONS.find(c => c.code === trimmed);
    if (!match) {
      setCouponError('Invalid coupon code. Try EVFIRST10 or GREEN500.');
      return false;
    }
    if (subtotal < match.minOrder) {
      setCouponError(`Minimum order value of ₹${match.minOrder.toLocaleString('en-IN')} required for this coupon.`);
      return false;
    }
    setAppliedCoupon(trimmed);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        discountAmount,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        shippingFee,
        taxAmount,
        grandTotal,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
