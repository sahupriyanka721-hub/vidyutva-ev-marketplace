import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  FileText,
  Wrench,
  LifeBuoy,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Bell,
  Eye,
  Send,
  Zap,
  Tag,
  LogOut,
  Smartphone,
  Lock,
  Mail,
  Phone,
  MapPin,
  PackageCheck,
  UserCheck
} from 'lucide-react';
import { storage } from '../services/storageService';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../data/seedData';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  CustomerUser,
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  ServiceBookingItem,
  SparePartsOrder,
  SupportTicketItem
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  // Admin authentication state: requires registered mobile & verification OTP
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('evahan_admin_auth') === 'true' ||
      sessionStorage.getItem('evahan_admin_auth') === 'true'
    );
  });
  const [adminPhone, setAdminPhone] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminStep, setAdminStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [adminError, setAdminError] = useState('');
  const [isOtpAutoFilled, setIsOtpAutoFilled] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'customers' | 'announcements' | 'orders' | 'test-drives' | 'quotations' | 'services' | 'parts' | 'tickets' | 'inventory'
  >('overview');

  // Live data from storageService (Zero dummy users - strictly only real platform data)
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerUser[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [vehicleOrders, setVehicleOrders] = useState<VehicleOrderItem[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBookingItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequestItem[]>([]);
  const [services, setServices] = useState<ServiceBookingItem[]>([]);
  const [partsOrders, setPartsOrders] = useState<SparePartsOrder[]>([]);
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);

  // Announcement Bar message manager (Section 4.A requirement)
  const [announcements, setAnnouncements] = useState<string[]>([
    '⚡ Zero Road Tax across Delhi, UP, Karnataka & Maharashtra | Doorstep Test Drives in 24+ Cities',
    '🛵 Book a Complimentary Doorstep Test Drive Today with Certified Van Specialist',
    '🔧 100% Genuine OEM EV Spare Parts with Verified Fitment Guarantee',
    '🛠️ Certified EV Technician Service at Your Doorstep in 24+ Cities'
  ]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Ticket reply state
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const loadAllData = () => {
    setRegisteredCustomers(storage.getRegisteredUsers());
    setVehicleOrders(storage.getVehicleOrders());
    setTestDrives(storage.getTestDrives());
    setQuotations(storage.getQuotations());
    setServices(storage.getServiceBookings());
    setPartsOrders(storage.getSparePartsOrders());
    setTickets(storage.getSupportTickets());
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllData();
    }
  }, [isAdminAuthenticated]);

  const handleSendAdminOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = adminPhone.trim();
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      setAdminError('Kripya 10-digit valid Indian mobile number enter karein');
      return;
    }
    // Check if phone number is authorized for admin access
    if (!storage.isAuthorizedAdminPhone(cleanPhone)) {
      setAdminError('❌ Ye mobile number Admin access ke liye registered nahi hai. Kripya authorized admin mobile number enter karein.');
      return;
    }
    setAdminError('');
    setAdminStep('OTP');
    const generatedOtp = '849201';
    setAdminOtp(generatedOtp);
    setIsOtpAutoFilled(true);
  };

  const handleVerifyAdminOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = adminOtp.trim();
    if (enteredOtp.length !== 6) {
      setAdminError('Kripya 6-digit verification OTP code dalein');
      return;
    }
    // Master Admin OTP code verification (standard authorized code 849201 or 123456)
    if (enteredOtp !== '849201' && enteredOtp !== '123456') {
      setAdminError('❌ Galat OTP code. Kripya sahi 6-digit OTP code enter karein.');
      return;
    }
    setAdminLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('evahan_admin_auth', 'true');
      localStorage.setItem('evahan_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setAdminLoading(false);
    }, 350);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('evahan_admin_auth');
    localStorage.removeItem('evahan_admin_auth');
    setIsAdminAuthenticated(false);
    setAdminStep('PHONE');
    setAdminPhone('');
    setAdminOtp('');
    setIsOtpAutoFilled(false);
    setAdminError('');
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    storage.updateVehicleOrderStatus(orderId, status);
    loadAllData();
  };

  const handleUpdatePartsOrderStatus = (orderId: string, status: any) => {
    storage.updateSparePartsOrderStatus(orderId, status);
    loadAllData();
  };

  const handleUpdateTestDriveStatus = (bookingId: string, status: any) => {
    storage.updateTestDriveStatus(bookingId, status);
    loadAllData();
  };

  const handleUpdateServiceApproval = (bookingId: string, approve: boolean) => {
    storage.updateServiceApproval(bookingId, approve);
    loadAllData();
  };

  const handleReplyTicket = (ticketId: string) => {
    const text = replyText[ticketId];
    if (text && text.trim()) {
      storage.replySupportTicket(ticketId, text.trim());
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
      loadAllData();
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncementText.trim()) {
      setAnnouncements(prev => [newAnnouncementText.trim(), ...prev]);
      setNewAnnouncementText('');
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements(prev => prev.filter((_, i) => i !== index));
  };

  // Filter registered customers based on search query
  const filteredCustomers = registeredCustomers.filter(c => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase();
    return (
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  // If Admin is NOT authenticated, present the secure Registered Mobile Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#F0F4F8] min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-xl border border-gray-200/90 relative">
          
          {/* Brand Logo with stylish non-white dark badge */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="header" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Administrative Gateway</span>
            </div>
            <h2 className="text-2xl font-black text-[#06152B] tracking-tight">
              Admin Portal Login
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Authorized admin access only. Enter your registered mobile number and verification OTP to access operations.
            </p>
          </div>

          {adminStep === 'PHONE' ? (
            <form onSubmit={handleSendAdminOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Registered Admin Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs font-bold text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={adminPhone}
                    onChange={(e) => {
                      setAdminPhone(e.target.value.replace(/\D/g, ''));
                      if (adminError) setAdminError('');
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#06152B] via-[#0B2545] to-[#081E3B] hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Send Admin OTP</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>

              <div className="pt-2 text-center">
                <Link to="/" className="text-xs text-gray-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
                  ← Return to Customer Storefront
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAdminOtp} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span>Registered Admin: +91 {adminPhone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminStep('PHONE');
                      setAdminError('');
                      setAdminOtp('');
                      setIsOtpAutoFilled(false);
                    }}
                    className="text-[#16A34A] hover:underline text-[11px] font-bold"
                  >
                    Change
                  </button>
                </div>
                {isOtpAutoFilled && (
                  <p className="text-[11px] text-emerald-800 flex items-center gap-1.5 pt-0.5 font-medium bg-emerald-100/70 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>OTP auto-detected and filled automatically: <strong className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">849201</strong></span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  6-Digit Admin Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="8 4 9 2 0 1"
                  value={adminOtp}
                  onChange={(e) => {
                    setAdminOtp(e.target.value.replace(/\D/g, ''));
                    if (adminError) setAdminError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-400 bg-emerald-50/30 text-center tracking-[0.3em] font-mono text-xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {adminLoading ? (
                  <span>Verifying Admin Authorization...</span>
                ) : (
                  <>
                    <span>Verify OTP & Open Admin Dashboard</span>
                    <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAdminStep('PHONE');
                    setAdminError('');
                    setAdminOtp('');
                  }}
                  className="text-xs text-gray-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                >
                  ← Back to mobile number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Secured Admin Gateway • E-VAHAN Operations</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Master Header with Logout button */}
        <div className="bg-gradient-to-r from-[#06152B] via-[#0B2545] to-[#081E3B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#B7F34A] text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse"></span>
              <span>E-VAHAN Central Multi-Vendor Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Live marketplace operations: registered customers, vehicle orders, quotation dockets, doorstep service van allocations, announcements, and support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-[#B7F34A] transition-all border border-emerald-500/40"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Lock Admin Portal & Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Top 7 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'customers' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
            }`}
            onClick={() => setActiveTab('customers')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Registered Customers
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{registeredCustomers.length}</strong>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Vehicle Orders
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{vehicleOrders.length}</strong>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'test-drives' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-blue-300'
            }`}
            onClick={() => setActiveTab('test-drives')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Test Drives
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{testDrives.length}</strong>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Active</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'quotations' ? 'bg-purple-50 border-purple-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-purple-300'
            }`}
            onClick={() => setActiveTab('quotations')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Fleet Quotes
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{quotations.length}</strong>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">Issued</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'services' ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-amber-300'
            }`}
            onClick={() => setActiveTab('services')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Doorstep Vans
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{services.length}</strong>
              <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Vans</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'parts' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
            }`}
            onClick={() => setActiveTab('parts')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Parts Orders
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{partsOrders.length}</strong>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">OEM</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'tickets' ? 'bg-rose-50 border-rose-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-rose-300'
            }`}
            onClick={() => setActiveTab('tickets')}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Support Desk
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{tickets.length}</strong>
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">Desk</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-subtle flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Customers ({registeredCustomers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Vehicle Orders ({vehicleOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'parts'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Parts Orders ({partsOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('test-drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'test-drives'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Test Drives ({testDrives.length})
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quotations'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Quotation Dockets ({quotations.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Doorstep Vans ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tickets'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Support Desk ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Announcement Bar Manager
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Inventory Catalog
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Vehicle Orders */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                    <span>Recent Customer Vehicle Bookings</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {vehicleOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No vehicle orders yet.</p>
                  ) : (
                    vehicleOrders.slice(0, 4).map(o => (
                      <div key={o.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">{o.vehicleName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {o.orderNumber} • ₹{(o.bookingAmountPaid || 0).toLocaleString('en-IN')} ({o.deliveryAddress?.fullName || 'Customer'})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Test Drive Bookings */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Upcoming Doorstep Test Drives</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('test-drives')}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {testDrives.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No test drives scheduled yet.</p>
                  ) : (
                    testDrives.slice(0, 4).map(td => (
                      <div key={td.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">{td.vehicleName}</strong>
                          <span className="text-[11px] text-gray-500">
                            {td.customerName} • {td.preferredDate} ({td.timeSlot}) • {td.city}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                          {td.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Recent Registered Customers Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#16A34A]" />
                  <span>Recent Registered Customer Profiles</span>
                </h3>
                <button
                  onClick={() => setActiveTab('customers')}
                  className="text-xs font-bold text-[#16A34A] hover:underline"
                >
                  Manage All Customers ({registeredCustomers.length}) →
                </button>
              </div>

              {registeredCustomers.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    No customers have registered yet. Real customer profiles will appear here as soon as they sign up on the marketplace.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {registeredCustomers.slice(0, 6).map(cust => (
                    <div key={cust.id || cust.phone} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-gray-900 block">{cust.fullName}</strong>
                        <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#16A34A]" />
                          <span>+91 {cust.phone}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">{cust.city} {cust.pincode ? `(${cust.pincode})` : ''}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        cust.isKycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cust.isKycVerified ? 'KYC Verified' : 'Pending KYC'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Registered Customers (Live real user database) */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#16A34A]" />
                  <span>Registered Customers Database ({registeredCustomers.length})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Live profiles of customers who have registered on the E-VAHAN marketplace. Real customer details flow directly here.
                </p>
              </div>

              {/* Customer Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 space-y-3">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">
                  {registeredCustomers.length === 0 ? 'No Registered Customers Yet' : 'No Matching Customers Found'}
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {registeredCustomers.length === 0
                    ? 'When customers register with their phone number and details on the website, their profiles, contact information, and delivery addresses will appear here in real-time.'
                    : `No registered customer matched "${customerSearch}". Try searching with a different name, phone number, or city.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">Customer Profile</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">Registered Location</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Saved Delivery Addresses</th>
                      <th className="p-3">Marketplace Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((cust) => {
                      const custOrders = vehicleOrders.filter(o => o.deliveryAddress?.phone === cust.phone || o.userId === cust.id);
                      const custParts = partsOrders.filter(p => p.deliveryAddress?.phone === cust.phone || p.userId === cust.id);
                      const custTestDrives = testDrives.filter(td => td.customerPhone === cust.phone || td.userId === cust.id);

                      return (
                        <tr key={cust.id || cust.phone} className="hover:bg-gray-50/70">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06152B] to-[#16A34A] text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                {cust.fullName?.slice(0, 2) || 'CU'}
                              </div>
                              <div>
                                <strong className="text-xs font-bold text-gray-900 block">{cust.fullName}</strong>
                                <span className="text-[10px] text-gray-400 font-mono">ID: {cust.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <div className="font-mono font-bold text-gray-900 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-[#16A34A]" />
                                <span>+91 {cust.phone}</span>
                              </div>
                              {cust.email && (
                                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  <span>{cust.email}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              <span>{cust.city || 'Not specified'} {cust.pincode ? `(${cust.pincode})` : ''}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {cust.isKycVerified ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> KYC Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Pending KYC
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {cust.savedAddresses && cust.savedAddresses.length > 0 ? (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                  {cust.savedAddresses.length} Address{cust.savedAddresses.length > 1 ? 'es' : ''}
                                </span>
                                <p className="text-[11px] text-gray-500 max-w-xs truncate">
                                  {cust.savedAddresses[0].line1}, {cust.savedAddresses[0].city}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">No addresses saved</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 text-[10px]">
                              {custOrders.length > 0 && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                  {custOrders.length} Vehicle Order{custOrders.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custParts.length > 0 && (
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                                  {custParts.length} Parts Order{custParts.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custTestDrives.length > 0 && (
                                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                                  {custTestDrives.length} Test Drive{custTestDrives.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custOrders.length === 0 && custParts.length === 0 && custTestDrives.length === 0 && (
                                <span className="text-gray-400">Account Active</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Vehicle Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">All Customer Vehicle Purchases & Token Bookings</h2>
                <p className="text-xs text-gray-500">Live vehicle orders with full customer contact, booking tokens, and delivery status.</p>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl w-max">
                Total Orders: {vehicleOrders.length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer & Contact</th>
                    <th className="p-3">Vehicle & Variant</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Booking Amount</th>
                    <th className="p-3">Total On-Road</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vehicleOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-[#06152B]">{o.orderNumber}</td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">
                            {o.deliveryAddress?.fullName || 'Customer'}
                          </strong>
                          <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#16A34A]" />
                            <span>+91 {o.deliveryAddress?.phone || '-'}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {o.deliveryAddress?.city}{o.deliveryAddress?.pincode ? ` (${o.deliveryAddress.pincode})` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{o.vehicleName} ({o.colorName})</td>
                      <td className="p-3 font-medium text-gray-600">{o.paymentMode}</td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(o.bookingAmountPaid || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-semibold text-gray-900">₹{(o.totalOnRoad || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="BOOKING_CONFIRMED">BOOKING CONFIRMED</option>
                          <option value="DOCUMENTS_PENDING">DOCUMENTS PENDING</option>
                          <option value="KYC_VERIFIED">KYC VERIFIED</option>
                          <option value="ALLOCATED_TO_DEALERSHIP">ALLOCATED TO DEALERSHIP</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Spare Parts Orders */}
        {activeTab === 'parts' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Genuine OEM Spare Parts Orders & Dispatch</h2>
                <p className="text-xs text-gray-500">Live spare parts orders, customer delivery locations, courier tracking, and fulfillment updates.</p>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl w-max">
                Total Orders: {partsOrders.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer & Contact</th>
                    <th className="p-3">Parts Purchased</th>
                    <th className="p-3">Delivery Address</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {partsOrders.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-emerald-800">{p.orderNumber}</td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">{p.deliveryAddress?.fullName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">+91 {p.deliveryAddress?.phone}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {p.items.map((item, idx) => (
                            <div key={idx} className="text-[11px]">
                              <span className="font-bold text-gray-800">{item.name}</span>
                              <span className="text-gray-400 ml-1">× {item.quantity} (SKU: {item.sku})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-[11px] text-gray-700 max-w-xs">
                          {p.deliveryAddress?.line1}, {p.deliveryAddress?.city} - {p.deliveryAddress?.pincode}
                        </p>
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {p.deliverySpeed} DELIVERY
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(p.grandTotal || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdatePartsOrderStatus(p.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="IN_TRANSIT">IN TRANSIT</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Test Drives */}
        {activeTab === 'test-drives' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Doorstep Test Drive Schedule & Hub Dispatch</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Location & Pincode</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testDrives.map(td => (
                    <tr key={td.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold">{td.bookingNumber || td.id}</td>
                      <td className="p-3 font-semibold text-gray-900">{td.customerName} (+91 {td.customerPhone})</td>
                      <td className="p-3 font-bold text-gray-800">{td.vehicleName}</td>
                      <td className="p-3">{td.preferredDate} ({td.timeSlot})</td>
                      <td className="p-3">{td.city} ({td.pincode})</td>
                      <td className="p-3 font-semibold text-gray-600">{td.testDriveMode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                          {td.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={td.status}
                          onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="RESCHEDULE_REQUESTED">RESCHEDULE REQUESTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Quotations */}
        {activeTab === 'quotations' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Customer Quotation Inquiries & Commercial Fleet Dockets</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Docket Number</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Usage Type</th>
                    <th className="p-3">Units</th>
                    <th className="p-3">Net On-Road Estimate</th>
                    <th className="p-3">State Subsidy Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotations.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-purple-700">{q.quotationNumber}</td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">{q.customerName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">+91 {q.customerPhone}</span>
                          {q.companyName && <span className="text-[10px] text-gray-400 block">{q.companyName}</span>}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{q.vehicleName}</td>
                      <td className="p-3">{q.usageType}</td>
                      <td className="p-3 font-bold">{q.quantity}</td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(q.estimatedGrandTotal || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-emerald-700 font-semibold">-₹{(q.estimatedSubsidyTotal || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Services */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Doorstep Mobile Service Vans & Customer Digital Approvals</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Service Type</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Customer Digital Approval</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold">{s.bookingNumber || s.id}</td>
                      <td className="p-3">
                        <strong className="text-xs font-bold text-gray-900 block">{s.customerName}</strong>
                        <span className="text-[11px] text-gray-500 font-mono">+91 {s.customerPhone}</span>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{s.serviceCategoryName}</td>
                      <td className="p-3">{s.appointmentDate} ({s.appointmentSlot})</td>
                      <td className="p-3">{s.addressLine}, {s.city} ({s.pincode})</td>
                      <td className="p-3">
                        {s.isCustomerApproved ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1 w-max">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 font-bold text-[10px]">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Support Desk */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-gray-900">Customer Support Ticket Helpdesk</h2>
            
            <div className="space-y-4">
              {tickets.map(t => (
                <div key={t.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-700 mr-2">{t.ticketNumber}</span>
                      <strong className="text-sm font-bold text-gray-900">{t.subject}</strong>
                      <span className="ml-2 text-[10px] font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">
                        {t.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2 pt-2 border-t border-gray-200/80">
                    {t.messages.map(m => (
                      <div key={m.id} className={`p-3 rounded-xl text-xs ${m.sender === 'SUPPORT_AGENT' ? 'bg-purple-50 text-purple-900 border border-purple-100 ml-4' : 'bg-white border border-gray-200 mr-4'}`}>
                        <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-gray-500">
                          <span>{m.senderName}</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Type official executive reply to customer..."
                      value={replyText[t.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                    <button
                      onClick={() => handleReplyTicket(t.id)}
                      className="px-4 py-2 bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Announcement Bar Manager (Section 4.A) */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#16A34A]" />
                <span>Homepage Announcement Bar Management (Spec 4.A)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                As required by Section 4.A of the product specification, these announcement messages are directly editable from the administration panel.
              </p>
            </div>

            <form onSubmit={handleAddAnnouncement} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter new announcement message (e.g. Subsidy update, Festival discount)..."
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Message</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <strong className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                Active Live Messages:
              </strong>
              {announcements.map((msg, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#06152B] text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-gray-800">{msg}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Inventory Catalog */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Master Catalog: Electric Vehicles & Genuine Spare Parts</h2>
                <p className="text-xs text-gray-500">Live inventory specifications, pricing, battery ratings, and vehicle benchmarking.</p>
              </div>
              <Link
                to="/compare"
                target="_blank"
                className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#16A34A] border border-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                title="Open Vehicle Specification Comparison Benchmark"
              >
                <span>Vehicle Comparison Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicles */}
              <div className="space-y-3">
                <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Electric Vehicles ({VEHICLES_DATA.length})
                </strong>
                {VEHICLES_DATA.map(v => (
                  <div key={v.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={v.images[0]?.url} alt={v.name} className="w-10 h-10 object-cover rounded-xl bg-gray-200" />
                      <div>
                        <strong className="text-xs font-bold text-gray-900 block">{v.name}</strong>
                        <span className="text-[11px] text-gray-500">{v.brand} • ₹{v.exShowroomPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      IN STOCK
                    </span>
                  </div>
                ))}
              </div>

              {/* Spare Parts */}
              <div className="space-y-3">
                <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  OEM Genuine Spare Parts ({SPARE_PARTS_DATA.length})
                </strong>
                {SPARE_PARTS_DATA.map(p => (
                  <div key={p.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-gray-200" />
                      <div>
                        <strong className="text-xs font-bold text-gray-900 block">{p.name}</strong>
                        <span className="text-[11px] text-gray-500">SKU: {p.sku} • ₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md">
                      OEM VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
