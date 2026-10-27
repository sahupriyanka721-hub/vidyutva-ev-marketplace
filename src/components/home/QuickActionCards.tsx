import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    id: 'buy-vehicle',
    title: 'Buy an Electric Vehicle',
    description: 'Explore certified personal scooters, commercial passenger autos, and heavy cargo loaders with upfront subsidy discounts.',
    link: '/vehicles',
    ctaText: 'Browse Vehicles',
    icon: Zap,
    pillar: 'NEW EV',
    pillarBg: 'bg-[#0B2545] text-blue-200 border-blue-400/30',
    accentBg: 'bg-emerald-50 text-[#16A34A]',
    cardBorder: 'hover:border-emerald-500 hover:shadow-glow-emerald',
  },
  {
    id: 'get-quotation',
    title: 'Get a Vehicle Quotation',
    description: 'Request formal on-road pricing dockets, commercial bulk fleet discounts, and bank loan pre-approvals online in minutes.',
    link: '/quotation',
    ctaText: 'Generate Instant Quote',
    icon: FileText,
    pillar: 'NEW EV',
    pillarBg: 'bg-[#0B2545] text-blue-200 border-blue-400/30',
    accentBg: 'bg-blue-50 text-blue-900',
    cardBorder: 'hover:border-blue-400',
  },
  {
    id: 'buy-spare-parts',
    title: 'Buy Spare Parts',
    description: '100% genuine OEM lithium batteries, smart fast chargers, low-rolling-resistance tyres, controllers and brake systems.',
    link: '/spare-parts',
    ctaText: 'Shop Genuine Parts',
    icon: ShieldCheck,
    pillar: 'SPARE PARTS',
    pillarBg: 'bg-[#B7F34A] text-[#06152B] font-extrabold',
    accentBg: 'bg-lime-50 text-emerald-900',
    cardBorder: 'hover:border-[#B7F34A] hover:shadow-glow-lime',
  },
  {
    id: 'doorstep-service',
    title: 'Book Doorstep Service',
    description: 'Certified EV technician van arrives right at your home or workplace for preventive maintenance and diagnostics.',
    link: '/service',
    ctaText: 'Schedule Van Visit',
    icon: Wrench,
    pillar: 'SERVICE',
    pillarBg: 'bg-[#0B2545] text-blue-200 border-blue-400/30',
    accentBg: 'bg-amber-50 text-amber-900',
    cardBorder: 'hover:border-amber-400',
  },
];

export const QuickActionCards: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_ACTIONS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.link}
                className={`group flex flex-col justify-between p-6 rounded-3xl bg-[#F0F4F8] border border-[#E3E9E4] ${card.cardBorder} transition-all duration-200 hover:shadow-premium hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${card.accentBg} flex items-center justify-center font-bold shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.pillarBg}`}>
                      {card.pillar}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#06152B] group-hover:text-[#16A34A] transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#647067] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#06152B] group-hover:text-[#16A34A] transition-colors pt-2 border-t border-gray-200/50">
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#16A34A]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
