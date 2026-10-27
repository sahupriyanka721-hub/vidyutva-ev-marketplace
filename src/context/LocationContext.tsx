import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { INDIAN_PINCODES, IndianPincodeInfo } from '../data/seedData';

interface LocationContextType {
  city: string;
  pincode: string;
  serviceability: IndianPincodeInfo;
  setLocation: (city: string, pincode: string) => void;
  checkPincode: (pin: string) => IndianPincodeInfo;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const saved = storage.getSelectedLocation();
    setCity(saved.city);
    setPincode(saved.pincode);
  }, []);

  const serviceability = storage.getPincodeServiceability(pincode);

  const setLocation = (newCity: string, newPincode: string) => {
    setCity(newCity);
    setPincode(newPincode);
    storage.setSelectedLocation({ city: newCity, pincode: newPincode });
    setIsLocationModalOpen(false);
  };

  const checkPincode = (pin: string) => {
    return storage.getPincodeServiceability(pin);
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        pincode,
        serviceability,
        setLocation,
        checkPincode,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
