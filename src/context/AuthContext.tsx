import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, CustomerAddress } from '../types';
import { storage } from '../services/storageService';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  signup: (data: { fullName: string; phone: string; email: string; city: string; pincode: string }) => Promise<boolean>;
  isPhoneRegistered: (phone: string) => boolean;
  getRegisteredUser: (phone: string) => CustomerUser | undefined;
  logout: () => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectAfter?: string) => void;
  closeAuthModal: () => void;
  authRedirectUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load persisted user or default demo user
    const loadedUser = storage.getUser();
    setUser(loadedUser);
  }, []);

  const isPhoneRegistered = (phone: string): boolean => {
    return !!storage.findRegisteredUserByPhone(phone);
  };

  const getRegisteredUser = (phone: string): CustomerUser | undefined => {
    return storage.findRegisteredUserByPhone(phone);
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/\D/g, '').trim();
    // 1. Strictly verify that the mobile number is registered
    const registeredUser = storage.findRegisteredUserByPhone(cleanPhone);
    if (!registeredUser) {
      return false; // Not registered! Login not allowed
    }

    // 2. Verify 6-digit OTP
    if (otp && otp.length === 6) {
      setUser(registeredUser);
      storage.saveUser(registeredUser);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const signup = async (data: { fullName: string; phone: string; email: string; city: string; pincode: string }): Promise<boolean> => {
    const cleanPhone = data.phone.replace(/\D/g, '').trim();
    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName.trim(),
      phone: cleanPhone,
      email: data.email.trim(),
      city: data.city.trim(),
      pincode: data.pincode.trim(),
      isKycVerified: false,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'HOME',
          fullName: data.fullName.trim(),
          phone: cleanPhone,
          line1: `${data.city.trim()} Residential Area`,
          city: data.city.trim(),
          state: 'India',
          pincode: data.pincode.trim(),
          isDefault: true,
        }
      ]
    };
    storage.saveRegisteredUser(newUser);
    setUser(newUser);
    storage.saveUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    storage.clearUser();
    setIsAuthModalOpen(false);
    setAuthRedirectUrl(undefined);
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    storage.saveUser(updated);
    storage.saveRegisteredUser(updated);
  };

  const addAddress = (addressData: Omit<CustomerAddress, 'id'>) => {
    if (!user) return;
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    storage.updateAddress(newAddress);
    const updated = storage.getUser();
    if (updated) {
      setUser(updated);
      storage.saveRegisteredUser(updated);
    }
  };

  const deleteAddress = (id: string) => {
    storage.deleteAddress(id);
    const updated = storage.getUser();
    if (updated) {
      setUser(updated);
      storage.saveRegisteredUser(updated);
    }
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    updateProfile({ savedAddresses: updatedAddresses });
  };

  const openAuthModal = (redirectAfter?: string) => {
    setAuthRedirectUrl(redirectAfter);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        isPhoneRegistered,
        getRegisteredUser,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
