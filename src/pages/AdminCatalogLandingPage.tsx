import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Search,
  Copy,
  ExternalLink,
  Trash2,
  Layers,
  Tag,
  Truck,
  Zap,
  Box,
  Check,
  X,
  ChevronDown,
  ArrowLeft,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { storage } from '../services/storageService';
import { api } from '../services/apiService';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  CategoryItem,
  SubCategoryItem,
  BrandItem,
  VehicleItem
} from '../types';

interface AdminCatalogLandingPageProps {
  onBackToDashboard?: () => void;
}

export const AdminCatalogLandingPage: React.FC<AdminCatalogLandingPageProps> = ({
  onBackToDashboard
}) => {
  // Real data state from Storage & Backend API
  const [categories, setCategories] = useState<CategoryItem[]>(() => storage.getCategories());
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>(() => storage.getSubCategories());
  const [brands, setBrands] = useState<BrandItem[]>(() => storage.getBrands());
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => storage.getVehicles());

  // Filter & Dropdown States (Drop button based navigation)
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('ELECTRIC_SCOOTER');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('ALL');
  const [selectedUsageType, setSelectedUsageType] = useState<string>('ALL');
  const [selectedSortBy, setSelectedSortBy] = useState<'POPULARITY' | 'PRICE_ASC' | 'PRICE_DESC' | 'RANGE_DESC'>('POPULARITY');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active view tab inside landing page: 'showcase' | 'categories-manage' | 'subcategories-manage' | 'brands-manage'
  const [catalogViewTab, setCatalogViewTab] = useState<'showcase' | 'categories-manage' | 'subcategories-manage' | 'brands-manage'>('showcase');

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Studio / Modal States (Full-screen dedicated studios)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Forms
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    categoryKey: '',
    subtitle: '',
    description: '',
    type: 'VEHICLE' as CategoryItem['type'],
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    scaleTier: '2W_PERSONAL' as CategoryItem['scaleTier'],
    scaleLabel: '2-Wheeler Electric Vehicles'
  });

  const [subCategoryForm, setSubCategoryForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    vehicleSegment: '',
    speedRangeTier: '',
    typicalPayloadOrSeats: '',
    subsidyEligible: true
  });

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: 'ElectraMobility',
    category: 'ELECTRIC_SCOOTER',
    subcategory: '',
    tagline: '',
    description: '',
    exShowroomPrice: 125000,
    subsidyEstimate: 18000,
    certifiedRangeKm: 150,
    batteryCapacityKwh: 3.5,
    topSpeedKmph: 85,
    chargingTimeHours: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    inStock: true
  });

  const [brandForm, setBrandForm] = useState({
    name: '',
    origin: 'Bengaluru, India',
    logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.electramobility.in',
    warrantyPeriod: '3 Years / 50,000 km',
    categories: ['Electric Scooters']
  });

  // Sync with live storage & backend API
  const refreshData = () => {
    setCategories(storage.getCategories());
    setSubCategories(storage.getSubCategories());
    setBrands(storage.getBrands());
    setVehicles(storage.getVehicles());
  };

  useEffect(() => {
    const unsub = storage.onSync(() => {
      refreshData();
    });
    return () => unsub();
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Find active parent category object
  const activeParentCategory = useMemo(() => {
    if (selectedCategoryKey === 'ALL') return null;
    const qNorm = selectedCategoryKey.trim().toUpperCase();
    return categories.find(c =>
      (c.categoryKey && c.categoryKey.toUpperCase() === qNorm) ||
      c.slug.toUpperCase() === qNorm ||
      c.id === selectedCategoryKey
    ) || null;
  }, [categories, selectedCategoryKey]);

  // Child subcategories of selected parent category
  const availableSubCategories = useMemo(() => {
    if (!activeParentCategory) return subCategories.filter(s => s.status === 'ACTIVE');
    return subCategories.filter(s => s.categoryId === activeParentCategory.id && s.status === 'ACTIVE');
  }, [subCategories, activeParentCategory]);

  // Generated Storefront URL
  const currentStorefrontPath = useMemo(() => {
    const catParam = activeParentCategory?.categoryKey || selectedCategoryKey;
    let url = `/vehicles?category=${catParam}`;
    if (selectedSubCategoryId !== 'ALL') {
      const sub = subCategories.find(s => s.id === selectedSubCategoryId || s.slug === selectedSubCategoryId);
      if (sub) {
        url += `&subcategory=${sub.slug || sub.id}`;
      }
    }
    return url;
  }, [activeParentCategory, selectedCategoryKey, selectedSubCategoryId, subCategories]);

  const currentStorefrontUrl = `https://vidyutva-ev-marketplace.vercel.app${currentStorefrontPath}`;

  // Filtered & Sorted vehicles list
  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter(v => {
      // Category Filter
      if (selectedCategoryKey !== 'ALL') {
        const qNorm = selectedCategoryKey.trim().toUpperCase();
        let match = Boolean(v.category && (v.category === selectedCategoryKey || v.category.toUpperCase() === qNorm));
        if (!match && activeParentCategory) {
          const catKey = activeParentCategory.categoryKey ? activeParentCategory.categoryKey.toUpperCase() : '';
          const catName = activeParentCategory.name.toLowerCase();
          match = Boolean(v.category && v.category.toUpperCase() === catKey) ||
                  v.name.toLowerCase().includes(catName) ||
                  v.tagline.toLowerCase().includes(catName);
        }
        if (!match) return false;
      }

      // Subcategory Filter
      if (selectedSubCategoryId !== 'ALL') {
        const sub = subCategories.find(s => s.id === selectedSubCategoryId || s.slug === selectedSubCategoryId);
        if (sub) {
          const term = sub.name.toLowerCase();
          const matchesSub = v.name.toLowerCase().includes(term) ||
                             v.tagline.toLowerCase().includes(term) ||
                             Boolean(v.description && v.description.toLowerCase().includes(term));
          if (!matchesSub && sub.vehicleSegment) {
            const segMatch = v.name.toLowerCase().includes(sub.vehicleSegment.toLowerCase());
            if (!segMatch) return false;
          }
        }
      }

      // Usage Type Filter
      if (selectedUsageType !== 'ALL') {
        if (v.usageType && v.usageType !== selectedUsageType) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = v.name.toLowerCase().includes(q) ||
                         v.brand.toLowerCase().includes(q) ||
                         v.tagline.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      return true;
    });

    // Sorting
    if (selectedSortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.exShowroomPrice - b.exShowroomPrice);
    } else if (selectedSortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.exShowroomPrice - a.exShowroomPrice);
    } else if (selectedSortBy === 'RANGE_DESC') {
      result.sort((a, b) => (b.certifiedRangeKm || 0) - (a.certifiedRangeKm || 0));
    }

    return result;
  }, [vehicles, selectedCategoryKey, selectedSubCategoryId, selectedUsageType, selectedSortBy, searchQuery, activeParentCategory, subCategories]);

  // Actions
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentStorefrontUrl);
    setCopiedLink(true);
    notify('✓ Live Storefront link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleStock = (vehicleId: string, currentStock: boolean) => {
    storage.updateVehicle(vehicleId, { inStock: !currentStock });
    refreshData();
    notify(`✓ Vehicle stock status updated to ${!currentStock ? 'In Stock' : 'Out of Stock'}!`);
  };

  const handleDeleteVehicle = (vehicleId: string, vehicleName: string) => {
    if (window.confirm(`Are you sure you want to delete "${vehicleName}" from catalog?`)) {
      storage.deleteVehicle(vehicleId);
      refreshData();
      notify(`✓ Vehicle "${vehicleName}" deleted from catalog.`);
    }
  };

  // Add Category Submit
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const key = categoryForm.categoryKey.trim()
      ? categoryForm.categoryKey.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_')
      : categoryForm.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');

    const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCat = storage.addCategory({
      name: categoryForm.name.trim(),
      slug,
      categoryKey: key,
      subtitle: categoryForm.subtitle || `${categoryForm.name} Mobility Segment`,
      description: categoryForm.description || `Certified ${categoryForm.name} catalog on E-VAHAN marketplace.`,
      imageUrl: categoryForm.imageUrl,
      type: categoryForm.type,
      scaleTier: categoryForm.scaleTier,
      scaleLabel: categoryForm.scaleLabel,
      isFeatured: true,
      displayOrder: categories.length + 1,
      status: 'ACTIVE'
    });

    refreshData();
    setSelectedCategoryKey(newCat.categoryKey || newCat.slug);
    setIsCategoryModalOpen(false);
    notify(`✓ Primary Category "${newCat.name}" created live!`);
  };

  // Add SubCategory Submit
  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryForm.name.trim() || !subCategoryForm.categoryId) return;

    const parentCat = categories.find(c => c.id === subCategoryForm.categoryId);
    const slug = subCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newSub = storage.addSubCategory({
      categoryId: subCategoryForm.categoryId,
      categoryName: parentCat?.name || 'Category',
      name: subCategoryForm.name.trim(),
      slug,
      description: subCategoryForm.description || `${subCategoryForm.name} EV classification.`,
      vehicleSegment: subCategoryForm.vehicleSegment || 'L2 / L5 Certified',
      speedRangeTier: subCategoryForm.speedRangeTier || '85-115 km/h • 140 km Range',
      typicalPayloadOrSeats: subCategoryForm.typicalPayloadOrSeats || '2-Seater',
      subsidyEligible: subCategoryForm.subsidyEligible,
      status: 'ACTIVE'
    });

    refreshData();
    setSelectedSubCategoryId(newSub.id);
    setIsSubCategoryModalOpen(false);
    notify(`✓ Subcategory "${newSub.name}" added under ${parentCat?.name}!`);
  };

  // Add Vehicle Submit
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name.trim()) return;

    const slug = vehicleForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newVeh = storage.addVehicle({
      name: vehicleForm.name.trim(),
      brand: vehicleForm.brand,
      category: vehicleForm.category as any,
      modelSlug: slug,
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
        { url: vehicleForm.imageUrl, label: vehicleForm.name, isPrimary: true }
      ],
      variants: [
        { id: `var-${Date.now()}`, variantName: 'Standard Edition', colorName: 'Pearl White', colorHex: '#F3F4F6', priceDifference: 0, batteryCapacity: Number(vehicleForm.batteryCapacityKwh) || 3.5, realWorldRangeKm: Number(vehicleForm.certifiedRangeKm) || 120, stockCount: 10, imageUrl: vehicleForm.imageUrl, isDefault: true }
      ],
      specifications: []
    });

    refreshData();
    setIsVehicleModalOpen(false);
    notify(`✓ Vehicle "${newVeh.name}" published to catalog and storefront!`);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#06152B] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#06152B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TOP HEADER: Clean, dedicated, no old sidebar */}
      <header className="bg-[#06152B] text-white border-b border-blue-400/20 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToDashboard ? (
              <button
                onClick={onBackToDashboard}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <BrandLogo variant="header" />
              <div className="hidden sm:block border-l border-white/20 pl-3">
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>EV Categories & Catalog Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h1>
                <p className="text-[10px] text-blue-200 font-medium">
                  Direct Storefront Taxonomy & Inventory Control
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Studio Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>+ Add Category</span>
            </button>

            <button
              onClick={() => {
                if (categories.length > 0 && !subCategoryForm.categoryId) {
                  setSubCategoryForm(prev => ({
                    ...prev,
                    categoryId: activeParentCategory?.id || categories[0].id
                  }));
                }
                setIsSubCategoryModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>+ Add Sub-Category (Dropdown)</span>
            </button>

            <button
              onClick={() => {
                setVehicleForm(prev => ({
                  ...prev,
                  category: selectedCategoryKey !== 'ALL' ? selectedCategoryKey : 'ELECTRIC_SCOOTER'
                }));
                setIsVehicleModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-cyan-600 hover:opacity-95 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>+ Add Vehicle</span>
            </button>

            <a
              href={currentStorefrontPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Storefront ↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        
        {/* VIEW NAVIGATION TABS */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200/90 shadow-subtle overflow-x-auto">
          <button
            onClick={() => setCatalogViewTab('showcase')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              catalogViewTab === 'showcase'
                ? 'bg-[#06152B] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Catalog Showcase & Link Generator ({filteredVehicles.length} Models)</span>
          </button>

          <button
            onClick={() => setCatalogViewTab('categories-manage')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              catalogViewTab === 'categories-manage'
                ? 'bg-[#06152B] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Primary Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setCatalogViewTab('subcategories-manage')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              catalogViewTab === 'subcategories-manage'
                ? 'bg-[#06152B] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Categories (Sub-Categories) ({subCategories.length})</span>
          </button>

          <button
            onClick={() => setCatalogViewTab('brands-manage')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              catalogViewTab === 'brands-manage'
                ? 'bg-[#06152B] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>OEM Brands ({brands.length})</span>
          </button>
        </div>

        {/* TAB 1: SHOWCASE & LIVE LINK GENERATOR WITH DROPDOWN CONTROLS */}
        {catalogViewTab === 'showcase' && (
          <div className="space-y-6 animate-in fade-in">
            {/* CONTROL BAR WITH DROP BUTTONS */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-subtle space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>Electric Vehicles Catalog Navigator</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select category & subcategory from the dropdowns below to instantly inspect live models and generate customer share links.
                  </p>
                </div>

                {/* Live Search */}
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search model, brand or specs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* DROPDOWN SELECTORS GRID (Drop button ka use) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Primary Category Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Primary Category:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategoryKey}
                      onChange={(e) => {
                        setSelectedCategoryKey(e.target.value);
                        setSelectedSubCategoryId('ALL');
                      }}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-white text-gray-900 text-xs font-bold focus:ring-2 focus:ring-[#16A34A] focus:outline-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="ALL">All Categories (Show All Vehicles)</option>
                      {categories.filter(c => c.type === 'VEHICLE').map((cat) => (
                        <option key={cat.id} value={cat.categoryKey || cat.slug}>
                          {cat.name} [{cat.categoryKey || cat.slug}]
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Subcategory Dropdown (Dynamic based on selected primary category) */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sub-Category (Tier):</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSubCategoryId}
                      onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-white text-gray-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="ALL">
                        All {activeParentCategory ? activeParentCategory.name : 'Subcategories'}
                      </option>
                      {availableSubCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} {sub.subsidyEligible ? '(PM E-DRIVE ✓)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Usage Type Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Usage Purpose:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedUsageType}
                      onChange={(e) => setSelectedUsageType(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-white text-gray-900 text-xs font-bold focus:ring-2 focus:ring-[#16A34A] focus:outline-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="ALL">All Usage Types</option>
                      <option value="PERSONAL">Personal Commute</option>
                      <option value="COMMERCIAL">Commercial / Fleet Logistics</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Sort Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Sort By:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSortBy}
                      onChange={(e) => setSelectedSortBy(e.target.value as any)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-white text-gray-900 text-xs font-bold focus:ring-2 focus:ring-[#16A34A] focus:outline-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="POPULARITY">Most Popular / Featured</option>
                      <option value="PRICE_ASC">Price: Low to High</option>
                      <option value="PRICE_DESC">Price: High to Low</option>
                      <option value="RANGE_DESC">Highest Range (km)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* LIVE STOREFRONT SHAREABLE LINK BANNER (link create karo) */}
              <div className="bg-gradient-to-r from-[#06152B] via-[#0E2442] to-[#12335C] p-4 sm:p-5 rounded-2xl border border-blue-400/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-[#B7F34A] text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                      Live Customer Link
                    </span>
                    <span className="text-xs text-blue-200">
                      Shareable URL for this Category & Subcategory:
                    </span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-cyan-300 font-bold truncate bg-black/40 px-3 py-1.5 rounded-lg border border-cyan-400/20 select-all">
                    {currentStorefrontUrl}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Copy live customer URL"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{copiedLink ? '✓ Copied!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={currentStorefrontPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    title="Open live storefront page in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                    <span>Open Storefront ↗</span>
                  </a>
                </div>
              </div>

              {/* Active Filter Pills Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 font-bold">Active Filters:</span>
                  {selectedCategoryKey !== 'ALL' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-300">
                      <span>Category: {activeParentCategory?.name || selectedCategoryKey}</span>
                      <button
                        onClick={() => { setSelectedCategoryKey('ALL'); setSelectedSubCategoryId('ALL'); }}
                        className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedSubCategoryId !== 'ALL' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-300">
                      <span>Subcategory: {subCategories.find(s => s.id === selectedSubCategoryId)?.name || selectedSubCategoryId}</span>
                      <button
                        onClick={() => setSelectedSubCategoryId('ALL')}
                        className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {(selectedCategoryKey !== 'ALL' || selectedSubCategoryId !== 'ALL') && (
                    <button
                      onClick={() => { setSelectedCategoryKey('ALL'); setSelectedSubCategoryId('ALL'); }}
                      className="text-xs text-gray-500 hover:text-red-600 underline font-semibold ml-1 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-600 font-medium">
                  Showing <strong>{filteredVehicles.length}</strong> certified models
                </div>
              </div>
            </div>

            {/* VEHICLES CARDS GRID */}
            {filteredVehicles.length === 0 ? (
              <div className="p-12 rounded-3xl border border-dashed border-gray-300 text-center space-y-3 bg-white shadow-subtle">
                <Truck className="w-12 h-12 text-gray-400 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">No vehicles match this category / subcategory</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Click "+ Add Vehicle" to onboard the first vehicle model for this segment.
                </p>
                <button
                  onClick={() => {
                    setVehicleForm(prev => ({
                      ...prev,
                      category: selectedCategoryKey !== 'ALL' ? selectedCategoryKey : 'ELECTRIC_SCOOTER'
                    }));
                    setIsVehicleModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#B7F34A]" />
                  <span>+ Add Vehicle to Catalog</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVehicles.map((v) => {
                  const primaryImage = v.images?.find((img: any) => img.isPrimary)?.url || v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80';
                  return (
                    <div
                      key={v.id}
                      className="rounded-3xl border border-gray-200 overflow-hidden bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Image & Badges */}
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
                              v.inStock ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
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

                          {/* Brand & Model Title */}
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
                            <span className="truncate">{v.certifiedRangeCondition || 'ARAI Certified Range'}</span>
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
                            onClick={() => handleToggleStock(v.id, v.inStock)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              v.inStock
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                            title="Toggle in-stock status"
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
        )}

        {/* TAB 2: PRIMARY CATEGORIES MANAGEMENT TABLE */}
        {catalogViewTab === 'categories-manage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">Primary Categories ({categories.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Top-level mobility segments published live to Homepage and Header navigation.
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>+ Add Primary Category</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Category Name & Banner</th>
                    <th className="p-3">Category Key / Slug</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Subcategories</th>
                    <th className="p-3">Storefront Route</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => {
                    const subCount = subCategories.filter(s => s.categoryId === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/70">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={cat.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=100&q=80'}
                              alt={cat.name}
                              className="w-12 h-10 object-cover rounded-xl bg-gray-100 border border-gray-200"
                            />
                            <div>
                              <strong className="text-xs font-bold text-gray-900 block">{cat.name}</strong>
                              <span className="text-[10px] text-gray-500">{cat.subtitle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] font-bold text-emerald-800">
                          {cat.categoryKey || cat.slug}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                            {cat.type}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {subCount} Subcategories
                        </td>
                        <td className="p-3">
                          <a
                            href={`/vehicles?category=${cat.categoryKey || cat.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>/vehicles?category={cat.categoryKey || cat.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ✓ LIVE
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUBCATEGORIES MANAGEMENT TABLE */}
        {catalogViewTab === 'subcategories-manage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">Categories (Sub-Categories) ({subCategories.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Specific EV segment tiers linked to parent primary categories with PM E-DRIVE subsidies.
                </p>
              </div>
              <button
                onClick={() => {
                  if (categories.length > 0 && !subCategoryForm.categoryId) {
                    setSubCategoryForm(prev => ({ ...prev, categoryId: categories[0].id }));
                  }
                  setIsSubCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>+ Add Subcategory (Dropdown)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Subcategory Name</th>
                    <th className="p-3">Parent Category (Linked)</th>
                    <th className="p-3">Segment Code</th>
                    <th className="p-3">Speed & Range</th>
                    <th className="p-3">PM E-DRIVE Subsidy</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subCategories.map((sub) => {
                    const parent = categories.find(c => c.id === sub.categoryId);
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/70">
                        <td className="p-3">
                          <strong className="text-xs font-bold text-gray-900 block">{sub.name}</strong>
                          <span className="text-[10px] text-gray-500">{sub.description}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                            {parent?.name || sub.categoryName}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-gray-700">
                          {sub.vehicleSegment || 'L2 / L5'}
                        </td>
                        <td className="p-3 text-gray-700">
                          {sub.speedRangeTier || 'Standard EV Tier'}
                        </td>
                        <td className="p-3">
                          {sub.subsidyEligible ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              PM E-DRIVE ✓
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">Standard</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: OEM BRANDS MANAGEMENT TABLE */}
        {catalogViewTab === 'brands-manage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">Certified OEM Brands ({brands.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified EV manufacturers, battery suppliers, and warranty SLA partners on the platform.
                </p>
              </div>
              <button
                onClick={() => setIsBrandModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>+ Register OEM Brand</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <img
                      src={b.logoUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=100&q=80'}
                      alt={b.name}
                      className="w-12 h-12 object-cover rounded-xl bg-white border border-gray-200"
                    />
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ VERIFIED OEM
                    </span>
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 block">{b.name}</strong>
                    <span className="text-[11px] text-gray-500">{b.origin}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200/60">
                    <span>Warranty: <strong>{b.warrantyPeriod}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN STUDIO 1: CREATE PRIMARY CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
          <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Back to Catalog Landing Hub</span>
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
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <form onSubmit={handleCreateCategory} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Category Credentials</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define a top-level electric mobility segment (e.g. Electric Scooters, Electric Autos, etc.) with custom machine key for URL filtering.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electric Scooters, Electric Autos"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Machine Category Key (for URL Query) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ELECTRIC_SCOOTER, ELECTRIC_PASSENGER_AUTO"
                    value={categoryForm.categoryKey}
                    onChange={(e) => setCategoryForm({ ...categoryForm, categoryKey: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono font-bold"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Routes directly to: /vehicles?category={categoryForm.categoryKey || 'YOUR_KEY'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Urban, High-Speed & Delivery 2-Wheelers"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive description of vehicles in this mobility segment..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or hosted image"
                  value={categoryForm.imageUrl}
                  onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#B7F34A]" />
                  <span>Save Primary Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN STUDIO 2: CREATE SUBCATEGORY (PARENT DROPDOWN INCLUDED) */}
      {isSubCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
          <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubCategoryModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Back to Catalog Landing Hub</span>
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
            <button
              type="button"
              onClick={() => setIsSubCategoryModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <form onSubmit={handleCreateSubCategory} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Subcategory Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select parent primary category using the dropdown and configure speed, payload & subsidy eligibility.
                </p>
              </div>

              {/* PARENT DROPDOWN (Drop button) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Parent Primary Category (Dropdown Selection) *
                </label>
                <div className="relative">
                  <select
                    required
                    value={subCategoryForm.categoryId}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-blue-300 bg-blue-50/50 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#16A34A] focus:outline-none pr-8 cursor-pointer"
                  >
                    <option value="">-- Choose Parent Primary Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} [{c.categoryKey || c.slug}] ({c.type})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Subcategory Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Speed Performance Scooters, Passenger E-Rickshaws"
                    value={subCategoryForm.name}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Vehicle Regulatory Segment</label>
                  <input
                    type="text"
                    placeholder="e.g. L2 High-Speed 2W, L5M Auto, N1 Truck"
                    value={subCategoryForm.vehicleSegment}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, vehicleSegment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Certified Speed & Range Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. 85-115 km/h • 140 km Range"
                    value={subCategoryForm.speedRangeTier}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, speedRangeTier: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Typical Seating / Payload Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-Seater (160 kg) or 4+1 Passengers"
                    value={subCategoryForm.typicalPayloadOrSeats}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, typicalPayloadOrSeats: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description of this subcategory segment..."
                  value={subCategoryForm.description}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="subSubsidy"
                  checked={subCategoryForm.subsidyEligible}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, subsidyEligible: e.target.checked })}
                  className="w-4 h-4 text-[#16A34A] rounded border-gray-300 focus:ring-[#16A34A]"
                />
                <label htmlFor="subSubsidy" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Eligible for PM E-DRIVE / Central Government EV Subsidy
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Save Subcategory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN STUDIO 3: CREATE VEHICLE MODEL */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
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
                  Master EV Catalog / Add Vehicle
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Add Electric Vehicle to Catalog
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <form onSubmit={handleCreateVehicle} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Vehicle Specifications & Pricing</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter official ARAI/ICAT certified specs, on-road price, battery specs, and government subsidies.
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
                  <div className="relative">
                    <select
                      value={vehicleForm.brand}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold pr-8"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.name}>{b.name} ({b.origin})</option>
                      ))}
                      <option value="ElectraMobility">ElectraMobility</option>
                      <option value="Vidyut Motors">Vidyut Motors</option>
                      <option value="Shakti EV Commercials">Shakti EV Commercials</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Category (Dropdown) *</label>
                  <div className="relative">
                    <select
                      value={vehicleForm.category}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-bold pr-8"
                    >
                      {categories.filter(c => c.type === 'VEHICLE').map(c => (
                        <option key={c.id} value={c.categoryKey || c.slug}>
                          {c.name} [{c.categoryKey || c.slug}]
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Range (km) *</label>
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
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Charging (Hrs) *</label>
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vehStock"
                  checked={vehicleForm.inStock}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, inStock: e.target.checked })}
                  className="w-4 h-4 text-[#16A34A] rounded border-gray-300 focus:ring-[#16A34A]"
                />
                <label htmlFor="vehStock" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Mark In Stock & Ready for Immediate Doorstep Delivery
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#B7F34A]" />
                  <span>Save & Publish Vehicle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN STUDIO 4: REGISTER OEM BRAND */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F1F5F9] w-screen h-screen overflow-y-auto flex flex-col animate-in fade-in">
          <div className="bg-[#06152B] text-white px-6 py-4 flex items-center justify-between border-b border-blue-500/20 shrink-0 sticky top-0 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Back to Catalog Landing Hub</span>
              </button>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Master EV Catalog / Brand Registration
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Register Certified OEM Brand Partner
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsBrandModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!brandForm.name.trim()) return;
                const newBrand = storage.addBrand({
                  name: brandForm.name.trim(),
                  slug: brandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  origin: brandForm.origin,
                  logoUrl: brandForm.logoUrl,
                  website: brandForm.website,
                  warrantyPeriod: brandForm.warrantyPeriod,
                  categories: brandForm.categories,
                  isVerified: true,
                  modelCount: 0,
                  status: 'ACTIVE'
                });
                refreshData();
                setIsBrandModalOpen(false);
                notify(`✓ Brand "${newBrand.name}" registered!`);
              }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle space-y-5"
            >
              <div>
                <h3 className="text-base font-bold text-gray-900">Brand Partner Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Register an authorized EV manufacturer with warranty SLA guarantees.
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
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Origin City / HQ *</label>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Logo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Warranty SLA *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Years / 40,000 km Warranty"
                    value={brandForm.warrantyPeriod}
                    onChange={(e) => setBrandForm({ ...brandForm, warrantyPeriod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>Register Brand</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
