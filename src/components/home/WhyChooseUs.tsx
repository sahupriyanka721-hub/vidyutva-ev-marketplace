import React from 'react';
import {
  Bike,
  FileCheck,
  CalendarCheck,
  ShieldCheck,
  Wrench,
  Award,
  Headphones,
  CheckCircle2
} from 'lucide-react';

const FEATURES = [
  {
    icon: Bike,
    title: 'Multiple Vehicle Options',
    description: 'Personal scooters, commercial passenger autos, and heavy cargo loaders compared objectively side-by-side.',
  },
  {
    icon: FileCheck,
    title: 'Transparent Quotations',
    description: 'Itemised on-road pricing with explicit state subsidy, RTO, and insurance breakdown. No hidden fees or fabricated charges.',
  },
  {
    icon: CalendarCheck,
    title: 'Convenient Test Drives',
    description: 'Complimentary doorstep test drives brought to your residence or workplace at pre-reserved time slots.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Spare Parts',
    description: '100% OEM batteries, fast chargers, controllers, and brake components with verified compatibility checks.',
  },
  {
    icon: Wrench,
    title: 'Doorstep Service',
    description: 'Mobile EV service vans equipped with diagnostic scanners, genuine spares, and certified technicians.',
  },
  {
    icon: Award,
    title: 'Warranty Assistance',
    description: 'Up to 3-5 years / 50,000 km battery replacement coverage with seamless claim facilitation.',
  },
  {
    icon: Headphones,
    title: 'Dedicated EV Support',
    description: 'Expert customer support executives ready to resolve booking, financing, or technical queries via phone and ticket.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Built For Trust & Longevity</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Why Choose E-VAHAN
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Every feature on our platform is designed to make your switch to electric mobility transparent, dependable, and hassle-free.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#F8FAF8] border border-[#E3E9E4] hover:border-emerald-500/60 transition-all duration-300 hover:shadow-premium flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#14532D] border border-gray-200/80 flex items-center justify-center mb-4 shadow-subtle">
                    <Icon className="w-6 h-6 text-[#16A34A]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#647067] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
