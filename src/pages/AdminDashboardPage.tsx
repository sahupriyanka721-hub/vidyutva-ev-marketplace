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
  Tag
} from 'lucide-react';
import { storage } from '../services/storageService';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../data/seedData';
import {
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  ServiceBookingItem,
  SparePartsOrder,
  SupportTicketItem
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'orders' | 'test-drives' | 'quotations' | 'services' | 'parts' | 'tickets' | 'inventory'>('overview');

  // Live data from storageService
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
    setVehicleOrders(storage.getVehicleOrders());
    setTestDrives(storage.getTestDrives());
    setQuotations(storage.getQuotations());
    setServices(storage.getServiceBookings());
    setPartsOrders(storage.getSparePartsOrders());
    setTickets(storage.getSupportTickets());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    storage.updateVehicleOrderStatus(orderId, status);
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

  // Quick stats
  const totalRevenue = vehicleOrders.reduce((sum, o) => sum + (o.bookingAmountPaid || 0), 0) +
                       partsOrders.reduce((sum, p) => sum + (p.grandTotal || 0), 0);

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Master Header */}
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
              Manage live vehicle bookings, quotation dockets, doorstep service van allocations, announcements, and customer tickets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-[#B7F34A] transition-all border border-emerald-500/40"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Vehicle Orders
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{vehicleOrders.length}</strong>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Test Drive Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{testDrives.length}</strong>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Active</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Quotation Dockets
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{quotations.length}</strong>
              <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">Issued</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Doorstep Van Services
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{services.length}</strong>
              <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Vans</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Parts Orders
            </span>
            <div className="flex items-baseline justify-between">
              <strong className="text-xl sm:text-2xl font-black text-[#06152B]">{partsOrders.length}</strong>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">OEM</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-subtle">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Support Inquiries
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
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Announcement Bar Manager (Spec 4.A)
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
            onClick={() => setActiveTab('test-drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'test-drives'
                ? 'bg-[#06152B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Test Drive Bookings ({testDrives.length})
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
                {vehicleOrders.slice(0, 4).map(o => (
                  <div key={o.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block">{o.vehicleName}</strong>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {o.orderNumber} • ₹{(o.bookingAmountPaid || 0).toLocaleString('en-IN')} ({o.paymentMode})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
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
                {testDrives.slice(0, 4).map(td => (
                  <div key={td.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block">{td.vehicleName}</strong>
                      <span className="text-[11px] text-gray-500">
                        {td.preferredDate} • {td.timeSlot} • {td.city} ({td.pincode})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      {td.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Announcement Bar Manager (Section 4.A) */}
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

        {/* Tab 3: Vehicle Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">All Customer Vehicle Purchases & Token Bookings</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
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
                      <td className="p-3 font-bold text-gray-800">{o.vehicleName} ({o.colorName})</td>
                      <td className="p-3">{o.paymentMode}</td>
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
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white"
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

        {/* Tab 4: Test Drives */}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testDrives.map(td => (
                    <tr key={td.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold">{td.bookingNumber || td.id}</td>
                      <td className="p-3 font-semibold text-gray-900">{td.customerName} ({td.customerPhone})</td>
                      <td className="p-3 font-bold text-gray-800">{td.vehicleName}</td>
                      <td className="p-3">{td.preferredDate} ({td.timeSlot})</td>
                      <td className="p-3">{td.city} ({td.pincode})</td>
                      <td className="p-3 font-semibold text-gray-600">{td.testDriveMode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                          {td.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Quotations */}
        {activeTab === 'quotations' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Customer Quotation Inquiries & Commercial Fleet Dockets</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Docket Number</th>
                    <th className="p-3">Customer Name</th>
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
                      <td className="p-3 font-semibold text-gray-900">{q.customerName}</td>
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

        {/* Tab 6: Services */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Doorstep Mobile Service Vans & Customer Digital Approvals</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Booking ID</th>
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

        {/* Tab 7: Support Desk */}
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

        {/* Tab 8: Inventory Catalog */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-gray-900">Master Catalog: Electric Vehicles & Genuine Spare Parts</h2>

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
