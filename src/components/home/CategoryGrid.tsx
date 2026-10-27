import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bike,
  Users,
  Truck,
  Layers,
  BatteryCharging,
  Zap,
  Cpu,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'cat-scooters',
    title: 'Electric Scooters',
    subtitle: 'Urban & Commuter',
    link: '/vehicles?category=ELECTRIC_SCOOTER',
    icon: Bike,
    count: '3 Models Available',
    bgImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-passenger-autos',
    title: 'Electric Passenger Autos',
    subtitle: 'Commercial 4+1 Seater',
    link: '/vehicles?category=ELECTRIC_PASSENGER_AUTO',
    icon: Users,
    count: 'High Daily ROI',
    bgImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-cargo-autos',
    title: 'Electric Cargo Autos',
    subtitle: 'Delivery & Last-Mile',
    link: '/vehicles?category=ELECTRIC_CARGO_AUTO',
    icon: Truck,
    count: '600 kg Payload',
    bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-loaders',
    title: 'Electric Loaders',
    subtitle: 'Industrial & Heavy Duty',
    link: '/vehicles?category=ELECTRIC_LOADER',
    icon: Layers,
    count: '750 kg Capacity',
    bgImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-batteries',
    title: 'Batteries',
    subtitle: 'LFP & NMC Lithium Packs',
    link: '/spare-parts?category=cat-batteries',
    icon: BatteryCharging,
    count: 'Smart CAN BMS',
    bgImage: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-chargers',
    title: 'Chargers',
    subtitle: 'Home & Fast Chargers',
    link: '/spare-parts?category=cat-chargers',
    icon: Zap,
    count: '60V - 72V Fast Charge',
    bgImage: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-spare-parts',
    title: 'Spare Parts',
    subtitle: 'Motors, Controllers & Brakes',
    link: '/spare-parts',
    icon: Cpu,
    count: '100% OEM Genuine',
    bgImage: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'cat-accessories',
    title: 'Accessories',
    subtitle: 'Helmets, Covers & Mats',
    link: '/spare-parts?category=cat-accessories',
    icon: Sparkles,
    count: 'ISI Certified Gear',
    bgImage: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=500&q=80',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-14 bg-[#F8FAF8] border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-[#14532D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modular Marketplace Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select an electric mobility category to browse verified vehicles and genuine parts.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs font-bold text-[#14532D] hover:text-[#0d381e] flex items-center gap-1 hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16A34A]" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.link}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#E3E9E4] hover:border-emerald-500/80 p-4 sm:p-5 transition-all duration-300 hover:shadow-premium flex flex-col justify-between"
              >
                {/* Visual Thumbnail & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 group-hover:bg-[#14532D] text-[#14532D] group-hover:text-[#B7F34A] flex items-center justify-center transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    {cat.count}
                  </span>
                </div>

                <div className="h-24 sm:h-28 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative">
                  <img
                    src={cat.bgImage}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#14532D] transition-colors leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
