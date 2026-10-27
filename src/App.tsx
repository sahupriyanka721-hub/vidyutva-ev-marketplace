import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';

// Global Layout Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { CompareBar } from './components/common/CompareBar';

// Pages
import { HomePage } from './pages/HomePage';
import { VehiclesListingPage } from './pages/VehiclesListingPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { VehicleCheckoutPage } from './pages/VehicleCheckoutPage';
import { TestDrivePage } from './pages/TestDrivePage';
import { QuotationPage } from './pages/QuotationPage';
import { SparePartsListingPage } from './pages/SparePartsListingPage';
import { SparePartDetailPage } from './pages/SparePartDetailPage';
import { CartPage } from './pages/CartPage';
import { SparePartsCheckoutPage } from './pages/SparePartsCheckoutPage';
import { ServiceBookingPage } from './pages/ServiceBookingPage';
import { CompareVehiclesPage } from './pages/CompareVehiclesPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CustomerSupportPage } from './pages/CustomerSupportPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <NotificationProvider>
                  <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#17211B] antialiased">
                    {/* Announcement Bar */}
                    <AnnouncementBar />

                    {/* Global Navigation Header */}
                    <Header />

                    {/* Main Routed Content Area */}
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/vehicles" element={<VehiclesListingPage />} />
                        <Route path="/vehicles/:modelSlug" element={<VehicleDetailPage />} />
                        <Route path="/checkout/vehicle/:modelSlug" element={<VehicleCheckoutPage />} />
                        <Route path="/test-drive" element={<TestDrivePage />} />
                        <Route path="/quotation" element={<QuotationPage />} />
                        <Route path="/spare-parts" element={<SparePartsListingPage />} />
                        <Route path="/spare-parts/:slug" element={<SparePartDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout/spare-parts" element={<SparePartsCheckoutPage />} />
                        <Route path="/service" element={<ServiceBookingPage />} />
                        <Route path="/compare" element={<CompareVehiclesPage />} />
                        <Route path="/dashboard" element={<CustomerDashboardPage />} />
                        <Route path="/contact" element={<CustomerSupportPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/legal/:slug" element={<LegalPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>

                    {/* Global Comparison Dock */}
                    <CompareBar />

                    {/* Global Footer */}
                    <Footer />

                    {/* Global Modals & Drawers */}
                    <LocationModal />
                    <CartDrawer />
                    <AuthModal />
                  </div>
                </NotificationProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
