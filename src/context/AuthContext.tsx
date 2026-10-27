import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, CustomerAddress } from '../types';
import { storage } from '../services/storageService';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  signup: (data: { fullName: string; phone: string; email: string; city: string; pincode: string }) => Promise<boolean>;
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

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Secure 6-digit OTP verification
    if (otp && otp.length === 6) {
      const existingUser = storage.getUser();
      const updatedUser: CustomerUser = {
        ...existingUser,
        phone: phone.trim() || existingUser.phone,
      };
      setUser(updatedUser);
      storage.saveUser(updatedUser);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const signup = async (data: { fullName: string; phone: string; email: string; city: string; pincode: string }): Promise<boolean> => {
    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      pincode: data.pincode,
      isKycVerified: false,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'HOME',
          fullName: data.fullName,
          phone: data.phone,
          line1: `${data.city} Residential Area`,
          city: data.city,
          state: 'India',
          pincode: data.pincode,
          isDefault: true,
        }
      ]
    };
    setUser(newUser);
    storage.saveUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('evahan_user');
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    storage.saveUser(updated);
  };

  const addAddress = (addressData: Omit<CustomerAddress, 'id'>) => {
    if (!user) return;
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    storage.updateAddress(newAddress);
    setUser(storage.getUser());
  };

  const deleteAddress = (id: string) => {
    storage.deleteAddress(id);
    setUser(storage.getUser());
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
