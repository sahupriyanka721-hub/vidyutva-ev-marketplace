import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LifeBuoy,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

export const CustomerSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState('VEHICLE_ORDER');
  const [subject, setSubject] = useState('');
  const [relatedOrder, setRelatedOrder] = useState('');
  const [description, setDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState<any>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = storage.createSupportTicket(
      {
        userId: user?.id || 'usr-demo-001',
        category,
        subject,
        relatedReference: relatedOrder.trim() || undefined
      },
      description
    );
    setTicketSuccess(newTicket);
  };

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Customer Support & Contact</span>
        </nav>

        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Dedicated EV Specialist Helpdesk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Reach out regarding vehicle deliveries, doorstep test rides, quotation subsidies, or spare parts returns.
          </p>
        </div>

        {/* 3 Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-subtle flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-[#16A34A]" />
            </div>
            <strong className="text-sm font-bold text-gray-900">Phone Support</strong>
            <p className="text-xs text-gray-500 mt-1 mb-3">Toll-free EV advisory hotline</p>
            <span className="font-mono text-xs font-bold text-[#14532D] bg-emerald-50 px-3 py-1 rounded-full">
              1800-EV-HELP (Demo)
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-subtle flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-[#16A34A]" />
            </div>
            <strong className="text-sm font-bold text-gray-900">Email Inquiry</strong>
            <p className="text-xs text-gray-500 mt-1 mb-3">Response within 4 business hours</p>
            <span className="font-mono text-xs font-bold text-[#14532D] bg-emerald-50 px-3 py-1 rounded-full">
              support@e-vahan.demo
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-subtle flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6 text-[#16A34A]" />
            </div>
            <strong className="text-sm font-bold text-gray-900">Knowledge Base</strong>
            <p className="text-xs text-gray-500 mt-1 mb-3">Browse common questions</p>
            <Link to="/faq" className="text-xs font-bold text-[#14532D] hover:underline">
              Explore FAQs →
            </Link>
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-subtle space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Submit a Support Ticket</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Create a tracked inquiry ticket. Our specialists will update your dashboard with status replies.
            </p>
          </div>

          {ticketSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Ticket Created: {ticketSuccess.ticketNumber}
              </span>
              <h3 className="text-lg font-bold text-gray-900">Your Support Ticket has Been Logged</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Our support desk has received your inquiry regarding &ldquo;{ticketSuccess.subject}&rdquo; and will respond shortly.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard?tab=tickets"
                  className="inline-block px-5 py-2.5 bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  View in Customer Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#14532D]"
                  >
                    <option value="VEHICLE_ORDER">Vehicle Booking & Delivery Inquiry</option>
                    <option value="TEST_DRIVE">Test Drive Scheduling & Rescheduling</option>
                    <option value="QUOTATION">Quotation & State Subsidy Clarification</option>
                    <option value="SPARE_PARTS">Spare Parts Order & Courier Tracking</option>
                    <option value="RETURNS">Spare Parts Return / Replacement Request</option>
                    <option value="SERVICE_COMPLAINT">Doorstep Service Complaint / Warranty Claim</option>
                    <option value="GENERAL">General Electric Mobility Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Related Order or Booking ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-EV-2026-89421 or TD-2026-7814"
                    value={relatedOrder}
                    onChange={(e) => setRelatedOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain the details of your inquiry or complaint..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-premium"
                >
                  <Send className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
