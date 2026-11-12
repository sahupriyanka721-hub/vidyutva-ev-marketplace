import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';

// Global Layout Components for Customer Panel
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { CompareBar } from './components/common/CompareBar';

// Customer Panel Pages
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

// Standalone Admin Panel Page
import { AdminDashboardPage } from './pages/AdminDashboardPage';

/**
 * ScrollToTop component: Ensures page view jumps to the very top (0, 0)
 * whenever route changes (crucial when navigating to /admin from footer).
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

/**
 * AppContent separates the Customer Storefront Panel from the Standalone Admin Portal.
 * Customer panel elements (Navbar, AnnouncementBar, Footer, MobileNav, Modals) NEVER appear in Admin.
 */
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Standalone Admin Portal (Customer panel is completely hidden)
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] text-[#17211B] antialiased">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  // Full Customer Panel
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F8] text-[#17211B] antialiased">
      <ScrollToTop />
      {/* Customer Announcement Bar */}
      <AnnouncementBar />

      {/* Customer Navigation Header */}
      <Header />

      {/* Main Routed Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
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
          <Route path="/customer" element={<CustomerDashboardPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/customer-panel" element={<CustomerDashboardPage />} />
          <Route path="/contact" element={<CustomerSupportPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Comparison Dock */}
      <CompareBar />

      {/* Global Footer */}
      <Footer />

      {/* Mobile Native-Style Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <LocationModal />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <NotificationProvider>
                  <AppContent />
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
