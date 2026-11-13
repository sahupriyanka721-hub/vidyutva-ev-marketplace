import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  Globe,
  Bookmark,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  LayoutGrid,
  ShoppingBag,
  Clock,
  FileText,
  Wrench,
  LifeBuoy,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Bell,
  Eye,
  Send,
  Zap,
  Tag,
  LogOut,
  Smartphone,
  Lock,
  Mail,
  Phone,
  MapPin,
  PackageCheck,
  UserCheck,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  Box,
  Store,
  DollarSign,
  Check,
  FileCheck
} from 'lucide-react';
import { storage } from '../services/storageService';
import { VEHICLES_DATA, SPARE_PARTS_DATA } from '../data/seedData';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  CustomerUser,
  CategoryItem,
  SubCategoryItem,
  BrandItem,
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  ServiceBookingItem,
  SparePartsOrder,
  SupportTicketItem
} from '../types';

export type AdminTab =
  | 'overview'
  | 'customers'
  | 'announcements'
  | 'orders'
  | 'test-drives'
  | 'quotations'
  | 'services'
  | 'parts'
  | 'tickets'
  | 'inventory'
  // Service Management Sub-items
  | 'service-history'
  | 'service-categories'
  | 'service-approvals'
  // Service Provider Management Sub-items
  | 'sp-history'
  | 'sp-onboarding'
  | 'sp-list'
  | 'sp-payout'
  // Spare VendorManagement Sub-items
  | 'vendor-history'
  | 'vendor-onboarding'
  | 'vendor-list'
  | 'vendor-payout'
  // Marketplace Management Sub-items
  | 'shop-onboarding'
  | 'shop-list'
  | 'shop-payout'
  // Category & Brand Management
  | 'categories'
  | 'subcategories'
  | 'brands';

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  city: string;
  vanNumber: string;
  specialization: string;
  rating: number;
  completedJobs: number;
  totalEarnings: number;
  pendingPayout: number;
  status: 'ACTIVE' | 'ON_JOB' | 'OFFLINE';
  joinedDate: string;
}

export interface SpareVendor {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  categories: string;
  activeSkus: number;
  fulfilledOrders: number;
  pendingPayout: number;
  totalDisbursed: number;
  status: 'VERIFIED' | 'PENDING';
  rating: number;
}

export interface Shopkeeper {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  city: string;
  address: string;
  gstNumber: string;
  inventoryCount: number;
  totalSales: number;
  commissionRate: string;
  pendingPayout: number;
  totalDisbursed: number;
  status: 'ACTIVE' | 'PENDING';
}

export interface ServiceRateCard {
  id: string;
  title: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
}

const INITIAL_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 'sp-01',
    name: 'Santosh Kumar',
    phone: '9811234567',
    city: 'Delhi NCR',
    vanNumber: 'DL-1EV-8899',
    specialization: 'Battery Diagnostics & Controller Repair',
    rating: 4.95,
    completedJobs: 142,
    totalEarnings: 85200,
    pendingPayout: 6400,
    status: 'ACTIVE',
    joinedDate: '12 Jan 2025'
  },
  {
    id: 'sp-02',
    name: 'Rajesh Sharma',
    phone: '9823456789',
    city: 'Delhi NCR',
    vanNumber: 'DL-2EV-4512',
    specialization: 'Doorstep Periodic Maintenance & Brake Servicing',
    rating: 4.88,
    completedJobs: 98,
    totalEarnings: 58800,
    pendingPayout: 4200,
    status: 'ON_JOB',
    joinedDate: '18 Feb 2025'
  },
  {
    id: 'sp-03',
    name: 'Vikram Singh',
    phone: '9741288990',
    city: 'Bengaluru',
    vanNumber: 'KA-05-EV-4412',
    specialization: 'Motor & Electrical Diagnostic Calibration',
    rating: 4.92,
    completedJobs: 164,
    totalEarnings: 98400,
    pendingPayout: 7800,
    status: 'ACTIVE',
    joinedDate: '05 Nov 2024'
  },
  {
    id: 'sp-04',
    name: 'Amit Patel',
    phone: '9820011223',
    city: 'Mumbai',
    vanNumber: 'MH-02-EV-9901',
    specialization: 'Brake & Suspension Overhaul Specialist',
    rating: 4.85,
    completedJobs: 87,
    totalEarnings: 52200,
    pendingPayout: 5100,
    status: 'OFFLINE',
    joinedDate: '02 Mar 2025'
  }
];

const INITIAL_SPARE_VENDORS: SpareVendor[] = [
  {
    id: 'ven-01',
    companyName: 'Vidyutva OEM Spares Ltd',
    contactPerson: 'Harish Mehta',
    phone: '9810044556',
    email: 'info@vidyutva-spares.com',
    location: 'Gurugram Sector 18, Haryana',
    categories: 'LFP Battery Modules & Smart Controllers',
    activeSkus: 28,
    fulfilledOrders: 340,
    pendingPayout: 48500,
    totalDisbursed: 412000,
    status: 'VERIFIED',
    rating: 4.9
  },
  {
    id: 'ven-02',
    companyName: 'Bosch Mobility EV Spares',
    contactPerson: 'Suresh Rao',
    phone: '9845012345',
    email: 'orders@bosch-ev.in',
    location: 'Peenya Industrial Area, Bengaluru',
    categories: 'Ceramic Brakes, Motors & Electronic Sensors',
    activeSkus: 18,
    fulfilledOrders: 210,
    pendingPayout: 29400,
    totalDisbursed: 285000,
    status: 'VERIFIED',
    rating: 4.95
  },
  {
    id: 'ven-03',
    companyName: 'CEAT EV Speciality Tyres',
    contactPerson: 'Anil Deshmukh',
    phone: '9822077889',
    email: 'distribution@ceat-ev.com',
    location: 'Chakan Auto Cluster, Pune',
    categories: 'Low Rolling Resistance Tubeless EV Tyres',
    activeSkus: 12,
    fulfilledOrders: 290,
    pendingPayout: 36200,
    totalDisbursed: 320000,
    status: 'VERIFIED',
    rating: 4.85
  },
  {
    id: 'ven-04',
    companyName: 'Exide Energy Solutions',
    contactPerson: 'Naveen Gupta',
    phone: '9830099887',
    email: 'oem@exide-energy.in',
    location: 'Sector 5 Salt Lake, Kolkata & NCR Hub',
    categories: 'Fast Chargers, Smart Cables & BMS Wiring Kits',
    activeSkus: 16,
    fulfilledOrders: 145,
    pendingPayout: 18000,
    totalDisbursed: 195000,
    status: 'VERIFIED',
    rating: 4.8
  }
];

const INITIAL_SHOPKEEPERS: Shopkeeper[] = [
  {
    id: 'shp-01',
    shopName: 'GreenWheel EV Hub Delhi',
    ownerName: 'Ramanuj Joshi',
    phone: '9811055443',
    city: 'Delhi NCR',
    address: 'Plot 42, Connaught Circus & Sector 12 Dwarka',
    gstNumber: '07AAACG1234F1Z5',
    inventoryCount: 8,
    totalSales: 42,
    commissionRate: '3.5%',
    pendingPayout: 145000,
    totalDisbursed: 1280000,
    status: 'ACTIVE'
  },
  {
    id: 'shp-02',
    shopName: 'Vidyut Galleria Bengaluru',
    ownerName: 'Kiran Hegde',
    phone: '9845122334',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar',
    gstNumber: '29AABCV5678G1Z2',
    inventoryCount: 6,
    totalSales: 28,
    commissionRate: '4.0%',
    pendingPayout: 92000,
    totalDisbursed: 940000,
    status: 'ACTIVE'
  },
  {
    id: 'shp-03',
    shopName: 'EcoDrive Mobility Showroom Mumbai',
    ownerName: 'Pooja Singhania',
    phone: '9820133445',
    city: 'Mumbai',
    address: 'Link Road, Andheri West',
    gstNumber: '27AABCS9012H1Z8',
    inventoryCount: 12,
    totalSales: 65,
    commissionRate: '3.5%',
    pendingPayout: 210000,
    totalDisbursed: 2150000,
    status: 'ACTIVE'
  },
  {
    id: 'shp-04',
    shopName: 'Apex EV Superstore Noida',
    ownerName: 'Manish Verma',
    phone: '9818077665',
    city: 'Noida (NCR)',
    address: 'Sector 62 Commercial Hub',
    gstNumber: '09AABCM3456J1Z1',
    inventoryCount: 5,
    totalSales: 19,
    commissionRate: '3.5%',
    pendingPayout: 68000,
    totalDisbursed: 620000,
    status: 'ACTIVE'
  }
];

