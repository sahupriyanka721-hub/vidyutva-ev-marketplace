import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { GENERAL_FAQS } from '../data/seedData';

export const FaqPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['ALL', 'Purchasing & Subsidies', 'Test Drives', 'Quotations', 'Spare Parts', 'Doorstep Servicing', 'Warranty & Returns'];

  const filteredFaqs = GENERAL_FAQS.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#14532D]">Frequently Asked Questions</span>
        </nav>

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Clear, transparent answers regarding electric vehicle bookings, subsidies, spare parts, and doorstep service.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search keywords (e.g. subsidy, battery warranty, test drive)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-xs sm:text-sm shadow-subtle focus:ring-2 focus:ring-[#14532D]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex justify-center gap-2 flex-wrap text-xs font-bold">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeCategory === c
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'bg-white border text-gray-600 hover:bg-gray-100'
              }`}
            >
              {c === 'ALL' ? 'All Topics' : c}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-subtle space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#14532D]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#14532D]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-2">
          <h3 className="text-sm font-bold text-gray-900">Still have questions?</h3>
          <p className="text-xs text-gray-600">
            Our EV support executives are available Monday to Saturday (9:00 AM - 7:00 PM).
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#14532D] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              <span>Contact Support Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B7F34A]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
