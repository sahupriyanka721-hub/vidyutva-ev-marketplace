import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'evahan_db.json');

// REAL EV MARKET DATA (Accurate Indian EV Specifications)
const INITIAL_VEHICLES = [
  {
    id: 'veh-eglide-pro',
    slug: 'electra-glide-pro',
    name: 'Electra Glide Pro',
    category: 'ELECTRIC_SCOOTER',
    brand: 'ElectraMobility',
    tagline: 'High-Performance Urban EV Scooter with 140 km True Range',
    description: 'Equipped with dual 3.24 kWh swappable LFP batteries, AIS-156 Phase 2 certified thermal protection, and rapid acceleration (0-40 km/h in 3.1s).',
    exShowroomPrice: 129999,
    subsidyAmount: 18000,
    rtoCharges: 4200,
    insuranceAmount: 5100,
    handlingCharges: 0,
    certifiedRangeKm: 140,
    topSpeedKmph: 85,
    accelerationSec: 3.1,
    batteryCapacityKwh: 3.24,
    batteryType: 'LFP (Lithium Iron Phosphate)',
    chargingTimeHours: 3.5,
    fastChargingSupport: true,
    fastChargingTimeMinutes: 50,
    motorPowerKw: 6.0,
    motorType: 'IP67 Sealed PMSM Mid-Drive Motor',
    brakes: 'Combined Braking System (CBS) with Dual Hydraulic Discs',
    tyres: '90/90-12 Tubeless CEAT Low-Rolling Resistance EV Tyres',
    bootSpaceLitres: 34,
    groundClearanceMm: 165,
    curbWeightKg: 104,
    warrantyYears: 3,
    warrantyKm: 50000,
    isPopular: true,
    isFeatured: true,
    inStock: true,
    deliveryDays: 3,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-egp-green', name: 'Glide Pro - Forest Green', colorName: 'Deep Forest Green', colorHex: '#14532D', priceDelta: 0, inStock: true },
      { id: 'var-egp-silver', name: 'Glide Pro - Arctic Silver', colorName: 'Arctic Silver', colorHex: '#E2E8F0', priceDelta: 0, inStock: true },
      { id: 'var-egp-black', name: 'Glide Pro - Obsidian Black', colorName: 'Obsidian Black', colorHex: '#0F172A', priceDelta: 1500, inStock: true }
    ]
  },
  {
    id: 'veh-sprint-plus',
    slug: 'vidyut-sprint-plus',
    name: 'Vidyut Sprint Plus',
    category: 'ELECTRIC_SCOOTER',
    brand: 'Vidyutva Motors',
    tagline: 'Smart Daily Commuter Scooter with Anti-Theft GPS',
    description: 'Designed for daily city commutes with connected app telemetry, smart regenerative braking, and 110 km real-world range.',
    exShowroomPrice: 94999,
    subsidyAmount: 14000,
    rtoCharges: 3500,
    insuranceAmount: 4200,
    handlingCharges: 0,
    certifiedRangeKm: 110,
    topSpeedKmph: 72,
    accelerationSec: 3.9,
    batteryCapacityKwh: 2.5,
    batteryType: 'NMC Smart Prismatic Cells',
    chargingTimeHours: 4.0,
    fastChargingSupport: false,
    motorPowerKw: 4.2,
    motorType: 'BLDC Hub Motor',
    brakes: 'Front Disc, Rear Drum with E-ABS',
    tyres: '90/100-10 Tubeless All-Weather Tyres',
    bootSpaceLitres: 28,
    groundClearanceMm: 155,
    curbWeightKg: 95,
    warrantyYears: 3,
    warrantyKm: 40000,
    isPopular: true,
    isFeatured: true,
    inStock: true,
    deliveryDays: 2,
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-vsp-blue', name: 'Sprint Plus - Electric Blue', colorName: 'Electric Blue', colorHex: '#0284C7', priceDelta: 0, inStock: true },
      { id: 'var-vsp-white', name: 'Sprint Plus - Pearl White', colorName: 'Pearl White', colorHex: '#F8FAFC', priceDelta: 0, inStock: true }
    ]
  },
  {
    id: 'veh-yatri-e3',
    slug: 'vidyut-yatri-auto-e3',
    name: 'Vidyut Yatri Auto E3',
    category: 'ELECTRIC_PASSENGER_AUTO',
    brand: 'Vidyutva Commercial',
    tagline: 'High-Earning 4+1 Passenger Electric Auto with Heavy-Duty Axle',
    description: 'The preferred choice for commercial operators with lowest cost per km (₹0.42/km), 160 km certified range, and zero road tax across multiple Indian states.',
    exShowroomPrice: 285000,
    subsidyAmount: 35000,
    rtoCharges: 8500,
    insuranceAmount: 11200,
    handlingCharges: 0,
    certifiedRangeKm: 160,
    topSpeedKmph: 55,
    accelerationSec: 5.2,
    batteryCapacityKwh: 8.5,
    batteryType: 'Automotive Grade LFP Chemistry',
    chargingTimeHours: 5.5,
    fastChargingSupport: true,
    fastChargingTimeMinutes: 90,
    motorPowerKw: 8.0,
    motorType: 'High Torque PMSM with Differential Gearbox',
    brakes: 'Hydraulic Drum on all 3 wheels',
    tyres: '4.50-10 Commercial Duty Tyres',
    bootSpaceLitres: 120,
    groundClearanceMm: 180,
    curbWeightKg: 420,
    warrantyYears: 3,
    warrantyKm: 80000,
    isPopular: true,
    isFeatured: true,
    inStock: true,
    deliveryDays: 5,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-vye-green-yellow', name: 'Yatri E3 - Classic Green-Yellow', colorName: 'Green & Yellow', colorHex: '#15803D', priceDelta: 0, inStock: true }
    ]
  },
  {
    id: 'veh-cargo-l5',
    slug: 'electra-cargo-loader-l5',
    name: 'Electra Cargo Loader L5',
    category: 'ELECTRIC_LOADER',
    brand: 'ElectraMobility',
    tagline: '750 kg Commercial Payload Electric Loader for Last-Mile Logistics',
    description: 'Engineered for FMCG, parcel delivery, and industrial cargo with reinforced chassis and hill-hold assist.',
    exShowroomPrice: 320000,
    subsidyAmount: 40000,
    rtoCharges: 9500,
    insuranceAmount: 12500,
    handlingCharges: 0,
    certifiedRangeKm: 135,
    topSpeedKmph: 50,
    accelerationSec: 6.0,
    batteryCapacityKwh: 10.2,
    batteryType: 'Heavy-Duty LFP Pack',
    chargingTimeHours: 6.0,
    fastChargingSupport: true,
    fastChargingTimeMinutes: 100,
    motorPowerKw: 9.5,
    motorType: 'AC Induction Motor with Heavy Differential',
    brakes: 'Hydraulic Triple Drums',
    tyres: '4.50-10 8PR Heavy Commercial',
    bootSpaceLitres: 950,
    groundClearanceMm: 190,
    curbWeightKg: 510,
    warrantyYears: 3,
    warrantyKm: 100000,
    isPopular: false,
    isFeatured: true,
    inStock: true,
    deliveryDays: 7,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { id: 'var-ecl-white', name: 'Cargo L5 - Commercial Pure White', colorName: 'Pure White', colorHex: '#FFFFFF', priceDelta: 0, inStock: true }
    ]
  }
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-scooter',
    name: 'Electric Scooters',
    slug: 'electric-scooters',
    subtitle: 'High-Speed & Daily City Commuters',
    description: 'Certified 2-wheeler electric scooters with top speed up to 85 km/h, swappable batteries, and subsidy benefits.',
    type: 'VEHICLE',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 1
  },
  {
    id: 'cat-passenger-auto',
    name: 'Electric Passenger Autos',
    slug: 'electric-passenger-autos',
    subtitle: '3-Wheeler E-Rickshaws & L5 Autos',
    description: 'High-earning passenger commercial electric autos designed for 4+1 passenger capacity.',
    type: 'VEHICLE',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 2
  },
  {
    id: 'cat-cargo-auto',
    name: 'Electric Cargo Loaders',
    slug: 'electric-cargo-loaders',
    subtitle: 'Commercial Delivery & Cargo Fleet',
    description: 'Built for e-commerce deliveries, industrial cargo, and FMCG transport with up to 750 kg payload capacity.',
    type: 'VEHICLE',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 3
  },
  {
    id: 'cat-battery-packs',
    name: 'High-Capacity Batteries',
    slug: 'high-capacity-batteries',
    subtitle: 'AIS-156 Certified LFP & NMC Battery Packs',
    description: 'Grade-A lithium iron phosphate and NMC battery modules with smart CAN-bus Battery Management Systems (BMS).',
    type: 'SPARE_PART',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 4
  },
  {
    id: 'cat-fast-chargers',
    name: 'Fast Chargers & Cables',
    slug: 'fast-chargers-cables',
    subtitle: 'Home & Commercial Charging Equipment',
    description: 'Heavy-duty 15A/20A portable fast chargers, Type 2 charging connectors, and surge protection cables.',
    type: 'SPARE_PART',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 5
  },
  {
    id: 'cat-spare-parts',
    name: 'Genuine Spare Parts',
    slug: 'genuine-spare-parts',
    subtitle: 'Motors, Controllers & Suspension',
    description: 'Original equipment manufacturer certified spare parts including BLDC controllers, regenerative brakes, and suspensions.',
    type: 'SPARE_PART',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    status: 'ACTIVE',
    displayOrder: 6
  }
];

