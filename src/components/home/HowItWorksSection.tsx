import React, { useState } from 'react';
import {
  Bike,
  CalendarCheck,
  FileText,
  ShoppingBag,
  Wrench,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WORKFLOWS = [
  {
    id: 'buy-ev',
    name: 'Purchasing a Vehicle',
    icon: Bike,
    steps: [
      { step: '01', title: 'Choose Model & Variant', desc: 'Browse certified electric scooters and 3-wheelers. Select your preferred color, battery capacity, and accessories.' },
      { step: '02', title: 'Transparent On-Road Pricing', desc: 'View itemized prices with exact state subsidy deductions, RTO registration, and insurance estimates for your PIN code.' },
      { step: '03', title: 'Pay Token or Full Amount', desc: 'Secure your booking with a refundable ₹1,999 - ₹5,000 token or choose low-EMI financing assistance.' },
      { step: '04', title: 'RTO Registration & Delivery', desc: 'Our dealer partner completes KYC, fits high-security number plates (HSRP), and delivers the vehicle right to your home.' },
    ],
    ctaText: 'Explore Vehicles to Buy',
    ctaLink: '/vehicles',
  },
  {
    id: 'test-drive',
    name: 'Booking a Test Drive',
    icon: CalendarCheck,
    steps: [
      { step: '01', title: 'Select Vehicle & Mode', desc: 'Pick the electric scooter or auto you want to experience and select doorstep visit or dealership appointment.' },
      { step: '02', title: 'Pick Date & Slot', desc: 'Select any available date and time slot within the next 14 days without duplicate conflict.' },
      { step: '03', title: 'Instant Confirmation', desc: 'Receive your unique Test Drive Booking ID (e.g. TD-2026-XXXX) and dealer executive details.' },
      { step: '04', title: 'Experience the EV', desc: 'Take a complimentary test ride with our certified mobility specialist at your doorstep.' },
    ],
    ctaText: 'Book a Complimentary Test Drive',
    ctaLink: '/test-drive',
  },
  {
    id: 'quotation',
    name: 'Requesting a Quotation',
    icon: FileText,
    steps: [
      { step: '01', title: 'Specify Buyer Profile', desc: 'Indicate whether you are buying as an individual or a commercial fleet business with GST credit.' },
      { step: '02', title: 'Configure Quantity & Specs', desc: 'Select 1 unit or bulk fleet quantities with automatic volume discount calculations.' },
      { step: '03', title: 'Instant Indicative Docket', desc: 'Review comprehensive itemised ex-showroom, subsidy, RTO, and insurance breakdown.' },
      { step: '04', title: 'Download Official PDF', desc: 'Download a formal proforma quote reference (QT-2026-XXXX) for loan approval or convert directly to an order.' },
    ],
    ctaText: 'Get an Instant Quotation',
    ctaLink: '/quotation',
  },
  {
    id: 'spare-parts',
    name: 'Ordering Spare Parts',
    icon: ShoppingBag,
    steps: [
      { step: '01', title: 'Check Vehicle Compatibility', desc: 'Select your vehicle make, model and year to guarantee 100% verified fitment.' },
      { step: '02', title: 'Add to Cart & Apply Coupons', desc: 'Choose genuine OEM batteries, chargers, brake pads or tyres with live stock counts.' },
      { step: '03', title: 'Secure Sandbox Checkout', desc: 'Enter delivery address and pay securely with UPI, Net Banking or cards with 18% GST breakdown.' },
      { step: '04', title: 'Dispatched with Tracking', desc: 'Track your package with courier milestones from warehouse dispatch to doorstep delivery.' },
    ],
    ctaText: 'Browse Genuine Spare Parts',
    ctaLink: '/spare-parts',
  },
  {
    id: 'doorstep-service',
    name: 'Booking Vehicle Servicing',
    icon: Wrench,
    steps: [
      { step: '01', title: 'Select Issue & Appointment', desc: 'Choose from 8+ service packages, specify any symptoms, and pick a convenient date & slot.' },
      { step: '02', title: 'Mobile Van Dispatched', desc: 'A certified technician in an equipped EV van travels directly to your home address.' },
      { step: '03', title: 'Inspection & Approval', desc: 'Review the digital health report on your dashboard. Any additional parts require your explicit one-click approval.' },
      { step: '04', title: 'Digital Invoice & Rating', desc: 'Complete payment online, download your GST service invoice, and rate your technician.' },
    ],
    ctaText: 'Book Doorstep Service',
    ctaLink: '/service',
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeWorkflowId, setActiveWorkflowId] = useState('buy-ev');
  const currentWorkflow = WORKFLOWS.find(w => w.id === activeWorkflowId) || WORKFLOWS[0];

  return (
    <section className="py-16 bg-[#F8FAF8] border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clear Step-by-Step Journeys</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How E-VAHAN Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Explore how each customer workflow operates with complete transparency and verified processes.
          </p>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm gap-1">
            {WORKFLOWS.map((w) => {
              const Icon = w.icon;
              const isActive = w.id === activeWorkflowId;
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveWorkflowId(w.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#14532D] text-[#B7F34A] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{w.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {currentWorkflow.steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#E3E9E4] shadow-subtle hover:shadow-premium transition-all relative flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-[#16A34A]/30 block mb-3 font-mono">
                  {s.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-[#647067] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {idx < currentWorkflow.steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={currentWorkflow.ctaLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl shadow-premium transition-all"
          >
            <span>{currentWorkflow.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
