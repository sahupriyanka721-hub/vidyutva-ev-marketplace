import React, { useState } from 'react';
import { Star, CheckCircle2, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { CUSTOMER_REVIEWS, GENERAL_FAQS } from '../../data/seedData';

export const ReviewsAndFaqSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Purchasing & Subsidies', 'Test Drives', 'Quotations', 'Spare Parts', 'Doorstep Servicing', 'Warranty & Returns'];

  const filteredFaqs = GENERAL_FAQS.filter((f) => {
    if (faqCategoryFilter === 'ALL') return true;
    return f.category === faqCategoryFilter;
  });

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Customer Reviews Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              What EV Riders Say About E-VAHAN
            </h2>
            <p className="text-xs text-gray-400 mt-1 italic">
              Verified Customer Reviews • ARAI & State FAME Subsidy Beneficiaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#F0F4F8] rounded-3xl p-6 border border-[#E3E9E4] flex flex-col justify-between hover:shadow-premium transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Verified
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 leading-snug">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-xs text-[#647067] leading-relaxed mb-4">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/60 text-xs">
                  <span className="font-bold text-gray-900 block truncate">{rev.name}</span>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mt-0.5">
                    <span>{rev.city}</span>
                    <span className="font-medium text-emerald-700">{rev.vehicleName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="pt-8 border-t border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions Answered</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Clear answers regarding vehicle bookings, state subsidies, doorstep test drives, and spare parts warranties.
            </p>
          </div>

          {/* FAQ Category Pills */}
          <div className="flex justify-center gap-2 flex-wrap mb-8 text-xs font-bold">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFaqCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  faqCategoryFilter === c
                    ? 'bg-[#14532D] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'ALL' ? 'All Questions' : c}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-[#F0F4F8] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-[#14532D]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#14532D]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-[#647067] leading-relaxed border-t border-gray-100/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