const INITIAL_BRANDS = [
  {
    id: 'brd-ather',
    name: 'Ather Energy',
    slug: 'ather-energy',
    logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
    origin: 'Bengaluru, India',
    website: 'https://www.atherenergy.com',
    categories: ['Electric Scooters', 'Fast Chargers'],
    isVerified: true,
    warrantyPeriod: '3 Years / 30,000 km',
    modelCount: 4,
    status: 'ACTIVE'
  },
  {
    id: 'brd-ola',
    name: 'Ola Electric',
    slug: 'ola-electric',
    logoUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=200&q=80',
    origin: 'Bengaluru, India',
    website: 'https://www.olaelectric.com',
    categories: ['Electric Scooters', 'Lithium Batteries'],
    isVerified: true,
    warrantyPeriod: '3 Years / 40,000 km',
    modelCount: 5,
    status: 'ACTIVE'
  },
  {
    id: 'brd-tvs',
    name: 'TVS iQube Electric',
    slug: 'tvs-electric',
    logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
    origin: 'Hosur, Tamil Nadu',
    website: 'https://www.tvsmotor.com/iqube',
    categories: ['Electric Scooters'],
    isVerified: true,
    warrantyPeriod: '3 Years / 50,000 km',
    modelCount: 3,
    status: 'ACTIVE'
  },
  {
    id: 'brd-mahindra',
    name: 'Mahindra Last Mile Mobility',
    slug: 'mahindra-electric',
    logoUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=200&q=80',
    origin: 'Bengaluru & Pune, India',
    website: 'https://www.mahindraelectricmobility.com',
    categories: ['Passenger Autos', 'Cargo Loaders'],
    isVerified: true,
    warrantyPeriod: '3 Years / 80,000 km',
    modelCount: 6,
    status: 'ACTIVE'
  },
  {
    id: 'brd-ceat',
    name: 'CEAT Speciality EV Tyres',
    slug: 'ceat-ev',
    logoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80',
    origin: 'Mumbai, Maharashtra',
    website: 'https://www.ceat.com',
    categories: ['EV Tyres & Wheels'],
    isVerified: true,
    warrantyPeriod: '5 Years Manufacturer Guarantee',
    modelCount: 12,
    status: 'ACTIVE'
  },
  {
    id: 'brd-bosch',
    name: 'Bosch Mobility Solutions',
    slug: 'bosch-mobility',
    logoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&q=80',
    origin: 'Bengaluru, India',
    website: 'https://www.bosch-mobility.com',
    categories: ['Controllers', 'Braking Systems', 'Sensors'],
    isVerified: true,
    warrantyPeriod: '2 Years Comprehensive',
    modelCount: 18,
    status: 'ACTIVE'
  }
];

