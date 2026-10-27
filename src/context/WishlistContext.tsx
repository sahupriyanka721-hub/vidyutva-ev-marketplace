import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  savedVehicleIds: string[];
  savedPartIds: string[];
  toggleVehicleWishlist: (vehicleId: string) => void;
  isVehicleWishlisted: (vehicleId: string) => boolean;
  togglePartWishlist: (partId: string) => void;
  isPartWishlisted: (partId: string) => boolean;
  totalWishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('evahan_wishlist_vehicles');
      return saved ? JSON.parse(saved) : ['veh-eglide-pro'];
    } catch {
      return ['veh-eglide-pro'];
    }
  });

  const [savedPartIds, setSavedPartIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('evahan_wishlist_parts');
      return saved ? JSON.parse(saved) : ['part-charger-72v-fast'];
    } catch {
      return ['part-charger-72v-fast'];
    }
  });

  useEffect(() => {
    localStorage.setItem('evahan_wishlist_vehicles', JSON.stringify(savedVehicleIds));
  }, [savedVehicleIds]);

  useEffect(() => {
    localStorage.setItem('evahan_wishlist_parts', JSON.stringify(savedPartIds));
  }, [savedPartIds]);

  const toggleVehicleWishlist = (vehicleId: string) => {
    setSavedVehicleIds(prev =>
      prev.includes(vehicleId) ? prev.filter(id => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  const isVehicleWishlisted = (vehicleId: string) => savedVehicleIds.includes(vehicleId);

  const togglePartWishlist = (partId: string) => {
    setSavedPartIds(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const isPartWishlisted = (partId: string) => savedPartIds.includes(partId);

  return (
    <WishlistContext.Provider
      value={{
        savedVehicleIds,
        savedPartIds,
        toggleVehicleWishlist,
        isVehicleWishlisted,
        togglePartWishlist,
        isPartWishlisted,
        totalWishlistCount: savedVehicleIds.length + savedPartIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
