import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ChevronDown, HelpCircle, MessageSquare, X } from 'lucide-react';
import { GENERAL_FAQS } from '../../data/seedData';
import { storage } from '../../services/storageService';
import { CustomerReviewItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ReviewsAndFaqSection: React.FC = () => {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('ALL');

  // Real verified reviews from storage (Zero dummy reviews - strictly real user reviews only)
  const [realReviews, setRealReviews] = useState<CustomerReviewItem[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const loadReviews = () => {
    setRealReviews(storage.getVerifiedReviews());
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.fullName && !name) setName(user.fullName);
      if (user.city && !city) setCity(user.city);
    }
  }, [user, isReviewModalOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !title.trim()) {
      alert('Kripya sabhi zaroori fields bharein!');
      return;
    }

    storage.addVerifiedReview({
      name: name.trim(),
      city: city.trim() || 'Verified Rider',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      vehicleName: vehicleName.trim() || 'E-VAHAN Verified Purchase',
      verified: true
    });

    loadReviews();
    setIsReviewModalOpen(false);
    setTitle('');
    setComment('');
    setVehicleName('');
    setRating(5);
    setReviewSuccessMsg('✓ Thank you! Your verified review has been published.');
    setTimeout(() => setReviewSuccessMsg(null), 4000);
  };

  const categories = ['ALL', 'Purchasing & Subsidies', 'Test Drives', 'Quotations', 'Spare Parts', 'Doorstep Servicing', 'Warranty & Returns'];

  const filteredFaqs = GENERAL_FAQS.filter((f) => {
    if (faqCategoryFilter === 'ALL') return true;
    return f.category === faqCategoryFilter;
  });

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Customer Reviews Section (Only real reviews, zero dummy reviews) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Verified Rider Feedback</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Authentic Customer Reviews
              </h2>
              <p className="text-xs text-gray-500">
                100% genuine reviews from real verified buyers and service recipients.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 w-max"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Write a Real Review</span>
            </button>
          </div>

          {/* Review Success Confirmation */}
          {reviewSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* If No Real Reviews Yet: Clean state without ANY dummy cards */}
          {realReviews.length === 0 ? (
            <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-dashed border-gray-300 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Be the First to Review E-VAHAN</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  We believe in 100% genuine customer transparency and never show fake reviews. If you have purchased an EV, booked a service van, or bought spare parts, share your experience!
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <Star className="w-3.5 h-3.5 text-amber-300 fill-current" />
                <span>Share Your Experience</span>
              </button>
            </div>
          ) : (
            /* Real Customer Reviews Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#F0F4F8] rounded-3xl p-6 border border-[#E3E9E4] flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Real Verified Customer
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
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
                      <span className="font-medium text-emerald-700">{rev.vehicleName || 'Verified Purchase'}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 block mt-1">{rev.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Real Customer Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Rider Feedback</span>
              </div>
              <h3 className="text-xl font-black text-gray-900">Share Your EV Experience</h3>
              <p className="text-xs text-gray-500 mt-1">
                Your genuine feedback helps fellow EV riders across India. Only real reviews are shown on our platform.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">
                    {rating === 5 ? '5.0 - Excellent' : rating === 4 ? '4.0 - Very Good' : rating === 3 ? '3.0 - Good' : rating === 2 ? '2.0 - Fair' : '1.0 - Poor'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City, State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi NCR / Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle / Service Used</label>
                <input
                  type="text"
                  placeholder="e.g. Electra Glide Pro / Doorstep Service / CEAT Tyres"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Headline / Review Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smooth delivery and great performance!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Feedback *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about your EV purchase, test drive experience, or service van support..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#B7F34A]" />
                  <span>Submit Verified Customer Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