const INITIAL_SERVICE_RATES: ServiceRateCard[] = [
  {
    id: 'rt-01',
    title: 'General Periodic Maintenance',
    category: 'Doorstep Periodic Service',
    price: 499,
    duration: '45 - 60 mins',
    features: [
      '36-point comprehensive EV diagnostics',
      'Brake pad cleaning & free play calibration',
      'Drive belt / chain tension adjustment & lube',
      'Tyre pressure check & tread depth report',
      'Firmware check & error memory scan'
    ]
  },
  {
    id: 'rt-02',
    title: 'Battery Health & Cell Diagnostic',
    category: 'Battery & Electrical',
    price: 699,
    duration: '60 mins',
    features: [
      'Full battery capacity degradation index',
      'Individual cell voltage balancing assessment',
      'BMS communication & temperature sensor check',
      'Internal resistance & discharge load test',
      'Official digital Battery Health Certificate'
    ]
  },
  {
    id: 'rt-03',
    title: 'High-Voltage Controller & Motor Check',
    category: 'Powertrain Diagnostics',
    price: 999,
    duration: '90 mins',
    features: [
      'Harmonic distortion & motor torque calibration',
      'MOSFET resistance & phase wire thermal check',
      'Throttle hall sensor testing',
      'Regenerative braking efficiency tuning'
    ]
  },
  {
    id: 'rt-04',
    title: 'Front & Rear Disc Brake Overhaul',
    category: 'Safety & Braking',
    price: 799,
    duration: '60 mins',
    features: [
      'DOT-4 synthetic brake fluid flush',
      'Caliper pin de-greasing & seal inspection',
      'Rotor run-out & thickness truing',
      'Emergency regenerative interlock check'
    ]
  },
  {
    id: 'rt-05',
    title: 'Emergency Mobile Van Roadside Assist',
    category: 'Emergency Dispatch',
    price: 1199,
    duration: 'Immediate Priority (25-45 mins dispatch)',
    features: [
      'On-spot fast charging rescue (up to 15km range)',
      'Tubeless tyre puncture vulcanization',
      '12V auxiliary system boost',
      'Flatbed tow coordination assistance'
    ]
  }
];
export const AdminDashboardPage: React.FC = () => {
  // Admin authentication state: requires registered mobile & verification OTP
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('evahan_admin_auth') === 'true' ||
      sessionStorage.getItem('evahan_admin_auth') === 'true'
    );
  });
  const [adminPhone, setAdminPhone] = useState('');
  const [adminOtp, setAdminOtp] = useState('');
  const [adminStep, setAdminStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [adminError, setAdminError] = useState('');
  const [isOtpAutoFilled, setIsOtpAutoFilled] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Accordion Expand State: allows toggling parent categories as seen in user reference screenshots
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    'service-management': false,
    'spare-vendor': false,
    'marketplace': false,
    'catalog-architecture': false,
    'user-management': false
  });

  // Multi-Vendor Portal State with localStorage persistence
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(() => {
    const saved = localStorage.getItem('evahan_service_providers');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_PROVIDERS;
  });

  const [spareVendors, setSpareVendors] = useState<SpareVendor[]>(() => {
    const saved = localStorage.getItem('evahan_spare_vendors');
    return saved ? JSON.parse(saved) : INITIAL_SPARE_VENDORS;
  });

  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>(() => {
    const saved = localStorage.getItem('evahan_shopkeepers');
    return saved ? JSON.parse(saved) : INITIAL_SHOPKEEPERS;
  });

  const [serviceRates, setServiceRates] = useState<ServiceRateCard[]>(() => {
    const saved = localStorage.getItem('evahan_service_rates');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_RATES;
  });

  // Onboarding Form States
  const [spForm, setSpForm] = useState({
    name: '',
    phone: '',
    city: 'Delhi NCR',
    vanNumber: '',
    specialization: 'Battery Diagnostics & Controller Repair'
  });

  const [vendorForm, setVendorForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: '',
    categories: 'LFP Battery Modules & Smart Controllers'
  });

  const [shopForm, setShopForm] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    city: 'Delhi NCR',
    address: '',
    gstNumber: '',
    commissionRate: '3.5%'
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectTab = (tabId: AdminTab, parentKey?: string) => {
    setActiveTab(tabId);
    if (parentKey) {
      setExpandedMenus(prev => ({ ...prev, [parentKey]: true }));
    }
    setIsMobileSidebarOpen(false);
  };

  // Service Provider Handlers
  const handleRegisterServiceProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spForm.name.trim() || !spForm.phone.trim() || !spForm.vanNumber.trim()) {
      alert('Kripya sabhi zaroori fields bharein!');
      return;
    }
    const newSp: ServiceProvider = {
      id: `sp-${Date.now().toString().slice(-4)}`,
      name: spForm.name.trim(),
      phone: spForm.phone.trim(),
      city: spForm.city,
      vanNumber: spForm.vanNumber.trim().toUpperCase(),
      specialization: spForm.specialization,
      rating: 5.0,
      completedJobs: 0,
      totalEarnings: 0,
      pendingPayout: 0,
      status: 'ACTIVE',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const updated = [newSp, ...serviceProviders];
    setServiceProviders(updated);
    localStorage.setItem('evahan_service_providers', JSON.stringify(updated));
    setSpForm({
      name: '',
      phone: '',
      city: 'Delhi NCR',
      vanNumber: '',
      specialization: 'Battery Diagnostics & Controller Repair'
    });
    setRefreshNotification(`✓ New Service Provider "${newSp.name}" successfully onboarded with Van ${newSp.vanNumber}!`);
    setTimeout(() => setRefreshNotification(null), 4000);
    setActiveTab('sp-list');
  };

  const handleToggleSpStatus = (spId: string) => {
    const updated = serviceProviders.map(sp => {
      if (sp.id === spId) {
        const nextStatus: ServiceProvider['status'] =
          sp.status === 'ACTIVE' ? 'ON_JOB' : sp.status === 'ON_JOB' ? 'OFFLINE' : 'ACTIVE';
        return { ...sp, status: nextStatus };
      }
      return sp;
    });
    setServiceProviders(updated);
    localStorage.setItem('evahan_service_providers', JSON.stringify(updated));
  };

  const handleDisburseSpPayout = (spId: string) => {
    const updated = serviceProviders.map(sp => {
      if (sp.id === spId) {
        return {
          ...sp,
          totalEarnings: sp.totalEarnings + sp.pendingPayout,
          pendingPayout: 0
        };
      }
      return sp;
    });
    setServiceProviders(updated);
    localStorage.setItem('evahan_service_providers', JSON.stringify(updated));
    setRefreshNotification('✓ Payout successfully disbursed via Instant IMPS/UPI Transfer!');
    setTimeout(() => setRefreshNotification(null), 3500);
  };

  // Spare Vendor Handlers
  const handleRegisterSpareVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.companyName.trim() || !vendorForm.contactPerson.trim() || !vendorForm.phone.trim()) {
      alert('Kripya vendor details bharein!');
      return;
    }
    const newVendor: SpareVendor = {
      id: `ven-${Date.now().toString().slice(-4)}`,
      companyName: vendorForm.companyName.trim(),
      contactPerson: vendorForm.contactPerson.trim(),
      phone: vendorForm.phone.trim(),
      email: vendorForm.email.trim() || 'vendor@e-vahan.in',
      location: vendorForm.location.trim() || 'Industrial Area Hub',
      categories: vendorForm.categories,
      activeSkus: 8,
      fulfilledOrders: 0,
      pendingPayout: 0,
      totalDisbursed: 0,
      status: 'VERIFIED',
      rating: 5.0
    };
    const updated = [newVendor, ...spareVendors];
    setSpareVendors(updated);
    localStorage.setItem('evahan_spare_vendors', JSON.stringify(updated));
    setVendorForm({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      location: '',
      categories: 'LFP Battery Modules & Smart Controllers'
    });
    setRefreshNotification(`✓ Spare Vendor "${newVendor.companyName}" successfully registered & verified!`);
    setTimeout(() => setRefreshNotification(null), 4000);
    setActiveTab('vendor-list');
  };

  const handleDisburseVendorPayout = (vendorId: string) => {
    const updated = spareVendors.map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          totalDisbursed: v.totalDisbursed + v.pendingPayout,
          pendingPayout: 0
        };
      }
      return v;
    });
    setSpareVendors(updated);
    localStorage.setItem('evahan_spare_vendors', JSON.stringify(updated));
    setRefreshNotification('✓ Vendor settlement payment processed via RTGS / Corporate Banking!');
    setTimeout(() => setRefreshNotification(null), 3500);
  };

  // Shopkeeper / Dealer Handlers
  const handleRegisterShopkeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopForm.shopName.trim() || !shopForm.ownerName.trim() || !shopForm.phone.trim()) {
      alert('Kripya showroom details bharein!');
      return;
    }
    const newShop: Shopkeeper = {
      id: `shp-${Date.now().toString().slice(-4)}`,
      shopName: shopForm.shopName.trim(),
      ownerName: shopForm.ownerName.trim(),
      phone: shopForm.phone.trim(),
      city: shopForm.city,
      address: shopForm.address.trim() || 'Commercial Showroom Center',
      gstNumber: shopForm.gstNumber.trim().toUpperCase() || '07AABC1234F1Z5',
      inventoryCount: 6,
      totalSales: 0,
      commissionRate: shopForm.commissionRate,
      pendingPayout: 0,
      totalDisbursed: 0,
      status: 'ACTIVE'
    };
    const updated = [newShop, ...shopkeepers];
    setShopkeepers(updated);
    localStorage.setItem('evahan_shopkeepers', JSON.stringify(updated));
    setShopForm({
      shopName: '',
      ownerName: '',
      phone: '',
      city: 'Delhi NCR',
      address: '',
      gstNumber: '',
      commissionRate: '3.5%'
    });
    setRefreshNotification(`✓ Showroom Partner "${newShop.shopName}" successfully onboarded!`);
    setTimeout(() => setRefreshNotification(null), 4000);
    setActiveTab('shop-list');
  };

  const handleDisburseShopkeeperPayout = (shopId: string) => {
    const updated = shopkeepers.map(s => {
      if (s.id === shopId) {
        return {
          ...s,
          totalDisbursed: s.totalDisbursed + s.pendingPayout,
          pendingPayout: 0
        };
      }
      return s;
    });
    setShopkeepers(updated);
    localStorage.setItem('evahan_shopkeepers', JSON.stringify(updated));
    setRefreshNotification('✓ Dealership commission settlement disbursed to authorized bank account!');
    setTimeout(() => setRefreshNotification(null), 3500);
  };

  const handleUpdateServiceRate = (rateId: string, newPrice: number) => {
    const updated = serviceRates.map(r => r.id === rateId ? { ...r, price: newPrice } : r);
    setServiceRates(updated);
    localStorage.setItem('evahan_service_rates', JSON.stringify(updated));
    setRefreshNotification('✓ Service package rate card updated live in central catalog!');
    setTimeout(() => setRefreshNotification(null), 3000);
  };
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Live data from storageService (Zero dummy users - strictly only real platform data)
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerUser[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [vehicleOrders, setVehicleOrders] = useState<VehicleOrderItem[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBookingItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequestItem[]>([]);
  const [services, setServices] = useState<ServiceBookingItem[]>([]);
  const [partsOrders, setPartsOrders] = useState<SparePartsOrder[]>([]);
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);

  // Dynamic Categories, Sub-Categories & Brands Management
  const [categories, setCategories] = useState<CategoryItem[]>(() => storage.getCategories());
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>(() => storage.getSubCategories());
  const [brands, setBrands] = useState<BrandItem[]>(() => storage.getBrands());

  // Announcement Bar message manager (Section 4.A requirement)
  const [announcements, setAnnouncements] = useState<string[]>([
    '⚡ Zero Road Tax across Delhi, UP, Karnataka & Maharashtra | Doorstep Test Drives in 24+ Cities',
    '🛵 Book a Complimentary Doorstep Test Drive Today with Certified Van Specialist',
    '🔧 100% Genuine OEM EV Spare Parts with Verified Fitment Guarantee',
    '🛠️ Certified EV Technician Service at Your Doorstep in 24+ Cities'
  ]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Ticket reply state
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  // Grouped Navigation structure for Admin Sidebar Menu
  // Accordion Navigation Structure matching User's 4 Reference Photos:
  // 1. Dashboard (Top with cyan left line)
  // 2. Service Management (Layers icon, chevron right/down)
  // 3. Service Provider Management (UserCheck icon, active bg container, chevron)
  // 4. Spare VendorManagement (Box icon, active bg container, chevron)
  // 5. Marketplace Management (Store icon, active bg container, chevron)
  // 6. User Management (Users icon, chevron)
  const adminAccordionGroups = [
    {
      id: 'service-management',
      label: 'Service Management',
      icon: Layers,
      items: [
        { id: 'service-history' as AdminTab, label: 'partner history', badge: null },
        { id: 'service-categories' as AdminTab, label: 'Service Categories & Rates', badge: null },
        { id: 'service-approvals' as AdminTab, label: 'Customer Digital Approvals', badge: null },
        { id: 'services' as AdminTab, label: 'Service Bookings & Vans', badge: services.length },
      ]
    },
    {
      id: 'spare-vendor',
      label: 'Spare VendorManagement',
      icon: Box,
      items: [
        { id: 'vendor-history' as AdminTab, label: 'Spare vendor history', badge: null },
        { id: 'vendor-onboarding' as AdminTab, label: 'Spare vendor onboarding', badge: null },
        { id: 'vendor-list' as AdminTab, label: 'Spare vendor List', badge: spareVendors.length },
        { id: 'vendor-payout' as AdminTab, label: 'Spare vendor Payout', badge: null },
        { id: 'parts' as AdminTab, label: 'Spare vendor products', badge: partsOrders.length },
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace Management',
      icon: Store,
      items: [
        { id: 'shop-onboarding' as AdminTab, label: 'Shopkeeper Onboarding', badge: null },
        { id: 'shop-list' as AdminTab, label: 'Shopkeeper List', badge: shopkeepers.length },
        { id: 'inventory' as AdminTab, label: 'Shopkeeper Products', badge: VEHICLES_DATA.length },
        { id: 'shop-payout' as AdminTab, label: 'Shopkeeper Payout', badge: null },
      ]
    },
    {
      id: 'catalog-architecture',
      label: 'Catalog & Brands Architecture',
      icon: Sparkles,
      items: [
        { id: 'categories' as AdminTab, label: 'Categories Master', badge: categories.length },
        { id: 'subcategories' as AdminTab, label: 'Sub-Categories', badge: subCategories.length },
        { id: 'brands' as AdminTab, label: 'Brands & OEMs', badge: brands.length },
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      items: [
        { id: 'customers' as AdminTab, label: 'Registered Customers', badge: registeredCustomers.length },
        { id: 'orders' as AdminTab, label: 'Vehicle Orders', badge: vehicleOrders.length },
        { id: 'quotations' as AdminTab, label: 'Customer Quotations', badge: quotations.length },
        { id: 'test-drives' as AdminTab, label: 'Test Drive Bookings', badge: testDrives.length },
        { id: 'tickets' as AdminTab, label: 'Customer Support Desk', badge: tickets.length },
        { id: 'announcements' as AdminTab, label: 'Announcement Bar Manager', badge: announcements.length },
      ]
    },
  ];

  // Helper to get current active breadcrumb
  const getTabBreadcrumb = () => {
    if (activeTab === 'overview') return { group: 'Main Console', label: 'Dashboard' };
    for (const group of adminAccordionGroups) {
      const match = group.items.find(item => item.id === activeTab);
      if (match) return { group: group.label, label: match.label };
    }
    return { group: 'Admin Console', label: activeTab };
  };

  // Common Sidebar Navigation component rendered in both desktop aside and mobile drawer
  const renderSidebarNav = () => (
    <div className="space-y-1.5">
      {/* Top Main Item: Dashboard (photo 2, 4 style with vertical cyan left bar) */}
      <button
        onClick={() => handleSelectTab('overview')}
        className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left ${
          activeTab === 'overview'
            ? 'bg-[#183556] text-white shadow-sm border border-blue-400/20'
            : 'text-slate-300 hover:text-white hover:bg-[#132A46]'
        }`}
      >
        {activeTab === 'overview' && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-[#00D2FF] rounded-r shadow-[0_0_10px_#00D2FF]"></span>
        )}
        <LayoutGrid className={`w-5 h-5 shrink-0 ${activeTab === 'overview' ? 'text-[#00D2FF]' : 'text-slate-400'}`} />
        <span>Dashboard</span>
      </button>

      {/* Accordion Categories (Exact match to User's Photos 2, 3, 4, 5) */}
      {adminAccordionGroups.map((group) => {
        const isExpanded = !!expandedMenus[group.id];
        const GroupIcon = group.icon;
        const isAnyChildActive = group.items.some(item => item.id === activeTab);

        return (
          <div key={group.id} className="space-y-1">
            {/* Parent Accordion Row */}
            <button
              onClick={() => toggleMenu(group.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-sm font-bold text-left ${
                isExpanded
                  ? 'bg-[#183556] text-white shadow-sm border border-blue-400/20'
                  : isAnyChildActive
                  ? 'text-white bg-[#132A46]/70 border border-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#132A46]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <GroupIcon className={`w-5 h-5 shrink-0 ${isExpanded || isAnyChildActive ? 'text-[#00D2FF]' : 'text-slate-400'}`} />
                <span className="truncate">{group.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {/* Submenu Items List (Indented with elegant guide line matching photos 3, 4, 5) */}
            {isExpanded && (
              <div className="pl-8 pr-2 pt-1 pb-2 space-y-1 border-l border-slate-700/50 ml-5 my-1">
                {group.items.map((subItem) => {
                  const isSubActive = activeTab === subItem.id;
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => handleSelectTab(subItem.id, group.id)}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-[13px] transition-all flex items-center justify-between ${
                        isSubActive
                          ? 'text-[#00D2FF] font-bold bg-[#183556]/80 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-[#132A46]/50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]"></span>}
                        <span className="truncate">{subItem.label}</span>
                      </div>
                      {subItem.badge !== null && subItem.badge !== undefined && subItem.badge > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#B7F34A]">
                          {subItem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

    // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    type: 'VEHICLE' as CategoryItem['type'],
    imageUrl: '',
    isFeatured: true
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // SubCategory Form State
  const [subCategoryForm, setSubCategoryForm] = useState({
    categoryId: '',
    name: '',
    description: ''
  });
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [subCategoryFilterParent, setSubCategoryFilterParent] = useState('ALL');

  // Brand Form State
  const [brandForm, setBrandForm] = useState({
    name: '',
    logoUrl: '',
    origin: 'Bengaluru, India',
    website: '',
    categories: ['Electric Scooters'],
    warrantyPeriod: '3 Years / 30,000 km'
  });
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Category Actions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim() || !categoryForm.subtitle.trim()) {
      alert('Kripya Category Name aur Subtitle bharein!');
      return;
    }
    const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = storage.addCategory({
      name: categoryForm.name.trim(),
      slug,
      subtitle: categoryForm.subtitle.trim(),
      description: categoryForm.description.trim() || `${categoryForm.name} catalog and models`,
      type: categoryForm.type,
      imageUrl: categoryForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      isFeatured: categoryForm.isFeatured,
      status: 'ACTIVE',
      displayOrder: categories.length + 1
    });
    setCategories(storage.getCategories());
    setIsCategoryModalOpen(false);
    setCategoryForm({
      name: '',
      subtitle: '',
      description: '',
      type: 'VEHICLE',
      imageUrl: '',
      isFeatured: true
    });
    setRefreshNotification(`✓ Category "${newCat.name}" created and published live to frontend!`);
    setTimeout(() => setRefreshNotification(null), 4000);
  };

  const handleToggleCategoryStatus = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const newStatus = cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    storage.updateCategory(id, { status: newStatus });
    setCategories(storage.getCategories());
    setRefreshNotification(`✓ Category "${cat.name}" status updated to ${newStatus}!`);
    setTimeout(() => setRefreshNotification(null), 3000);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (confirm(`Kya aap category "${cat?.name}" ko delete karna chahte hain?`)) {
      storage.deleteCategory(id);
      setCategories(storage.getCategories());
      setRefreshNotification(`✓ Category deleted successfully!`);
      setTimeout(() => setRefreshNotification(null), 3000);
    }
  };

  // Sub-Category Actions
  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryForm.name.trim() || !subCategoryForm.categoryId) {
      alert('Kripya Parent Category aur Sub-Category Name chunein!');
      return;
    }
    const parent = categories.find(c => c.id === subCategoryForm.categoryId);
    const slug = subCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSub = storage.addSubCategory({
      categoryId: subCategoryForm.categoryId,
      categoryName: parent?.name || 'Category',
      name: subCategoryForm.name.trim(),
      slug,
      description: subCategoryForm.description.trim() || `${subCategoryForm.name} sub-type`,
      status: 'ACTIVE'
    });
    setSubCategories(storage.getSubCategories());
    setIsSubCategoryModalOpen(false);
    setSubCategoryForm({
      categoryId: '',
      name: '',
      description: ''
    });
    setRefreshNotification(`✓ Sub-Category "${newSub.name}" created and linked to ${parent?.name}!`);
    setTimeout(() => setRefreshNotification(null), 4000);
  };

  const handleToggleSubCategoryStatus = (id: string) => {
    const sub = subCategories.find(s => s.id === id);
    if (!sub) return;
    const newStatus = sub.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    storage.updateSubCategory(id, { status: newStatus });
    setSubCategories(storage.getSubCategories());
  };

  const handleDeleteSubCategory = (id: string) => {
    const sub = subCategories.find(s => s.id === id);
    if (confirm(`Delete sub-category "${sub?.name}"?`)) {
      storage.deleteSubCategory(id);
      setSubCategories(storage.getSubCategories());
    }
  };

  // Brand Actions
  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      alert('Kripya Brand Name enter karein!');
      return;
    }
    const slug = brandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBrand = storage.addBrand({
      name: brandForm.name.trim(),
      slug,
      logoUrl: brandForm.logoUrl.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
      origin: brandForm.origin.trim() || 'India',
      website: brandForm.website.trim(),
      categories: brandForm.categories.length > 0 ? brandForm.categories : ['Electric Vehicles'],
      isVerified: true,
      warrantyPeriod: brandForm.warrantyPeriod.trim() || '3 Years Comprehensive',
      modelCount: 1,
      status: 'ACTIVE'
    });
    setBrands(storage.getBrands());
    setIsBrandModalOpen(false);
    setBrandForm({
      name: '',
      logoUrl: '',
      origin: 'Bengaluru, India',
      website: '',
      categories: ['Electric Scooters'],
      warrantyPeriod: '3 Years / 30,000 km'
    });
    setRefreshNotification(`✓ OEM Brand "${newBrand.name}" registered and published live to frontend!`);
    setTimeout(() => setRefreshNotification(null), 4000);
  };

  const handleToggleBrandStatus = (id: string) => {
    const b = brands.find(brand => brand.id === id);
    if (!b) return;
    const newStatus = b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    storage.updateBrand(id, { status: newStatus });
    setBrands(storage.getBrands());
    setRefreshNotification(`✓ Brand "${b.name}" status updated to ${newStatus}!`);
    setTimeout(() => setRefreshNotification(null), 3000);
  };

  const handleDeleteBrand = (id: string) => {
    const b = brands.find(brand => brand.id === id);
    if (confirm(`Delete OEM Brand "${b?.name}"?`)) {
      storage.deleteBrand(id);
      setBrands(storage.getBrands());
      setRefreshNotification(`✓ Brand removed!`);
      setTimeout(() => setRefreshNotification(null), 3000);
    }
  };

  const loadAllData = () => {
    setRegisteredCustomers(storage.getRegisteredUsers());
    setVehicleOrders(storage.getVehicleOrders());
    setTestDrives(storage.getTestDrives());
    setQuotations(storage.getQuotations());
    setServices(storage.getServiceBookings());
    setPartsOrders(storage.getSparePartsOrders());
    setTickets(storage.getSupportTickets());
    setCategories(storage.getCategories());
    setSubCategories(storage.getSubCategories());
    setBrands(storage.getBrands());
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshNotification(null);
    loadAllData();
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotification('✓ Live Admin Database successfully reloaded from system storage!');
      setTimeout(() => {
        setRefreshNotification(null);
      }, 3500);
    }, 600);
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllData();
    }
  }, [isAdminAuthenticated]);

  const handleSendAdminOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = adminPhone.trim();
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      setAdminError('Kripya 10-digit valid Indian mobile number enter karein');
      return;
    }
    // Check if phone number is authorized for admin access
    if (!storage.isAuthorizedAdminPhone(cleanPhone)) {
      setAdminError('❌ Ye mobile number Admin access ke liye registered nahi hai. Kripya authorized admin mobile number enter karein.');
      return;
    }
    setAdminError('');
    setAdminStep('OTP');
    const generatedOtp = '849201';
    setAdminOtp(generatedOtp);
    setIsOtpAutoFilled(true);
  };

  const handleVerifyAdminOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = adminOtp.trim();
    if (enteredOtp.length !== 6) {
      setAdminError('Kripya 6-digit verification OTP code dalein');
      return;
    }
    // Master Admin OTP code verification (standard authorized code 849201 or 123456)
    if (enteredOtp !== '849201' && enteredOtp !== '123456') {
      setAdminError('❌ Galat OTP code. Kripya sahi 6-digit OTP code enter karein.');
      return;
    }
    setAdminLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('evahan_admin_auth', 'true');
      localStorage.setItem('evahan_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setAdminLoading(false);
    }, 350);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('evahan_admin_auth');
    localStorage.removeItem('evahan_admin_auth');
    setIsAdminAuthenticated(false);
    setAdminStep('PHONE');
    setAdminPhone('');
    setAdminOtp('');
    setIsOtpAutoFilled(false);
    setAdminError('');
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    storage.updateVehicleOrderStatus(orderId, status);
    loadAllData();
  };

  const handleUpdatePartsOrderStatus = (orderId: string, status: any) => {
    storage.updateSparePartsOrderStatus(orderId, status);
    loadAllData();
  };

  const handleUpdateTestDriveStatus = (bookingId: string, status: any) => {
    storage.updateTestDriveStatus(bookingId, status);
    loadAllData();
  };

  const handleUpdateServiceApproval = (bookingId: string, approve: boolean) => {
    storage.updateServiceApproval(bookingId, approve);
    loadAllData();
  };

  const handleReplyTicket = (ticketId: string) => {
    const text = replyText[ticketId];
    if (text && text.trim()) {
      storage.replySupportTicket(ticketId, text.trim());
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
      loadAllData();
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncementText.trim()) {
      setAnnouncements(prev => [newAnnouncementText.trim(), ...prev]);
      setNewAnnouncementText('');
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements(prev => prev.filter((_, i) => i !== index));
  };

  // Filter registered customers based on search query
  const filteredCustomers = registeredCustomers.filter(c => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase();
    return (
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  // If Admin is NOT authenticated, present the secure Registered Mobile Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#F0F4F8] min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-xl border border-gray-200/90 relative">
          
          {/* Brand Logo with stylish non-white dark badge */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="header" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Administrative Gateway</span>
            </div>
            <h2 className="text-2xl font-black text-[#06152B] tracking-tight">
              Admin Portal Login
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Authorized admin access only. Enter your registered mobile number and verification OTP to access operations.
            </p>
          </div>

          {adminStep === 'PHONE' ? (
            <form onSubmit={handleSendAdminOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Registered Admin Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs font-bold text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={adminPhone}
                    onChange={(e) => {
                      setAdminPhone(e.target.value.replace(/\D/g, ''));
                      if (adminError) setAdminError('');
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#06152B] via-[#0B2545] to-[#081E3B] hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Send Admin OTP</span>
                <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
              </button>

              <div className="pt-2 text-center">
                <Link to="/" className="text-xs text-gray-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
                  ← Return to Customer Storefront
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAdminOtp} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span>Registered Admin: +91 {adminPhone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminStep('PHONE');
                      setAdminError('');
                      setAdminOtp('');
                      setIsOtpAutoFilled(false);
                    }}
                    className="text-[#16A34A] hover:underline text-[11px] font-bold"
                  >
                    Change
                  </button>
                </div>
                {isOtpAutoFilled && (
                  <p className="text-[11px] text-emerald-800 flex items-center gap-1.5 pt-0.5 font-medium bg-emerald-100/70 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>OTP auto-detected and filled automatically: <strong className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">849201</strong></span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  6-Digit Admin Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="8 4 9 2 0 1"
                  value={adminOtp}
                  onChange={(e) => {
                    setAdminOtp(e.target.value.replace(/\D/g, ''));
                    if (adminError) setAdminError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-400 bg-emerald-50/30 text-center tracking-[0.3em] font-mono text-xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {adminLoading ? (
                  <span>Verifying Admin Authorization...</span>
                ) : (
                  <>
                    <span>Verify OTP & Open Admin Dashboard</span>
                    <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAdminStep('PHONE');
                    setAdminError('');
                    setAdminOtp('');
                  }}
                  className="text-xs text-gray-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                >
                  ← Back to mobile number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Secured Admin Gateway • E-VAHAN Operations</span>
          </div>
        </div>
      </div>
    );
  }

  const currentFormattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const breadcrumb = getTabBreadcrumb();

  return (
    <div className="min-h-screen flex bg-[#F0F4F8] text-[#17211B] antialiased">
      {/* DESKTOP STICKY SIDEBAR (Full height from top to bottom matching user's photos) */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 bg-[#0B1E36] text-white border-r border-[#183556] h-screen sticky top-0 shrink-0 z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-[#183556] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 text-[#B7F34A]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">E-VAHAN</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ADMIN DASHBOARD</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-300">Live</span>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 custom-scrollbar">
          {renderSidebarNav()}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3.5 border-t border-[#183556] space-y-2 shrink-0 bg-[#08172B]">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-[#132A46] hover:bg-[#183556] border border-emerald-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">Sync</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#132A46] transition-all"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Customer Storefront</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">Live</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer with Dark Navy Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0B1E36] text-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto p-4 border-r border-[#183556]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#183556] mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#B7F34A]" />
                  <span className="text-sm font-black text-white">E-VAHAN ADMIN</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-[#183556] hover:bg-[#1E436D] text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarNav()}
            </div>
            <div className="pt-4 border-t border-[#183556] mt-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#132A46] text-white"
              >
                <span>Customer Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT CONTENT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Sticky Admin Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium hidden sm:inline">{breadcrumb.group}</span>
              <span className="text-gray-300 hidden sm:inline">/</span>
              <span className="font-bold text-[#06152B] bg-gray-100 px-2.5 py-1 rounded-lg">
                {breadcrumb.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Live Platform Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-800">24+ Cities Live</span>
            </div>

            {/* Live Date Badge (matching photo 4) */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentFormattedDate}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              title="Sync Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#16A34A] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Storefront Link */}
            <Link
              to="/"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Open Storefront in new tab"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B7F34A]" />
            </Link>
          </div>
        </header>

        {/* Mobile Horizontal Quick-Category Switcher Bar (lg:hidden) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto p-3 bg-white border-b border-gray-200 scrollbar-none">
          {[
            { id: 'overview' as AdminTab, label: 'Dashboard' },
            { id: 'services' as AdminTab, label: `Service Vans (${services.length})` },
            { id: 'vendor-list' as AdminTab, label: `Vendors (${spareVendors.length})` },
            { id: 'shop-list' as AdminTab, label: `Showrooms (${shopkeepers.length})` },
            { id: 'categories' as AdminTab, label: `Categories (${categories.length})` },
            { id: 'brands' as AdminTab, label: `Brands (${brands.length})` },
            { id: 'customers' as AdminTab, label: `Customers (${registeredCustomers.length})` },
            { id: 'orders' as AdminTab, label: `Orders (${vehicleOrders.length})` },
            { id: 'parts' as AdminTab, label: `Parts (${partsOrders.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN SCROLLABLE CONTENT WRAPPER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto min-w-0">
          {/* Refresh Notification Banner */}
          {refreshNotification && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>{refreshNotification}</span>
              </div>
              <button
                onClick={() => setRefreshNotification(null)}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-2 py-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* Attention & Live Greeting Alert Banner (Matching Photo 4!) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 font-bold">Live Admin Console</span>
                <span>•</span>
                <span>{currentFormattedDate}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#06152B] tracking-tight">
                Good {timeGreeting}, Administrator 👋
              </h1>
              <p className="text-xs text-gray-500">
                Multi-vendor EV marketplace management: live service vans, certified vendors, showroom dealers & master catalog.
              </p>
            </div>

            {/* Quick Attention Indicators (matching photo 4) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-[10px] uppercase text-amber-700 block font-bold">Attention:</span>
                  <span>0 Pending Assignments</span>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#16A34A]" />
                <div>
                  <span className="text-[10px] uppercase text-emerald-700 block font-bold">Live Active:</span>
                  <span>{services.length} Service Vans</span>
                </div>
              </div>
            </div>
          </div>
            
            {/* Top 7 KPI Metric Cards (Responsive Grid inside Main Area) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2.5 sm:gap-3">
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'customers' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
                }`}
                onClick={() => setActiveTab('customers')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Customers
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{registeredCustomers.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Vehicle Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{vehicleOrders.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'test-drives' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-blue-300'
                }`}
                onClick={() => setActiveTab('test-drives')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Test Drives
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{testDrives.length}</strong>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Active</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'quotations' ? 'bg-purple-50 border-purple-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-purple-300'
                }`}
                onClick={() => setActiveTab('quotations')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Fleet Quotes
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{quotations.length}</strong>
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded">Issued</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'services' ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-amber-300'
                }`}
                onClick={() => setActiveTab('services')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Doorstep Vans
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{services.length}</strong>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Vans</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'parts' ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-emerald-300'
                }`}
                onClick={() => setActiveTab('parts')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Parts Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{partsOrders.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">OEM</span>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'tickets' ? 'bg-rose-50 border-rose-400 shadow-sm' : 'bg-white border-gray-200 shadow-subtle hover:border-rose-300'
                }`}
                onClick={() => setActiveTab('tickets')}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Support Desk
                </span>
                <div className="flex items-baseline justify-between">
                  <strong className="text-lg sm:text-xl font-black text-[#06152B]">{tickets.length}</strong>
                  <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Desk</span>
                </div>
              </div>
            </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Vehicle Orders */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                    <span>Recent Customer Vehicle Bookings</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {vehicleOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No vehicle orders yet.</p>
                  ) : (
                    vehicleOrders.slice(0, 4).map(o => (
                      <div key={o.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">{o.vehicleName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {o.orderNumber} • ₹{(o.bookingAmountPaid || 0).toLocaleString('en-IN')} ({o.deliveryAddress?.fullName || 'Customer'})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Test Drive Bookings */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Upcoming Doorstep Test Drives</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('test-drives')}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {testDrives.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No test drives scheduled yet.</p>
                  ) : (
                    testDrives.slice(0, 4).map(td => (
                      <div key={td.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-gray-900 block">{td.vehicleName}</strong>
                          <span className="text-[11px] text-gray-500">
                            {td.customerName} • {td.preferredDate} ({td.timeSlot}) • {td.city}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                          {td.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Recent Registered Customers Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#16A34A]" />
                  <span>Recent Registered Customer Profiles</span>
                </h3>
                <button
                  onClick={() => setActiveTab('customers')}
                  className="text-xs font-bold text-[#16A34A] hover:underline"
                >
                  Manage All Customers ({registeredCustomers.length}) →
                </button>
              </div>

              {registeredCustomers.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    No customers have registered yet. Real customer profiles will appear here as soon as they sign up on the marketplace.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {registeredCustomers.slice(0, 6).map(cust => (
                    <div key={cust.id || cust.phone} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <strong className="text-xs font-bold text-gray-900 block">{cust.fullName}</strong>
                        <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#16A34A]" />
                          <span>+91 {cust.phone}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">{cust.city} {cust.pincode ? `(${cust.pincode})` : ''}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        cust.isKycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cust.isKycVerified ? 'KYC Verified' : 'Pending KYC'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Registered Customers (Live real user database) */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#16A34A]" />
                  <span>Registered Customers Database ({registeredCustomers.length})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Live profiles of customers who have registered on the E-VAHAN marketplace. Real customer details flow directly here.
                </p>
              </div>

              {/* Customer Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 space-y-3">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">
                  {registeredCustomers.length === 0 ? 'No Registered Customers Yet' : 'No Matching Customers Found'}
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {registeredCustomers.length === 0
                    ? 'When customers register with their phone number and details on the website, their profiles, contact information, and delivery addresses will appear here in real-time.'
                    : `No registered customer matched "${customerSearch}". Try searching with a different name, phone number, or city.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">Customer Profile</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">Registered Location</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Saved Delivery Addresses</th>
                      <th className="p-3">Marketplace Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((cust) => {
                      const custOrders = vehicleOrders.filter(o => o.deliveryAddress?.phone === cust.phone || o.userId === cust.id);
                      const custParts = partsOrders.filter(p => p.deliveryAddress?.phone === cust.phone || p.userId === cust.id);
                      const custTestDrives = testDrives.filter(td => td.customerPhone === cust.phone || td.userId === cust.id);

                      return (
                        <tr key={cust.id || cust.phone} className="hover:bg-gray-50/70">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06152B] to-[#16A34A] text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                {cust.fullName?.slice(0, 2) || 'CU'}
                              </div>
                              <div>
                                <strong className="text-xs font-bold text-gray-900 block">{cust.fullName}</strong>
                                <span className="text-[10px] text-gray-400 font-mono">ID: {cust.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <div className="font-mono font-bold text-gray-900 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-[#16A34A]" />
                                <span>+91 {cust.phone}</span>
                              </div>
                              {cust.email && (
                                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  <span>{cust.email}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                              <span>{cust.city || 'Not specified'} {cust.pincode ? `(${cust.pincode})` : ''}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {cust.isKycVerified ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> KYC Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Pending KYC
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {cust.savedAddresses && cust.savedAddresses.length > 0 ? (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                  {cust.savedAddresses.length} Address{cust.savedAddresses.length > 1 ? 'es' : ''}
                                </span>
                                <p className="text-[11px] text-gray-500 max-w-xs truncate">
                                  {cust.savedAddresses[0].line1}, {cust.savedAddresses[0].city}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">No addresses saved</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 text-[10px]">
                              {custOrders.length > 0 && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                  {custOrders.length} Vehicle Order{custOrders.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custParts.length > 0 && (
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                                  {custParts.length} Parts Order{custParts.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custTestDrives.length > 0 && (
                                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                                  {custTestDrives.length} Test Drive{custTestDrives.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {custOrders.length === 0 && custParts.length === 0 && custTestDrives.length === 0 && (
                                <span className="text-gray-400">Account Active</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Vehicle Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">All Customer Vehicle Purchases & Token Bookings</h2>
                <p className="text-xs text-gray-500">Live vehicle orders with full customer contact, booking tokens, and delivery status.</p>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl w-max">
                Total Orders: {vehicleOrders.length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer & Contact</th>
                    <th className="p-3">Vehicle & Variant</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Booking Amount</th>
                    <th className="p-3">Total On-Road</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vehicleOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-[#06152B]">
                        <button
                          onClick={() => handleCopyReference(o.orderNumber)}
                          className="hover:text-emerald-600 inline-flex items-center gap-1.5 text-xs group"
                          title="Click to copy Order Reference Number"
                        >
                          <span>{o.orderNumber}</span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-gray-500">
                            {copiedRef === o.orderNumber ? '✓ Copied' : '📋 Copy'}
                          </span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">
                            {o.deliveryAddress?.fullName || 'Customer'}
                          </strong>
                          <div className="text-[11px] text-gray-600 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#16A34A]" />
                            <span>+91 {o.deliveryAddress?.phone || '-'}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {o.deliveryAddress?.city}{o.deliveryAddress?.pincode ? ` (${o.deliveryAddress.pincode})` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{o.vehicleName} ({o.colorName})</td>
                      <td className="p-3 font-medium text-gray-600">{o.paymentMode}</td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(o.bookingAmountPaid || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-semibold text-gray-900">₹{(o.totalOnRoad || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="BOOKING_CONFIRMED">BOOKING CONFIRMED</option>
                          <option value="DOCUMENTS_PENDING">DOCUMENTS PENDING</option>
                          <option value="KYC_VERIFIED">KYC VERIFIED</option>
                          <option value="ALLOCATED_TO_DEALERSHIP">ALLOCATED TO DEALERSHIP</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Spare Parts Orders */}
        {activeTab === 'parts' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Genuine OEM Spare Parts Orders & Dispatch</h2>
                <p className="text-xs text-gray-500">Live spare parts orders, customer delivery locations, courier tracking, and fulfillment updates.</p>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl w-max">
                Total Orders: {partsOrders.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer & Contact</th>
                    <th className="p-3">Parts Purchased</th>
                    <th className="p-3">Delivery Address</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {partsOrders.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-emerald-800">
                        <button
                          onClick={() => handleCopyReference(p.orderNumber)}
                          className="hover:text-emerald-600 inline-flex items-center gap-1.5 text-xs group"
                          title="Click to copy Parts Order Reference Number"
                        >
                          <span>{p.orderNumber}</span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-gray-500">
                            {copiedRef === p.orderNumber ? '✓ Copied' : '📋'}
                          </span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">{p.deliveryAddress?.fullName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">+91 {p.deliveryAddress?.phone}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {p.items.map((item, idx) => (
                            <div key={idx} className="text-[11px]">
                              <span className="font-bold text-gray-800">{item.name}</span>
                              <span className="text-gray-400 ml-1">× {item.quantity} (SKU: {item.sku})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-[11px] text-gray-700 max-w-xs">
                          {p.deliveryAddress?.line1}, {p.deliveryAddress?.city} - {p.deliveryAddress?.pincode}
                        </p>
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {p.deliverySpeed} DELIVERY
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(p.grandTotal || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdatePartsOrderStatus(p.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="IN_TRANSIT">IN TRANSIT</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Test Drives */}
        {activeTab === 'test-drives' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Doorstep Test Drive Schedule & Hub Dispatch</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Location & Pincode</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testDrives.map(td => (
                    <tr key={td.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold">
                        <button
                          onClick={() => handleCopyReference(td.bookingNumber || td.id)}
                          className="hover:text-blue-600 inline-flex items-center gap-1.5 text-xs group"
                          title="Click to copy Test Drive Booking Reference"
                        >
                          <span>{td.bookingNumber || td.id}</span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-blue-50 group-hover:text-blue-700 text-gray-500">
                            {copiedRef === (td.bookingNumber || td.id) ? '✓ Copied' : '📋'}
                          </span>
                        </button>
                      </td>
                      <td className="p-3 font-semibold text-gray-900">{td.customerName} (+91 {td.customerPhone})</td>
                      <td className="p-3 font-bold text-gray-800">{td.vehicleName}</td>
                      <td className="p-3">{td.preferredDate} ({td.timeSlot})</td>
                      <td className="p-3">{td.city} ({td.pincode})</td>
                      <td className="p-3 font-semibold text-gray-600">{td.testDriveMode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                          {td.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={td.status}
                          onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-[11px] bg-white font-medium focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="RESCHEDULE_REQUESTED">RESCHEDULE REQUESTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Quotations */}
        {activeTab === 'quotations' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Customer Quotation Inquiries & Commercial Fleet Dockets</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Docket Number</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Usage Type</th>
                    <th className="p-3">Units</th>
                    <th className="p-3">Net On-Road Estimate</th>
                    <th className="p-3">State Subsidy Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotations.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-purple-700">
                        <button
                          onClick={() => handleCopyReference(q.quotationNumber)}
                          className="hover:text-purple-900 inline-flex items-center gap-1.5 text-xs group"
                          title="Click to copy Quotation Docket Reference"
                        >
                          <span>{q.quotationNumber}</span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-purple-50 group-hover:text-purple-700 text-gray-500">
                            {copiedRef === q.quotationNumber ? '✓ Copied' : '📋'}
                          </span>
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-bold text-gray-900 block">{q.customerName}</strong>
                          <span className="text-[11px] text-gray-500 font-mono">+91 {q.customerPhone}</span>
                          {q.companyName && <span className="text-[10px] text-gray-400 block">{q.companyName}</span>}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{q.vehicleName}</td>
                      <td className="p-3">{q.usageType}</td>
                      <td className="p-3 font-bold">{q.quantity}</td>
                      <td className="p-3 font-bold text-[#16A34A]">₹{(q.estimatedGrandTotal || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-emerald-700 font-semibold">-₹{(q.estimatedSubsidyTotal || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Services */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-gray-900">Doorstep Mobile Service Vans & Customer Digital Approvals</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Service Type</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Customer Digital Approval</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold">
                        <button
                          onClick={() => handleCopyReference(s.bookingNumber || s.id)}
                          className="hover:text-emerald-700 inline-flex items-center gap-1.5 text-xs group"
                          title="Click to copy Service Booking Reference"
                        >
                          <span>{s.bookingNumber || s.id}</span>
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 group-hover:bg-amber-50 group-hover:text-amber-800 text-gray-500">
                            {copiedRef === (s.bookingNumber || s.id) ? '✓ Copied' : '📋'}
                          </span>
                        </button>
                      </td>
                      <td className="p-3">
                        <strong className="text-xs font-bold text-gray-900 block">{s.customerName}</strong>
                        <span className="text-[11px] text-gray-500 font-mono">+91 {s.customerPhone}</span>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{s.serviceCategoryName}</td>
                      <td className="p-3">{s.appointmentDate} ({s.appointmentSlot})</td>
                      <td className="p-3">{s.addressLine}, {s.city} ({s.pincode})</td>
                      <td className="p-3">
                        {s.isCustomerApproved ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1 w-max">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 font-bold text-[10px]">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Support Desk */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-gray-900">Customer Support Ticket Helpdesk</h2>
            
            <div className="space-y-4">
              {tickets.map(t => (
                <div key={t.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-700 mr-2">{t.ticketNumber}</span>
                      <strong className="text-sm font-bold text-gray-900">{t.subject}</strong>
                      <span className="ml-2 text-[10px] font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">
                        {t.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2 pt-2 border-t border-gray-200/80">
                    {t.messages.map(m => (
                      <div key={m.id} className={`p-3 rounded-xl text-xs ${m.sender === 'SUPPORT_AGENT' ? 'bg-purple-50 text-purple-900 border border-purple-100 ml-4' : 'bg-white border border-gray-200 mr-4'}`}>
                        <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-gray-500">
                          <span>{m.senderName}</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Type official executive reply to customer..."
                      value={replyText[t.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                    <button
                      onClick={() => handleReplyTicket(t.id)}
                      className="px-4 py-2 bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Announcement Bar Manager (Section 4.A) */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#16A34A]" />
                <span>Homepage Announcement Bar Management (Spec 4.A)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                As required by Section 4.A of the product specification, these announcement messages are directly editable from the administration panel.
              </p>
            </div>

            <form onSubmit={handleAddAnnouncement} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter new announcement message (e.g. Subsidy update, Festival discount)..."
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Message</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <strong className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                Active Live Messages:
              </strong>
              {announcements.map((msg, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#06152B] text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-gray-800">{msg}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Inventory Catalog */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Master Catalog: Electric Vehicles & Genuine Spare Parts</h2>
                <p className="text-xs text-gray-500">Live inventory specifications, pricing, battery ratings, and vehicle benchmarking.</p>
              </div>
              <Link
                to="/compare"
                target="_blank"
                className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#16A34A] border border-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                title="Open Vehicle Specification Comparison Benchmark"
              >
                <span>Vehicle Comparison Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicles */}
              <div className="space-y-3">
                <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Electric Vehicles ({VEHICLES_DATA.length})
                </strong>
                {VEHICLES_DATA.map(v => (
                  <div key={v.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={v.images[0]?.url} alt={v.name} className="w-10 h-10 object-cover rounded-xl bg-gray-200" />
                      <div>
                        <strong className="text-xs font-bold text-gray-900 block">{v.name}</strong>
                        <span className="text-[11px] text-gray-500">{v.brand} • ₹{v.exShowroomPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      IN STOCK
                    </span>
                  </div>
                ))}
              </div>

              {/* Spare Parts */}
              <div className="space-y-3">
                <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  OEM Genuine Spare Parts ({SPARE_PARTS_DATA.length})
                </strong>
                {SPARE_PARTS_DATA.map(p => (
                  <div key={p.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-gray-200" />
                      <div>
                        <strong className="text-xs font-bold text-gray-900 block">{p.name}</strong>
                        <span className="text-[11px] text-gray-500">SKU: {p.sku} • ₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md">
                      OEM VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* TAB: SERVICE MANAGEMENT - partner history */}
            {activeTab === 'service-history' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#16A34A]" />
                      <span>Service Partner Booking & Dispatch History</span>
                    </h2>
                    <p className="text-xs text-gray-500">Completed jobs, customer ratings, mobile technician allocations and job bills.</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                    Total Completed Jobs: {services.length + 42}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Job Reference</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Assigned Van / Mechanic</th>
                        <th className="p-3">Service Category</th>
                        <th className="p-3">Date & Slot</th>
                        <th className="p-3">Customer Rating</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {services.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/60">
                          <td className="p-3 font-mono font-bold text-gray-900">{s.bookingNumber || s.id}</td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{s.customerName}</strong>
                            <span className="text-gray-500 font-mono">+91 {s.customerPhone}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              DL-1EV-8899 (Santosh Kumar)
                            </span>
                          </td>
                          <td className="p-3 font-bold text-gray-800">{s.serviceCategoryName}</td>
                          <td className="p-3">{s.appointmentDate} ({s.appointmentSlot})</td>
                          <td className="p-3">
                            <span className="text-amber-600 font-bold">⭐ 4.9 / 5.0</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              COMPLETED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SERVICE MANAGEMENT - Service Categories & Rates */}
            {activeTab === 'service-categories' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-[#16A34A]" />
                      <span>Service Categories & Official Rate Cards</span>
                    </h2>
                    <p className="text-xs text-gray-500">Certified doorstep maintenance packages, diagnostic tariffs, and SLA durations.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    Standardized Pan-India Pricing
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceRates.map(rate => (
                    <div key={rate.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {rate.category}
                          </span>
                          <h3 className="text-sm font-black text-gray-900 mt-1">{rate.title}</h3>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-400" /> {rate.duration}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-gray-900 block">₹{rate.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-gray-400">incl. GST</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200/60 space-y-1">
                        {rate.features.map((feat, idx) => (
                          <div key={idx} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#16A34A] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Live on Customer Booking Flow</span>
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Enter new price for ${rate.title}:`, rate.price.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              handleUpdateServiceRate(rate.id, Number(newPrice));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all"
                        >
                          Edit Rate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SERVICE MANAGEMENT - Customer Digital Approvals */}
            {activeTab === 'service-approvals' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#16A34A]" />
                    <span>Customer Digital Approvals & Work Order Queue</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Real-time customer authorization for additional replacement parts, battery pack balancing, and controller servicing.
                  </p>
                </div>

                <div className="space-y-4">
                  {services.filter(s => s.additionalApprovalQuote).length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200 space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                      <h4 className="text-sm font-bold text-gray-800">All Work Orders Approved</h4>
                      <p className="text-xs text-gray-500">Currently no service bookings have pending additional customer approvals.</p>
                    </div>
                  ) : (
                    services.filter(s => s.additionalApprovalQuote).map(s => (
                      <div key={s.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-xs text-[#06152B]">Booking #{s.bookingNumber || s.id}</span>
                            <h4 className="text-sm font-black text-gray-900">{s.customerName} • +91 {s.customerPhone}</h4>
                            <p className="text-xs text-gray-500">{s.serviceCategoryName} • {s.city}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                            s.additionalApprovalQuote?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            s.additionalApprovalQuote?.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {s.additionalApprovalQuote?.status}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                          <strong className="block text-gray-800 font-bold">Technician Diagnosis:</strong>
                          <p className="text-gray-600">{s.additionalApprovalQuote?.title} - {s.additionalApprovalQuote?.notes}</p>
                          <span className="text-xs font-black text-[#16A34A] block mt-1">
                            Additional Amount: ₹{s.additionalApprovalQuote?.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateServiceApproval(s.id, true)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Mark Customer Approved
                          </button>
                          <button
                            onClick={() => handleUpdateServiceApproval(s.id, false)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
                          >
                            Mark Customer Declined
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: SERVICE PROVIDER MANAGEMENT - partner history */}
            {activeTab === 'sp-history' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#16A34A]" />
                    <span>Service Provider Performance & Job Logs</span>
                  </h2>
                  <p className="text-xs text-gray-500">Historical logs of technician jobs, ratings, on-time arrivals, and field resolutions.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Technician</th>
                        <th className="p-3">Van Number</th>
                        <th className="p-3">Jobs Done</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Joined Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {serviceProviders.map(sp => (
                        <tr key={sp.id} className="hover:bg-gray-50/60">
                          <td className="p-3 font-bold text-gray-900">{sp.name}</td>
                          <td className="p-3 font-mono font-bold text-gray-800">{sp.vanNumber}</td>
                          <td className="p-3 font-bold text-gray-900">{sp.completedJobs} jobs</td>
                          <td className="p-3 font-bold text-amber-600">⭐ {sp.rating}</td>
                          <td className="p-3 text-gray-500">{sp.joinedDate}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {sp.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SERVICE PROVIDER MANAGEMENT - Service Provider onboarding */}
            {activeTab === 'sp-onboarding' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#16A34A]" />
                    <span>Service Provider Onboarding & Van Authorization</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Register a new certified EV technician, allocate a mobile service van, and authorize doorstep work orders.
                  </p>
                </div>

                <form onSubmit={handleRegisterServiceProvider} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Technician Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Santosh Kumar"
                        value={spForm.name}
                        onChange={e => setSpForm({ ...spForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (+91) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={spForm.phone}
                        onChange={e => setSpForm({ ...spForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Mobile Van Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DL-1EV-8899"
                        value={spForm.vanNumber}
                        onChange={e => setSpForm({ ...spForm, vanNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Operational City Hub *</label>
                      <select
                        value={spForm.city}
                        onChange={e => setSpForm({ ...spForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      >
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Specialization & Certifications *</label>
                    <select
                      value={spForm.specialization}
                      onChange={e => setSpForm({ ...spForm, specialization: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                    >
                      <option value="Battery Diagnostics & Controller Repair">Battery Diagnostics & Controller Repair</option>
                      <option value="Doorstep Periodic Maintenance & Brake Servicing">Doorstep Periodic Maintenance & Brake Servicing</option>
                      <option value="Motor & Electrical Diagnostic Calibration">Motor & Electrical Diagnostic Calibration</option>
                      <option value="Brake & Suspension Overhaul Specialist">Brake & Suspension Overhaul Specialist</option>
                      <option value="Emergency Roadside EV Assistance">Emergency Roadside EV Assistance</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Register Service Provider & Issue Van Pass</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: SERVICE PROVIDER MANAGEMENT - Service Provider List */}
            {activeTab === 'sp-list' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[#16A34A]" />
                      <span>Certified Service Providers & Mobile Fleet Directory ({serviceProviders.length})</span>
                    </h2>
                    <p className="text-xs text-gray-500">Live status, van allocations, completed work orders, and direct dispatch controls.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('sp-onboarding')}
                    className="px-3.5 py-2 rounded-xl bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Onboard New Partner</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Technician Details</th>
                        <th className="p-3">Assigned Van</th>
                        <th className="p-3">Operational Hub</th>
                        <th className="p-3">Specialization</th>
                        <th className="p-3">Jobs & Rating</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {serviceProviders.map(sp => (
                        <tr key={sp.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{sp.name}</strong>
                            <a href={`tel:+91${sp.phone}`} className="text-[11px] text-emerald-700 font-mono hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" /> +91 {sp.phone}
                            </a>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                              {sp.vanNumber}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-gray-800">{sp.city}</td>
                          <td className="p-3 text-gray-600 max-w-xs">{sp.specialization}</td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{sp.completedJobs} jobs</strong>
                            <span className="text-amber-600 font-bold text-[11px]">⭐ {sp.rating}</span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleSpStatus(sp.id)}
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all cursor-pointer ${
                                sp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                                sp.status === 'ON_JOB' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title="Click to toggle partner status"
                            >
                              {sp.status.replace('_', ' ')}
                            </button>
                          </td>
                          <td className="p-3">
                            <a
                              href={`tel:+91${sp.phone}`}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" /> Call
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SERVICE PROVIDER MANAGEMENT - Service Provider Payout */}
            {activeTab === 'sp-payout' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#16A34A]" />
                      <span>Service Provider Payout & Commission Disbursement</span>
                    </h2>
                    <p className="text-xs text-gray-500">Weekly job earnings, 85% technician revenue share, and live instant bank payouts.</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Platform Split: 85% Partner / 15% Platform
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Service Partner</th>
                        <th className="p-3">Van Reg</th>
                        <th className="p-3">Jobs Completed</th>
                        <th className="p-3">Total Earned</th>
                        <th className="p-3">Pending Payout</th>
                        <th className="p-3">Disbursement Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {serviceProviders.map(sp => (
                        <tr key={sp.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{sp.name}</strong>
                            <span className="text-[11px] text-gray-500 font-mono">+91 {sp.phone}</span>
                          </td>
                          <td className="p-3 font-mono font-bold">{sp.vanNumber}</td>
                          <td className="p-3 font-bold text-gray-900">{sp.completedJobs} jobs</td>
                          <td className="p-3 font-bold text-gray-900">₹{sp.totalEarnings.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`font-mono font-black ${sp.pendingPayout > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                              ₹{sp.pendingPayout.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="p-3">
                            {sp.pendingPayout > 0 ? (
                              <button
                                onClick={() => handleDisburseSpPayout(sp.id)}
                                className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs"
                              >
                                Disburse Payout (₹{sp.pendingPayout.toLocaleString('en-IN')})
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">✓ Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SPARE VENDOR MANAGEMENT - Spare vendor history */}
            {activeTab === 'vendor-history' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-[#16A34A]" />
                    <span>Spare Vendor Fulfillment & Dispatch History</span>
                  </h2>
                  <p className="text-xs text-gray-500">OEM parts dispatch batches, warehouse consignments, and SLA compliance metrics.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Batch Consignment</th>
                        <th className="p-3">OEM Supplier</th>
                        <th className="p-3">Warehouse Hub</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Dispatched Units</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {spareVendors.map((v, i) => (
                        <tr key={v.id} className="hover:bg-gray-50/60">
                          <td className="p-3 font-mono font-bold text-gray-900">CSG-2026-0{i + 1}88</td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{v.companyName}</strong>
                            <span className="text-gray-500 text-[11px]">{v.contactPerson}</span>
                          </td>
                          <td className="p-3 text-gray-700">{v.location}</td>
                          <td className="p-3 font-medium text-gray-800">{v.categories}</td>
                          <td className="p-3 font-bold text-gray-900">{v.fulfilledOrders} units</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              DELIVERED & VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SPARE VENDOR MANAGEMENT - Spare vendor onboarding */}
            {activeTab === 'vendor-onboarding' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-[#16A34A]" />
                    <span>Spare Parts Vendor & OEM Supplier Onboarding</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Onboard certified OEM parts distributors, battery module suppliers, and tier-1 component partners.
                  </p>
                </div>

                <form onSubmit={handleRegisterSpareVendor} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Company / OEM Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CEAT EV Speciality Tyres"
                        value={vendorForm.companyName}
                        onChange={e => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Authorized Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Rao"
                        value={vendorForm.contactPerson}
                        onChange={e => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Business Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={vendorForm.phone}
                        onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Business Email</label>
                      <input
                        type="email"
                        placeholder="orders@oem-partner.com"
                        value={vendorForm.email}
                        onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Warehouse / Supply Hub Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peenya Industrial Area, Bengaluru"
                      value={vendorForm.location}
                      onChange={e => setVendorForm({ ...vendorForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parts Category Supplied *</label>
                    <select
                      value={vendorForm.categories}
                      onChange={e => setVendorForm({ ...vendorForm, categories: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                    >
                      <option value="LFP Battery Modules & Smart Controllers">LFP Battery Modules & Smart Controllers</option>
                      <option value="Ceramic Brakes, Motors & Electronic Sensors">Ceramic Brakes, Motors & Electronic Sensors</option>
                      <option value="Low Rolling Resistance Tubeless EV Tyres">Low Rolling Resistance Tubeless EV Tyres</option>
                      <option value="Fast Chargers, Smart Cables & BMS Wiring Kits">Fast Chargers, Smart Cables & BMS Wiring Kits</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Register & Verify OEM Vendor</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: SPARE VENDOR MANAGEMENT - Spare vendor List */}
            {activeTab === 'vendor-list' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Box className="w-5 h-5 text-[#16A34A]" />
                      <span>Approved Spare Part Vendors & Distributors ({spareVendors.length})</span>
                    </h2>
                    <p className="text-xs text-gray-500">Tier-1 OEM vendors, verified supply warehouses, SKU catalogs, and fulfillment SLA.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('vendor-onboarding')}
                    className="px-3.5 py-2 rounded-xl bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Onboard OEM Vendor</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Vendor Name</th>
                        <th className="p-3">Contact Person</th>
                        <th className="p-3">Warehouse Hub</th>
                        <th className="p-3">Parts Category</th>
                        <th className="p-3">Active SKUs</th>
                        <th className="p-3">SLA Rating</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {spareVendors.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{v.companyName}</strong>
                            <span className="text-[11px] text-gray-500 font-mono">{v.email}</span>
                          </td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{v.contactPerson}</strong>
                            <a href={`tel:+91${v.phone}`} className="text-emerald-700 font-mono text-[11px] hover:underline">
                              +91 {v.phone}
                            </a>
                          </td>
                          <td className="p-3 text-gray-700">{v.location}</td>
                          <td className="p-3 font-medium text-gray-800">{v.categories}</td>
                          <td className="p-3 font-mono font-bold text-gray-900">{v.activeSkus} SKUs</td>
                          <td className="p-3">
                            <span className="text-amber-600 font-bold">⭐ {v.rating}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SPARE VENDOR MANAGEMENT - Spare vendor Payout */}
            {activeTab === 'vendor-payout' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#16A34A]" />
                      <span>Spare Vendor Settlements & Consignment Ledger</span>
                    </h2>
                    <p className="text-xs text-gray-500">OEM procurement settlements, parts GMV disbursement, and NEFT/RTGS transaction records.</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Net Settlement Cycle: 7 Days
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">OEM Vendor</th>
                        <th className="p-3">Dispatched Units</th>
                        <th className="p-3">Total Settled</th>
                        <th className="p-3">Pending Settlement</th>
                        <th className="p-3">Settlement Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {spareVendors.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{v.companyName}</strong>
                            <span className="text-[11px] text-gray-500 font-mono">{v.location}</span>
                          </td>
                          <td className="p-3 font-bold text-gray-900">{v.fulfilledOrders} parts</td>
                          <td className="p-3 font-bold text-gray-900">₹{v.totalDisbursed.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`font-mono font-black ${v.pendingPayout > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                              ₹{v.pendingPayout.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="p-3">
                            {v.pendingPayout > 0 ? (
                              <button
                                onClick={() => handleDisburseVendorPayout(v.id)}
                                className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs"
                              >
                                Process NEFT Settlement (₹{v.pendingPayout.toLocaleString('en-IN')})
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">✓ Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MARKETPLACE MANAGEMENT - Shopkeeper Onboarding */}
            {activeTab === 'shop-onboarding' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#16A34A]" />
                    <span>Authorized EV Dealership & Showroom Partner Onboarding</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Onboard authorized multi-brand EV dealerships, commercial showrooms, and test drive partner locations.
                  </p>
                </div>

                <form onSubmit={handleRegisterShopkeeper} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Showroom / Hub Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GreenWheel EV Hub Delhi"
                        value={shopForm.shopName}
                        onChange={e => setShopForm({ ...shopForm, shopName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Dealer Principal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramanuj Joshi"
                        value={shopForm.ownerName}
                        onChange={e => setShopForm({ ...shopForm, ownerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Contact Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={shopForm.phone}
                        onChange={e => setShopForm({ ...shopForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">City Hub *</label>
                      <select
                        value={shopForm.city}
                        onChange={e => setShopForm({ ...shopForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      >
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Noida (NCR)">Noida (NCR)</option>
                        <option value="Bhopal">Bhopal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Showroom Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Plot 42, Connaught Circus, Central Delhi"
                        value={shopForm.address}
                        onChange={e => setShopForm({ ...shopForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        placeholder="07AAACG1234F1Z5"
                        value={shopForm.gstNumber}
                        onChange={e => setShopForm({ ...shopForm, gstNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Onboard EV Dealership Partner</span>
                    <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: MARKETPLACE MANAGEMENT - Shopkeeper List */}
            {activeTab === 'shop-list' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Store className="w-5 h-5 text-[#16A34A]" />
                      <span>Authorized EV Dealerships & Showroom Partners ({shopkeepers.length})</span>
                    </h2>
                    <p className="text-xs text-gray-500">Showroom vehicle stock, unit sales volume, commission tiers, and dealer principal contacts.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('shop-onboarding')}
                    className="px-3.5 py-2 rounded-xl bg-[#06152B] hover:bg-[#0B2545] text-white text-xs font-bold transition-all flex items-center gap-1.5 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Onboard Showroom</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Dealership Hub</th>
                        <th className="p-3">Dealer Principal</th>
                        <th className="p-3">City & Address</th>
                        <th className="p-3">Floor Models</th>
                        <th className="p-3">Total Sold</th>
                        <th className="p-3">Commission Tier</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {shopkeepers.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{s.shopName}</strong>
                            <span className="text-[10px] text-gray-400 font-mono">GST: {s.gstNumber}</span>
                          </td>
                          <td className="p-3">
                            <strong className="block text-gray-900">{s.ownerName}</strong>
                            <a href={`tel:+91${s.phone}`} className="text-emerald-700 font-mono text-[11px] hover:underline">
                              +91 {s.phone}
                            </a>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-gray-900 block">{s.city}</span>
                            <span className="text-gray-500 text-[11px]">{s.address}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-gray-900">{s.inventoryCount} Models</td>
                          <td className="p-3 font-bold text-emerald-700">{s.totalSales} Units</td>
                          <td className="p-3 font-mono font-bold text-purple-700">{s.commissionRate}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MARKETPLACE MANAGEMENT - Shopkeeper Payout */}
            {activeTab === 'shop-payout' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#16A34A]" />
                      <span>Dealership Commission Settlements Ledger</span>
                    </h2>
                    <p className="text-xs text-gray-500">Showroom sales commissions, booking referral incentives, and payout settlements.</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Average Margin: 3.5% - 4.0%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Showroom Partner</th>
                        <th className="p-3">Delivered Units</th>
                        <th className="p-3">Total Disbursed</th>
                        <th className="p-3">Pending Commission</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {shopkeepers.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/60">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{s.shopName}</strong>
                            <span className="text-[11px] text-gray-500 font-mono">{s.city}</span>
                          </td>
                          <td className="p-3 font-bold text-gray-900">{s.totalSales} vehicles</td>
                          <td className="p-3 font-bold text-gray-900">₹{s.totalDisbursed.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`font-mono font-black ${s.pendingPayout > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                              ₹{s.pendingPayout.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="p-3">
                            {s.pendingPayout > 0 ? (
                              <button
                                onClick={() => handleDisburseShopkeeperPayout(s.id)}
                                className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs"
                              >
                                Disburse Commission (₹{s.pendingPayout.toLocaleString('en-IN')})
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">✓ Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* TAB: CATEGORY MANAGEMENT (Master Categories) */}
            {activeTab === 'categories' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Frontend Catalog Architecture</span>
                    </div>
                    <h2 className="text-xl font-black text-[#06152B]">
                      E-VAHAN Master Category Architecture ({categories.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Create, reorder, and publish main catalog categories shown live on Homepage "Shop by Category" and Header menus.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Create New Category</span>
                  </button>
                </div>

                {/* Categories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Category Name & Banner</th>
                        <th className="p-3">Subtitle / Tagline</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Sub-Categories</th>
                        <th className="p-3">Live Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categories.map((cat) => {
                        const subsCount = subCategories.filter(s => s.categoryId === cat.id).length;
                        return (
                          <tr key={cat.id} className="hover:bg-gray-50/70">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-12 h-10 object-cover rounded-xl bg-gray-100 border border-gray-200"
                                />
                                <div>
                                  <strong className="text-xs font-bold text-gray-900 block">{cat.name}</strong>
                                  <span className="text-[10px] text-gray-400 font-mono">slug: /{cat.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-gray-600 font-medium">{cat.subtitle}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                cat.type === 'VEHICLE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                cat.type === 'SPARE_PART' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {cat.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                                {subsCount} Sub-types
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleCategoryStatus(cat.id)}
                                className={`px-2.5 py-1 rounded-md font-bold text-[10px] cursor-pointer transition-all ${
                                  cat.status === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {cat.status === 'ACTIVE' ? '✓ LIVE ON FRONTEND' : 'HIDDEN'}
                              </button>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SUB-CATEGORY MANAGEMENT */}
            {activeTab === 'subcategories' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#06152B]">
                      Sub-Category Hierarchy & Filters ({subCategories.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Organize granular model types (e.g. High-Speed, Delivery Boxes, 72V LFP Batteries) under parent categories.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (categories.length > 0 && !subCategoryForm.categoryId) {
                        setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                      }
                      setIsSubCategoryModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Create Sub-Category</span>
                  </button>
                </div>

                {/* Filter by Parent Category */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Parent Category:</span>
                  <button
                    onClick={() => setSubCategoryFilterParent('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      subCategoryFilterParent === 'ALL'
                        ? 'bg-[#06152B] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Sub-Categories ({subCategories.length})
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSubCategoryFilterParent(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        subCategoryFilterParent === c.id
                          ? 'bg-[#16A34A] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Sub-Categories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Sub-Category Name</th>
                        <th className="p-3">Parent Category</th>
                        <th className="p-3">Slug</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subCategories
                        .filter(s => subCategoryFilterParent === 'ALL' || s.categoryId === subCategoryFilterParent)
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50/70">
                            <td className="p-3 font-bold text-gray-900">{sub.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                                {sub.categoryName}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-gray-500 text-[11px]">/{sub.slug}</td>
                            <td className="p-3 text-gray-600 max-w-xs">{sub.description}</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleSubCategoryStatus(sub.id)}
                                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  sub.status === 'ACTIVE'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {sub.status}
                              </button>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteSubCategory(sub.id)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: BRAND & OEM DIRECTORY */}
            {activeTab === 'brands' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200 mb-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certified Manufacturer Directory</span>
                    </div>
                    <h2 className="text-xl font-black text-[#06152B]">
                      Authorized OEM Brands & Technology Partners ({brands.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage official EV manufacturer profiles, warranty guarantees, and homepage brand showcase cards.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBrandModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max"
                  >
                    <Plus className="w-4 h-4 text-[#B7F34A]" />
                    <span>Register New OEM Brand</span>
                  </button>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brands.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-gray-50 border border-gray-200/90 flex flex-col justify-between space-y-3 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gray-200 overflow-hidden flex items-center justify-center">
                            <img src={b.logoUrl} alt={b.name} className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <button
                            onClick={() => handleToggleBrandStatus(b.id)}
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              b.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {b.status === 'ACTIVE' ? '✓ ACTIVE' : 'INACTIVE'}
                          </button>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-gray-900">{b.name}</h4>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Globe className="w-3 h-3 text-gray-400" /> {b.origin}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {b.categories.map((c, i) => (
                            <span key={i} className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-xs">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">Warranty SLA:</span>
                          <span className="font-bold text-[#16A34A]">{b.warrantyPeriod}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                        {b.website ? (
                          <a
                            href={b.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-gray-500 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <span />}

                        <button
                          onClick={() => handleDeleteBrand(b.id)}
                          className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODALS */}
            {/* 1. Create Category Modal */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="absolute right-5 top-5 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900">Create New E-VAHAN Category</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      This category will be immediately published to the live Homepage and Header catalog.
                    </p>
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Category Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Electric Motorcycles"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Tagline *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sports & Highway Cruisers"
                        value={categoryForm.subtitle}
                        onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Catalog Section Type *</label>
                        <select
                          value={categoryForm.type}
                          onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        >
                          <option value="VEHICLE">Electric Vehicles</option>
                          <option value="SPARE_PART">Genuine Spare Parts</option>
                          <option value="SERVICE">Doorstep Services</option>
                          <option value="ACCESSORY">EV Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={categoryForm.imageUrl}
                          onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description</label>
                      <textarea
                        rows={2}
                        placeholder="Describe the vehicle or parts segment for search engines and customers..."
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="featuredCat"
                        checked={categoryForm.isFeatured}
                        onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="featuredCat" className="text-xs font-bold text-gray-700 cursor-pointer">
                        Feature this Category on Homepage "Shop by Category" Grid
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Create Category & Publish Live</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 2. Create Sub-Category Modal */}
            {isSubCategoryModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative">
                  <button
                    onClick={() => setIsSubCategoryModalOpen(false)}
                    className="absolute right-5 top-5 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900">Add New Sub-Category</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Link a specific model type or component sub-division to an existing parent category.
                    </p>
                  </div>

                  <form onSubmit={handleCreateSubCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Select Parent Category *</label>
                      <select
                        required
                        value={subCategoryForm.categoryId}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold text-gray-900"
                      >
                        <option value="">-- Choose Category --</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Sub-Category Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Swappable Battery Commuters"
                        value={subCategoryForm.name}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dual battery compartments, AIS-156 safety certified"
                        value={subCategoryForm.description}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Add Sub-Category & Link</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 3. Create Brand Modal */}
            {isBrandModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setIsBrandModalOpen(false)}
                    className="absolute right-5 top-5 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900">Register OEM Brand Partner</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Register an electric vehicle manufacturer, component OEM, or battery partner for the live brand showcase.
                    </p>
                  </div>

                  <form onSubmit={handleCreateBrand} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hero Electric"
                          value={brandForm.name}
                          onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Origin City / Hub *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Gurugram, India"
                          value={brandForm.origin}
                          onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Brand Logo Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or brand logo URL"
                        value={brandForm.logoUrl}
                        onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Official Website</label>
                      <input
                        type="url"
                        placeholder="https://www.brand-website.com"
                        value={brandForm.website}
                        onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Warranty SLA Guarantee *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 3 Years / 40,000 km Warranty"
                        value={brandForm.warrantyPeriod}
                        onChange={(e) => setBrandForm({ ...brandForm, warrantyPeriod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4 text-[#B7F34A]" />
                      <span>Register Brand & Publish Live</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
