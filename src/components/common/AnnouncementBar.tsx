import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Wrench, Sparkles, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../../services/storageService';

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>(() => storage.getAnnouncements());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Live two-way synchronization: automatically reloads when Admin updates announcements
  useEffect(() => {
    const unsub = storage.onSync((key) => {
      if (key === 'announcements') {
        setAnnouncements(storage.getAnnouncements());
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!isVisible || announcements.length === 0) return null;

  const currentText = announcements[currentIndex] || announcements[0];

  return (
    <div className="bg-gradient-to-r from-[#EBF3FB] via-[#F1F6FD] to-[#EBF3FB] text-slate-800 text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative border-b border-[#D5E3F0]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center space-x-2 text-center overflow-hidden">
          <span className="inline-flex items-center justify-center p-1 rounded-full bg-[#0B2545] text-[#B7F34A] shadow-xs">
            <Zap className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-slate-800 truncate">{currentText}</span>
          <Link
            to="/vehicles"
            className="hidden sm:inline-flex items-center font-bold text-blue-700 hover:text-blue-900 ml-1"
          >
            <span>Explore EVs</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-slate-900 p-1 rounded-md transition-colors ml-2"
          aria-label="Close Announcement Bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
