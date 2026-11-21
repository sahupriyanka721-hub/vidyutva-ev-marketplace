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
  FileCheck,
  Copy
} from 'lucide-react';
import { AdminCatalogLandingPage } from './AdminCatalogLandingPage';
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
  SupportTicketItem,
  VehicleItem
} from '../types';

export type AdminTab =
  | 'overview'
  | 'customers'
  | 'customer-kyc'
  | 'admin-users'
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
  | 'catalog-hub'
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
    'catalog-hub': false,
    'orders-management': false,
    'user-management': false,
    'support-communication': false
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

  // Announcement Bar message manager (Synced live across storefront & admin)
  const [announcements, setAnnouncements] = useState<string[]>(() => storage.getAnnouncements());
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Ticket reply state
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  // User Management Dedicated States
  const [authorizedAdminPhones, setAuthorizedAdminPhones] = useState<string[]>(() => storage.getAdminAuthorizedPhones());
  const [newAdminPhoneInput, setNewAdminPhoneInput] = useState('');
  const [kycFilter, setKycFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [selectedCustomerModal, setSelectedCustomerModal] = useState<CustomerUser | null>(null);
  const [recentActivityTab, setRecentActivityTab] = useState<'orders' | 'test-drives' | 'quotes'>('orders');

  // Grouped Navigation structure for Admin Sidebar Menu
  const adminAccordionGroups = [
    {
      id: 'service-management',
      label: 'Service Management',
      icon: Layers,
      items: [
        { id: 'sp-list' as AdminTab, label: 'Live Service Vans & Fleet', badge: serviceProviders.length },
        { id: 'services' as AdminTab, label: 'Doorstep Service Bookings', badge: services.length },
        { id: 'service-categories' as AdminTab, label: 'Service Categories & Rates', badge: null },
        { id: 'service-approvals' as AdminTab, label: 'Customer Digital Approvals', badge: null },
        { id: 'service-history' as AdminTab, label: 'Partner Job History', badge: null },
      ]
    },
    {
      id: 'spare-vendor',
      label: 'Spare VendorManagement',
      icon: Box,
      items: [
        { id: 'vendor-list' as AdminTab, label: 'Spare Vendor Hub & List', badge: spareVendors.length },
        { id: 'parts' as AdminTab, label: 'Customer Parts Orders', badge: partsOrders.length },
        { id: 'vendor-onboarding' as AdminTab, label: 'Spare Vendor Onboarding', badge: null },
        { id: 'vendor-payout' as AdminTab, label: 'Spare Vendor Payouts', badge: null },
        { id: 'vendor-history' as AdminTab, label: 'Spare Vendor History', badge: null },
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace Management',
      icon: Store,
      items: [
        { id: 'shop-list' as AdminTab, label: 'Showroom Dealers & List', badge: shopkeepers.length },
        { id: 'inventory' as AdminTab, label: 'Dealership Floor Vehicles', badge: storage.getVehicles().length },
        { id: 'shop-onboarding' as AdminTab, label: 'Showroom Onboarding', badge: null },
        { id: 'shop-payout' as AdminTab, label: 'Dealership Commissions', badge: null },
      ]
    },
    {
      id: 'catalog-hub',
      label: 'EV Categories & Catalog Hub',
      icon: Sparkles,
      items: [
        { id: 'catalog-hub' as AdminTab, label: 'Catalog Landing Hub', badge: 'Live' },
        { id: 'categories' as AdminTab, label: 'Primary Categories', badge: categories.length },
        { id: 'subcategories' as AdminTab, label: 'Categories (Sub-Categories)', badge: subCategories.length },
        { id: 'brands' as AdminTab, label: 'Brands & OEMs', badge: brands.length },
      ]
    },
    {
      id: 'orders-management',
      label: 'Orders & Bookings Management',
      icon: ShoppingBag,
      items: [
        { id: 'orders' as AdminTab, label: 'Vehicle Orders & Tokens', badge: vehicleOrders.length },
        { id: 'test-drives' as AdminTab, label: 'Test Drive Bookings', badge: testDrives.length },
        { id: 'quotations' as AdminTab, label: 'Customer Fleet Quotations', badge: quotations.length },
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      items: [
        { id: 'customers' as AdminTab, label: 'Registered Customers', badge: registeredCustomers.length },
        { id: 'customer-kyc' as AdminTab, label: 'Customer KYC Verification', badge: registeredCustomers.filter(c => !c.isKycVerified).length || null },
        { id: 'admin-users' as AdminTab, label: 'Admin & Staff Access', badge: authorizedAdminPhones.length },
      ]
    },
    {
      id: 'support-communication',
      label: 'Support & Communications',
      icon: LifeBuoy,
      items: [
        { id: 'tickets' as AdminTab, label: 'Customer Support Desk', badge: tickets.length },
        { id: 'announcements' as AdminTab, label: 'Announcement Bar Manager', badge: announcements.length },
      ]
    },
  ];

  // Helper to get current active breadcrumb
  const getTabBreadcrumb = () => {
    if (activeTab === 'overview') return { group: 'Main Console', label: 'Dashboard' };
    if (activeTab === 'catalog-hub') return { group: 'EV Categories & Catalog Hub', label: 'Master Catalog Landing Page' };
    if (activeTab === 'sp-list') return { group: 'Service Management', label: 'Live Service Vans & Mobile Fleet Hub' };
    if (activeTab === 'vendor-list') return { group: 'Spare VendorManagement', label: 'Certified Vendors & Wholesale Hub' };
    if (activeTab === 'shop-list') return { group: 'Marketplace Management', label: 'Showroom Dealers & Dealerships Hub' };
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
            {/* Parent Accordion Row - Clicking parent immediately opens domain landing console */}
            <button
              onClick={() => {
                toggleMenu(group.id);
                const parentDefaultTabs: Record<string, AdminTab> = {
                  'service-management': 'sp-list',
                  'spare-vendor': 'vendor-list',
                  'marketplace': 'shop-list',
                  'catalog-hub': 'catalog-hub',
                  'orders-management': 'orders',
                  'user-management': 'customers',
                  'support-communication': 'tickets'
                };
                const targetTab = parentDefaultTabs[group.id];
                if (targetTab) {
                  handleSelectTab(targetTab, group.id);
                }
              }}
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
                      {subItem.badge !== null && subItem.badge !== undefined && (typeof subItem.badge === 'number' ? subItem.badge > 0 : Boolean(subItem.badge)) && (
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
    categoryKey: '',
    subtitle: '',
    description: '',
    type: 'VEHICLE' as CategoryItem['type'],
    imageUrl: '',
    isFeatured: true,
    scaleTier: '2W_PERSONAL' as CategoryItem['scaleTier'],
    scaleLabel: 'Micro & Personal Mobility (2W)'
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // SubCategory Form State
  const [subCategoryForm, setSubCategoryForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    vehicleSegment: '',
    speedRangeTier: '',
    typicalPayloadOrSeats: '',
    subsidyEligible: true
  });
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [subCategoryFilterParent, setSubCategoryFilterParent] = useState('ALL');

  // Catalog & Categories Console State
  const [archViewMode, setArchViewMode] = useState<'overview-hub' | 'visual-tree' | 'primary-table' | 'subcategory-table' | 'brand-grid'>('overview-hub');
  const [archSearchQuery, setArchSearchQuery] = useState('');
  const [archScaleFilter, setArchScaleFilter] = useState('ALL');

  // Interactive Catalog Landing Page States (Storefront Preview & Vehicle Models)
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => storage.getVehicles());
  const [landingSelectedCat, setLandingSelectedCat] = useState<string>('ELECTRIC_SCOOTER');
  const [landingSelectedSub, setLandingSelectedSub] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);

  // New Vehicle Model Studio State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: 'ElectraMobility',
    category: 'ELECTRIC_SCOOTER',
    subcategory: '',
    tagline: '',
    description: '',
    exShowroomPrice: 125000,
    subsidyEstimate: 15000,
    certifiedRangeKm: 150,
    batteryCapacityKwh: 3.5,
    topSpeedKmph: 85,
    chargingTimeHours: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    inStock: true
  });

  // Service Provider Fleet Master Console State
  const [spViewMode, setSpViewMode] = useState<'fleet' | 'bookings' | 'payouts' | 'onboard'>('fleet');
  const [spSearchQuery, setSpSearchQuery] = useState('');
  const [spCityFilter, setSpCityFilter] = useState('ALL');

  // Spare Vendor Wholesale Master Console State
  const [vendorViewMode, setVendorViewMode] = useState<'vendors' | 'orders' | 'catalog' | 'settlements' | 'onboard'>('vendors');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('ALL');

  // Showroom Dealership Master Console State
  const [shopViewMode, setShopViewMode] = useState<'dealers' | 'inventory' | 'test-drives' | 'commissions' | 'onboard'>('dealers');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [shopCityFilter, setShopCityFilter] = useState('ALL');

  // Quick Action Handlers for Live Services & Orders
  const handleUpdateServiceBookingStatus = (bookingId: string, nextStatus: any) => {
    const updated = services.map(s => {
      if (s.id === bookingId) {
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setServices(updated);
    storage.updateServiceStatus(bookingId, nextStatus);
    setRefreshNotification(`✓ Service booking status updated to ${nextStatus}!`);
    setTimeout(() => setRefreshNotification(null), 3000);
  };

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
    const categoryKey = categoryForm.categoryKey.trim() || categoryForm.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    const newCat = storage.addCategory({
      name: categoryForm.name.trim(),
      slug,
      categoryKey,
      subtitle: categoryForm.subtitle.trim(),
      description: categoryForm.description.trim() || `${categoryForm.name} catalog and models`,
      type: categoryForm.type,
      imageUrl: categoryForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      isFeatured: categoryForm.isFeatured,
      status: 'ACTIVE',
      scaleTier: categoryForm.scaleTier,
      scaleLabel: categoryForm.scaleLabel,
      displayOrder: categories.length + 1
    });
    setCategories(storage.getCategories());
    setIsCategoryModalOpen(false);
    setCategoryForm({
      name: '',
      categoryKey: '',
      subtitle: '',
      description: '',
      type: 'VEHICLE',
      imageUrl: '',
      isFeatured: true,
      scaleTier: '2W_PERSONAL',
      scaleLabel: 'Micro & Personal Mobility (2W)'
    });
    setRefreshNotification(`✓ Category "${newCat.name}" (${categoryKey}) created and published live to frontend!`);
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
      vehicleSegment: subCategoryForm.vehicleSegment.trim() || undefined,
      speedRangeTier: subCategoryForm.speedRangeTier.trim() || undefined,
      typicalPayloadOrSeats: subCategoryForm.typicalPayloadOrSeats.trim() || undefined,
      subsidyEligible: subCategoryForm.subsidyEligible,
      status: 'ACTIVE'
    });
    setSubCategories(storage.getSubCategories());
    setIsSubCategoryModalOpen(false);
    setSubCategoryForm({
      categoryId: '',
      name: '',
      description: '',
      vehicleSegment: '',
      speedRangeTier: '',
      typicalPayloadOrSeats: '',
      subsidyEligible: true
    });
    setRefreshNotification(`✓ Category "${newSub.name}" created and linked to ${parent?.name}!`);
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

  const loadAllData = async () => {
    await storage.syncWithBackend();
    setRegisteredCustomers(storage.getRegisteredUsers());
    setAuthorizedAdminPhones(storage.getAdminAuthorizedPhones());
    setVehicleOrders(storage.getVehicleOrders());
    setTestDrives(storage.getTestDrives());
    setQuotations(storage.getQuotations());
    setServices(storage.getServiceBookings());
    setPartsOrders(storage.getSparePartsOrders());
    setTickets(storage.getSupportTickets());
    setCategories(storage.getCategories());
    setSubCategories(storage.getSubCategories());
    setBrands(storage.getBrands());
    setVehicles(storage.getVehicles());
  };

  // Vehicle Management Handlers
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name.trim()) return;

    const newVeh = storage.addVehicle({
      name: vehicleForm.name.trim(),
      brand: vehicleForm.brand || 'ElectraMobility',
      category: vehicleForm.category as any,
      tagline: vehicleForm.tagline || `${vehicleForm.brand} ${vehicleForm.name}`,
      description: vehicleForm.description || `Certified high-efficiency electric vehicle by ${vehicleForm.brand}.`,
      usageType: 'COMMERCIAL',
      exShowroomPrice: Number(vehicleForm.exShowroomPrice) || 99000,
      subsidyEstimate: Number(vehicleForm.subsidyEstimate) || 0,
      rtoEstimate: Math.round(Number(vehicleForm.exShowroomPrice) * 0.04),
      insuranceEstimate: Math.round(Number(vehicleForm.exShowroomPrice) * 0.05),
      bookingTokenAmount: 2999,
      certifiedRangeKm: Number(vehicleForm.certifiedRangeKm) || 120,
      certifiedRangeCondition: 'ARAI / IDC Certified under standard test conditions',
      topSpeedKmph: Number(vehicleForm.topSpeedKmph) || 75,
      batteryCapacityKwh: Number(vehicleForm.batteryCapacityKwh) || 3.5,
      chargingTimeHours: Number(vehicleForm.chargingTimeHours) || 4,
      fastChargingTimeMin: 60,
      motorType: 'High Efficiency PMSM Drive',
      motorPowerWatts: 3500,
      warrantyYears: 3,
      warrantyKm: 50000,
      isFeatured: true,
      inStock: vehicleForm.inStock,
      deliveryEstimateDays: 5,
      images: [
        { url: vehicleForm.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', label: vehicleForm.name, isPrimary: true }
      ],
      variants: [
        { id: `var-${Date.now()}`, variantName: 'Standard Edition', colorName: 'Pearl White', colorHex: '#F3F4F6', priceDifference: 0, batteryCapacity: Number(vehicleForm.batteryCapacityKwh) || 3.5, realWorldRangeKm: Number(vehicleForm.certifiedRangeKm) || 120, stockCount: 10, imageUrl: vehicleForm.imageUrl, isDefault: true }
      ],
      specifications: []
    });

    setVehicles(storage.getVehicles());
    setIsVehicleModalOpen(false);
    setVehicleForm({
      name: '',
      brand: 'ElectraMobility',
      category: 'ELECTRIC_SCOOTER',
      subcategory: '',
      tagline: '',
      description: '',
      exShowroomPrice: 125000,
      subsidyEstimate: 15000,
      certifiedRangeKm: 150,
      batteryCapacityKwh: 3.5,
      topSpeedKmph: 85,
      chargingTimeHours: 4,
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      inStock: true
    });
    setRefreshNotification(`✓ Vehicle "${newVeh.name}" added to catalog and live storefront!`);
    setTimeout(() => setRefreshNotification(null), 3500);
  };

  const handleToggleVehicleStock = (vehicleId: string, currentStock: boolean) => {
    storage.updateVehicle(vehicleId, { inStock: !currentStock });
    setVehicles(storage.getVehicles());
    setRefreshNotification(`✓ Vehicle stock status updated!`);
    setTimeout(() => setRefreshNotification(null), 3000);
  };

  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    if (confirm(`Are you sure you want to delete "${vehicleName}" from catalog?`)) {
      storage.deleteVehicle(vehicleId);
      setVehicles(storage.getVehicles());
      setRefreshNotification(`✓ Vehicle "${vehicleName}" removed from catalog!`);
      setTimeout(() => setRefreshNotification(null), 3000);
    }
  };

  // User Management Handlers
  const handleToggleCustomerKyc = (customer: CustomerUser) => {
    const updated: CustomerUser = { ...customer, isKycVerified: !customer.isKycVerified };
    storage.saveRegisteredUser(updated);
    setRegisteredCustomers(storage.getRegisteredUsers());
    setRefreshNotification(`✓ Customer "${customer.fullName}" KYC status updated to ${updated.isKycVerified ? 'Verified' : 'Pending Review'}!`);
    setTimeout(() => setRefreshNotification(null), 3000);
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (window.confirm(`Kya aap sach me customer "${customerName}" ka profile remove karna chahte hain?`)) {
      storage.deleteRegisteredUser(customerId);
      setRegisteredCustomers(storage.getRegisteredUsers());
      setRefreshNotification(`✓ Customer profile "${customerName}" removed from system!`);
      setTimeout(() => setRefreshNotification(null), 3000);
    }
  };

  const handleAddAdminPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newAdminPhoneInput.trim().replace(/\D/g, '').slice(-10);
    if (!/^[6-9][0-9]{9}$/.test(clean)) {
      alert('Kripya 10-digit valid Indian mobile number enter karein');
      return;
    }
    storage.addAuthorizedAdminPhone(clean);
    setAuthorizedAdminPhones(storage.getAdminAuthorizedPhones());
    setNewAdminPhoneInput('');
    setRefreshNotification(`✓ Admin access granted to mobile number +91 ${clean}!`);
    setTimeout(() => setRefreshNotification(null), 3500);
  };

  const handleRemoveAdminPhone = (phone: string) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    const protectedPhones = ['9244272627', '8269288189', '9876543210'];
    if (protectedPhones.includes(clean)) {
      alert('⚠️ Primary Super Admin mobile number ko remove nahi kiya ja sakta.');
      return;
    }
    if (window.confirm(`Kya aap +91 ${clean} ka admin access revoke karna chahte hain?`)) {
      const ok = storage.removeAuthorizedAdminPhone(clean);
      if (ok) {
        setAuthorizedAdminPhones(storage.getAdminAuthorizedPhones());
        setRefreshNotification(`✓ Admin access revoked for +91 ${clean}!`);
        setTimeout(() => setRefreshNotification(null), 3500);
      }
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshNotification(null);
    await storage.syncWithBackend();
    await loadAllData();
    setIsRefreshing(false);
    setRefreshNotification('✓ Live Admin Database successfully reloaded from Central Backend API!');
    setTimeout(() => {
      setRefreshNotification(null);
    }, 3500);
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllData();
      // Auto-poll every 4 seconds so any real customer booking, order, or KYC is immediately fetched from backend
      const pollTimer = setInterval(() => {
        loadAllData();
      }, 4000);
      // Live two-way synchronization: any real customer order, booking, or registration instantly updates admin!
      const unsub = storage.onSync(() => {
        loadAllData();
      });
      return () => {
        clearInterval(pollTimer);
        unsub();
      };
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
      const updated = [newAnnouncementText.trim(), ...announcements];
      setAnnouncements(updated);
      storage.saveAnnouncements(updated);
      setNewAnnouncementText('');
      setRefreshNotification('✓ Announcement broadcasted live to Customer Storefront!');
      setTimeout(() => setRefreshNotification(null), 3000);
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
    storage.saveAnnouncements(updated);
    setRefreshNotification('✓ Announcement removed from live storefront!');
    setTimeout(() => setRefreshNotification(null), 3000);
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

  // When activeTab is 'catalog-hub', open the dedicated Full-Width Catalog Landing Page
  // This removes the old distracting sidebar and giant greeting banner completely!
  if (activeTab === 'catalog-hub') {
    return (
      <AdminCatalogLandingPage
        onBackToDashboard={() => setActiveTab('overview')}
      />
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

  // Dynamic Attention & Pending Assignments Calculations
  const pendingKycCount = registeredCustomers.filter(c => !c.isKycVerified).length;
  const pendingServicesCount = services.filter(
    s => s.status === 'REQUESTED' || s.status === 'AWAITING_CONFIRMATION' || s.additionalApprovalQuote?.status === 'PENDING'
  ).length;
  const pendingQuotationsCount = quotations.filter(
    q => q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW'
  ).length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'OPEN').length;
  const totalPendingAssignments = pendingKycCount + pendingServicesCount + pendingQuotationsCount + pendingTicketsCount;
  const activeServiceVansCount = serviceProviders.filter(sp => sp.status === 'ACTIVE' || sp.status === 'ON_JOB').length || serviceProviders.length;

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
            { id: 'categories' as AdminTab, label: `Primary (${categories.length})` },
            { id: 'subcategories' as AdminTab, label: `Category (${subCategories.length})` },
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

          {/* Clean Executive Welcome & Quick Actions Bar */}
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Central Command • 24 Cities Live
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-900 text-[#00D2FF]">
                    Super Admin
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#06152B] tracking-tight">
                  Good {timeGreeting}, Administrator 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Vidyutva E-Vahan Multi-Vendor Operations: Vehicles catalog, mobile service vans, certified vendors & showroom network.
                </p>
              </div>

              {/* Top Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                  className="px-4 py-2.5 rounded-2xl bg-[#06152B] hover:bg-[#132A46] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  title="Open Dedicated Full-Width Catalog Hub"
                >
                  <Sparkles className="w-4 h-4 text-[#B7F34A]" />
                  <span>Catalog Studio</span>
                </button>

                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  title="Synchronize live storage and backend data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#16A34A] ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
                </button>

                <Link
                  to="/"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
                  title="Open live customer storefront in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Storefront ↗</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Core Executive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Catalog & Models */}
            <div
              onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5 text-[#16A34A]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live Catalog
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Certified EV Models
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-[#06152B] block mt-0.5">
                  {storage.getVehicles().length} Models
                </strong>
                <p className="text-xs text-slate-500 mt-1">
                  {categories.length} Segments • {subCategories.length} Subcategories
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Open Catalog Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Multi-Vendor Fleet & Hubs */}
            <div
              onClick={() => handleSelectTab('sp-list', 'service-management')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {activeServiceVansCount} Active Vans
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Partner Network Hubs
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-[#06152B] block mt-0.5">
                  {serviceProviders.length + spareVendors.length + shopkeepers.length} Partners
                </strong>
                <p className="text-xs text-slate-500 mt-1">
                  {shopkeepers.length} Showrooms • {spareVendors.length} OEM Vendors
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                <span>Manage Fleet & Hubs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Customer Demand & Inquiries */}
            <div
              onClick={() => handleSelectTab('orders', 'orders-management')}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Demand Queue
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Customer Bookings
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-[#06152B] block mt-0.5">
                  {vehicleOrders.length + testDrives.length + quotations.length} Requests
                </strong>
                <p className="text-xs text-slate-500 mt-1">
                  {vehicleOrders.length} Token Orders • {testDrives.length} Test Drives
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                <span>View All Bookings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Operational Readiness & KYC */}
            <div
              onClick={() => {
                if (pendingKycCount > 0) setActiveTab('customer-kyc');
                else if (pendingServicesCount > 0) setActiveTab('services');
                else setActiveTab('admin-users');
              }}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    totalPendingAssignments > 0
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {totalPendingAssignments > 0 ? `${totalPendingAssignments} Pending` : 'Verified'}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Operational Health
                </span>
                <strong className="text-2xl sm:text-3xl font-black text-[#06152B] block mt-0.5">
                  {totalPendingAssignments === 0 ? 'Optimal' : `${totalPendingAssignments} To Review`}
                </strong>
                <p className="text-xs text-slate-500 mt-1">
                  {totalPendingAssignments === 0 ? 'All 24 city hubs online & synced' : `${pendingKycCount} KYC • ${pendingServicesCount} Bookings`}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-800">
                <span>System Verification</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Core Marketplace Hubs (Clean modern elevated cards) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#16A34A]" />
                    <span>Enterprise Marketplace Hubs</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Direct access to specialized multi-vendor consoles with live bi-directional sync.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. EV Categories & Catalog Hub */}
                <div
                  onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                  className="group relative p-5 rounded-3xl bg-white border border-gray-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {categories.length} Segments
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        EV Categories & Catalog Hub
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        Electric Scooters, Electric Autos, Cargo, Loaders, 35+ Subcategories with PM E-DRIVE subsidies & OEM Brands.
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 space-y-1.5 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subcategories:</span>
                        <strong className="text-gray-800">{subCategories.length} Types</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Verified Brands:</span>
                        <strong className="text-emerald-700 font-bold">{brands.length} OEMs</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                    <span>Open Catalog Studio →</span>
                  </div>
                </div>

                {/* 2. Live Service Vans Hub */}
                <div
                  onClick={() => handleSelectTab('sp-list', 'service-management')}
                  className="group relative p-5 rounded-3xl bg-white border border-gray-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {activeServiceVansCount} Active
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        Doorstep Service Vans Fleet
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        Mobile EV breakdown fleet, field dispatch, GPS van tracking & technician instant payouts.
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 space-y-1.5 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Fleet:</span>
                        <strong className="text-gray-800">{serviceProviders.length} Vans</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Requests:</span>
                        <strong className="text-blue-700 font-bold">{services.length} Requests</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                    <span>Open Fleet Console →</span>
                  </div>
                </div>

                {/* 3. Certified Spare Vendors */}
                <div
                  onClick={() => handleSelectTab('vendor-list', 'spare-vendor')}
                  className="group relative p-5 rounded-3xl bg-white border border-gray-200/90 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                        <Box className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {spareVendors.length} Verified
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        Certified OEM Spare Vendors
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        Tier-1 component manufacturers, battery warehouses, parts SKU dispatch & settlements.
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 space-y-1.5 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active SKUs:</span>
                        <strong className="text-gray-800">{spareVendors.reduce((acc, v) => acc + (v.activeSkus || 0), 0)} SKUs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customer Orders:</span>
                        <strong className="text-emerald-700 font-bold">{partsOrders.length} Orders</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Open Vendor Console →</span>
                  </div>
                </div>

                {/* 4. Showroom Dealers Hub */}
                <div
                  onClick={() => handleSelectTab('shop-list', 'marketplace')}
                  className="group relative p-5 rounded-3xl bg-white border border-gray-200/90 hover:border-purple-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 group-hover:scale-105 transition-transform">
                        <Store className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        {shopkeepers.length} Hubs
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                        Showroom Dealers Network
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        Authorized dealerships, floor vehicle display models, test drives & commissions.
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 space-y-1.5 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Floor Models:</span>
                        <strong className="text-gray-800">{shopkeepers.reduce((acc, s) => acc + (s.inventoryCount || 0), 0)} Units</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Test Drives:</span>
                        <strong className="text-purple-700 font-bold">{testDrives.length} Bookings</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
                    <span>Open Dealership Console →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Operational Activity Center: Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Customer Inquiries (Orders / Test Drives / Quotes) with Sub-tabs */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                      <span>Customer Bookings & Test Drives</span>
                    </h3>
                  </div>

                  {/* Clean Tab Switcher */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setRecentActivityTab('orders')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        recentActivityTab === 'orders'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Orders ({vehicleOrders.length})
                    </button>
                    <button
                      onClick={() => setRecentActivityTab('test-drives')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        recentActivityTab === 'test-drives'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Test Drives ({testDrives.length})
                    </button>
                    <button
                      onClick={() => setRecentActivityTab('quotes')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        recentActivityTab === 'quotes'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Quotes ({quotations.length})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {recentActivityTab === 'orders' && (
                  <div className="space-y-3">
                    {vehicleOrders.length === 0 ? (
                      <div className="py-8 px-4 text-center rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 space-y-2">
                        <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-700">No active vehicle token bookings</p>
                        <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                          Customer bookings from the storefront or showroom walk-ins appear here with digital token deposit receipts.
                        </p>
                        <Link
                          to="/"
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline pt-1"
                        >
                          <span>Explore Customer Storefront</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
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
                )}

                {recentActivityTab === 'test-drives' && (
                  <div className="space-y-3">
                    {testDrives.length === 0 ? (
                      <div className="py-8 px-4 text-center rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 space-y-2">
                        <Clock className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-700">No doorstep test drives scheduled</p>
                        <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                          Scheduled customer test drives across 24 cities with assigned showroom dealer units will appear here.
                        </p>
                      </div>
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
                )}

                {recentActivityTab === 'quotes' && (
                  <div className="space-y-3">
                    {quotations.length === 0 ? (
                      <div className="py-8 px-4 text-center rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 space-y-2">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-700">No fleet quotations in review</p>
                        <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                          B2B enterprise fleet inquiries and custom financing quotations will be displayed here.
                        </p>
                      </div>
                    ) : (
                      quotations.slice(0, 4).map(q => (
                        <div key={q.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                          <div>
                            <strong className="text-xs font-bold text-gray-900 block">{q.vehicleName} ({q.quantity} Units)</strong>
                            <span className="text-[11px] text-gray-500">
                              {q.companyName || q.customerName} • {q.city}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                            {q.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Registered Customer Profiles */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#16A34A]" />
                    <span>Registered Customers ({registeredCustomers.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className="text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
                  >
                    Manage Users →
                  </button>
                </div>

                {registeredCustomers.length === 0 ? (
                  <div className="py-8 px-4 text-center rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 space-y-2">
                    <Users className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-xs font-bold text-gray-700">Customer profiles ready</p>
                    <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                      Real customer user profiles with verified mobile OTP numbers and KYC documents will appear here.
                    </p>
                    <button
                      onClick={() => setActiveTab('customer-kyc')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline pt-1 cursor-pointer"
                    >
                      <span>Check Customer KYC Desk →</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {registeredCustomers.slice(0, 4).map(cust => (
                      <div key={cust.id || cust.phone} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
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
                          {cust.isKycVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Operations Action Bar */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Quick Operational Actions</span>
                <span className="text-[11px] text-slate-500">Fast onboarding & configuration shortcuts</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>+ Add Primary Category</span>
                </button>
                <button
                  onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>+ Add Sub-Category</span>
                </button>
                <button
                  onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>+ Add Vehicle Model</span>
                </button>
                <button
                  onClick={() => handleSelectTab('sp-onboarding', 'service-management')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>+ Dispatch Service Van</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Customers (Live real user database - Strictly User Related) */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#16A34A]" />
                  <span>Registered Customers Database ({registeredCustomers.length})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Live user profiles of registered customers on E-VAHAN marketplace. Manage customer accounts, contact details, and verification status.
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
                      <th className="p-3">Saved Addresses</th>
                      <th className="p-3">User Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((cust) => (
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
                          <div className="flex items-center gap-2">
                            {cust.isKycVerified ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleCustomerKyc(cust)}
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                              title="Toggle KYC Status"
                            >
                              {cust.isKycVerified ? 'Mark Pending' : 'Approve'}
                            </button>
                          </div>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedCustomerModal(cust)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-[#16A34A] hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="View full customer profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.fullName)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 font-bold text-[11px] transition-colors"
                              title="Remove customer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Customer KYC Verification Desk (Strictly User Related) */}
        {activeTab === 'customer-kyc' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                  <span>Customer KYC & Document Verification Desk</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Verify government IDs, driving licenses, and customer identity status for compliance and doorstep handovers.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                {(['ALL', 'PENDING', 'VERIFIED'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setKycFilter(filter)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      kycFilter === filter
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Customers' : filter === 'PENDING' ? 'Pending Review' : 'Verified'}
                  </button>
                ))}
              </div>
            </div>

            {/* KYC Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Total Registered Users
                </span>
                <strong className="text-xl font-black text-gray-900">{registeredCustomers.length}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  KYC Verified Customers
                </span>
                <strong className="text-xl font-black text-emerald-700">
                  {registeredCustomers.filter(c => c.isKycVerified).length}
                </strong>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  Pending Document Review
                </span>
                <strong className="text-xl font-black text-amber-700">
                  {registeredCustomers.filter(c => !c.isKycVerified).length}
                </strong>
              </div>
            </div>

            {/* Customer KYC Table */}
            {registeredCustomers.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 space-y-2">
                <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">No Customer KYC Requests</h4>
                <p className="text-xs text-gray-500">When customers register on the marketplace, their KYC verification tasks will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">Customer Profile</th>
                      <th className="p-3">Phone & Location</th>
                      <th className="p-3">Driving License / ID</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Admin Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registeredCustomers
                      .filter(c => {
                        if (kycFilter === 'VERIFIED') return c.isKycVerified;
                        if (kycFilter === 'PENDING') return !c.isKycVerified;
                        return true;
                      })
                      .map((cust) => (
                        <tr key={cust.id} className="hover:bg-gray-50/70">
                          <td className="p-3">
                            <strong className="text-xs font-bold text-gray-900 block">{cust.fullName}</strong>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {cust.id}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-gray-800 block">+91 {cust.phone}</span>
                            <span className="text-[10px] text-gray-400">{cust.city || 'India'}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-gray-700">
                              {cust.drivingLicenseNo || 'Aadhaar / OTP Verified'}
                            </span>
                          </td>
                          <td className="p-3">
                            {cust.isKycVerified ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Verified
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleCustomerKyc(cust)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                cust.isKycVerified
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white hover:opacity-90 shadow-sm'
                              }`}
                            >
                              {cust.isKycVerified ? 'Revoke Approval' : '✓ Approve KYC'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Admin & Staff Access Management (Strictly User Related) */}
        {activeTab === 'admin-users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#16A34A]" />
                  <span>Admin & Staff Access Authorization</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Manage authorized administrative mobile numbers permitted to log into this Central Operations Portal via secure OTP gateway.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>Authorized Active Numbers: {authorizedAdminPhones.length}</span>
              </div>
            </div>

            {/* Authorize New Admin Number Form */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#16A34A]" />
                <span>Authorize New Administrator Mobile Number</span>
              </h3>
              <form onSubmit={handleAddAdminPhone} className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1">
                  <span className="inline-flex items-center px-3.5 bg-white border border-r-0 border-gray-300 rounded-l-xl text-xs font-bold text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={newAdminPhoneInput}
                    onChange={(e) => setNewAdminPhoneInput(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#06152B] to-[#16A34A] hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#B7F34A]" />
                  <span>Grant Admin Access</span>
                </button>
              </form>
            </div>

            {/* Authorized Admin Numbers List */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Authorized Mobile Number</th>
                    <th className="p-3">Administrative Role</th>
                    <th className="p-3">Access Gateway</th>
                    <th className="p-3">Revoke Privilege</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {authorizedAdminPhones.map((phone) => {
                    const isPrimary = ['9244272627', '8269288189', '9876543210'].includes(phone);
                    return (
                      <tr key={phone} className="hover:bg-gray-50/70">
                        <td className="p-3 font-mono font-bold text-gray-900 text-sm">
                          +91 {phone}
                        </td>
                        <td className="p-3">
                          {isPrimary ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1 border border-emerald-300">
                              <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> Primary Super Admin
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1 border border-blue-200">
                              <UserCheck className="w-3 h-3 text-blue-600" /> Authorized Admin Staff
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span>OTP Login Permitted</span>
                          </span>
                        </td>
                        <td className="p-3">
                          {isPrimary ? (
                            <span className="text-gray-400 text-[11px] italic">Protected Core Number</span>
                          ) : (
                            <button
                              onClick={() => handleRemoveAdminPhone(phone)}
                              className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors border border-rose-200"
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Security Gateway Enforced:</strong>
                <span>Only mobile numbers listed above can receive verification OTPs and access the Admin Portal (`/admin`). Any unauthorized number is blocked automatically.</span>
              </div>
            </div>
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
                  Electric Vehicles ({storage.getVehicles().length})
                </strong>
                {storage.getVehicles().map(v => (
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

            {/* TAB: SERVICE PROVIDER MANAGEMENT - Service Provider List (Master Console) */}
            {activeTab === 'sp-list' && (() => {
              const filteredFleet = serviceProviders.filter(sp => {
                const matchesSearch =
                  !spSearchQuery ||
                  sp.name.toLowerCase().includes(spSearchQuery.toLowerCase()) ||
                  sp.vanNumber.toLowerCase().includes(spSearchQuery.toLowerCase()) ||
                  sp.phone.includes(spSearchQuery);
                const matchesCity = spCityFilter === 'ALL' || sp.city === spCityFilter;
                return matchesSearch && matchesCity;
              });

              const totalCompletedJobs = serviceProviders.reduce((acc, sp) => acc + (sp.completedJobs || 0), 0);
              const totalFleetPayoutPending = serviceProviders.reduce((acc, sp) => acc + (sp.pendingPayout || 0), 0);

              return (
                <div className="space-y-6">
                  {/* Master Console Header */}
                  <div className="bg-gradient-to-r from-[#06152B] via-[#0E284D] to-[#123668] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-blue-500/20 space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-500/20 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[#00D2FF] text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Enterprise Mobile Fleet Management</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                          <span>Live Service Vans & Fleet Operations Hub</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#B7F34A] border border-emerald-500/30 font-bold">
                            Live GPS & Dispatch Active
                          </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                          Manage real-time doorstep EV breakdown assistance vans, certified field technician duty rosters, live customer service queues, and instant 85% IMPS commission payouts.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => setSpViewMode('onboard')}
                          className="px-4 py-2.5 rounded-xl bg-[#00D2FF] hover:bg-[#38bdf8] text-[#06152B] text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Onboard New Van</span>
                        </button>
                        <button
                          onClick={() => {
                            setSpSearchQuery('');
                            setSpCityFilter('ALL');
                            setSpViewMode('fleet');
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Executive KPI Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Active Vans On Duty
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{activeServiceVansCount}</strong>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            {serviceProviders.length} Total Fleet
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Field Jobs Completed
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{totalCompletedJobs}</strong>
                          <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                            100% Resolved
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Doorstep Bookings Queue
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{services.length}</strong>
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                            {services.filter(s => s.status === 'REQUESTED' || s.status === 'AWAITING_CONFIRMATION').length} Pending
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Pending Payouts (85%)
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-[#B7F34A]">
                            ₹{totalFleetPayoutPending.toLocaleString('en-IN')}
                          </strong>
                          <span className="text-[11px] font-bold text-slate-300">
                            Instant IMPS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                    <button
                      onClick={() => setSpViewMode('fleet')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        spViewMode === 'fleet'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Van Roster & Technicians ({filteredFleet.length})</span>
                    </button>

                    <button
                      onClick={() => setSpViewMode('bookings')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        spViewMode === 'bookings'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Doorstep Bookings Queue ({services.length})</span>
                      {services.filter(s => s.status === 'REQUESTED' || s.status === 'AWAITING_CONFIRMATION').length > 0 && (
                        <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                          {services.filter(s => s.status === 'REQUESTED' || s.status === 'AWAITING_CONFIRMATION').length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setSpViewMode('payouts')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        spViewMode === 'payouts'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Technician Payouts & Commission</span>
                    </button>

                    <button
                      onClick={() => setSpViewMode('onboard')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        spViewMode === 'onboard'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Onboard New Service Van</span>
                    </button>
                  </div>

                  {/* VIEW 1: FLEET ROSTER */}
                  {spViewMode === 'fleet' && (
                    <div className="space-y-4">
                      {/* Search & City Filter Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="relative flex-1 max-w-md">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search technician name, van number, mobile..."
                            value={spSearchQuery}
                            onChange={(e) => setSpSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">City Hub:</span>
                          <select
                            value={spCityFilter}
                            onChange={(e) => setSpCityFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-none bg-white"
                          >
                            <option value="ALL">All Operational Hubs ({serviceProviders.length})</option>
                            <option value="Delhi NCR">Delhi NCR</option>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Pune">Pune</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Hyderabad">Hyderabad</option>
                          </select>
                        </div>
                      </div>

                      {/* Van Fleet Grid Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFleet.map(sp => (
                          <div key={sp.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-subtle hover:border-blue-300 transition-all space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-mono text-xs font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 block w-max">
                                  {sp.vanNumber}
                                </span>
                                <h3 className="text-sm font-black text-gray-900 mt-2">{sp.name}</h3>
                                <p className="text-[11px] text-gray-500 font-medium">{sp.city} Hub</p>
                              </div>

                              <button
                                onClick={() => handleToggleSpStatus(sp.id)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer border ${
                                  sp.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    : sp.status === 'ON_JOB'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                                title="Click to toggle status (ACTIVE / ON JOB / OFFLINE)"
                              >
                                {sp.status === 'ACTIVE' ? '🟢 ON DUTY' : sp.status === 'ON_JOB' ? '🔵 ON JOB' : '⚪ OFFLINE'}
                              </button>
                            </div>

                            <div className="text-xs text-gray-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">Specialization</div>
                              <div className="font-medium text-gray-800 line-clamp-1">{sp.specialization}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Performance</span>
                                <strong className="text-gray-900 font-bold block">{sp.completedJobs} Jobs</strong>
                                <span className="text-amber-600 text-[11px] font-bold">⭐ {sp.rating} Rating</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Pending Payout</span>
                                <strong className="text-[#16A34A] font-black font-mono block">
                                  ₹{sp.pendingPayout.toLocaleString('en-IN')}
                                </strong>
                                <span className="text-[10px] text-gray-400">Total: ₹{sp.totalEarnings.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                              <a
                                href={`tel:+91${sp.phone}`}
                                className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 font-bold text-xs text-center transition-all inline-flex items-center justify-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                                <span>Call (+91 {sp.phone})</span>
                              </a>
                              {sp.pendingPayout > 0 && (
                                <button
                                  onClick={() => handleDisburseSpPayout(sp.id)}
                                  className="py-2 px-3 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap"
                                  title="Disburse instant commission"
                                >
                                  Disburse
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dense Table View */}
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <h3 className="text-sm font-bold text-gray-900">
                            Complete Authorized Van Fleet Roster ({filteredFleet.length})
                          </h3>
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
                                <th className="p-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredFleet.map(sp => (
                                <tr key={sp.id} className="hover:bg-gray-50/60">
                                  <td className="p-3">
                                    <strong className="text-xs font-bold text-gray-900 block">{sp.name}</strong>
                                    <span className="text-[11px] text-gray-500 font-mono">+91 {sp.phone}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                      {sp.vanNumber}
                                    </span>
                                  </td>
                                  <td className="p-3 font-medium text-gray-800">{sp.city}</td>
                                  <td className="p-3 text-gray-600 max-w-xs truncate">{sp.specialization}</td>
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
                                    >
                                      {sp.status.replace('_', ' ')}
                                    </button>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1.5">
                                      <a
                                        href={`tel:+91${sp.phone}`}
                                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-emerald-800"
                                        title="Call Technician"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </a>
                                      {sp.pendingPayout > 0 && (
                                        <button
                                          onClick={() => handleDisburseSpPayout(sp.id)}
                                          className="px-2 py-1 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded text-[10px]"
                                        >
                                          Pay ₹{sp.pendingPayout}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: DOORSTEP BOOKINGS QUEUE */}
                  {spViewMode === 'bookings' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <span>Live Doorstep Service Booking & Van Dispatch Queue ({services.length})</span>
                          </h2>
                          <p className="text-xs text-gray-500">Real customer doorstep maintenance & emergency breakdown work orders awaiting dispatch.</p>
                        </div>
                      </div>

                      {services.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          No active doorstep service bookings in the queue.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                              <tr>
                                <th className="p-3">Booking ID</th>
                                <th className="p-3">Customer Details</th>
                                <th className="p-3">Service Package</th>
                                <th className="p-3">Date & Slot</th>
                                <th className="p-3">Service Location</th>
                                <th className="p-3">Digital Approval</th>
                                <th className="p-3">Status & Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {services.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50/60">
                                  <td className="p-3 font-mono font-bold text-gray-900">
                                    {s.bookingNumber || s.id}
                                  </td>
                                  <td className="p-3">
                                    <strong className="text-xs font-bold text-gray-900 block">{s.customerName}</strong>
                                    <a href={`tel:+91${s.customerPhone}`} className="text-[11px] text-emerald-700 font-mono hover:underline flex items-center gap-1">
                                      <Phone className="w-3 h-3" /> +91 {s.customerPhone}
                                    </a>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold text-gray-900 block">{s.serviceCategoryName}</span>
                                    <span className="text-[10px] text-gray-500">{s.vehicleType}</span>
                                  </td>
                                  <td className="p-3 font-medium text-gray-800">
                                    {s.appointmentDate} ({s.appointmentSlot})
                                  </td>
                                  <td className="p-3 text-gray-600 max-w-xs">
                                    {s.addressLine}, {s.city} ({s.pincode})
                                  </td>
                                  <td className="p-3">
                                    {s.isCustomerApproved ? (
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Approved
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 text-amber-600" /> Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-center ${
                                        s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                        s.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                        s.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                                        'bg-amber-100 text-amber-800'
                                      }`}>
                                        {s.status}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {s.status !== 'IN_PROGRESS' && s.status !== 'COMPLETED' && (
                                          <button
                                            onClick={() => handleUpdateServiceBookingStatus(s.id, 'IN_PROGRESS')}
                                            className="text-[9px] px-1.5 py-0.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 cursor-pointer"
                                            title="Dispatch service van"
                                          >
                                            Dispatch
                                          </button>
                                        )}
                                        {s.status !== 'COMPLETED' && (
                                          <button
                                            onClick={() => handleUpdateServiceBookingStatus(s.id, 'COMPLETED')}
                                            className="text-[9px] px-1.5 py-0.5 bg-[#16A34A] text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                                            title="Mark as completed"
                                          >
                                            Complete
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW 3: TECHNICIAN PAYOUTS */}
                  {spViewMode === 'payouts' && (
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
                                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs cursor-pointer"
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

                  {/* VIEW 4: ONBOARD NEW SERVICE VAN */}
                  {spViewMode === 'onboard' && (
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

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <span>Register Service Provider & Issue Van Pass</span>
                            <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpViewMode('fleet')}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })()}

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

            {/* TAB: SPARE VENDOR MANAGEMENT - Spare vendor List (Master Console) */}
            {activeTab === 'vendor-list' && (() => {
              const filteredVendors = spareVendors.filter(v => {
                const matchesSearch =
                  !vendorSearchQuery ||
                  v.companyName.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
                  v.contactPerson.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
                  v.location.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
                  v.phone.includes(vendorSearchQuery);
                const matchesCat = vendorCategoryFilter === 'ALL' || v.categories.includes(vendorCategoryFilter);
                return matchesSearch && matchesCat;
              });

              const totalActiveSkus = spareVendors.reduce((acc, v) => acc + (v.activeSkus || 0), 0);
              const totalFulfilledParts = spareVendors.reduce((acc, v) => acc + (v.fulfilledOrders || 0), 0);
              const totalSettlementPending = spareVendors.reduce((acc, v) => acc + (v.pendingPayout || 0), 0);

              return (
                <div className="space-y-6">
                  {/* Master Console Header */}
                  <div className="bg-gradient-to-r from-[#06152B] via-[#0E284D] to-[#123668] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-500/20 space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#B7F34A] text-[11px] font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                          <Box className="w-3.5 h-3.5" />
                          <span>OEM Parts Supply Network & Logistics Hub</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                          <span>Certified OEM Vendors & Wholesale Hub</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#B7F34A] border border-emerald-500/30 font-bold">
                            Verified Tier-1 Network
                          </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                          Manage certified OEM component manufacturers, regional fulfillment warehouses, customer spare parts dispatch queues, and corporate NEFT settlements.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => setVendorViewMode('onboard')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Onboard OEM Vendor</span>
                        </button>
                        <button
                          onClick={() => {
                            setVendorSearchQuery('');
                            setVendorCategoryFilter('ALL');
                            setVendorViewMode('vendors');
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Executive KPI Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Verified OEM Vendors
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{spareVendors.length}</strong>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            100% Verified
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Active Marketplace SKUs
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{totalActiveSkus}</strong>
                          <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                            {SPARE_PARTS_DATA.length} Catalog SKUs
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Fulfilled Parts Units
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{totalFulfilledParts}</strong>
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                            {partsOrders.length} Orders
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Pending NEFT Settlement
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-[#B7F34A]">
                            ₹{totalSettlementPending.toLocaleString('en-IN')}
                          </strong>
                          <span className="text-[11px] font-bold text-slate-300">
                            7-Day Cycle
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                    <button
                      onClick={() => setVendorViewMode('vendors')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        vendorViewMode === 'vendors'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Approved Vendor Directory ({filteredVendors.length})</span>
                    </button>

                    <button
                      onClick={() => setVendorViewMode('orders')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        vendorViewMode === 'orders'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Parts Orders Dispatch Queue ({partsOrders.length})</span>
                    </button>

                    <button
                      onClick={() => setVendorViewMode('catalog')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        vendorViewMode === 'catalog'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Marketplace Spare Parts Catalog ({SPARE_PARTS_DATA.length} SKUs)</span>
                    </button>

                    <button
                      onClick={() => setVendorViewMode('settlements')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        vendorViewMode === 'settlements'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Vendor Settlements & NEFT Ledger</span>
                    </button>

                    <button
                      onClick={() => setVendorViewMode('onboard')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        vendorViewMode === 'onboard'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Onboard OEM Vendor</span>
                    </button>
                  </div>

                  {/* VIEW 1: VENDOR DIRECTORY */}
                  {vendorViewMode === 'vendors' && (
                    <div className="space-y-4">
                      {/* Search & Category Filter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="relative flex-1 max-w-md">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search company, contact person, location..."
                            value={vendorSearchQuery}
                            onChange={(e) => setVendorSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Category:</span>
                          <select
                            value={vendorCategoryFilter}
                            onChange={(e) => setVendorCategoryFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-none bg-white"
                          >
                            <option value="ALL">All Categories ({spareVendors.length})</option>
                            <option value="Battery">Battery & BMS</option>
                            <option value="Brakes">Brakes & Motors</option>
                            <option value="Tyres">EV Tyres</option>
                            <option value="Chargers">Fast Chargers</option>
                          </select>
                        </div>
                      </div>

                      {/* Vendor Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {filteredVendors.map(v => (
                          <div key={v.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-subtle hover:border-emerald-300 transition-all space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> VERIFIED OEM VENDOR
                                </span>
                                <h3 className="text-base font-black text-gray-900 mt-1.5">{v.companyName}</h3>
                                <p className="text-[11px] text-gray-500 font-medium">{v.location}</p>
                              </div>
                              <span className="text-amber-600 font-black text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                ⭐ {v.rating} SLA
                              </span>
                            </div>

                            <div className="text-xs text-gray-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">Parts Category</div>
                              <div className="font-semibold text-gray-800">{v.categories}</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-gray-100">
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Active SKUs</span>
                                <strong className="text-gray-900 font-bold block">{v.activeSkus} SKUs</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Fulfilled</span>
                                <strong className="text-emerald-700 font-bold block">{v.fulfilledOrders} Units</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Pending NEFT</span>
                                <strong className="text-[#16A34A] font-black font-mono block">
                                  ₹{v.pendingPayout.toLocaleString('en-IN')}
                                </strong>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
                              <div>
                                <span className="text-gray-400 text-[10px] block">Contact Person</span>
                                <strong className="text-gray-900 font-bold">{v.contactPerson}</strong>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:+91${v.phone}`}
                                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-[#16A34A]" /> +91 {v.phone}
                                </a>
                                {v.pendingPayout > 0 && (
                                  <button
                                    onClick={() => handleDisburseVendorPayout(v.id)}
                                    className="px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                                  >
                                    Pay
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dense Table View */}
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <h3 className="text-sm font-bold text-gray-900">
                            Approved Spare Part Vendors & Distributors ({filteredVendors.length})
                          </h3>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                              <tr>
                                <th className="p-3">Vendor Details</th>
                                <th className="p-3">Contact Person</th>
                                <th className="p-3">Warehouse Hub</th>
                                <th className="p-3">Parts Category</th>
                                <th className="p-3">Active SKUs</th>
                                <th className="p-3">SLA Rating</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredVendors.map(v => (
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
                    </div>
                  )}

                  {/* VIEW 2: CUSTOMER PARTS ORDERS QUEUE */}
                  {vendorViewMode === 'orders' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-emerald-600" />
                            <span>Customer Spare Parts Orders & Dispatch Queue ({partsOrders.length})</span>
                          </h2>
                          <p className="text-xs text-gray-500">Live wholesale fulfillment and courier dispatch pipeline.</p>
                        </div>
                      </div>

                      {partsOrders.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          No spare parts orders placed yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                              <tr>
                                <th className="p-3">Order Number</th>
                                <th className="p-3">Customer Details</th>
                                <th className="p-3">Delivery Address</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Courier Tracking</th>
                                <th className="p-3">Status & Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {partsOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/60">
                                  <td className="p-3 font-mono font-bold text-gray-900">
                                    {order.orderNumber}
                                  </td>
                                  <td className="p-3">
                                    <strong className="text-xs font-bold text-gray-900 block">
                                      {order.deliveryAddress?.fullName || 'Customer'}
                                    </strong>
                                    <span className="text-[11px] text-gray-500 font-mono">
                                      +91 {order.deliveryAddress?.phone}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-600 max-w-xs">
                                    {order.deliveryAddress?.line1}, {order.deliveryAddress?.city} ({order.deliveryAddress?.pincode})
                                  </td>
                                  <td className="p-3 font-mono font-black text-gray-900">
                                    ₹{order.grandTotal.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3">
                                    {order.courierTracking ? (
                                      <div className="text-[11px]">
                                        <span className="font-bold text-gray-800 block">{order.courierTracking.carrierName}</span>
                                        <span className="font-mono text-gray-500">{order.courierTracking.trackingNumber}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-[10px]">Awaiting Dispatch</span>
                                    )}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-center ${
                                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                                        order.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-amber-100 text-amber-800'
                                      }`}>
                                        {order.status}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {order.status !== 'DISPATCHED' && order.status !== 'DELIVERED' && (
                                          <button
                                            onClick={() => handleUpdatePartsOrderStatus(order.id, 'DISPATCHED')}
                                            className="text-[9px] px-1.5 py-0.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 cursor-pointer"
                                          >
                                            Dispatch
                                          </button>
                                        )}
                                        {order.status !== 'DELIVERED' && (
                                          <button
                                            onClick={() => handleUpdatePartsOrderStatus(order.id, 'DELIVERED')}
                                            className="text-[9px] px-1.5 py-0.5 bg-[#16A34A] text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                                          >
                                            Deliver
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW 3: MARKETPLACE SPARE PARTS CATALOG */}
                  {vendorViewMode === 'catalog' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span>Marketplace Spare Parts Catalog & OEM Components ({SPARE_PARTS_DATA.length})</span>
                          </h2>
                          <p className="text-xs text-gray-500">Available component SKUs, verified OEM specifications, warranty tiers, and stock status.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SPARE_PARTS_DATA.map(part => (
                          <div key={part.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex gap-3">
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-20 h-20 rounded-xl object-cover border border-gray-200 bg-white shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {part.categoryName}
                              </span>
                              <h4 className="text-xs font-black text-gray-900 line-clamp-1">{part.name}</h4>
                              <p className="text-[11px] text-gray-500 line-clamp-1">Brand: {part.brand}</p>
                              <div className="flex items-baseline justify-between pt-1">
                                <strong className="text-sm font-black text-gray-900 font-mono">
                                  ₹{part.sellingPrice.toLocaleString('en-IN')}
                                </strong>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${part.stockQuantity > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                                  {part.stockQuantity > 0 ? `${part.stockQuantity} In Stock` : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: VENDOR SETTLEMENTS LEDGER */}
                  {vendorViewMode === 'settlements' && (
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
                                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs cursor-pointer"
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

                  {/* VIEW 5: ONBOARD NEW OEM VENDOR */}
                  {vendorViewMode === 'onboard' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Box className="w-5 h-5 text-[#16A34A]" />
                          <span>Onboard Certified OEM Spare Parts Vendor</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          Register a tier-1 component manufacturer or warehouse distributor into the Vidyutva parts marketplace.
                        </p>
                      </div>

                      <form onSubmit={handleRegisterSpareVendor} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Company / Manufacturer Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. NexCharge Powertrain Ltd."
                              value={vendorForm.companyName}
                              onChange={e => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Vikram Malhotra"
                              value={vendorForm.contactPerson}
                              onChange={e => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / Direct Phone *</label>
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Corporate Email Address</label>
                            <input
                              type="email"
                              placeholder="vendor@company.com"
                              value={vendorForm.email}
                              onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Central Warehouse Location *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Manesar Logistics Park, Haryana"
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

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <span>Register & Verify OEM Vendor</span>
                            <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setVendorViewMode('vendors')}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })()}

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

            {/* TAB: MARKETPLACE MANAGEMENT - Shopkeeper List (Master Console) */}
            {activeTab === 'shop-list' && (() => {
              const filteredShops = shopkeepers.filter(s => {
                const matchesSearch =
                  !shopSearchQuery ||
                  s.shopName.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                  s.ownerName.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                  s.city.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                  s.gstNumber.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                  s.phone.includes(shopSearchQuery);
                const matchesCity = shopCityFilter === 'ALL' || s.city === shopCityFilter;
                return matchesSearch && matchesCity;
              });

              const totalFloorInventory = shopkeepers.reduce((acc, s) => acc + (s.inventoryCount || 0), 0);
              const totalVehiclesDelivered = shopkeepers.reduce((acc, s) => acc + (s.totalSales || 0), 0);
              const totalCommissionPending = shopkeepers.reduce((acc, s) => acc + (s.pendingPayout || 0), 0);

              return (
                <div className="space-y-6">
                  {/* Master Console Header */}
                  <div className="bg-gradient-to-r from-[#06152B] via-[#0E284D] to-[#123668] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-purple-500/20 space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-purple-500/30">
                          <Store className="w-3.5 h-3.5" />
                          <span>EV Dealership Network & Showroom Operations</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                          <span>Showroom Dealers & Dealerships Hub</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                            Authorized Dealer Network
                          </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                          Manage authorized EV dealerships, floor display inventory allocations, customer test drive appointments, dealer delivery volumes, and weekly sales commission payouts.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => setShopViewMode('onboard')}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Onboard Showroom</span>
                        </button>
                        <button
                          onClick={() => {
                            setShopSearchQuery('');
                            setShopCityFilter('ALL');
                            setShopViewMode('dealers');
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Executive KPI Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Authorized Dealerships
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{shopkeepers.length}</strong>
                          <span className="text-[11px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                            {shopkeepers.filter(s => s.status === 'ACTIVE').length} Active
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Floor Demo Vehicles
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{totalFloorInventory}</strong>
                          <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                            {storage.getVehicles().length} Models
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Total Units Delivered
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-white">{totalVehiclesDelivered}</strong>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            {testDrives.length} Test Drives
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Pending Commissions
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className="text-2xl font-black text-[#B7F34A]">
                            ₹{totalCommissionPending.toLocaleString('en-IN')}
                          </strong>
                          <span className="text-[11px] font-bold text-slate-300">
                            Avg 3.5%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
                    <button
                      onClick={() => setShopViewMode('dealers')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        shopViewMode === 'dealers'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Authorized Showrooms ({filteredShops.length})</span>
                    </button>

                    <button
                      onClick={() => setShopViewMode('inventory')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        shopViewMode === 'inventory'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Dealership Floor Vehicles ({storage.getVehicles().length})</span>
                    </button>

                    <button
                      onClick={() => setShopViewMode('test-drives')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        shopViewMode === 'test-drives'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Customer Test Drives ({testDrives.length})</span>
                    </button>

                    <button
                      onClick={() => setShopViewMode('commissions')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        shopViewMode === 'commissions'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Dealer Commission Settlements</span>
                    </button>

                    <button
                      onClick={() => setShopViewMode('onboard')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        shopViewMode === 'onboard'
                          ? 'bg-[#06152B] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Onboard Showroom Dealership</span>
                    </button>
                  </div>

                  {/* VIEW 1: DEALERS DIRECTORY */}
                  {shopViewMode === 'dealers' && (
                    <div className="space-y-4">
                      {/* Search & City Filter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="relative flex-1 max-w-md">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search showroom name, owner, city, GSTIN..."
                            value={shopSearchQuery}
                            onChange={(e) => setShopSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">City Hub:</span>
                          <select
                            value={shopCityFilter}
                            onChange={(e) => setShopCityFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#16A34A] focus:outline-none bg-white"
                          >
                            <option value="ALL">All Dealership Hubs ({shopkeepers.length})</option>
                            <option value="Delhi NCR">Delhi NCR</option>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Pune">Pune</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Hyderabad">Hyderabad</option>
                          </select>
                        </div>
                      </div>

                      {/* Showroom Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {filteredShops.map(s => (
                          <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-subtle hover:border-purple-300 transition-all space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 inline-flex items-center gap-1">
                                  <Store className="w-3 h-3 text-purple-600" /> AUTHORIZED DEALERSHIP
                                </span>
                                <h3 className="text-base font-black text-gray-900 mt-1.5">{s.shopName}</h3>
                                <p className="text-[11px] text-gray-500 font-medium">{s.city} • <span className="font-mono">{s.gstNumber}</span></p>
                              </div>
                              <span className="text-purple-700 font-black text-xs bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                                {s.commissionRate} Margin
                              </span>
                            </div>

                            <div className="text-xs text-gray-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">Showroom Address</div>
                              <div className="font-medium text-gray-800">{s.address}</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-gray-100">
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Floor Models</span>
                                <strong className="text-gray-900 font-bold block">{s.inventoryCount} Models</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Total Sold</span>
                                <strong className="text-emerald-700 font-bold block">{s.totalSales} Units</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 block font-medium">Pending Commission</span>
                                <strong className="text-[#16A34A] font-black font-mono block">
                                  ₹{s.pendingPayout.toLocaleString('en-IN')}
                                </strong>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
                              <div>
                                <span className="text-gray-400 text-[10px] block">Dealer Principal</span>
                                <strong className="text-gray-900 font-bold">{s.ownerName}</strong>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:+91${s.phone}`}
                                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-[#16A34A]" /> +91 {s.phone}
                                </a>
                                {s.pendingPayout > 0 && (
                                  <button
                                    onClick={() => handleDisburseShopkeeperPayout(s.id)}
                                    className="px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                                  >
                                    Pay
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dense Table View */}
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <h3 className="text-sm font-bold text-gray-900">
                            Authorized EV Dealerships & Showroom Partners ({filteredShops.length})
                          </h3>
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
                              {filteredShops.map(s => (
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
                    </div>
                  )}

                  {/* VIEW 2: DEALERSHIP FLOOR INVENTORY */}
                  {shopViewMode === 'inventory' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-purple-600" />
                            <span>Dealership Floor Display Models & Stock ({storage.getVehicles().length})</span>
                          </h2>
                          <p className="text-xs text-gray-500">Live vehicles available for showroom display, test drives, and customer delivery.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {storage.getVehicles().map(vehicle => (
                          <div key={vehicle.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="relative h-40 rounded-xl overflow-hidden bg-white mb-3">
                                <img
                                  src={vehicle.images[0]?.url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}
                                  alt={vehicle.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#06152B]/80 text-white rounded text-[10px] font-bold">
                                  {vehicle.brand}
                                </span>
                              </div>
                              <h4 className="text-sm font-black text-gray-900">{vehicle.name}</h4>
                              <p className="text-[11px] text-gray-500">{vehicle.tagline || vehicle.category}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-gray-200">
                              <div>
                                <span className="text-gray-400 block text-[10px]">Range</span>
                                <strong className="text-gray-900 font-bold">{vehicle.certifiedRangeKm} km</strong>
                              </div>
                              <div>
                                <span className="text-gray-400 block text-[10px]">Top Speed</span>
                                <strong className="text-gray-900 font-bold">{vehicle.topSpeedKmph} km/h</strong>
                              </div>
                            </div>

                            <div className="flex items-baseline justify-between pt-1 border-t border-gray-200">
                              <div>
                                <span className="text-[10px] text-gray-400 block">Ex-Showroom Price</span>
                                <strong className="text-sm font-black text-gray-900 font-mono">
                                  ₹{vehicle.exShowroomPrice.toLocaleString('en-IN')}
                                </strong>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Allocated to Showrooms
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: TEST DRIVES QUEUE */}
                  {shopViewMode === 'test-drives' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span>Assigned Customer Test Drives Queue ({testDrives.length})</span>
                          </h2>
                          <p className="text-xs text-gray-500">Scheduled doorstep and showroom demo drive slots booked by verified customers.</p>
                        </div>
                      </div>

                      {testDrives.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          No test drives booked yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                              <tr>
                                <th className="p-3">Vehicle Model</th>
                                <th className="p-3">Customer Details</th>
                                <th className="p-3">Date & Slot</th>
                                <th className="p-3">Location & Hub</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {testDrives.map(td => (
                                <tr key={td.id} className="hover:bg-gray-50/60">
                                  <td className="p-3 font-bold text-gray-900">
                                    {td.vehicleName}
                                  </td>
                                  <td className="p-3">
                                    <strong className="text-xs font-bold text-gray-900 block">{td.customerName}</strong>
                                    <span className="text-[11px] text-gray-500 font-mono">+91 {td.customerPhone}</span>
                                  </td>
                                  <td className="p-3 font-medium text-gray-800">
                                    {td.preferredDate} ({td.timeSlot})
                                  </td>
                                  <td className="p-3 text-gray-600">
                                    {td.city} ({td.pincode})
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                                      {td.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW 4: DEALER COMMISSIONS */}
                  {shopViewMode === 'commissions' && (
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
                                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-sm text-xs cursor-pointer"
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

                  {/* VIEW 5: ONBOARD NEW SHOWROOM */}
                  {shopViewMode === 'onboard' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Store className="w-5 h-5 text-[#16A34A]" />
                          <span>Onboard Authorized EV Dealership Partner</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          Register a multi-brand EV showroom dealer, configure floor allocation quotas, and issue dealer portal credentials.
                        </p>
                      </div>

                      <form onSubmit={handleRegisterShopkeeper} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Showroom / Dealership Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. GreenWheels EV World"
                              value={shopForm.shopName}
                              onChange={e => setShopForm({ ...shopForm, shopName: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Dealer Principal (Owner Name) *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rajesh Singhania"
                              value={shopForm.ownerName}
                              onChange={e => setShopForm({ ...shopForm, ownerName: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (+91) *</label>
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
                            <label className="block text-xs font-bold text-gray-700 mb-1">Showroom City Hub *</label>
                            <select
                              value={shopForm.city}
                              onChange={e => setShopForm({ ...shopForm, city: e.target.value })}
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
                          <label className="block text-xs font-bold text-gray-700 mb-1">Full Commercial Address *</label>
                          <input
                            type="text"
                            required
                            placeholder="Plot / Showroom No., Sector / Road, Landmark"
                            value={shopForm.address}
                            onChange={e => setShopForm({ ...shopForm, address: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN Registration Number *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 07AABC1234F1Z5"
                              value={shopForm.gstNumber}
                              onChange={e => setShopForm({ ...shopForm, gstNumber: e.target.value.toUpperCase() })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Commission Rate Tier *</label>
                            <select
                              value={shopForm.commissionRate}
                              onChange={e => setShopForm({ ...shopForm, commissionRate: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                            >
                              <option value="3.5%">3.5% Standard Dealership</option>
                              <option value="4.0%">4.0% Premier Dealership</option>
                              <option value="4.5%">4.5% Exclusive Flagship Hub</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <span>Onboard EV Dealership Partner</span>
                            <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShopViewMode('dealers')}
                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })()}

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
            {/* TAB: EV CATEGORIES & CATALOG LANDING HUB */}
            {(activeTab as string) === 'catalog-hub' && (() => {
              const filteredCats = categories.filter(c => {
                if (archScaleFilter !== 'ALL') {
                  if (archScaleFilter === 'TECH_COMPONENTS') {
                    if (c.type !== 'SPARE_PART' && c.scaleTier !== 'BATTERY_STORAGE' && c.scaleTier !== 'CHARGING_INFRA' && c.scaleTier !== 'SPARE_COMPONENTS') {
                      return false;
                    }
                  } else if (c.scaleTier !== archScaleFilter) {
                    return false;
                  }
                }
                if (archSearchQuery) {
                  const q = archSearchQuery.toLowerCase();
                  const matchCat = c.name.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || (c.scaleLabel && c.scaleLabel.toLowerCase().includes(q));
                  const matchSub = subCategories.some(s => s.categoryId === c.id && (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || (s.vehicleSegment && s.vehicleSegment.toLowerCase().includes(q))));
                  const matchBrand = brands.some(b => b.name.toLowerCase().includes(q) && b.categories.some(bc => bc.toLowerCase().includes(c.name.toLowerCase())));
                  return matchCat || matchSub || matchBrand;
                }
                return true;
              });

              const filteredSubs = subCategories.filter(s => {
                if (subCategoryFilterParent !== 'ALL' && s.categoryId !== subCategoryFilterParent) return false;
                if (!archSearchQuery) return true;
                const q = archSearchQuery.toLowerCase();
                return (
                  s.name.toLowerCase().includes(q) ||
                  s.description.toLowerCase().includes(q) ||
                  s.categoryName.toLowerCase().includes(q) ||
                  (s.vehicleSegment && s.vehicleSegment.toLowerCase().includes(q))
                );
              });

              const filteredBrands = brands.filter(b => {
                if (!archSearchQuery) return true;
                const q = archSearchQuery.toLowerCase();
                return (
                  b.name.toLowerCase().includes(q) ||
                  b.origin.toLowerCase().includes(q) ||
                  b.categories.some(c => c.toLowerCase().includes(q))
                );
              });

              // Dynamic Storefront URL & Filtered Vehicles for Landing Hub
              const activeParentCat = categories.find(c =>
                (c.categoryKey && c.categoryKey.toUpperCase() === landingSelectedCat.toUpperCase()) ||
                c.slug.toLowerCase() === landingSelectedCat.toLowerCase() ||
                c.id === landingSelectedCat
              );

              const activeChildSubs = activeParentCat ? subCategories.filter(s => s.categoryId === activeParentCat.id) : [];

              const currentStorefrontPath = `/vehicles?category=${activeParentCat?.categoryKey || landingSelectedCat}${landingSelectedSub !== 'ALL' ? `&subcategory=${landingSelectedSub}` : ''}`;
              const currentStorefrontUrl = `https://vidyutva-ev-marketplace.vercel.app${currentStorefrontPath}`;

              const displayedLandingVehicles = vehicles.filter(v => {
                if (landingSelectedCat !== 'ALL') {
                  const qNorm = landingSelectedCat.trim().toUpperCase();
                  let match = Boolean(v.category && (v.category === landingSelectedCat || v.category.toUpperCase() === qNorm));
                  if (!match && activeParentCat) {
                    const catKey = activeParentCat.categoryKey ? activeParentCat.categoryKey.toUpperCase() : '';
                    const catName = activeParentCat.name.toLowerCase();
                    match = Boolean(v.category && v.category.toUpperCase() === catKey) ||
                            v.name.toLowerCase().includes(catName) ||
                            v.tagline.toLowerCase().includes(catName);
                  }
                  if (!match) return false;
                }

                if (landingSelectedSub !== 'ALL') {
                  const subObj = subCategories.find(s => s.id === landingSelectedSub || s.slug === landingSelectedSub);
                  if (subObj) {
                    const subTerm = subObj.name.toLowerCase();
                    const matchesSub = v.name.toLowerCase().includes(subTerm) ||
                                       v.tagline.toLowerCase().includes(subTerm) ||
                                       Boolean(v.description && v.description.toLowerCase().includes(subTerm));
                    if (!matchesSub && subObj.vehicleSegment) {
                      const segMatch = v.name.toLowerCase().includes(subObj.vehicleSegment.toLowerCase());
                      if (!segMatch) return false;
                    }
                  }
                }

                if (archSearchQuery) {
                  const q = archSearchQuery.toLowerCase();
                  const matchesQ = v.name.toLowerCase().includes(q) ||
                                   v.brand.toLowerCase().includes(q) ||
                                   v.tagline.toLowerCase().includes(q);
                  if (!matchesQ) return false;
                }

                return true;
              });

              return (
                <div className="space-y-6">
                  {/* 1. Command Header Banner */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06152B] via-[#0E2442] to-[#12335C] p-6 sm:p-8 text-white shadow-xl border border-blue-400/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-[#B7F34A] text-xs font-black border border-emerald-400/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>EV Vahan Categories & Master Catalog Hub</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                          EV Categories & Catalog Hub
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Complete electric vehicle classification: Primary Segments (Electric Scooters, Electric Autos, Cargo, Loaders) ➔ Subcategories with PM E-DRIVE subsidies ➔ Verified OEM Brands. Live working mode linked directly with customer storefront.
                        </p>
                      </div>

                      {/* Quick Add Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#B7F34A]" />
                          <span>+ Add Primary Category</span>
                        </button>

                        <button
                          onClick={() => {
                            if (categories.length > 0 && !subCategoryForm.categoryId) {
                              setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                            }
                            setIsSubCategoryModalOpen(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-white" />
                          <span>+ Add Category (Sub-Category)</span>
                        </button>

                        <button
                          onClick={() => setIsBrandModalOpen(true)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-purple-200" />
                          <span>+ Add OEM Brand</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Executive Taxonomy KPI Counters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Categories</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-white">{categories.length}</span>
                          <span className="text-[10px] font-bold text-emerald-400">100% Live</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Master vehicle & parts segments</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Categories (Sub-Categories)</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-[#00D2FF]">{subCategories.length}</span>
                          <span className="text-[10px] font-bold text-slate-300">All Scales</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Micro 2W to 55T heavy dumpers</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PM E-DRIVE Qualified</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-[#B7F34A]">
                            {subCategories.filter(s => s.subsidyEligible).length}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-300">Subsidy Approved</span>
                        </div>
                        <span className="text-[10px] text-slate-400">AIS-156 & FAME compliant</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OEM Brands & Partners</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-amber-300">{brands.length}</span>
                          <span className="text-[10px] font-bold text-amber-200">Tier-1 Verified</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Official manufacturers on platform</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Control & Filter Center */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-subtle space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* View Switcher Tabs */}
                      <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-2xl overflow-x-auto w-max">
                        <button
                          onClick={() => setArchViewMode('overview-hub')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            archViewMode === 'overview-hub'
                              ? 'bg-[#06152B] text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
                          <span>Landing Hub Overview</span>
                        </button>

                        <button
                          onClick={() => setArchViewMode('visual-tree')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            archViewMode === 'visual-tree'
                              ? 'bg-[#06152B] text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5 text-[#00D2FF]" />
                          <span>Category Hierarchy Tree</span>
                        </button>

                        <button
                          onClick={() => setArchViewMode('primary-table')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            archViewMode === 'primary-table'
                              ? 'bg-[#06152B] text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Primary Categories ({categories.length})</span>
                        </button>

                        <button
                          onClick={() => setArchViewMode('subcategory-table')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            archViewMode === 'subcategory-table'
                              ? 'bg-[#06152B] text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5 text-blue-500" />
                          <span>Categories / Sub-Categories ({subCategories.length})</span>
                        </button>

                        <button
                          onClick={() => setArchViewMode('brand-grid')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                            archViewMode === 'brand-grid'
                              ? 'bg-[#06152B] text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 text-purple-500" />
                          <span>OEM Brands ({brands.length})</span>
                        </button>
                      </div>

                      {/* Live Search */}
                      <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search category, model or brand..."
                          value={archSearchQuery}
                          onChange={(e) => setArchSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                        {archSearchQuery && (
                          <button
                            onClick={() => setArchSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Scale Tier Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Vehicle Scale:</span>
                      {[
                        { key: 'ALL', label: 'All Vehicle Scales' },
                        { key: '2W_PERSONAL', label: '2W (Micro & Personal)' },
                        { key: '3W_COMMERCIAL', label: '3W (L5 & Cargo Autos)' },
                        { key: '4W_PASSENGER', label: '4W (Cars, SUVs & Cabs)' },
                        { key: 'LCV_TRUCKS', label: 'LCV (Mini-Trucks & Logistics)' },
                        { key: 'HEAVY_COMMERCIAL', label: 'Heavy (Transit Buses & Haulers)' },
                        { key: 'SPECIAL_INDUSTRIAL', label: 'Special (Agri & Industrial)' },
                        { key: 'TECH_COMPONENTS', label: 'Tech (Batteries, Chargers & Parts)' },
                      ].map(f => (
                        <button
                          key={f.key}
                          onClick={() => setArchScaleFilter(f.key)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 text-xs cursor-pointer ${
                            archScaleFilter === f.key
                              ? 'bg-[#16A34A] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. CONTENT SECTIONS BASED ON archViewMode */}
                  {/* MODE 0: DEDICATED LANDING PAGE OVERVIEW HUB */}
                  {archViewMode === 'overview-hub' && (
                    <div className="space-y-6 animate-in fade-in">
                      {/* Section 1: Executive 4-Portal Launchpad */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="p-5 rounded-3xl bg-white border border-gray-200 shadow-subtle hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <Plus className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 group-hover:text-emerald-700 transition-colors">
                              + Add Primary Category
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Add new master mobility segment (Electric Scooters, Autos, Cargo, Loaders) with custom URL filter key.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
                            Open Category Studio →
                          </span>
                        </div>

                        <div
                          onClick={() => {
                            if (categories.length > 0 && !subCategoryForm.categoryId) {
                              setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                            }
                            setIsSubCategoryModalOpen(true);
                          }}
                          className="p-5 rounded-3xl bg-white border border-gray-200 shadow-subtle hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <Layers className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-700 transition-colors">
                              + Add Sub-Category (Dropdown)
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Select parent primary category from dropdown and configure speed, range, payload & PM E-DRIVE subsidies.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1">
                            Open Subcategory Studio →
                          </span>
                        </div>

                        <div
                          onClick={() => setIsBrandModalOpen(true)}
                          className="p-5 rounded-3xl bg-white border border-gray-200 shadow-subtle hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <Award className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                              + Register OEM Brand
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Onboard certified EV manufacturers, battery suppliers & warranty SLA partners live to storefront.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-purple-600 mt-4 flex items-center gap-1">
                            Open Brand Studio →
                          </span>
                        </div>

                        <div
                          onClick={() => setArchViewMode('visual-tree')}
                          className="p-5 rounded-3xl bg-white border border-gray-200 shadow-subtle hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 group-hover:text-amber-700 transition-colors">
                              Category Hierarchy View
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              Inspect complete tree view of {categories.length} primary categories and {subCategories.length} child sub-types.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-amber-600 mt-4 flex items-center gap-1">
                            View Full Hierarchy →
                          </span>
                        </div>
                      </div>

                      {/* Section: Live Customer Catalog Showcase & Direct Link Creator */}
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                        {/* Header & Quick Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-gray-900">
                                Electric Vehicles Catalog Showcase
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                                Showing {displayedLandingVehicles.length} certified models
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Live storefront preview & link generator. Select category and subcategory to filter models, test live links, and onboard new vehicles.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setVehicleForm(prev => ({
                                  ...prev,
                                  category: landingSelectedCat !== 'ALL' ? landingSelectedCat : 'ELECTRIC_SCOOTER'
                                }));
                                setIsVehicleModalOpen(true);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-emerald-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-[#B7F34A]" />
                              <span>+ Add Vehicle to Catalog</span>
                            </button>
                          </div>
                        </div>

                        {/* 1. Category Navigation Selector Bar (Exact match to storefront) */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Select Primary Category:</span>
                          </div>
                          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            <button
                              onClick={() => {
                                setLandingSelectedCat('ALL');
                                setLandingSelectedSub('ALL');
                              }}
                              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                                landingSelectedCat === 'ALL'
                                  ? 'bg-[#06152B] text-white shadow-md ring-2 ring-emerald-400/40'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              All Categories
                            </button>
                            {categories.filter(c => c.type === 'VEHICLE').map((cat) => {
                              const catKey = cat.categoryKey || cat.slug;
                              const isSelected = landingSelectedCat === catKey || landingSelectedCat === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    setLandingSelectedCat(catKey);
                                    setLandingSelectedSub('ALL');
                                  }}
                                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                                    isSelected
                                      ? 'bg-[#16A34A] text-white shadow-md ring-2 ring-emerald-500/40'
                                      : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800'
                                  }`}
                                >
                                  <span>{cat.name}</span>
                                  {cat.categoryKey && (
                                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                                      isSelected ? 'bg-black/20 text-white' : 'bg-white text-gray-500 border border-gray-200'
                                    }`}>
                                      {cat.categoryKey}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                            <button
                              onClick={() => setIsCategoryModalOpen(true)}
                              className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-dashed border-emerald-300 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Primary Category</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. Dynamic Subcategories Bar (When a Primary Category is chosen) */}
                        {landingSelectedCat !== 'ALL' && activeChildSubs.length > 0 && (
                          <div className="bg-gray-50/90 p-4 rounded-2xl border border-gray-200/80 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-600" />
                                <span>Subcategories for {activeParentCat?.name || landingSelectedCat}:</span>
                              </span>
                              <button
                                onClick={() => {
                                  if (activeParentCat) {
                                    setSubCategoryForm(prev => ({ ...prev, categoryId: activeParentCat.id }));
                                  }
                                  setIsSubCategoryModalOpen(true);
                                }}
                                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Subcategory (Dropdown)</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                              <button
                                onClick={() => setLandingSelectedSub('ALL')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                  landingSelectedSub === 'ALL'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                              >
                                All {activeParentCat?.name || 'Subcategories'}
                              </button>
                              {activeChildSubs.map(sub => {
                                const isSubSelected = landingSelectedSub === sub.id || landingSelectedSub === sub.slug;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => setLandingSelectedSub(sub.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                                      isSubSelected
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200'
                                    }`}
                                  >
                                    <span>{sub.name}</span>
                                    {sub.subsidyEligible && (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                        isSubSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        PM E-DRIVE
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 3. Live Storefront Link Creator & Filter Bar */}
                        <div className="bg-gradient-to-r from-[#06152B] via-[#0E2442] to-[#12335C] p-4 sm:p-5 rounded-2xl border border-blue-400/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-[#B7F34A] text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                                Generated Storefront URL
                              </span>
                              <span className="text-xs text-blue-200">
                                Direct Customer Route:
                              </span>
                            </div>
                            <div className="font-mono text-xs sm:text-sm text-cyan-300 font-bold break-all bg-black/40 px-3 py-1.5 rounded-lg border border-cyan-400/20 select-all">
                              {currentStorefrontUrl}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(currentStorefrontUrl);
                                setCopiedLink(true);
                                setTimeout(() => setCopiedLink(false), 2500);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
                              title="Copy live customer link"
                            >
                              <Copy className="w-3.5 h-3.5 text-cyan-300" />
                              <span>{copiedLink ? '✓ Copied!' : 'Copy Link'}</span>
                            </button>
                            <a
                              href={currentStorefrontPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                              title="Open filtered customer catalog in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-white" />
                              <span>Open Storefront ↗</span>
                            </a>
                          </div>
                        </div>

                        {/* Active Filters Pill */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gray-500 font-bold">Active Filters:</span>
                            {landingSelectedCat !== 'ALL' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-300">
                                <span>Category: {landingSelectedCat}</span>
                                <button
                                  onClick={() => { setLandingSelectedCat('ALL'); setLandingSelectedSub('ALL'); }}
                                  className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                                >
                                  ✕
                                </button>
                              </span>
                            )}
                            {landingSelectedSub !== 'ALL' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-300">
                                <span>Subcategory: {subCategories.find(s => s.id === landingSelectedSub)?.name || landingSelectedSub}</span>
                                <button
                                  onClick={() => setLandingSelectedSub('ALL')}
                                  className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                                >
                                  ✕
                                </button>
                              </span>
                            )}
                            {(landingSelectedCat !== 'ALL' || landingSelectedSub !== 'ALL') && (
                              <button
                                onClick={() => { setLandingSelectedCat('ALL'); setLandingSelectedSub('ALL'); }}
                                className="text-xs text-gray-500 hover:text-red-600 underline font-semibold ml-1 cursor-pointer"
                              >
                                Clear All Filters
                              </button>
                            )}
                          </div>

                          <span className="text-xs text-gray-500 font-medium">
                            Showing <strong>{displayedLandingVehicles.length}</strong> certified models
                          </span>
                        </div>

                        {/* 4. Live Vehicle Cards Grid */}
                        {displayedLandingVehicles.length === 0 ? (
                          <div className="p-10 rounded-3xl border border-dashed border-gray-300 text-center space-y-3 bg-gray-50">
                            <Truck className="w-10 h-10 text-gray-400 mx-auto" />
                            <h4 className="text-sm font-bold text-gray-800">No vehicles in this segment yet</h4>
                            <p className="text-xs text-gray-500 max-w-md mx-auto">
                              No electric models found matching the selected category and subcategory. Add your first vehicle model using the studio.
                            </p>
                            <button
                              onClick={() => {
                                setVehicleForm(prev => ({
                                  ...prev,
                                  category: landingSelectedCat !== 'ALL' ? landingSelectedCat : 'ELECTRIC_SCOOTER'
                                }));
                                setIsVehicleModalOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#B7F34A]" />
                              <span>+ Add Vehicle to Catalog</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {displayedLandingVehicles.map((v) => {
                              const primaryImage = v.images?.find((img: any) => img.isPrimary)?.url || v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80';
                              return (
                                <div
                                  key={v.id}
                                  className="rounded-3xl border border-gray-200 overflow-hidden bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                  <div>
                                    {/* Image & Stock Badge */}
                                    <div className="relative h-48 overflow-hidden bg-gray-900 group">
                                      <img
                                        src={primaryImage}
                                        alt={v.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                      
                                      {/* Stock Tag */}
                                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                          v.inStock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                          {v.inStock ? 'In Stock • Ready for Delivery' : 'Out of Stock'}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-emerald-300">
                                          Book at ₹{v.bookingTokenAmount?.toLocaleString('en-IN') || '2,999'}
                                        </span>
                                      </div>

                                      {/* Colours Preview */}
                                      {v.variants && v.variants.length > 0 && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">
                                          {v.variants.slice(0, 3).map((vr: any) => (
                                            <span
                                              key={vr.id}
                                              className="w-3 h-3 rounded-full border border-white/50"
                                              style={{ backgroundColor: vr.colorHex }}
                                              title={vr.colorName}
                                            />
                                          ))}
                                        </div>
                                      )}

                                      {/* Title & Brand on Image */}
                                      <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                          {v.brand}
                                        </div>
                                        <h4 className="text-base font-black leading-tight drop-shadow-sm">
                                          {v.name}
                                        </h4>
                                        <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1">
                                          {v.tagline}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Price & Subsidy Box */}
                                    <div className="p-4 space-y-3">
                                      <div className="flex items-baseline justify-between border-b border-gray-100 pb-2.5">
                                        <div>
                                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Ex-Showroom Price</span>
                                          <strong className="text-lg font-black text-gray-900">
                                            ₹{v.exShowroomPrice.toLocaleString('en-IN')}
                                          </strong>
                                        </div>
                                        {v.subsidyEstimate > 0 && (
                                          <div className="text-right">
                                            <span className="text-[11px] font-black text-[#16A34A] block bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                              ₹{v.subsidyEstimate.toLocaleString('en-IN')} Subsidy
                                            </span>
                                            <span className="text-[9px] text-gray-400">FAME-II / State credit</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* 4 Core Technical Specs Grid */}
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Certified Range</span>
                                          <strong className="text-xs font-black text-gray-900 flex items-center gap-1">
                                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{v.certifiedRangeKm} km</span>
                                          </strong>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Battery Capacity</span>
                                          <strong className="text-xs font-black text-gray-900 flex items-center gap-1">
                                            <Box className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{v.batteryCapacityKwh} kWh</span>
                                          </strong>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Max Speed</span>
                                          <strong className="text-xs font-black text-gray-900">
                                            {v.topSpeedKmph} km/h
                                          </strong>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Charging Time</span>
                                          <strong className="text-xs font-black text-gray-900">
                                            {v.chargingTimeHours} hrs
                                          </strong>
                                        </div>
                                      </div>

                                      <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100 flex items-center justify-between">
                                        <span className="truncate">{v.certifiedRangeCondition || 'ARAI / IDC Certified under test conditions'}</span>
                                        <span className="font-bold text-gray-700 shrink-0 ml-1">{v.warrantyYears}Y / {v.warrantyKm / 1000}k km</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Admin Actions Footer */}
                                  <div className="p-4 pt-0 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`/vehicles/${v.modelSlug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                        title="Open vehicle detail page on storefront"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Storefront View ↗</span>
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() => handleToggleVehicleStock(v.id, v.inStock)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                          v.inStock
                                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}
                                        title="Toggle stock availability"
                                      >
                                        {v.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteVehicle(v.id, v.name)}
                                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all border border-rose-200 cursor-pointer"
                                        title="Remove vehicle from catalog"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Core Primary EV Categories Landing Grid (Working Live Cards) */}
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-gray-900">
                                Primary Electric Vehicle Categories
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                                {categories.filter(c => c.type === 'VEHICLE').length} Vehicle Classes
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Live storefront segments linked directly with customer catalog filter routes.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setArchViewMode('primary-table')}
                              className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                            >
                              Manage All ({categories.length}) →
                            </button>
                            <button
                              onClick={() => setIsCategoryModalOpen(true)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Category</span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {categories.filter(c => c.type === 'VEHICLE').map((cat) => {
                            const childSubs = subCategories.filter(s => s.categoryId === cat.id);
                            return (
                              <div
                                key={cat.id}
                                className="rounded-3xl border border-gray-200 overflow-hidden bg-gray-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                              >
                                <div>
                                  {/* Cover Image & Badges */}
                                  <div className="relative h-44 overflow-hidden bg-gray-900">
                                    <img
                                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}
                                      alt={cat.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                      {cat.categoryKey && (
                                        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                                          {cat.categoryKey}
                                        </span>
                                      )}
                                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-gray-900">
                                        {cat.scaleLabel || cat.type}
                                      </span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                      <h4 className="text-base font-black leading-tight drop-shadow-sm">{cat.name}</h4>
                                      <p className="text-[11px] text-gray-200 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                                    </div>
                                  </div>

                                  {/* Body Details */}
                                  <div className="p-4 space-y-3">
                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                      {cat.description}
                                    </p>

                                    {/* Subcategories Preview Pills */}
                                    <div className="pt-2 border-t border-gray-200/60 space-y-1.5">
                                      <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-gray-500">Linked Subcategories:</span>
                                        <span className="text-emerald-700 font-mono">{childSubs.length} Classes</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                                        {childSubs.slice(0, 3).map(sub => (
                                          <span
                                            key={sub.id}
                                            className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-medium"
                                          >
                                            {sub.name}
                                          </span>
                                        ))}
                                        {childSubs.length > 3 && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-700 font-bold">
                                            +{childSubs.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Working Action Footer */}
                                <div className="p-4 pt-0 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={`/vehicles?category=${cat.categoryKey || cat.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                      title="Open customer storefront page"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      <span>Storefront ↗</span>
                                    </a>

                                    <button
                                      onClick={() => {
                                        setSubCategoryForm(prev => ({
                                          ...prev,
                                          categoryId: cat.id,
                                          name: '',
                                          description: '',
                                          vehicleSegment: '',
                                          speedRangeTier: '',
                                          typicalPayloadOrSeats: '',
                                          subsidyEligible: true
                                        }));
                                        setIsSubCategoryModalOpen(true);
                                      }}
                                      className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-xs font-bold transition-all border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                      title="Add subcategory with this parent pre-selected"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Subcategory</span>
                                    </button>

                                    <button
                                      onClick={() => handleToggleCategoryStatus(cat.id)}
                                      className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        cat.status === 'ACTIVE'
                                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {cat.status === 'ACTIVE' ? '✓ LIVE' : 'HIDDEN'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 3: Vehicle Scale Taxonomy Matrix (2W to Heavy Commercial) */}
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>National EV Vehicle Scale Classification</span>
                          </h3>
                          <p className="text-xs text-gray-500">
                            Standards compliant scale hierarchy supporting micro-mobility, passenger transport, and heavy transit fleets.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Scale Tier 1</span>
                            <strong className="text-gray-900 text-sm block">2W Personal Mobility</strong>
                            <p className="text-[11px] text-gray-600">L1 Non-RTO (25 km/h) & L2 High-Speed (85-115 km/h) Scooters & E-Bikes.</p>
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              PM E-DRIVE ✓
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Scale Tier 2</span>
                            <strong className="text-gray-900 text-sm block">3W Commercial Passenger</strong>
                            <p className="text-[11px] text-gray-600">4+1 City E-Rickshaws & L5M High-Speed Passenger Auto Rickshaws.</p>
                            <span className="inline-block text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                              PM E-DRIVE ✓
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Scale Tier 3</span>
                            <strong className="text-gray-900 text-sm block">3W Cargo & Loaders</strong>
                            <p className="text-[11px] text-gray-600">L5N Closed Delivery Boxes, Heavy Flatbeds & Hydraulic Tippers (750kg).</p>
                            <span className="inline-block text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                              FAME / Commercial ✓
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
                            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Scale Tier 4</span>
                            <strong className="text-gray-900 text-sm block">LCV Commercial Trucks</strong>
                            <p className="text-[11px] text-gray-600">1.0T-2.5T Intra-city Delivery Mini-Trucks & Cold-Chain Reefers.</p>
                            <span className="inline-block text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                              Logistics Fleets
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Scale Tier 5</span>
                            <strong className="text-gray-900 text-sm block">Heavy Commercial & Buses</strong>
                            <p className="text-[11px] text-gray-600">9m/12m Public Transit Buses & 28T-55T Electric Mining Tippers.</p>
                            <span className="inline-block text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                              State Fleets
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: PM E-DRIVE Subsidy Approved Subcategories Roster */}
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                              <span>PM E-DRIVE Subsidy Approved EV Subcategories</span>
                            </h3>
                            <p className="text-xs text-gray-500">
                              AIS-156 safety certified vehicle configurations eligible for central government financial subsidies.
                            </p>
                          </div>
                          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                            {subCategories.filter(s => s.subsidyEligible).length} Approved Segments
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] border-b border-gray-100">
                              <tr>
                                <th className="p-3">Subcategory / Model Class</th>
                                <th className="p-3">Parent Primary Segment</th>
                                <th className="p-3">Regulatory Code</th>
                                <th className="p-3">Certified Speed / Range</th>
                                <th className="p-3">Seating / Capacity</th>
                                <th className="p-3 text-right">Subsidy Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                              {subCategories.filter(s => s.subsidyEligible).map((sub) => {
                                const parent = categories.find(c => c.id === sub.categoryId);
                                return (
                                  <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-3 font-bold text-gray-900">
                                      {sub.name}
                                    </td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold">
                                        {parent?.name || sub.categoryName}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-[11px] text-gray-500">
                                      {sub.vehicleSegment || 'N/A'}
                                    </td>
                                    <td className="p-3">
                                      {sub.speedRangeTier || 'Standard AIS'}
                                    </td>
                                    <td className="p-3">
                                      {sub.typicalPayloadOrSeats || 'Standard'}
                                    </td>
                                    <td className="p-3 text-right">
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                        PM E-DRIVE ✓
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE A: INTERACTIVE VISUAL HIERARCHY TREE */}
                  {archViewMode === 'visual-tree' && (
                    <div className="space-y-6">
                      {filteredCats.map((cat) => {
                        const childSubs = subCategories.filter(s => {
                          const matchesParent = s.categoryId === cat.id;
                          if (!matchesParent) return false;
                          if (!archSearchQuery) return true;
                          const q = archSearchQuery.toLowerCase();
                          return (
                            s.name.toLowerCase().includes(q) ||
                            s.description.toLowerCase().includes(q) ||
                            (s.vehicleSegment && s.vehicleSegment.toLowerCase().includes(q))
                          );
                        });

                        const relatedBrands = brands.filter(b =>
                          b.categories.some(bc =>
                            bc.toLowerCase().includes(cat.name.toLowerCase()) ||
                            cat.name.toLowerCase().includes(bc.toLowerCase()) ||
                            (cat.slug.includes('2-wheeler') && bc.toLowerCase().includes('scooter')) ||
                            (cat.slug.includes('3-wheeler') && bc.toLowerCase().includes('auto')) ||
                            (cat.slug.includes('truck') && (bc.toLowerCase().includes('cargo') || bc.toLowerCase().includes('truck'))) ||
                            (cat.slug.includes('bus') && (bc.toLowerCase().includes('bus') || bc.toLowerCase().includes('commercial'))) ||
                            (cat.slug.includes('special') && bc.toLowerCase().includes('special')) ||
                            (cat.slug.includes('batter') && bc.toLowerCase().includes('batter')) ||
                            (cat.slug.includes('charger') && bc.toLowerCase().includes('charger')) ||
                            (cat.slug.includes('spare') && bc.toLowerCase().includes('spare'))
                          )
                        );

                        return (
                          <div
                            key={cat.id}
                            className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-5 transition-all hover:border-emerald-300"
                          >
                            {/* Primary Category Header */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                              <div className="flex items-start sm:items-center gap-4">
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-16 h-14 object-cover rounded-2xl bg-gray-100 border border-gray-200 shadow-xs shrink-0"
                                />
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
                                    {cat.categoryKey && (
                                      <span className="font-mono font-bold text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Key: {cat.categoryKey}
                                      </span>
                                    )}
                                    <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                      /{cat.slug}
                                    </span>
                                    {cat.scaleLabel && (
                                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                                        {cat.scaleLabel}
                                      </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                      cat.type === 'VEHICLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                      cat.type === 'SPARE_PART' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      'bg-purple-50 text-purple-700 border border-purple-200'
                                    }`}>
                                      {cat.type}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium">{cat.subtitle}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                                </div>
                              </div>

                              {/* Actions on Primary Category */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                                {cat.type === 'VEHICLE' && (
                                  <a
                                    href={`/vehicles?category=${cat.categoryKey || cat.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 flex items-center gap-1.5"
                                    title="Open filtered customer storefront page"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Storefront ↗</span>
                                  </a>
                                )}

                                <button
                                  onClick={() => {
                                    setSubCategoryForm(prev => ({
                                      ...prev,
                                      categoryId: cat.id,
                                      name: '',
                                      description: '',
                                      vehicleSegment: '',
                                      speedRangeTier: '',
                                      typicalPayloadOrSeats: '',
                                      subsidyEligible: true
                                    }));
                                    setIsSubCategoryModalOpen(true);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] text-xs font-bold transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#16A34A]" />
                                  <span>+ Add Subcategory (Dropdown)</span>
                                </button>

                                <button
                                  onClick={() => handleToggleCategoryStatus(cat.id)}
                                  className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                                    cat.status === 'ACTIVE'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {cat.status === 'ACTIVE' ? '✓ LIVE' : 'HIDDEN'}
                                </button>

                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  title="Delete Primary Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Nested Sub-Categories Grid */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span>Categories / Sub-Categories ({childSubs.length})</span>
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  Specific vehicle sizes, variants & technical classes
                                </span>
                              </div>

                              {childSubs.length === 0 ? (
                                <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
                                  <p className="text-xs text-gray-500 font-medium">No sub-categories linked to this primary segment yet.</p>
                                  <button
                                    onClick={() => {
                                      setSubCategoryForm(prev => ({ ...prev, categoryId: cat.id }));
                                      setIsSubCategoryModalOpen(true);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-emerald-700 transition-all inline-flex items-center gap-1.5"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add First Category</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {childSubs.map((sub) => (
                                    <div
                                      key={sub.id}
                                      className="p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 flex flex-col justify-between space-y-2 hover:bg-white hover:shadow-xs transition-all"
                                    >
                                      <div className="space-y-1.5">
                                        <div className="flex items-start justify-between gap-2">
                                          <h4 className="text-xs font-black text-gray-900 leading-snug">
                                            {sub.name}
                                          </h4>
                                          <button
                                            onClick={() => handleToggleSubCategoryStatus(sub.id)}
                                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                              sub.status === 'ACTIVE'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-200 text-gray-600'
                                            }`}
                                          >
                                            {sub.status}
                                          </button>
                                        </div>

                                        {/* Segment & Specs Badges */}
                                        <div className="flex flex-wrap gap-1">
                                          {sub.vehicleSegment && (
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                                              {sub.vehicleSegment}
                                            </span>
                                          )}
                                          {sub.speedRangeTier && (
                                            <span className="px-2 py-0.5 rounded bg-gray-200/80 text-gray-800 text-[10px] font-medium">
                                              ⚡ {sub.speedRangeTier}
                                            </span>
                                          )}
                                          {sub.typicalPayloadOrSeats && (
                                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                                              📦 {sub.typicalPayloadOrSeats}
                                            </span>
                                          )}
                                          {sub.subsidyEligible && (
                                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#16A34A] text-[10px] font-bold border border-emerald-200">
                                              ✓ PM E-DRIVE Eligible
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-[11px] text-gray-500 line-clamp-2">
                                          {sub.description}
                                        </p>
                                      </div>

                                      <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                                        <span className="font-mono text-gray-400">/{sub.slug}</span>
                                        <button
                                          onClick={() => handleDeleteSubCategory(sub.id)}
                                          className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Remove</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Tagged Certified Brands for this Primary */}
                            {relatedBrands.length > 0 && (
                              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                                  Verified OEM Brands:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {relatedBrands.map(b => (
                                    <span
                                      key={b.id}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800"
                                    >
                                      <img src={b.logoUrl} alt={b.name} className="w-4 h-4 rounded-md object-cover" />
                                      <span>{b.name}</span>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* MODE B: PRIMARY CATEGORIES TABLE */}
                  {archViewMode === 'primary-table' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-gray-900">
                          Primary Categories Master Desk ({filteredCats.length})
                        </h3>
                        <button
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Primary</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                            <tr>
                              <th className="p-3">Primary Name & Banner</th>
                              <th className="p-3">Scale & Subtitle</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Categories</th>
                              <th className="p-3">Live Status</th>
                              <th className="p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredCats.map((cat) => {
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
                                  <td className="p-3">
                                    <span className="font-bold text-gray-900 block">{cat.scaleLabel || 'Multi-Category'}</span>
                                    <span className="text-[11px] text-gray-500">{cat.subtitle}</span>
                                  </td>
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
                                      {subsCount} Categories
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
                                      {cat.status === 'ACTIVE' ? '✓ LIVE' : 'HIDDEN'}
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

                  {/* MODE C: SUBCATEGORY TABLE */}
                  {archViewMode === 'subcategory-table' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-gray-900">
                          Category / Sub-Categories Desk ({filteredSubs.length})
                        </h3>
                        <button
                          onClick={() => {
                            if (categories.length > 0 && !subCategoryForm.categoryId) {
                              setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                            }
                            setIsSubCategoryModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Category</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                            <tr>
                              <th className="p-3">Category Name</th>
                              <th className="p-3">Primary Segment</th>
                              <th className="p-3">Vehicle Segment & Specs</th>
                              <th className="p-3">Subsidy</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredSubs.map((sub) => (
                              <tr key={sub.id} className="hover:bg-gray-50/70">
                                <td className="p-3">
                                  <strong className="text-xs font-bold text-gray-900 block">{sub.name}</strong>
                                  <span className="font-mono text-gray-400 text-[10px]">/{sub.slug}</span>
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                                    {sub.categoryName}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="space-y-0.5">
                                    {sub.vehicleSegment && (
                                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] inline-block mr-1">
                                        {sub.vehicleSegment}
                                      </span>
                                    )}
                                    {sub.speedRangeTier && (
                                      <span className="text-gray-600 text-[10px] block">
                                        ⚡ {sub.speedRangeTier}
                                      </span>
                                    )}
                                    {sub.typicalPayloadOrSeats && (
                                      <span className="text-amber-800 text-[10px] block">
                                        📦 {sub.typicalPayloadOrSeats}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3">
                                  {sub.subsidyEligible ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      ✓ PM E-DRIVE
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-[10px]">Standard</span>
                                  )}
                                </td>
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

                  {/* MODE D: BRAND GRID */}
                  {archViewMode === 'brand-grid' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-gray-900">
                          OEM Brands & Verified Technology Partners ({filteredBrands.length})
                        </h3>
                        <button
                          onClick={() => setIsBrandModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Register Brand</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBrands.map((b) => (
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
                </div>
              );
            })()}

            {/* TAB: PRIMARY CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-bold border border-emerald-200 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Frontend EV Catalog & Categories</span>
                    </div>
                    <h2 className="text-xl font-black text-[#06152B]">
                      Primary ({categories.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Create, reorder, and publish main primary categories shown live on Homepage "Shop by Category" and Header menus.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Catalog Landing Hub →</span>
                    </button>
                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Create Primary</span>
                    </button>
                  </div>
                </div>

                {/* Primary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Primary Name & Banner</th>
                        <th className="p-3">Subtitle / Tagline</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Categories</th>
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
                                {subsCount} Categories
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
                                title="Delete Primary Category"
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

            {/* TAB: CATEGORY MANAGEMENT */}
            {activeTab === 'subcategories' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#06152B]">
                      Category ({subCategories.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Organize granular category types (e.g. High-Speed, Delivery Boxes, 72V LFP Batteries) under primary categories.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Catalog Landing Hub →</span>
                    </button>
                    <button
                      onClick={() => {
                        if (categories.length > 0 && !subCategoryForm.categoryId) {
                          setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                        }
                        setIsSubCategoryModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Create Category</span>
                    </button>
                  </div>
                </div>

                {/* Filter by Primary Category */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Primary Category:</span>
                  <button
                    onClick={() => setSubCategoryFilterParent('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      subCategoryFilterParent === 'ALL'
                        ? 'bg-[#06152B] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Categories ({subCategories.length})
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

                {/* Categories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Category Name</th>
                        <th className="p-3">Primary Category</th>
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectTab('catalog-hub', 'catalog-hub')}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Catalog Landing Hub →</span>
                    </button>
                    <button
                      onClick={() => setIsBrandModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 w-max cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Register New OEM Brand</span>
                    </button>
                  </div>
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

            {/* 1. Create Category Full-Screen Studio */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                {/* Full Screen Top Nav Header */}
                <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>← Back</span>
                    </button>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Master EV Catalog / New Category
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        Create New Primary EV Category
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCreateCategory(e as any)}
                      className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Publish Category</span>
                    </button>
                  </div>
                </div>

                {/* Full Screen Content Body */}
                <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
                  <form onSubmit={handleCreateCategory} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Form Inputs */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900">Category Specifications</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Configure the title, scale tier, segment classification, and live storefront display parameters.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Electric Scooters or Electric Autos"
                            value={categoryForm.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              const autoKey = val.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/(^_|_$)/g, '');
                              setCategoryForm(prev => ({
                                ...prev,
                                name: val,
                                categoryKey: !prev.categoryKey || prev.categoryKey === autoKey.slice(0, -1) ? autoKey : prev.categoryKey
                              }));
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Subtitle / Tagline *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Urban, High-Speed & Delivery Scooters"
                            value={categoryForm.subtitle}
                            onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Category Filter Key / URL Code * (e.g. ELECTRIC_SCOOTER)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ELECTRIC_SCOOTER or ELECTRIC_PASSENGER_AUTO"
                          value={categoryForm.categoryKey}
                          onChange={(e) => setCategoryForm({ ...categoryForm, categoryKey: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none bg-white"
                        />
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
                          <span>Storefront Filter URL:</span>
                          <span className="font-mono text-emerald-700 font-bold">/vehicles?category={categoryForm.categoryKey || 'CATEGORY_KEY'}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Catalog Section Type *</label>
                          <select
                            value={categoryForm.type}
                            onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as any })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium bg-white"
                          >
                            <option value="VEHICLE">Electric Vehicles</option>
                            <option value="SPARE_PART">Genuine Spare Parts</option>
                            <option value="SERVICE">Doorstep Services</option>
                            <option value="ACCESSORY">EV Accessories</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Vehicle Scale & Segment Tier</label>
                          <select
                            value={categoryForm.scaleTier || '2W_PERSONAL'}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              const labels: Record<string, string> = {
                                '2W_PERSONAL': 'Micro & Personal Mobility (2W)',
                                '3W_COMMERCIAL': 'Light Commercial 3-Wheeler (L5)',
                                '4W_PASSENGER': 'Passenger Electric Cars (4W)',
                                'LCV_TRUCKS': 'Commercial Fleet & LCV Mini-Trucks',
                                'HEAVY_COMMERCIAL': 'Heavy Commercial & Public Transit',
                                'SPECIAL_INDUSTRIAL': 'Agricultural, Industrial & Special EVs',
                                'BATTERY_STORAGE': 'Energy Storage & Swappable Battery Tech',
                                'CHARGING_INFRA': 'Charging Network & Infrastructure',
                                'SPARE_COMPONENTS': 'OEM Components & ARAI Retrofit Kits'
                              };
                              setCategoryForm({ ...categoryForm, scaleTier: val, scaleLabel: labels[val] || val });
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium bg-white"
                          >
                            <option value="2W_PERSONAL">2-Wheeler (Micro & Personal Mobility)</option>
                            <option value="3W_COMMERCIAL">3-Wheeler (L5 Commercial Passenger & Cargo)</option>
                            <option value="4W_PASSENGER">4-Wheeler (Passenger Cars, SUVs & Cabs)</option>
                            <option value="LCV_TRUCKS">LCV (Mini-Trucks & Delivery Vans)</option>
                            <option value="HEAVY_COMMERCIAL">Heavy Commercial (Buses & Mining Tippers)</option>
                            <option value="SPECIAL_INDUSTRIAL">Special EVs (Tractors, Forklifts & Campus)</option>
                            <option value="BATTERY_STORAGE">Battery Packs & Energy Storage</option>
                            <option value="CHARGING_INFRA">Charging Stations & Infrastructure</option>
                            <option value="SPARE_COMPONENTS">OEM Spare Parts & Retrofit Kits</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={categoryForm.imageUrl}
                          onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Detailed Description</label>
                        <textarea
                          rows={4}
                          placeholder="Describe the vehicle or parts segment for search engines and customers..."
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="featuredCatFull"
                          checked={categoryForm.isFeatured}
                          onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <label htmlFor="featuredCatFull" className="text-xs font-bold text-gray-700 cursor-pointer">
                          Feature this Category on Homepage "Shop by Category" Grid
                        </label>
                      </div>
                    </div>

                    {/* Right 1 Col: Live Preview Card */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Live Storefront Preview
                        </h4>
                        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 shadow-xs">
                          <img
                            src={categoryForm.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}
                            alt="Category Preview"
                            className="w-full h-44 object-cover"
                          />
                          <div className="p-4 space-y-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {categoryForm.type}
                            </span>
                            <h4 className="text-sm font-black text-gray-900 mt-1">
                              {categoryForm.name || 'Category Name'}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {categoryForm.subtitle || 'Category Subtitle / Tagline'}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 space-y-1">
                          <strong className="block font-bold">ℹ️ Enterprise Catalog Tip:</strong>
                          <p className="text-[11px] leading-relaxed text-blue-800">
                            Saving this category creates a top-level taxonomy node in the catalog. You can immediately attach specialized vehicle subcategories and certified OEM brands under it.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#B7F34A]" />
                          <span>Publish Category Live</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(false)}
                          className="px-5 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. Create Sub-Category Full-Screen Studio */}
            {isSubCategoryModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                {/* Full Screen Top Nav Header */}
                <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubCategoryModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>← Back</span>
                    </button>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Master EV Catalog / Vehicle Subcategory
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        Create EV Subcategory & Segment Tier
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSubCategoryModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCreateSubCategory(e as any)}
                      className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B7F34A]" />
                      <span>Publish Subcategory</span>
                    </button>
                  </div>
                </div>

                {/* Full Screen Content Body */}
                <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
                  <form onSubmit={handleCreateSubCategory} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Form Inputs */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900">Subcategory & Segment Configuration</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Link a specific model class, powertrain scale, or payload configuration under an active parent category.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                            <span>Select Primary Category (Dropdown) *</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">Parent Segment</span>
                          </label>
                          <select
                            required
                            value={subCategoryForm.categoryId}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold text-gray-900 bg-white shadow-xs"
                          >
                            <option value="">-- Choose Primary Category (Dropdown) --</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} {c.categoryKey ? `[${c.categoryKey}]` : `[${c.slug}]`} ({c.type})
                              </option>
                            ))}
                          </select>
                          {(() => {
                            const selectedCat = categories.find(c => c.id === subCategoryForm.categoryId);
                            if (!selectedCat) return null;
                            const count = subCategories.filter(s => s.categoryId === selectedCat.id).length;
                            return (
                              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
                                <span className="font-bold flex items-center gap-1">
                                  ✓ Target: {selectedCat.name}
                                </span>
                                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                                  Filter Code: {selectedCat.categoryKey || selectedCat.slug} • {count} Existing Subcategories
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Subcategory Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Swappable Battery Commuters"
                            value={subCategoryForm.name}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Vehicle Segment / Regulatory Class</label>
                          <input
                            type="text"
                            placeholder="e.g. L2 High-Speed, L5M Auto, 1.5T Mini-Truck"
                            value={subCategoryForm.vehicleSegment}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, vehicleSegment: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Speed / Certified Range Standard</label>
                          <input
                            type="text"
                            placeholder="e.g. 85 km/h • 140 km Range"
                            value={subCategoryForm.speedRangeTier}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, speedRangeTier: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Seating / Payload Capacity</label>
                          <input
                            type="text"
                            placeholder="e.g. 4+1 Passengers, 1.5-Ton Payload"
                            value={subCategoryForm.typicalPayloadOrSeats}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, typicalPayloadOrSeats: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                          <input
                            type="checkbox"
                            id="subsidyEligibleCheckFull"
                            checked={subCategoryForm.subsidyEligible}
                            onChange={(e) => setSubCategoryForm({ ...subCategoryForm, subsidyEligible: e.target.checked })}
                            className="w-5 h-5 text-emerald-600 rounded cursor-pointer"
                          />
                          <label htmlFor="subsidyEligibleCheckFull" className="text-xs font-bold text-gray-800 cursor-pointer">
                            PM E-DRIVE Central Subsidy Eligible
                            <span className="block text-[11px] text-gray-500 font-normal">Display government subsidy badges on vehicle listings</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Subcategory Description *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="e.g. Dual battery compartments, AIS-156 safety certified, swappable quick-release design."
                          value={subCategoryForm.description}
                          onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium resize-none"
                        />
                      </div>
                    </div>

                    {/* Right 1 Col: Live Preview Card */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Live Catalog Hierarchy Preview
                        </h4>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                              {categories.find(c => c.id === subCategoryForm.categoryId)?.name || 'Parent Category'}
                            </span>
                            {subCategoryForm.subsidyEligible && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                PM E-DRIVE ✓
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-gray-900">
                              {subCategoryForm.name || 'Subcategory Title'}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {subCategoryForm.description || 'Description of this subcategory segment...'}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                              <span className="text-gray-400 block text-[9px] uppercase font-bold">Segment</span>
                              <strong className="text-gray-800">{subCategoryForm.vehicleSegment || 'N/A'}</strong>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                              <span className="text-gray-400 block text-[9px] uppercase font-bold">Speed / Range</span>
                              <strong className="text-gray-800">{subCategoryForm.speedRangeTier || 'N/A'}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                          <strong className="block font-bold">⚡ Taxonomy Mapping:</strong>
                          <p className="text-[11px] leading-relaxed text-amber-800">
                            Subcategories provide customers with granular search filters on the vehicle marketplace and auto-associate with relevant OEM spare parts.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#B7F34A]" />
                          <span>Save Subcategory</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSubCategoryModalOpen(false)}
                          className="px-5 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 3. Register Brand Full-Screen Studio */}
            {isBrandModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                {/* Full Screen Top Nav Header */}
                <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBrandModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>← Back</span>
                    </button>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Master EV Catalog / OEM Partnerships
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        Register Certified OEM Brand Partner
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBrandModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCreateBrand(e as any)}
                      className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-[#B7F34A]" />
                      <span>Register Brand</span>
                    </button>
                  </div>
                </div>

                {/* Full Screen Content Body */}
                <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
                  <form onSubmit={handleCreateBrand} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Form Inputs */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900">Brand Partner Credentials</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Register an authorized electric vehicle manufacturer, component OEM, or battery partner for the verified storefront.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Hero Electric, Tata Motors, Ather"
                            value={brandForm.name}
                            onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Origin City / Manufacturing HQ *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Gurugram, Bengaluru, Pune, India"
                            value={brandForm.origin}
                            onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand Logo Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or brand logo URL"
                            value={brandForm.logoUrl}
                            onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Official Website URL</label>
                          <input
                            type="url"
                            placeholder="https://www.brand-website.com"
                            value={brandForm.website}
                            onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Warranty SLA Guarantee *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 3 Years / 40,000 km Warranty"
                            value={brandForm.warrantyPeriod}
                            onChange={(e) => setBrandForm({ ...brandForm, warrantyPeriod: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Specialization Tag</label>
                          <input
                            type="text"
                            placeholder="e.g. High-Performance Scooters, Cargo Autos"
                            defaultValue={brandForm.categories[0] || 'Electric Vehicles'}
                            onChange={(e) => setBrandForm({ ...brandForm, categories: [e.target.value] })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right 1 Col: Live Brand Showcase Preview */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Live Brand Partner Card
                        </h4>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col items-center text-center shadow-xs">
                          <img
                            src={brandForm.logoUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80'}
                            alt="Brand Logo"
                            className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm mb-3 bg-white"
                          />
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-1">
                            ✓ Verified OEM Partner
                          </span>
                          <h4 className="text-base font-black text-gray-900">
                            {brandForm.name || 'Brand Name'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {brandForm.origin || 'Manufacturing HQ'}
                          </p>
                          <div className="w-full mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-600 flex justify-between">
                            <span>Warranty SLA:</span>
                            <strong className="text-gray-900">{brandForm.warrantyPeriod || '3 Years'}</strong>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                          <strong className="block font-bold">🎖️ Verified Partner Badge:</strong>
                          <p className="text-[11px] leading-relaxed text-emerald-800">
                            Certified brands gain instant trust badges across vehicles, genuine parts listings, and showroom dealership locators.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-[#B7F34A]" />
                          <span>Register Brand Live</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsBrandModalOpen(false)}
                          className="px-5 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 4. Create Vehicle Model Full-Screen Studio */}
            {isVehicleModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
                {/* Full Screen Top Nav Header */}
                <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsVehicleModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>← Back to Catalog Landing Hub</span>
                    </button>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        Master EV Catalog / New Model Onboarding
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        Add Electric Vehicle to Catalog
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVehicleModalOpen(false)}
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Full Screen Content Body */}
                <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
                  <form onSubmit={handleSaveVehicle} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Form Inputs */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900">Vehicle Specifications & Pricing</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Enter official ARAI/ICAT certified vehicle details, on-road pricing, and government subsidy credits.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Vehicle Model Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Electra Glide Pro, Vidyut Yatri Auto"
                            value={vehicleForm.name}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand / Manufacturer *</label>
                          <select
                            value={vehicleForm.brand}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold"
                          >
                            {brands.map(b => (
                              <option key={b.id} value={b.name}>{b.name} ({b.origin})</option>
                            ))}
                            <option value="ElectraMobility">ElectraMobility</option>
                            <option value="Vidyut Motors">Vidyut Motors</option>
                            <option value="Shakti EV Commercials">Shakti EV Commercials</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary EV Category *</label>
                          <select
                            value={vehicleForm.category}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold"
                          >
                            {categories.filter(c => c.type === 'VEHICLE').map(c => (
                              <option key={c.id} value={c.categoryKey || c.slug}>
                                {c.name} [{c.categoryKey || c.slug}]
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Subcategory Segment Tag</label>
                          <input
                            type="text"
                            placeholder="e.g. High-Speed Performance Scooters, Passenger E-Rickshaws"
                            value={vehicleForm.subcategory}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, subcategory: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Tagline / Subtitle</label>
                        <input
                          type="text"
                          placeholder="e.g. High Performance Urban Electric Smart Scooter"
                          value={vehicleForm.tagline}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, tagline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">Ex-Showroom Price (₹) *</label>
                          <input
                            type="number"
                            required
                            min={10000}
                            placeholder="129999"
                            value={vehicleForm.exShowroomPrice}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, exShowroomPrice: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">FAME-II / State Subsidy Credit (₹)</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="18000"
                            value={vehicleForm.subsidyEstimate}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, subsidyEstimate: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Certified Range (km) *</label>
                          <input
                            type="number"
                            required
                            min={20}
                            placeholder="170"
                            value={vehicleForm.certifiedRangeKm}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, certifiedRangeKm: Number(e.target.value) })}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Battery (kWh) *</label>
                          <input
                            type="number"
                            step="0.1"
                            required
                            min={1}
                            placeholder="4.0"
                            value={vehicleForm.batteryCapacityKwh}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, batteryCapacityKwh: Number(e.target.value) })}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Max Speed (km/h) *</label>
                          <input
                            type="number"
                            required
                            min={25}
                            placeholder="95"
                            value={vehicleForm.topSpeedKmph}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, topSpeedKmph: Number(e.target.value) })}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Charging (Hours) *</label>
                          <input
                            type="number"
                            step="0.1"
                            required
                            min={0.5}
                            placeholder="4.5"
                            value={vehicleForm.chargingTimeHours}
                            onChange={(e) => setVehicleForm({ ...vehicleForm, chargingTimeHours: Number(e.target.value) })}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Vehicle Cover Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or hosted image"
                          value={vehicleForm.imageUrl}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="vehicleInStock"
                          checked={vehicleForm.inStock}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, inStock: e.target.checked })}
                          className="w-4 h-4 text-[#16A34A] rounded border-gray-300 focus:ring-[#16A34A]"
                        />
                        <label htmlFor="vehicleInStock" className="text-xs font-bold text-gray-800 cursor-pointer">
                          Mark In-Stock & Ready for Immediate Doorstep Delivery
                        </label>
                      </div>
                    </div>

                    {/* Right 1 Col: Live Preview Card */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-subtle space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Live Storefront Preview
                        </h4>
                        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 shadow-xs">
                          <div className="h-40 bg-gray-800 relative">
                            <img
                              src={vehicleForm.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                              {vehicleForm.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                          </div>
                          <div className="p-4 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 block">{vehicleForm.brand}</span>
                            <strong className="text-sm font-black text-gray-900 block">{vehicleForm.name || 'Vehicle Model'}</strong>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{vehicleForm.tagline || 'Tagline description'}</p>
                            <div className="flex items-baseline justify-between pt-1 border-t border-gray-200">
                              <span className="text-sm font-black text-gray-900">₹{vehicleForm.exShowroomPrice.toLocaleString('en-IN')}</span>
                              {vehicleForm.subsidyEstimate > 0 && (
                                <span className="text-[10px] font-bold text-emerald-700">₹{vehicleForm.subsidyEstimate.toLocaleString('en-IN')} Subsidy</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600 pt-1">
                              <span>Range: <strong>{vehicleForm.certifiedRangeKm} km</strong></span>
                              <span>Battery: <strong>{vehicleForm.batteryCapacityKwh} kWh</strong></span>
                              <span>Speed: <strong>{vehicleForm.topSpeedKmph} km/h</strong></span>
                              <span>Charge: <strong>{vehicleForm.chargingTimeHours} hrs</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                          <strong className="block font-bold">⚡ Live Storefront Publish:</strong>
                          <p className="text-[11px] leading-relaxed text-emerald-800">
                            Saving publishes this vehicle directly to the customer catalog with instant search, test-drive booking, and quotation generation.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#B7F34A]" />
                          <span>Save & Publish to Catalog</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsVehicleModalOpen(false)}
                          className="px-5 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </main>
      </div>

      {/* Customer Profile Details Full-Screen Studio */}
      {selectedCustomerModal && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
          {/* Full Screen Top Nav Header */}
          <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCustomerModal(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span>← Back</span>
              </button>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Customer Directory / KYC & Account Inspector
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {selectedCustomerModal.fullName} • Profile & Compliance Console
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleCustomerKyc(selectedCustomerModal);
                  setSelectedCustomerModal({
                    ...selectedCustomerModal,
                    isKycVerified: !selectedCustomerModal.isKycVerified
                  });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCustomerModal.isKycVerified
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                    : 'bg-[#16A34A] text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {selectedCustomerModal.isKycVerified ? 'Mark KYC Pending' : '✓ Approve KYC Status'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {/* Full Screen Content Body */}
          <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
            {/* Top Identity Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06152B] to-[#16A34A] text-white flex items-center justify-center font-black text-xl uppercase shadow-md">
                  {selectedCustomerModal.fullName?.slice(0, 2) || 'CU'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{selectedCustomerModal.fullName}</h3>
                    <span className={`font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                      selectedCustomerModal.isKycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedCustomerModal.isKycVerified ? '✓ Verified KYC' : 'Pending KYC'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">System User ID: {selectedCustomerModal.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Registration Status</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block mt-0.5">
                    Active Verified Customer
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Identity Detail Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-subtle">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Registered Mobile</span>
                <strong className="text-gray-900 font-mono text-base block mt-1">+91 {selectedCustomerModal.phone}</strong>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">OTP Verified</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-subtle">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                <strong className="text-gray-900 text-sm block mt-1 truncate">{selectedCustomerModal.email || 'Not Provided'}</strong>
                <span className="text-[11px] text-gray-400 font-medium mt-1 inline-block">Direct Alerts & Invoices</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-subtle">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Primary Location</span>
                <strong className="text-gray-900 text-sm block mt-1">{selectedCustomerModal.city || 'India'}</strong>
                <span className="text-[11px] text-gray-500 font-medium mt-1 inline-block">PIN: {selectedCustomerModal.pincode || 'N/A'}</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-subtle">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Compliance Status</span>
                <strong className="text-gray-900 text-sm block mt-1">
                  {selectedCustomerModal.isKycVerified ? 'Aadhaar / DL Verified' : 'Under Review'}
                </strong>
                <span className={`text-[11px] font-medium mt-1 inline-block ${selectedCustomerModal.isKycVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedCustomerModal.isKycVerified ? 'Subsidies Unlocked' : 'Action Required'}
                </span>
              </div>
            </div>

            {/* Saved Delivery Addresses Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Saved Delivery & Doorstep Addresses
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Addresses stored for spare parts delivery and mobile service van dispatch.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Total: {selectedCustomerModal.savedAddresses?.length || 0}
                </span>
              </div>

              {selectedCustomerModal.savedAddresses && selectedCustomerModal.savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCustomerModal.savedAddresses.map((addr, idx) => (
                    <div key={addr.id || idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 text-xs text-gray-700 space-y-2">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] uppercase font-bold">
                            {addr.label}
                          </span>
                          <span className="text-sm">{addr.fullName}</span>
                        </div>
                        <span className="font-mono text-xs text-emerald-700 font-bold">+91 {addr.phone}</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
                        <span>{addr.city}, {addr.state}</span>
                        <span className="font-mono font-bold text-gray-700">PIN: {addr.pincode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 italic">No saved delivery addresses found for this account.</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  handleToggleCustomerKyc(selectedCustomerModal);
                  setSelectedCustomerModal({
                    ...selectedCustomerModal,
                    isKycVerified: !selectedCustomerModal.isKycVerified
                  });
                }}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCustomerModal.isKycVerified
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                }`}
              >
                {selectedCustomerModal.isKycVerified ? 'Mark KYC Pending' : '✓ Approve KYC Status'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerModal(null)}
                className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-gray-800 cursor-pointer shadow-md"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