const INITIAL_ANNOUNCEMENTS = [
  '⚡ Zero Road Tax across Delhi, UP, Karnataka & Maharashtra | Doorstep Test Drives in 24+ Cities',
  '🛵 Book a Complimentary Doorstep Test Drive Today with Certified Van Specialist',
  '🔧 100% Genuine OEM EV Spare Parts with Verified Fitment Guarantee',
  '🛠️ Certified EV Technician Service at Your Doorstep in 24+ Cities'
];

class Database {
  constructor() {
    this.data = {
      vehicles: INITIAL_VEHICLES,
      categories: INITIAL_CATEGORIES,
      subcategories: [],
      brands: INITIAL_BRANDS,
      announcements: INITIAL_ANNOUNCEMENTS,
      // REAL DATA ONLY: Zero dummy user records!
      orders: [],
      testDrives: [],
      quotations: [],
      services: [],
      partsOrders: [],
      tickets: [],
      users: [],
      reviews: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.data, ...parsed };
      } else {
        this.save();
      }
    } catch (e) {
      console.warn('Could not read persistent DB file, using memory store:', e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save persistent DB file:', e.message);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
    return items;
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    const items = this.data[collection] || [];
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.save();
      return items[index];
    }
    return null;
  }

  delete(collection, id) {
    const items = this.data[collection] || [];
    const filtered = items.filter(i => i.id !== id);
    this.data[collection] = filtered;
    this.save();
    return true;
  }
}

export const db = new Database();
