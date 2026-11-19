import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  ShoppingBag,
  Clock,
  FileText,
  Wrench,
  Heart,
  Bell,
  LifeBuoy,
  Settings,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  Send,
  Eye,
  Star,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { storage } from '../services/storageService';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../data/seedData';
import { lookupCityOrPincode, ALL_INDIAN_CITIES } from '../data/indianCitiesPincodes';
import {
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  SparePartsOrder,
  ServiceBookingItem,
  SupportTicketItem,
  AppNotification,
  CustomerAddress
} from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { savedVehicleIds, savedPartIds, toggleVehicleWishlist, togglePartWishlist } = useWishlist();

  // Active Tab: overview, profile, addresses, vehicle-orders, test-drives, quotations, parts-orders, service-bookings, wishlist, notifications, tickets, reviews, settings
  const currentTab = searchParams.get('tab') || 'overview';

  // Live Records from storageService
  const [vehicleOrders, setVehicleOrders] = useState<VehicleOrderItem[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBookingItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequestItem[]>([]);
  const [partsOrders, setPartsOrders] = useState<SparePartsOrder[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBookingItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals & form state
  const [newAddressModal, setNewAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<CustomerAddress, 'id'>>({
    label: 'HOME',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: user?.city || '',
    state: 'India',
    pincode: user?.pincode || '',
    isDefault: false
  });

  const [ticketReplyText, setTicketReplyText] = useState<{ [ticketId: string]: string }>({});
  const [rescheduleData, setRescheduleData] = useState<{ id: string; date: string; slot: string } | null>(null);

  const loadData = () => {
    setVehicleOrders(storage.getVehicleOrders());
    setTestDrives(storage.getTestDrives());
    setQuotations(storage.getQuotations());
    setPartsOrders(storage.getSparePartsOrders());
    setServiceBookings(storage.getServiceBookings());
    setSupportTickets(storage.getSupportTickets());
    setNotifications(storage.getNotifications());
  };

  useEffect(() => {
    loadData();
    // Live two-way sync: customer dashboard updates instantly when Admin updates status or replies
    const unsub = storage.onSync(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      setAddressForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        phone: user.phone || prev.phone,
        city: user.city || prev.city,
        pincode: user.pincode || prev.pincode
      }));
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleApproveRepair = (bookingId: string, approve: boolean) => {
    storage.updateServiceApproval(bookingId, approve);
    loadData();
  };

  const handleCancelTestDrive = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled test drive?')) {
      storage.cancelTestDrive(id);
      loadData();
    }
  };

  const handleRescheduleTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleData) {
      storage.rescheduleTestDrive(rescheduleData.id, rescheduleData.date, rescheduleData.slot);
      setRescheduleData(null);
      loadData();
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(addressForm);
    setNewAddressModal(false);
  };

  const handleSendTicketReply = (ticketId: string) => {
    const text = ticketReplyText[ticketId];
    if (text && text.trim()) {
      storage.replySupportTicket(ticketId, text.trim());
      setTicketReplyText(prev => ({ ...prev, [ticketId]: '' }));
      loadData();
    }
  };

  const wishlistedVehicles = VEHICLES_DATA.filter(v => savedVehicleIds.includes(v.id));
  const wishlistedParts = SPARE_PARTS_DATA.filter(p => savedPartIds.includes(p.id));

  // If NOT authenticated or user is null (e.g. after signout or direct URL access),
  // strictly DO NOT open or render the customer dashboard!
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-[#F0F4F8] min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-50 text-[#16A34A] rounded-2xl mx-auto flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Customer Panel Locked</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Aap signed out hain. Customer dashboard access karne ke liye kripya apne registered mobile number se login karein.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('/dashboard')}
              className="w-full py-3.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-600 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-[#B7F34A]" />
              <span>Login to Open Customer Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
            >
              Back to Storefront Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Profile Header (Rendered only for authenticated customers) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06152B] to-[#0B2545] text-[#B7F34A] border border-emerald-500/40 flex items-center justify-center font-black text-2xl shadow-md">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Welcome back, {user.fullName}!
                </h1>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Verified Customer
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +91 {user.phone} • {user.email} • Location: {user.city} ({user.pincode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/vehicles"
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-xs font-bold rounded-xl transition-colors"
            >
              Browse Vehicles
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-gray-200/80 shadow-subtle space-y-1 sticky top-24">
            {[
              { id: 'overview', label: 'Overview', icon: UserIcon },
              { id: 'vehicle-orders', label: 'My Vehicle Orders', icon: ShoppingBag, count: vehicleOrders.length },
              { id: 'test-drives', label: 'Test Drive Bookings', icon: Clock, count: testDrives.length },
              { id: 'quotations', label: 'My Quotations', icon: FileText, count: quotations.length },
              { id: 'parts-orders', label: 'Spare Parts Orders', icon: Truck, count: partsOrders.length },
              { id: 'service-bookings', label: 'Doorstep Services', icon: Wrench, count: serviceBookings.length },
              { id: 'wishlist', label: 'Wishlist & Saved', icon: Heart, count: wishlistedVehicles.length + wishlistedParts.length },
              { id: 'addresses', label: 'My Addresses', icon: MapPin },
              { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy, count: supportTickets.length },
              { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => !n.isRead).length },
              { id: 'profile', label: 'My Profile & KYC', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#14532D] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#B7F34A]' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#B7F34A] text-[#14532D]'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Tab Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. TAB: OVERVIEW */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-subtle">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Vehicles</span>
                    <strong className="text-2xl font-black text-gray-900 mt-1 block">{vehicleOrders.length}</strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Allocated</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-subtle">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Test Drives</span>
                    <strong className="text-2xl font-black text-gray-900 mt-1 block">{testDrives.length}</strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Active Bookings</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-subtle">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Service Requests</span>
                    <strong className="text-2xl font-black text-gray-900 mt-1 block">{serviceBookings.length}</strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Van Scheduled</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-subtle">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Quotations</span>
                    <strong className="text-2xl font-black text-gray-900 mt-1 block">{quotations.length}</strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Fleet Dockets</span>
                  </div>
                </div>

                {/* Upcoming Service Alert / Approval Required */}
                {serviceBookings.some(s => s.additionalApprovalQuote?.status === 'PENDING') && (
                  <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                          Technician Estimate Requires Your Approval
                        </h4>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Service technician Santosh Kumar has submitted a digital inspection estimate for Front Brake Pad Replacement (₹1,000).
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTabChange('service-bookings')}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shrink-0"
                    >
                      Review & Approve
                    </button>
                  </div>
                )}

                {/* Recent Vehicle Orders Preview */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Recent Vehicle Orders</h3>
                    <button onClick={() => handleTabChange('vehicle-orders')} className="text-xs font-bold text-[#14532D] hover:underline">
                      View All
                    </button>
                  </div>

                  {vehicleOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={order.vehicleImage} alt={order.vehicleName} className="w-14 h-12 object-cover rounded-xl" />
                        <div>
                          <strong className="text-sm font-bold text-gray-900">{order.vehicleName}</strong>
                          <p className="text-[11px] text-gray-500">Order #{order.orderNumber} • {order.colorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                          {order.status}
                        </span>
                        <button
                          onClick={() => handleTabChange('vehicle-orders')}
                          className="px-3 py-1.5 bg-[#14532D] text-white font-bold rounded-xl"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Test Drives Preview */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Upcoming Test Drive</h3>
                    <button onClick={() => handleTabChange('test-drives')} className="text-xs font-bold text-[#14532D] hover:underline">
                      Manage
                    </button>
                  </div>

                  {testDrives.slice(0, 1).map((td) => (
                    <div key={td.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <strong className="text-sm font-bold text-gray-900">{td.vehicleName}</strong>
                        <p className="text-[11px] text-emerald-900 mt-0.5">
                          {td.preferredDate} ({td.timeSlot}) • Mode: {td.testDriveMode}
                        </p>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                        {td.status}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 2. TAB: VEHICLE ORDERS */}
            {currentTab === 'vehicle-orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Electric Vehicle Orders</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track RTO high-security plate registration, KYC verification, and home delivery milestones.
                  </p>
                </div>

                {vehicleOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-dashed text-xs text-gray-500">
                    No vehicle orders placed yet. <Link to="/vehicles" className="text-[#14532D] font-bold underline">Explore vehicles</Link>.
                  </div>
                ) : (
                  vehicleOrders.map((ord) => (
                    <div key={ord.id} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">Order Reference</span>
                          <h3 className="text-base font-bold text-gray-900">{ord.orderNumber}</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="flex gap-3 sm:col-span-2">
                          <img src={ord.vehicleImage} alt={ord.vehicleName} className="w-20 h-16 object-cover rounded-xl" />
                          <div>
                            <strong className="text-sm font-bold text-gray-900">{ord.vehicleName}</strong>
                            <p className="text-gray-500">Color Variant: {ord.colorName}</p>
                            <p className="text-gray-500">Allocated Dealer: {ord.allocatedDealer}</p>
                          </div>
                        </div>
                        <div className="text-right sm:border-l sm:pl-4 border-gray-100">
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Paid Amount</span>
                          <span className="text-lg font-black text-[#14532D]">₹{ord.bookingAmountPaid.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">Balance: ₹{ord.balanceDue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Delivery Stages
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-[11px] text-center font-bold">
                          <div className="text-emerald-700">✓ Booking Paid</div>
                          <div className="text-emerald-700">✓ Dealer Assigned</div>
                          <div className="text-gray-500">3. RTO / KYC</div>
                          <div className="text-gray-400">4. Delivery</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. TAB: TEST DRIVE BOOKINGS */}
            {currentTab === 'test-drives' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Test Drive Bookings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    View active test drive slots, reschedule dates, or cancel according to cancellation policy.
                  </p>
                </div>

                {testDrives.map((td) => (
                  <div key={td.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">Booking ID</span>
                        <h3 className="text-sm font-bold text-gray-900">{td.bookingNumber}</h3>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${
                        td.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        td.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {td.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Vehicle</span>
                        <strong className="text-gray-900 text-sm">{td.vehicleName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Scheduled Slot</span>
                        <strong className="text-gray-900">{td.preferredDate} ({td.timeSlot})</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                        <p className="text-gray-800">{td.testDriveMode === 'DOORSTEP' ? `Doorstep Visit at ${td.city} (${td.pincode})` : td.dealershipName}</p>
                      </div>
                    </div>

                    {td.status !== 'CANCELLED' && (
                      <div className="pt-3 border-t border-gray-100 flex gap-2 justify-end">
                        <button
                          onClick={() => setRescheduleData({ id: td.id, date: td.preferredDate, slot: td.timeSlot })}
                          className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                        >
                          Reschedule Slot
                        </button>
                        <button
                          onClick={() => handleCancelTestDrive(td.id)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Reschedule Full-Screen Studio */}
                {rescheduleData && (
                  <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                    {/* Top Sticky Header */}
                    <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setRescheduleData(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          <span>← Back</span>
                        </button>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                            Test Drive Management
                          </div>
                          <h2 className="text-base sm:text-lg font-black text-white">
                            Reschedule Test Drive Slot
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRescheduleData(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRescheduleTestDrive(e as any)}
                          className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Confirm Reschedule
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 p-6 sm:p-10 max-w-2xl mx-auto w-full">
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                          <h3 className="text-base font-bold text-gray-900">Select Date & Time Window</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Pick an upcoming date and convenient slot for your dealership or doorstep EV test drive.
                          </p>
                        </div>

                        <form onSubmit={handleRescheduleTestDrive} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Preferred Date *</label>
                            <input
                              type="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={rescheduleData.date}
                              onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Time Slot *</label>
                            <select
                              value={rescheduleData.slot}
                              onChange={(e) => setRescheduleData({ ...rescheduleData, slot: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium bg-white"
                            >
                              <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM (Morning Slot)</option>
                              <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM (Noon Slot)</option>
                              <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM (Afternoon Slot)</option>
                              <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM (Evening Slot)</option>
                            </select>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                            <strong className="block font-bold">ℹ️ Instant Confirmation:</strong>
                            <p className="text-[11px] leading-relaxed text-blue-800">
                              Your rescheduled slot will be instantly synchronized with the showroom EV advisor. An SMS confirmation will be sent to your registered phone.
                            </p>
                          </div>

                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => setRescheduleData(null)}
                              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
                            >
                              Confirm Reschedule
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. TAB: SERVICE BOOKINGS & REPAIR APPROVAL DRAWER */}
            {currentTab === 'service-bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Doorstep EV Servicing & Live Tracking</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track your assigned mobile technician van, view 40-point digital inspection reports, and approve estimates.
                  </p>
                </div>

                {serviceBookings.map((sb) => (
                  <div key={sb.id} className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">Service Docket</span>
                        <h3 className="text-sm font-bold text-gray-900">{sb.bookingNumber}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
                        {sb.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Technician Profile Card */}
                    {sb.technician && (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#14532D] text-[#B7F34A] flex items-center justify-center font-bold">
                            SK
                          </div>
                          <div>
                            <strong className="text-sm text-gray-900 block">{sb.technician.name}</strong>
                            <p className="text-gray-500">EV Mobile Van #{sb.technician.vanNumber} • {sb.technician.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="flex items-center gap-1 font-bold text-emerald-800">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                            {sb.technician.rating} / 5.0
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 40-Point Inspection Findings */}
                    {sb.inspectionReport && (
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                        <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                          Digital Vehicle Health Report
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-[10px] text-gray-400 block font-bold">Battery SOH</span>
                            <strong className="text-emerald-700 text-sm">{sb.inspectionReport.batteryHealthPercent}%</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-[10px] text-gray-400 block font-bold">Brake Pads</span>
                            <strong className="text-amber-700">{sb.inspectionReport.brakePadHealth}</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-[10px] text-gray-400 block font-bold">Tyre Condition</span>
                            <strong className="text-gray-800">{sb.inspectionReport.tyreCondition}</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-[10px] text-gray-400 block font-bold">BMS Diagnostics</span>
                            <strong className="text-emerald-700">Healthy</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STRICT REQUIREMENT: Additional Repair Customer Approval Box */}
                    {sb.additionalApprovalQuote && (
                      <div className={`p-4 rounded-2xl border-2 space-y-3 text-xs ${
                        sb.additionalApprovalQuote.status === 'PENDING'
                          ? 'border-amber-400 bg-amber-50/50'
                          : sb.additionalApprovalQuote.status === 'APPROVED'
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-xs">
                            Recommended Additional Repair: {sb.additionalApprovalQuote.title}
                          </span>
                          <span className="text-xs font-black text-gray-900">
                            Total: ₹{sb.additionalApprovalQuote.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          {sb.additionalApprovalQuote.notes}
                        </p>

                        {sb.additionalApprovalQuote.status === 'PENDING' ? (
                          <div className="pt-2 flex gap-2 justify-end">
                            <button
                              onClick={() => handleApproveRepair(sb.id, false)}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl"
                            >
                              Decline Additional Repair
                            </button>
                            <button
                              onClick={() => handleApproveRepair(sb.id, true)}
                              className="px-5 py-2 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl shadow-sm"
                            >
                              Approve & Authorize Technician (₹{sb.additionalApprovalQuote.totalAmount})
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1 text-right text-xs font-bold text-emerald-800">
                            ✓ {sb.additionalApprovalQuote.status === 'APPROVED' ? 'Approved by Customer' : 'Declined by Customer'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 5. TAB: QUOTATIONS */}
            {currentTab === 'quotations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Formal Vehicle Quotations</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Download official proforma dockets for loan verification or convert directly to online order.
                  </p>
                </div>

                {quotations.map((qt) => (
                  <div key={qt.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-400 font-mono text-[10px] font-bold">Quotation Docket</span>
                        <h3 className="text-sm font-bold text-gray-900">{qt.quotationNumber}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {qt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">Model & Quantity</span>
                        <strong className="text-gray-900">{qt.quantity}x {qt.vehicleName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">Buyer Profile</span>
                        <strong className="text-gray-900">{qt.customerType}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">Estimated On-Road</span>
                        <strong className="text-[#14532D] text-sm">₹{qt.estimatedGrandTotal.toLocaleString('en-IN')}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px]">Validity</span>
                        <strong className="text-gray-700">{new Date(qt.validUntil).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2 justify-end">
                      <Link
                        to={`/checkout/vehicle/${qt.vehicleId}`}
                        className="px-4 py-2 bg-[#14532D] text-white font-bold rounded-xl shadow-sm"
                      >
                        Convert to Online Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. TAB: SPARE PARTS ORDERS */}
            {currentTab === 'parts-orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Spare Parts Orders</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track courier tracking numbers, delivery milestones, and invoice receipts.
                  </p>
                </div>

                {partsOrders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-400 font-mono text-[10px] font-bold">Order Number</span>
                        <h3 className="text-sm font-bold text-gray-900">{ord.orderNumber}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <strong className="text-gray-900 block truncate">{item.name}</strong>
                            <span className="text-[10px] text-gray-400">Qty: {item.quantity} • SKU: {item.sku}</span>
                          </div>
                          <span className="font-bold text-gray-900">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-[11px]">
                      <span>Courier: <strong>{ord.courierTracking?.carrierName}</strong> ({ord.courierTracking?.trackingNumber})</span>
                      <strong className="text-emerald-700">{ord.courierTracking?.estimatedDeliveryDate}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. TAB: ADDRESSES */}
            {currentTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage home, office, and dealership pickup addresses for fast checkout and servicing.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewAddressModal(true)}
                    className="px-4 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.savedAddresses?.map((addr) => (
                    <div key={addr.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-subtle space-y-3 relative text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                          {addr.label}
                        </span>
                        {addr.isDefault ? (
                          <span className="text-emerald-700 font-bold">Default</span>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-gray-400 hover:text-gray-700 underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <div>
                        <strong className="text-gray-900 block">{addr.fullName}</strong>
                        <p className="text-gray-600 mt-1">{addr.line1}</p>
                        {addr.line2 && <p className="text-gray-600">{addr.line2}</p>}
                        <p className="text-gray-600 font-semibold">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-gray-400 font-mono mt-1">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Full-Screen Studio */}
                {newAddressModal && (
                  <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                    {/* Top Sticky Header */}
                    <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNewAddressModal(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          <span>← Back</span>
                        </button>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                            Saved Addresses Management
                          </div>
                          <h2 className="text-base sm:text-lg font-black text-white">
                            Add New Delivery & Service Location
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNewAddressModal(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleAddAddressSubmit(e as any)}
                          className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Inputs */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
                          <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-base font-bold text-gray-900">Address Information</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              This address will be available for quick checkout on genuine spare parts and doorstep EV mobile service vans.
                            </p>
                          </div>

                          <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1.5">Address Type / Label *</label>
                              <select
                                value={addressForm.label}
                                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium bg-white"
                              >
                                <option value="HOME">Home (Residential Delivery)</option>
                                <option value="OFFICE">Office (Commercial Premise)</option>
                                <option value="DEALERSHIP_PICKUP">Workshop / Fleet Warehouse</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1.5">Street Address & Landmark *</label>
                              <input
                                type="text"
                                required
                                placeholder="Flat, Building No., Street, Landmark..."
                                value={addressForm.line1}
                                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">City / District *</label>
                                <input
                                  type="text"
                                  list="dashboard-cities-list-full"
                                  required
                                  placeholder="e.g. Darbhanga, Patna..."
                                  value={addressForm.city}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const trimmed = val.trim();
                                    if (trimmed.length >= 2) {
                                      const entry = lookupCityOrPincode(trimmed);
                                      if (entry && entry.pincode && !entry.city.startsWith('PIN ')) {
                                        setAddressForm(prev => ({
                                          ...prev,
                                          city: val,
                                          pincode: entry.pincode,
                                          state: entry.state || prev.state
                                        }));
                                        return;
                                      }
                                    }
                                    setAddressForm(prev => ({ ...prev, city: val }));
                                  }}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                                />
                                <datalist id="dashboard-cities-list-full">
                                  {ALL_INDIAN_CITIES.map((c) => (
                                    <option key={`dash-full-${c.city}-${c.pincode}`} value={c.city}>
                                      {c.city} ({c.state} - {c.pincode})
                                    </option>
                                  ))}
                                </datalist>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">PIN Code *</label>
                                <input
                                  type="text"
                                  maxLength={6}
                                  required
                                  placeholder="6-digit PIN"
                                  value={addressForm.pincode}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    if (val.length === 6) {
                                      const entry = lookupCityOrPincode(val);
                                      if (entry && entry.city && !entry.city.startsWith('PIN ') && !addressForm.city) {
                                        setAddressForm(prev => ({ ...prev, pincode: val, city: entry.city, state: entry.state || prev.state }));
                                        return;
                                      }
                                    }
                                    setAddressForm(prev => ({ ...prev, pincode: val }));
                                  }}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => setNewAddressModal(false)}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
                              >
                                Save Location
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* Preview Card */}
                        <div className="space-y-4">
                          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Live Address Card Preview
                            </h4>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] uppercase font-bold inline-block">
                                {addressForm.label}
                              </span>
                              <p className="font-bold text-gray-900 text-sm">
                                {user?.fullName || 'Customer Name'}
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                {addressForm.line1 || 'Street address line will appear here...'}
                              </p>
                              <p className="text-gray-500 font-mono text-[11px]">
                                {addressForm.city || 'City'}, {addressForm.state || 'State'} - {addressForm.pincode || 'PIN'}
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                              <strong className="block font-bold">🚚 Serviceability Note:</strong>
                              <p className="text-[11px] leading-relaxed text-emerald-800">
                                Verified PIN codes automatically enable next-day courier delivery and priority doorstep van allocation.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. TAB: SUPPORT TICKETS */}
            {currentTab === 'tickets' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Support Tickets & Inquiry History</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Communicate directly with dedicated EV technical specialists.
                  </p>
                </div>

                {supportTickets.map((tkt) => (
                  <div key={tkt.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">{tkt.ticketNumber} • {tkt.category}</span>
                        <h3 className="text-sm font-bold text-gray-900">{tkt.subject}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {tkt.status}
                      </span>
                    </div>

                    {/* Messages Thread */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-2xl border">
                      {tkt.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl ${
                            m.sender === 'CUSTOMER'
                              ? 'bg-white border text-gray-800 ml-6'
                              : 'bg-emerald-100/60 border border-emerald-200 text-emerald-950 mr-6'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-[10px] text-gray-400 mb-1">
                            <span>{m.senderName}</span>
                            <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p>{m.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message or follow-up inquiry..."
                        value={ticketReplyText[tkt.id] || ''}
                        onChange={(e) => setTicketReplyText({ ...ticketReplyText, [tkt.id]: e.target.value })}
                        className="flex-1 px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-[#14532D]"
                      />
                      <button
                        onClick={() => handleSendTicketReply(tkt.id)}
                        className="px-4 py-2 bg-[#14532D] text-white font-bold rounded-xl flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. TAB: WISHLIST */}
            {currentTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saved Vehicles & Spare Parts</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Quickly access your bookmarked electric scooters, autos, and components.
                  </p>
                </div>

                {wishlistedVehicles.length === 0 && wishlistedParts.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-dashed text-xs text-gray-500">
                    Your wishlist is currently empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistedVehicles.map(v => (
                      <div key={v.id} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-subtle flex items-center justify-between gap-3 text-xs">
                        <img src={v.images[0].url} alt={v.name} className="w-16 h-12 object-cover rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <strong className="text-gray-900 block truncate">{v.name}</strong>
                          <span className="text-[11px] text-[#14532D] font-bold">₹{v.exShowroomPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <Link to={`/vehicles/${v.modelSlug}`} className="px-3 py-1.5 bg-[#14532D] text-white font-bold rounded-xl">
                          View
                        </Link>
                      </div>
                    ))}

                    {wishlistedParts.map(p => (
                      <div key={p.id} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-subtle flex items-center justify-between gap-3 text-xs">
                        <img src={p.imageUrl} alt={p.name} className="w-16 h-12 object-cover rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <strong className="text-gray-900 block truncate">{p.name}</strong>
                          <span className="text-[11px] text-[#14532D] font-bold">₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <Link to={`/spare-parts/${p.slug}`} className="px-3 py-1.5 bg-[#14532D] text-white font-bold rounded-xl">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. TAB: NOTIFICATIONS */}
            {currentTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Notification Center</h2>
                  <button
                    onClick={() => {
                      storage.markAllNotificationsRead();
                      loadData();
                    }}
                    className="text-xs text-[#14532D] font-bold hover:underline"
                  >
                    Mark All as Read
                  </button>
                </div>

                <div className="space-y-2.5">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        n.isRead ? 'bg-white border-gray-200 text-gray-700' : 'bg-emerald-50/70 border-emerald-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <strong className="text-gray-900">{n.title}</strong>
                        <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. TAB: PROFILE & KYC */}
            {currentTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-subtle space-y-6 text-xs">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Profile & Domicile KYC</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Aadhaar and Driving License details used for state EV subsidy authorization and RTO registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={user?.fullName || ''}
                      onChange={(e) => updateProfile({ fullName: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Mobile Number</label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="w-full p-2.5 border bg-gray-50 rounded-xl font-mono text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Permanent Driving License No.</label>
                    <input
                      type="text"
                      value={user?.drivingLicenseNo || ''}
                      onChange={(e) => updateProfile({ drivingLicenseNo: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>KYC & DigiLocker Authentication Verified for Delhi/NCR State Subsidies</span>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
