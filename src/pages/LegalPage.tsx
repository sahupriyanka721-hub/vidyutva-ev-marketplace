import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

const LEGAL_DOCUMENTS: { [slug: string]: { title: string; subtitle: string; content: string[] } } = {
  'about-us': {
    title: 'About E-VAHAN Electric Mobility',
    subtitle: 'Building India’s Most Trustworthy Electric Mobility & Services Ecosystem',
    content: [
      'E-VAHAN was founded with a singular purpose: to remove friction from the transition to electric mobility for Indian commuters, auto-rickshaw drivers, and last-mile logistics fleets.',
      'Unlike traditional vehicle listing portals, E-VAHAN provides an end-to-end verified ecosystem: from transparent on-road quotations with upfront state subsidy calculations, to verified doorstep test rides, genuine OEM spare parts with compatibility guarantees, and mobile technician doorstep servicing.',
      'Our multi-vendor architecture connects verified electric vehicle manufacturers, certified battery & charger suppliers, and local service partners under a single unified standard of trust and quality.'
    ]
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    subtitle: 'Customer Panel Master Terms of Use',
    content: [
      '1. Acceptance of Terms: By accessing or utilizing the E-VAHAN platform, you agree to comply with these terms, our privacy policy, and applicable Indian Motor Vehicles Acts and state EV policy guidelines.',
      '2. Product Disclosures: Range estimates published are ARAI / IDC certified values under standardized laboratory cycles. Real-world range depends on rider payload, road topography, ambient temperature, tyre pressure, and driving mode.',
      '3. Online Quotations: Generated online quotations represent indicative proforma calculations. Final sale invoices and road tax calculations are subject to local Regional Transport Office (RTO) jurisdiction.'
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How E-VAHAN Collects, Uses, and Protects Customer Information',
    content: [
      '1. Data Collection: We collect only the information necessary to fulfill vehicle bookings, quotations, doorstep service appointments, and spare parts deliveries (e.g. name, mobile number, delivery address, and Aadhaar/DigiLocker KYC for vehicle registration).',
      '2. Payment Security: E-VAHAN never captures, stores, or processes raw credit/debit card numbers or UPI MPINs. All payments are executed through verified, PCI-DSS compliant Indian payment gateways with verified server-side webhooks.',
      '3. Non-Disclosure: We do not sell or rent customer contact records to third-party telemarketing networks.'
    ]
  },
  'refund-policy': {
    title: 'Refund and Cancellation Policy',
    subtitle: 'Transparent Cancellation Guidelines for Bookings & Parts',
    content: [
      '1. Vehicle Token Booking Cancellations: Any token booking deposit (₹1,999 - ₹5,000) paid online is 100% refundable within 7 days of booking, provided vehicle chassis allocation has not undergone formal RTO registration.',
      '2. Spare Parts Returns: Unused, genuine spare parts in original manufacturer packaging with untampered holographic seals can be returned within 7 days of delivery for a full refund or exchange.',
      '3. Doorstep Service Cancellations: Scheduled service appointments may be rescheduled or cancelled free of charge up to 3 hours prior to the assigned technician slot.'
    ]
  },
  'shipping-policy': {
    title: 'Shipping and Delivery Policy',
    subtitle: 'Logistics Timelines for Vehicles & Spare Parts Across India',
    content: [
      '1. Vehicle Deliveries: In-stock electric vehicles are delivered within 4 to 7 business days following completion of RTO registration and HSRP plate fitment.',
      '2. Spare Parts Dispatch: In-stock OEM spare parts are packed and dispatched from central warehouses within 24 hours. Free standard shipping is provided on all parts orders exceeding ₹1,999.',
      '3. Transit Tracking: Customers receive real-time courier tracking IDs via BlueDart / Delhivery Surface Logistics with milestone notifications.'
    ]
  },
  'warranty-info': {
    title: 'Warranty Information',
    subtitle: 'OEM Manufacturer Guarantees on Batteries, Motors, and Spares',
    content: [
      '1. Traction Battery Warranty: All electric scooters and three-wheelers featured on E-VAHAN carry a minimum 3-Year / 50,000 km standard manufacturer warranty on lithium battery packs covering capacity retention above 75%.',
      '2. Motors & Controllers: Traction PMSM/BLDC motors and sinewave controllers are backed by an 18 to 24 month manufacturer replacement warranty against electrical breakdown.',
      '3. Genuine Spare Parts: Replacement parts purchased from our marketplace include 6 to 36 month replacement warranties backed by official brand distributors.'
    ]
  },
  'booking-terms': {
    title: 'Vehicle Booking Terms',
    subtitle: 'Procedures for Vehicle Allocation, State Subsidies, and Registration',
    content: [
      '1. Chassis Allocation: Online token payment reserves a specific chassis number from factory inventory in your chosen color and variant.',
      '2. Domicile Verification: Eligibility for state-specific EV subsidies (e.g. Delhi, Maharashtra, Karnataka EV policies) requires proof of address and Aadhaar verification corresponding to the delivery state.',
      '3. High-Security Plates (HSRP): Under Ministry of Road Transport & Highways regulations, no vehicle may be handed over to a customer without fitted HSRP plates.'
    ]
  },
  'service-policy': {
    title: 'Service Policy & Customer Approval Guarantee',
    subtitle: 'Standards for Doorstep Mobile EV Vans and Workshop Inspections',
    content: [
      '1. Customer Approval Guarantee: Technicians are strictly prohibited from executing paid repairs without explicit digital authorization from the customer via the live service tracking portal.',
      '2. Digital Health Scan: Every service booking includes a standardized 40-point health checklist including battery state-of-health (SOH), brake pad wear, and tyre tread depth.',
      '3. Verified Technicians: All mobile service personnel are certified high-voltage EV specialists.'
    ]
  },
  'become-a-vendor': {
    title: 'Become an EV Vendor Partner',
    subtitle: 'Expand Your Dealership or Spare Parts Reach Across India',
    content: [
      'Are you an authorized electric vehicle dealer or OEM spare parts manufacturer? Partner with E-VAHAN to reach thousands of individual and commercial fleet buyers.',
      'Vendor Panel features include real-time lead management, automated quotation requests, instant inventory synchronization, and direct payment settlements.',
      'Contact our Vendor Onboarding Team at partners@e-vahan.in to register your business.'
    ]
  },
  'become-a-service-partner': {
    title: 'Become a Service Partner',
    subtitle: 'Join India’s Fastest Growing Doorstep EV Service Network',
    content: [
      'Operate an authorized garage or mobile van service? Join the E-VAHAN Service Partner Network to receive high-ticket preventive maintenance and breakdown service bookings in your pincode.',
      'We provide partner mobile apps, digital diagnostic tools, genuine spare parts supply lines, and automated payouts.',
      'Apply today by emailing service@e-vahan.in.'
    ]
  }
};

export const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const activeSlug = slug || 'terms-and-conditions';
  const doc = LEGAL_DOCUMENTS[activeSlug] || LEGAL_DOCUMENTS['terms-and-conditions'];

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">{doc.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-subtle space-y-4">
          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            Official Platform Policy & Guidelines
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {doc.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {doc.subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-subtle space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {doc.content.map((paragraph, idx) => (
            <p key={idx} className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
              {paragraph}
            </p>
          ))}

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Last Updated: October 2026</span>
            <Link to="/contact" className="text-[#14532D] font-bold hover:underline">
              Contact Compliance Desk →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
