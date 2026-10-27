import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-700 pt-16 pb-12 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-200">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            {/* Brand Logo in Non-White Dark Oceanic Badge */}
            <BrandLogo variant="footer" />
            
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed pt-2">
              India&apos;s trusted electric mobility marketplace. Empowering individuals and commercial fleet operators to switch to clean, whisper-quiet, zero-emission transport with verified vehicles, genuine spare parts, and doorstep maintenance.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] block mb-2">
                Subscribe for EV News & Subsidy Updates
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#14532D] bg-emerald-100 p-2.5 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Thank you for subscribing to E-VAHAN Insights!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs rounded-xl transition-all shrink-0 shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Electric Vehicles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Electric Vehicles
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/vehicles?category=ELECTRIC_SCOOTER" className="hover:text-[#16A34A] transition-colors">
                  Electric Scooters
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_PASSENGER_AUTO" className="hover:text-[#16A34A] transition-colors">
                  Electric Passenger Autos
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_CARGO_AUTO" className="hover:text-[#16A34A] transition-colors">
                  Electric Cargo 3-Wheelers
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=ELECTRIC_LOADER" className="hover:text-[#16A34A] transition-colors">
                  Electric Industrial Loaders
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#16A34A] transition-colors">
                  Compare EV Specifications
                </Link>
              </li>
              <li>
                <Link to="/test-drive" className="hover:text-[#16A34A] transition-colors">
                  Book Complimentary Test Drive
                </Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-[#16A34A] transition-colors">
                  Get Instant Quotation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Parts & Servicing */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Parts & Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/spare-parts" className="hover:text-[#16A34A] transition-colors">
                  Genuine Spare Parts Hub
                </Link>
              </li>
              <li>
                <Link to="/spare-parts?category=cat-batteries" className="hover:text-[#16A34A] transition-colors">
                  EV Lithium Battery Packs
                </Link>
              </li>
              <li>
                <Link to="/spare-parts?category=cat-chargers" className="hover:text-[#16A34A] transition-colors">
                  Fast Chargers & Wallboxes
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#16A34A] transition-colors">
                  Book Doorstep Service Van
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#16A34A] transition-colors">
                  Authorised Service Centres
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#16A34A] transition-colors">
                  Vehicle Compatibility Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Legal & Partner Hub
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/legal/about-us" className="hover:text-[#16A34A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#16A34A] transition-colors">
                  Contact Us & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#16A34A] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/legal/terms-and-conditions" className="hover:text-[#16A34A] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="hover:text-[#16A34A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/refund-policy" className="hover:text-[#16A34A] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/shipping-policy" className="hover:text-[#16A34A] transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/warranty-info" className="hover:text-[#16A34A] transition-colors">
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link to="/legal/booking-terms" className="hover:text-[#16A34A] transition-colors">
                  Vehicle Booking Terms
                </Link>
              </li>
              <li>
                <Link to="/legal/service-policy" className="hover:text-[#16A34A] transition-colors">
                  Service Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/become-a-vendor" className="text-[#16A34A] hover:underline font-semibold flex items-center gap-1">
                  Become a Vendor <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/legal/become-a-service-partner" className="text-[#16A34A] hover:underline font-semibold flex items-center gap-1">
                  Become a Service Partner <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Business Demo Disclaimer & Contact Info */}
        <div className="pt-8 text-xs text-gray-500 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200/90 text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
            <div>
              <span className="font-bold text-[#14532D] uppercase tracking-wider block text-[11px]">
                Platform Demo & Compliance Notice
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                E-VAHAN is an Indian electric mobility marketplace customer panel demonstration. All phone numbers, emails, and corporate registration identifiers (CIN/GSTIN) are non-commercial development placeholders.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-4 text-xs font-mono text-gray-700">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#16A34A]" /> +91 (Placeholder) 1800-EV-HELP
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#16A34A]" /> support@e-vahan.demo
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
            <p>© {new Date().getFullYear()} E-VAHAN Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/legal/privacy-policy" className="hover:underline hover:text-gray-900">Privacy</Link>
              <Link to="/legal/terms-and-conditions" className="hover:underline hover:text-gray-900">Terms</Link>
              <Link to="/legal/refund-policy" className="hover:underline hover:text-gray-900">Refunds</Link>
              <Link to="/contact" className="hover:underline hover:text-gray-900">Support</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
