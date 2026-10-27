import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Wrench, Sparkles, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  { icon: Sparkles, text: 'Explore Electric Mobility — Zero Emissions, Maximum Savings with E-VAHAN', link: '/vehicles', linkText: 'Explore Vehicles' },
  { icon: Zap, text: 'Book a Complimentary Doorstep Test Drive Today', link: '/test-drive', linkText: 'Book Test Drive' },
  { icon: ShieldCheck, text: '100% Genuine OEM EV Spare Parts with Verified Fitment', link: '/spare-parts', linkText: 'Shop Spares' },
  { icon: Wrench, text: 'Certified EV Technician Service at Your Doorstep in 24+ Cities', link: '/service', linkText: 'Book Service' },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-emerald-50 text-emerald-950 text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative border-b border-emerald-200/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center space-x-2 text-center overflow-hidden">
          <span className="inline-flex items-center justify-center p-1 rounded-full bg-[#16A34A] text-white shadow-sm">
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-emerald-900 truncate">{current.text}</span>
          <Link
            to={current.link}
            className="hidden sm:inline-flex items-center font-bold text-[#16A34A] hover:underline ml-1"
          >
            {current.linkText}
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-emerald-700 hover:text-emerald-950 p-1 rounded-md transition-colors ml-2"
          aria-label="Close Announcement Bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
