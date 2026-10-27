// Comprehensive Seed Data for E-VAHAN Indian EV Marketplace
import { VehicleItem, SparePartItem, ServiceCategoryDef } from '../types';

export interface IndianPincodeInfo {
  pincode: string;
  city: string;
  state: string;
  tier: 1 | 2 | 3;
  vehicleDelivery: boolean;
  doorstepService: boolean;
  testDriveHome: boolean;
  partsShippingExpress: boolean;
  nearestDealership: string;
}

export const INDIAN_PINCODES: IndianPincodeInfo[] = [
  // Delhi NCR
  { pincode: '110001', city: 'New Delhi', state: 'Delhi', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Flagship Hub, Connaught Place' },
  { pincode: '110020', city: 'South Delhi', state: 'Delhi', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Okhla Experience Centre' },
  { pincode: '110058', city: 'West Delhi (Janakpuri)', state: 'Delhi', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN West Delhi Hub' },
  { pincode: '110092', city: 'East Delhi (Laxmi Nagar)', state: 'Delhi', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN East Delhi Hub' },
  { pincode: '122001', city: 'Gurugram', state: 'Haryana', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Cyber Hub Galleria' },
  { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sector 62 EV Pavilion' },
  { pincode: '201310', city: 'Greater Noida', state: 'Uttar Pradesh', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Pari Chowk Hub' },
  { pincode: '121001', city: 'Faridabad', state: 'Haryana', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Neelam Bata Road Hub' },
  { pincode: '201001', city: 'Ghaziabad', state: 'Uttar Pradesh', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Raj Nagar Hub' },

  // Mumbai & Maharashtra
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Fort Mobility Centre' },
  { pincode: '400050', city: 'Mumbai (Bandra)', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Linking Road Galleria' },
  { pincode: '400058', city: 'Mumbai (Andheri)', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Andheri West Hub' },
  { pincode: '400703', city: 'Navi Mumbai', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Vashi EV Hub' },
  { pincode: '400601', city: 'Thane', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Ghodbunder Road Centre' },
  { pincode: '411001', city: 'Pune', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Shivajinagar Hub' },
  { pincode: '411028', city: 'Pune (Hadapsar)', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Magarpatta EV Hub' },
  { pincode: '411057', city: 'Pune (Hinjewadi)', state: 'Maharashtra', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Hinjewadi IT Park Hub' },
  { pincode: '440001', city: 'Nagpur', state: 'Maharashtra', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sitabuldi Nagpur Centre' },
  { pincode: '422001', city: 'Nashik', state: 'Maharashtra', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN College Road Nashik' },
  { pincode: '431001', city: 'Aurangabad (Chhatrapati Sambhajinagar)', state: 'Maharashtra', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN CIDCO Hub' },

  // Bengaluru & Karnataka
  { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN MG Road Flagship' },
  { pincode: '560038', city: 'Bengaluru (Indiranagar)', state: 'Karnataka', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN 100ft Road Experience Hub' },
  { pincode: '560100', city: 'Bengaluru (Electronic City)', state: 'Karnataka', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Electronic City South' },
  { pincode: '560066', city: 'Bengaluru (Whitefield)', state: 'Karnataka', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN ITPL Whitefield Centre' },
  { pincode: '570001', city: 'Mysuru', state: 'Karnataka', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sayyaji Rao Road Hub' },
  { pincode: '575001', city: 'Mangaluru', state: 'Karnataka', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN KS Rao Road Centre' },
  { pincode: '580020', city: 'Hubballi', state: 'Karnataka', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Gokul Road Hub' },

  // Hyderabad & Telangana / Andhra Pradesh
  { pincode: '500001', city: 'Hyderabad', state: 'Telangana', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Abids Experience Hub' },
  { pincode: '500081', city: 'Hyderabad (Hitec City)', state: 'Telangana', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Madhapur EV Station' },
  { pincode: '500003', city: 'Secunderabad', state: 'Telangana', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN MG Road Secunderabad' },
  { pincode: '530001', city: 'Visakhapatnam', state: 'Andhra Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Waltair Uplands Hub' },
  { pincode: '520001', city: 'Vijayawada', state: 'Andhra Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN MG Road Vijayawada' },
  { pincode: '506001', city: 'Warangal', state: 'Telangana', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Hanamkonda Hub' },

  // Chennai & Tamil Nadu / Kerala
  { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN George Town Hub' },
  { pincode: '600028', city: 'Chennai (Adyar)', state: 'Tamil Nadu', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN OMR Adyar Pavilion' },
  { pincode: '600040', city: 'Chennai (Anna Nagar)', state: 'Tamil Nadu', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN 2nd Avenue Hub' },
  { pincode: '641001', city: 'Coimbatore', state: 'Tamil Nadu', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Avinashi Road Centre' },
  { pincode: '625001', city: 'Madurai', state: 'Tamil Nadu', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Town Hall Road Hub' },
  { pincode: '682001', city: 'Kochi (Cochin)', state: 'Kerala', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Marine Drive Kochi' },
  { pincode: '695001', city: 'Thiruvananthapuram', state: 'Kerala', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN MG Road Trivandrum' },

  // Kolkata & West Bengal / East
  { pincode: '700001', city: 'Kolkata', state: 'West Bengal', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Park Street Flagship' },
  { pincode: '700091', city: 'Kolkata (Salt Lake)', state: 'West Bengal', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sector V EV Galleria' },
  { pincode: '711101', city: 'Howrah', state: 'West Bengal', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN GT Road Howrah' },
  { pincode: '734001', city: 'Siliguri', state: 'West Bengal', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sevoke Road Centre' },
  { pincode: '800001', city: 'Patna', state: 'Bihar', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Fraser Road Patna' },
  { pincode: '834001', city: 'Ranchi', state: 'Jharkhand', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Main Road Ranchi' },
  { pincode: '831001', city: 'Jamshedpur', state: 'Jharkhand', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Bistupur Hub' },
  { pincode: '751001', city: 'Bhubaneswar', state: 'Odisha', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Janpath Bhubaneswar' },
  { pincode: '781001', city: 'Guwahati', state: 'Assam', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN GS Road Guwahati' },

  // Gujarat
  { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Ashram Road Centre' },
  { pincode: '380015', city: 'Ahmedabad (SG Highway)', state: 'Gujarat', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN SG Highway Mobility Hub' },
  { pincode: '395001', city: 'Surat', state: 'Gujarat', tier: 1, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Ring Road Surat' },
  { pincode: '390001', city: 'Vadodara', state: 'Gujarat', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Alkapuri Centre' },
  { pincode: '360001', city: 'Rajkot', state: 'Gujarat', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Yagnik Road Hub' },

  // Rajasthan
  { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN MI Road Dealership' },
  { pincode: '342001', city: 'Jodhpur', state: 'Rajasthan', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN High Court Road Hub' },
  { pincode: '313001', city: 'Udaipur', state: 'Rajasthan', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Chetak Circle Centre' },
  { pincode: '324001', city: 'Kota', state: 'Rajasthan', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Aerodrome Circle Hub' },

  // Uttar Pradesh & Uttarakhand
  { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Hazratganj Centre' },
  { pincode: '208001', city: 'Kanpur', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Mall Road Kanpur' },
  { pincode: '221001', city: 'Varanasi', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Cantt EV Hub' },
  { pincode: '282001', city: 'Agra', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sanjay Place Agra' },
  { pincode: '211001', city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Civil Lines Hub' },
  { pincode: '250001', city: 'Meerut', state: 'Uttar Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Delhi Road Meerut' },
  { pincode: '248001', city: 'Dehradun', state: 'Uttarakhand', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Rajpur Road Dehradun' },

  // Punjab, Haryana & Chandigarh
  { pincode: '160017', city: 'Chandigarh', state: 'Punjab', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Sector 17 Mobility Hub' },
  { pincode: '141001', city: 'Ludhiana', state: 'Punjab', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Ferozepur Road Hub' },
  { pincode: '143001', city: 'Amritsar', state: 'Punjab', tier: 2, vehicleDelivery: true, doorstepService: false, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Mall Road Amritsar' },

  // Madhya Pradesh, Chhattisgarh & Central India
  { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN AB Road Centre' },
  { pincode: '462001', city: 'Bhopal', state: 'Madhya Pradesh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN MP Nagar Bhopal' },
  { pincode: '492001', city: 'Raipur', state: 'Chhattisgarh', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: false, partsShippingExpress: true, nearestDealership: 'E-VAHAN Telibandha Raipur' },
  { pincode: '403001', city: 'Goa (Panaji)', state: 'Goa', tier: 2, vehicleDelivery: true, doorstepService: true, testDriveHome: true, partsShippingExpress: true, nearestDealership: 'E-VAHAN Panaji EV Pavilion' },
];

export const VEHICLES_DATA: VehicleItem[] = [
  {
    id: 'veh-eglide-pro',
    brand: 'ElectraMobility',
    brandOrigin: 'Bengaluru, India',
    category: 'ELECTRIC_SCOOTER',
    name: 'Electra Glide Pro',
    modelSlug: 'electra-glide-pro',
    tagline: 'High Performance Urban Electric Smart Scooter',
    description: 'Designed for the discerning city rider. Featuring an aerospace-grade aluminium chassis, 4.0 kWh high-density IP67 battery pack, 7-inch interactive TFT touchscreen with live navigation, 95 km/h top speed, and class-leading 170 km IDC range.',
    usageType: 'PERSONAL',
    exShowroomPrice: 129999,
    subsidyEstimate: 18000,
    rtoEstimate: 4200,
    insuranceEstimate: 5100,
    bookingTokenAmount: 2999,
    certifiedRangeKm: 170,
    certifiedRangeCondition: 'ARAI / IDC Certified under standard test conditions (Eco mode, 75kg rider, flat terrain)',
    topSpeedKmph: 95,
    batteryCapacityKwh: 4.0,
    chargingTimeHours: 4.5,
    fastChargingTimeMin: 55,
    motorType: 'PMSM Mid-Drive with Belt Transmission',
    motorPowerWatts: 6200,
    warrantyYears: 3,
    warrantyKm: 50000,
    isFeatured: true,
    inStock: true,
    deliveryEstimateDays: 5,
    images: [
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', label: 'Front Quarter - Forest Green', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80', label: 'Side Profile' },
      { url: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80', label: 'Handlebar & TFT Display' },
    ],
    variants: [
      { id: 'var-eg-green', variantName: 'Glide Pro - Forest Green', colorName: 'Deep Forest Green', colorHex: '#14532D', priceDifference: 0, batteryCapacity: 4.0, realWorldRangeKm: 145, stockCount: 12, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-eg-white', variantName: 'Glide Pro - Glacier White', colorName: 'Glacier White', colorHex: '#F3F4F6', priceDifference: 0, batteryCapacity: 4.0, realWorldRangeKm: 145, stockCount: 8, imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80', isDefault: false },
      { id: 'var-eg-grey', variantName: 'Glide Pro - Stealth Grey', colorName: 'Stealth Matte Grey', colorHex: '#374151', priceDifference: 2000, batteryCapacity: 4.0, realWorldRangeKm: 145, stockCount: 5, imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Performance & Motor',
        specs: [
          { key: 'Motor Architecture', value: 'Permanent Magnet Synchronous Motor (PMSM)' },
          { key: 'Peak Power', value: '6.2 kW (8.3 bhp)' },
          { key: 'Rated Power', value: '3.3 kW' },
          { key: 'Peak Torque', value: '26 Nm at wheel' },
          { key: 'Acceleration 0-40 km/h', value: '3.1 seconds' },
          { key: 'Top Speed', value: '95 km/h' },
          { key: 'Gradeability', value: '20 degrees (conquers flyovers with pillion)' },
          { key: 'Riding Modes', value: 'Eco, Ride, Sport, Warp, Reverse Assist' },
        ]
      },
      {
        groupName: 'Battery & Charging',
        specs: [
          { key: 'Battery Type', value: 'Lithium-ion NMC (IP67 Water & Dust Proof)' },
          { key: 'Nominal Capacity', value: '4.0 kWh' },
          { key: 'Charging Time (0-100% Home)', value: '4 Hours 30 Minutes via 5A Wall Socket' },
          { key: 'Fast Charging (0-80%)', value: '55 Minutes at E-VAHAN Superchargers' },
          { key: 'Charger Included', value: 'Portable 750W Home Charger with Smart Cutoff' },
          { key: 'Battery Warranty', value: '3 Years / 50,000 km (Upgradable to 5 Years)' },
        ]
      },
      {
        groupName: 'Brakes, Wheels & Suspension',
        specs: [
          { key: 'Front Brake', value: '200 mm Hydraulically Actuated Disc' },
          { key: 'Rear Brake', value: '190 mm Disc with Combined Braking System (CBS)' },
          { key: 'Regenerative Braking', value: 'Electronic Multi-level Regen on Throttle Rollback' },
          { key: 'Front Suspension', value: 'Telescopic Hydraulic Fork' },
          { key: 'Rear Suspension', value: 'Symmetrically Mounted Monoshock' },
          { key: 'Tyres', value: '90/90-12 Tubeless Low-Rolling-Resistance' },
        ]
      },
      {
        groupName: 'Smart Connected Features',
        specs: [
          { key: 'Instrument Cluster', value: '7-inch Capacitive Colour Touchscreen' },
          { key: 'Connectivity', value: '4G LTE eSIM, Bluetooth 5.0, Wi-Fi' },
          { key: 'Navigation', value: 'Turn-by-turn On-screen Map with Charger Routing' },
          { key: 'Security', value: 'Geofencing, Towing Alerts, Remote Keyless Unlock' },
          { key: 'Over-The-Air (OTA)', value: 'Supported for OS, BMS & Motor Controller' },
          { key: 'Under-Seat Boot Space', value: '22 Litres (Accommodates Full-face Helmet)' },
        ]
      }
    ],
    faqs: [
      { question: 'What is the real-world driving range of Electra Glide Pro?', answer: 'In actual Indian city riding conditions with a 75 kg rider and typical stop-and-go traffic, you can reliably expect 140-145 km in Eco mode, 115-120 km in Ride mode, and 90-95 km in Sport mode.' },
      { question: 'Can I charge this scooter using a regular 3-pin household socket?', answer: 'Yes! The included 750W portable smart charger plugs into any grounded 5A or 15A household socket with built-in surge protection.' },
      { question: 'What warranty is provided on the battery pack?', answer: 'The battery comes with a 3-Year / 50,000 km standard manufacturer warranty covering capacity retention above 75%. An extended 5-year warranty package is also available at checkout.' },
    ]
  },

  {
    id: 'veh-sprint-plus',
    brand: 'Vidyut Motors',
    brandOrigin: 'Pune, India',
    category: 'ELECTRIC_SCOOTER',
    name: 'Vidyut Sprint Plus',
    modelSlug: 'vidyut-sprint-plus',
    tagline: 'Reliable Everyday Family Electric Scooter with Ultra-Safe LFP Battery',
    description: 'Engineered for Indian daily commuters and families. Powered by Lithium Iron Phosphate (LFP) chemistry known for superior thermal stability in high temperatures, spacious floorboard, comfortable dual seat, and 135 km range.',
    usageType: 'PERSONAL',
    exShowroomPrice: 98500,
    subsidyEstimate: 14500,
    rtoEstimate: 3600,
    insuranceEstimate: 4200,
    bookingTokenAmount: 1999,
    certifiedRangeKm: 135,
    certifiedRangeCondition: 'ARAI Certified IDC Range under test conditions',
    topSpeedKmph: 82,
    batteryCapacityKwh: 3.2,
    chargingTimeHours: 4.0,
    fastChargingTimeMin: 70,
    motorType: 'BLDC High Efficiency Hub Motor',
    motorPowerWatts: 4500,
    warrantyYears: 3,
    warrantyKm: 60000,
    isFeatured: true,
    inStock: true,
    deliveryEstimateDays: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80', label: 'Sprint Plus - Pearl White', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', label: 'Front View' },
    ],
    variants: [
      { id: 'var-sp-white', variantName: 'Sprint Plus - Pearl White', colorName: 'Pearl White', colorHex: '#FAFAFA', priceDifference: 0, batteryCapacity: 3.2, realWorldRangeKm: 115, stockCount: 15, imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-sp-blue', variantName: 'Sprint Plus - Pacific Blue', colorName: 'Pacific Blue', colorHex: '#1E3A8A', priceDifference: 1500, batteryCapacity: 3.2, realWorldRangeKm: 115, stockCount: 9, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Performance & Motor',
        specs: [
          { key: 'Motor Architecture', value: 'High-Efficiency BLDC Hub Motor' },
          { key: 'Peak Power', value: '4.5 kW' },
          { key: 'Rated Power', value: '2.5 kW' },
          { key: 'Top Speed', value: '82 km/h' },
          { key: 'Riding Modes', value: 'Eco, City, Turbo, Reverse Walk' },
        ]
      },
      {
        groupName: 'Battery & Charging',
        specs: [
          { key: 'Battery Chemistry', value: 'Lithium Iron Phosphate (LFP) with Smart BMS' },
          { key: 'Capacity', value: '3.2 kWh' },
          { key: 'Charging Time (0-100%)', value: '4 Hours (Home Socket)' },
          { key: 'Thermal Protection', value: 'Active heat dissipation rated for 55°C Indian summers' },
        ]
      }
    ],
    faqs: [
      { question: 'Why is LFP battery chemistry better for Indian climates?', answer: 'LFP (Lithium Iron Phosphate) has the highest thermal runaway threshold, making it virtually fire-safe even during peak Indian summer temperatures up to 50°C, and offers over 2000+ charge cycles.' }
    ]
  },

  {
    id: 'veh-aero-city',
    brand: 'ElectraMobility',
    brandOrigin: 'Bengaluru, India',
    category: 'ELECTRIC_SCOOTER',
    name: 'AeroScoot City',
    modelSlug: 'aeroscoot-city',
    tagline: 'Ultra-Lightweight Electric Scooter with Dual Portable Swappable Batteries',
    description: 'Perfect for apartment dwellers without dedicated parking plug points. The dual 1.25 kWh lightweight battery packs can be removed in 5 seconds and charged inside your home or office just like a laptop bag.',
    usageType: 'PERSONAL',
    exShowroomPrice: 79900,
    subsidyEstimate: 12000,
    rtoEstimate: 3100,
    insuranceEstimate: 3800,
    bookingTokenAmount: 1999,
    certifiedRangeKm: 105,
    certifiedRangeCondition: 'ARAI IDC Certified with dual battery configuration',
    topSpeedKmph: 70,
    batteryCapacityKwh: 2.5,
    chargingTimeHours: 3.5,
    motorType: 'Direct Drive BLDC Hub',
    motorPowerWatts: 3200,
    warrantyYears: 3,
    warrantyKm: 40000,
    isFeatured: false,
    inStock: true,
    deliveryEstimateDays: 3,
    images: [
      { url: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80', label: 'AeroScoot City - Lime Neon', isPrimary: true },
    ],
    variants: [
      { id: 'var-ac-lime', variantName: 'AeroScoot - Cyber Lime', colorName: 'Cyber Lime', colorHex: '#B7F34A', priceDifference: 0, batteryCapacity: 2.5, realWorldRangeKm: 90, stockCount: 14, imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-ac-black', variantName: 'AeroScoot - Obsidian Black', colorName: 'Obsidian Black', colorHex: '#111827', priceDifference: 0, batteryCapacity: 2.5, realWorldRangeKm: 90, stockCount: 11, imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Battery & Swapping',
        specs: [
          { key: 'Battery Configuration', value: '2 x 1.25 kWh Removable Swappable Packs (Total 2.5 kWh)' },
          { key: 'Pack Weight', value: '9.2 kg per battery with ergonomic carry handle' },
          { key: 'Charging Convenience', value: 'Charge indoors via any 5A plug' },
        ]
      }
    ]
  },

  {
    id: 'veh-yatri-e3',
    brand: 'Vidyut Motors',
    brandOrigin: 'Pune, India',
    category: 'ELECTRIC_PASSENGER_AUTO',
    name: 'Vidyut Yatri Auto E3',
    modelSlug: 'vidyut-yatri-auto-e3',
    tagline: 'Heavy-Duty Electric Passenger 3-Wheeler Auto with Lowest Per-Km Operating Cost',
    description: 'Built specifically for Indian auto drivers and fleet operators. Carries 4 passengers plus driver with comfort, heavy-duty tubular chassis, hydraulic regenerative brakes, 8.0 kWh LFP battery offering 140 km range on a single charge at just 35 paise/km running cost.',
    usageType: 'COMMERCIAL',
    exShowroomPrice: 285000,
    subsidyEstimate: 35000,
    rtoEstimate: 8500,
    insuranceEstimate: 11200,
    bookingTokenAmount: 5000,
    certifiedRangeKm: 140,
    certifiedRangeCondition: 'ARAI Certified with full passenger load (4+1 seating)',
    topSpeedKmph: 55,
    batteryCapacityKwh: 8.0,
    chargingTimeHours: 4.5,
    fastChargingTimeMin: 90,
    motorType: 'High-Torque PMSM with Integrated Reduction Gearbox',
    motorPowerWatts: 8500,
    warrantyYears: 3,
    warrantyKm: 100000,
    isFeatured: true,
    inStock: true,
    deliveryEstimateDays: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80', label: 'Vidyut Yatri Auto E3 - Golden Yellow & Green', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', label: 'Driver Cockpit' }
    ],
    variants: [
      { id: 'var-ye-yg', variantName: 'Yatri E3 - Traditional Yellow & Green', colorName: 'Auto Yellow & Green', colorHex: '#EAB308', priceDifference: 0, batteryCapacity: 8.0, realWorldRangeKm: 120, stockCount: 6, imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-ye-white', variantName: 'Yatri E3 - Fleet Pure White', colorName: 'Fleet White', colorHex: '#F9FAFB', priceDifference: 0, batteryCapacity: 8.0, realWorldRangeKm: 120, stockCount: 4, imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Commercial Performance',
        specs: [
          { key: 'Seating Capacity', value: 'Driver + 4 Passengers' },
          { key: 'Peak Motor Torque', value: '45 Nm at motor shaft (Over 180 Nm at wheels)' },
          { key: 'Gradeability', value: '22% steep incline restart capability' },
          { key: 'Per-Km Fuel Savings', value: 'Saves approx ₹15,000 to ₹18,000/month compared to CNG/Diesel' },
          { key: 'Digital Fare Meter Ready', value: 'Pre-wired connector for digital taxi meter & GPS' },
        ]
      },
      {
        groupName: 'Chassis & Durability',
        specs: [
          { key: 'Frame Construction', value: 'Robotic welded high-tensile steel tubular chassis' },
          { key: 'Front Suspension', value: 'Leading link with helical springs & hydraulic dampener' },
          { key: 'Rear Suspension', value: 'Heavy duty leaf spring with shock absorbers' },
          { key: 'Tyres', value: '4.00-8 6PR Commercial Spec' },
        ]
      }
    ],
    faqs: [
      { question: 'What is the commercial loan eligibility for Vidyut Yatri Auto?', answer: 'We have partnerships with major Indian financiers (SBI, HDFC, Mahindra Finance, Bajaj Finserv) offering up to 90% on-road funding with low EMI starting at ₹5,999/month for 48 months.' }
    ]
  },

  {
    id: 'veh-shakti-cargo',
    brand: 'Shakti EV Commercials',
    brandOrigin: 'Faridabad, India',
    category: 'ELECTRIC_CARGO_AUTO',
    name: 'Vidyut Shakti Cargo 3W',
    modelSlug: 'vidyut-shakti-cargo-3w',
    tagline: 'Commercial Electric Cargo 3-Wheeler for Last-Mile Logistics & Deliveries',
    description: 'Designed specifically for e-commerce, FMCG distribution, courier delivery, and agricultural produce transport. Heavy-duty 600 kg rated payload container box, 9.5 kWh LFP pack providing 160 km range, reinforced chassis, and telematics GPS tracking.',
    usageType: 'COMMERCIAL',
    exShowroomPrice: 320000,
    subsidyEstimate: 40000,
    rtoEstimate: 9200,
    insuranceEstimate: 12500,
    bookingTokenAmount: 5000,
    certifiedRangeKm: 160,
    certifiedRangeCondition: 'ARAI Certified with 500 kg payload',
    topSpeedKmph: 50,
    batteryCapacityKwh: 9.5,
    chargingTimeHours: 5.0,
    fastChargingTimeMin: 110,
    motorType: 'Heavy-Duty Industrial PMSM Motor',
    motorPowerWatts: 9200,
    warrantyYears: 3,
    warrantyKm: 100000,
    isFeatured: true,
    inStock: true,
    deliveryEstimateDays: 6,
    images: [
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', label: 'Shakti Cargo - Closed Delivery Box', isPrimary: true },
    ],
    variants: [
      { id: 'var-sc-box', variantName: 'Shakti Cargo - Closed Delivery Box (140 cu.ft)', colorName: 'Commercial White', colorHex: '#FFFFFF', priceDifference: 0, batteryCapacity: 9.5, realWorldRangeKm: 135, stockCount: 5, imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-sc-open', variantName: 'Shakti Cargo - Open Deck Flatbed', colorName: 'Cargo Grey', colorHex: '#4B5563', priceDifference: -15000, batteryCapacity: 9.5, realWorldRangeKm: 140, stockCount: 3, imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Cargo Capacity & Dimensions',
        specs: [
          { key: 'Payload Capacity', value: '600 kg certified rated load' },
          { key: 'Cargo Container Volume', value: '140 cubic feet (Weatherproof Lockable Box)' },
          { key: 'Ground Clearance', value: '180 mm unladen' },
          { key: 'Turning Radius', value: '2.8 metres for narrow city alleys' },
        ]
      }
    ]
  },

  {
    id: 'veh-etitan-loader',
    brand: 'Shakti EV Commercials',
    brandOrigin: 'Faridabad, India',
    category: 'ELECTRIC_LOADER',
    name: 'GreenLoad E-Titan Loader',
    modelSlug: 'greenload-e-titan-loader',
    tagline: 'High-Capacity 750kg Industrial Electric Loader with Hydraulic Tipper Option',
    description: 'The heavyweight workhorse of electric loaders. Featuring an 11.2 kWh long-cycle LFP battery pack, 175 km range, 750 kg load rating, reinforced differential axle, and optional hydraulic tipping bed for construction, municipal, and industrial bulk transport.',
    usageType: 'FLEET',
    exShowroomPrice: 375000,
    subsidyEstimate: 45000,
    rtoEstimate: 11000,
    insuranceEstimate: 14000,
    bookingTokenAmount: 5000,
    certifiedRangeKm: 175,
    certifiedRangeCondition: 'IDC test cycle under full 750 kg ballast',
    topSpeedKmph: 48,
    batteryCapacityKwh: 11.2,
    chargingTimeHours: 5.5,
    fastChargingTimeMin: 120,
    motorType: 'IP67 Enclosed PMSM Industrial Motor',
    motorPowerWatts: 10500,
    warrantyYears: 3,
    warrantyKm: 120000,
    isFeatured: false,
    inStock: true,
    deliveryEstimateDays: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80', label: 'E-Titan Loader - Industrial Green', isPrimary: true },
    ],
    variants: [
      { id: 'var-et-flat', variantName: 'E-Titan - High Sided Flatbed', colorName: 'Industrial Green', colorHex: '#14532D', priceDifference: 0, batteryCapacity: 11.2, realWorldRangeKm: 150, stockCount: 4, imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80', isDefault: true },
    ],
    specifications: [
      {
        groupName: 'Heavy Duty Loader Specs',
        specs: [
          { key: 'Payload Rating', value: '750 kg Max Gross Vehicle Weight 1350 kg' },
          { key: 'Chassis Type', value: 'Twin-C channel reinforced automotive grade steel' },
          { key: 'Fleet Telematics', value: 'Built-in GPS, SOS kill switch, Real-time SOC & Driver Behaviour Monitoring' },
        ]
      }
    ]
  },

  {
    id: 'veh-thundervolt-x',
    brand: 'Vidyut Motors',
    brandOrigin: 'Pune, India',
    category: 'ELECTRIC_SCOOTER',
    name: 'ThunderVolt X Commuter',
    modelSlug: 'thundervolt-x-commuter',
    tagline: 'Sporty Long-Distance Electric Scooter with Aggressive Styling',
    description: 'Designed for young professionals and daily highway commuters. Boasts a 3.6 kWh battery, 145 km certified range, 88 km/h top speed, dual LED projection lamps, and aggressive sporty aerodynamics.',
    usageType: 'PERSONAL',
    exShowroomPrice: 112000,
    subsidyEstimate: 16000,
    rtoEstimate: 3900,
    insuranceEstimate: 4800,
    bookingTokenAmount: 2500,
    certifiedRangeKm: 145,
    certifiedRangeCondition: 'ARAI IDC Certified',
    topSpeedKmph: 88,
    batteryCapacityKwh: 3.6,
    chargingTimeHours: 4.2,
    fastChargingTimeMin: 65,
    motorType: 'PMSM Mid-drive with Toothed Belt',
    motorPowerWatts: 5500,
    warrantyYears: 3,
    warrantyKm: 50000,
    isFeatured: false,
    inStock: true,
    deliveryEstimateDays: 4,
    images: [
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', label: 'ThunderVolt X - Crimson Red', isPrimary: true },
    ],
    variants: [
      { id: 'var-tv-red', variantName: 'ThunderVolt - Crimson Red', colorName: 'Crimson Red', colorHex: '#DC2626', priceDifference: 0, batteryCapacity: 3.6, realWorldRangeKm: 125, stockCount: 7, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', isDefault: true },
      { id: 'var-tv-black', variantName: 'ThunderVolt - Matte Black', colorName: 'Matte Black', colorHex: '#1F2937', priceDifference: 1000, batteryCapacity: 3.6, realWorldRangeKm: 125, stockCount: 6, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', isDefault: false },
    ],
    specifications: [
      {
        groupName: 'Performance & Drive',
        specs: [
          { key: 'Motor Power', value: '5.5 kW Peak' },
          { key: 'Top Speed', value: '88 km/h' },
          { key: 'Range', value: '145 km IDC' },
        ]
      }
    ]
  }
];

export const SPARE_PARTS_DATA: SparePartItem[] = [
  {
    id: 'part-bat-72v-lfp',
    categoryId: 'cat-batteries',
    categoryName: 'Batteries',
    name: 'Vidyut Genuine 72V 45Ah LFP Battery Pack with Smart CAN-BMS',
    slug: 'vidyut-72v-45ah-lfp-battery-pack',
    sku: 'BAT-72V-LFP-01',
    brand: 'Vidyut OEM Genuine',
    mrpPrice: 42000,
    sellingPrice: 37500,
    stockQuantity: 14,
    warrantyMonths: 36,
    returnWindowDays: 10,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    description: 'High-safety Lithium Iron Phosphate (LiFePO4) 72V 45Ah battery pack built in an IP67 laser-welded aluminium casing. Equipped with an automotive-grade CAN 2.0B Smart Battery Management System (BMS) with cell active balancing, over-voltage, thermal runaway protection, and low-temperature charge management.',
    vendorName: 'Vidyut Central Warehouse, Pune',
    specifications: {
      'Voltage': '72V Nominal (Peak 86.4V)',
      'Capacity': '45Ah (3.24 kWh)',
      'Chemistry': 'Lithium Iron Phosphate (LFP Grade-A Prismatic Cells)',
      'Cycle Life': '> 2500 cycles to 80% DOD',
      'Ingress Protection': 'IP67 Water & Dust Submersible',
      'Weight': '22.5 kg',
      'Discharge Connector': 'Chogori / Anderson SB50 High-Ampere'
    },
    compatibleVehicleIds: ['veh-sprint-plus', 'veh-thundervolt-x', 'veh-yatri-e3'],
    compatibleVehicleNames: ['Vidyut Sprint Plus', 'ThunderVolt X Commuter', 'Vidyut Yatri Auto E3']
  },

  {
    id: 'part-charger-72v-fast',
    categoryId: 'cat-chargers',
    categoryName: 'Battery Chargers',
    name: 'Electra 72V 12A Smart Heavy-Duty Fast Charger with LED Display',
    slug: 'electra-72v-12a-smart-fast-charger',
    sku: 'CHG-72V-12A-FAST',
    brand: 'ElectraMobility Genuine',
    mrpPrice: 6500,
    sellingPrice: 5499,
    stockQuantity: 28,
    warrantyMonths: 24,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=800&q=80',
    description: 'Microprocessor-controlled intelligent fast charger. Auto-detects cell temperature and adjusts charging current smoothly from 12A to trickle charge, increasing battery pack longevity by 25%. Aluminium alloy housing with silent dual ball-bearing cooling fans.',
    vendorName: 'Electra OEM Supply Hub, Bengaluru',
    specifications: {
      'Input Voltage': '180V - 260V AC, 50Hz Standard Indian Grid',
      'Output Voltage': '84V DC Max',
      'Max Current': '12 Amperes',
      'Efficiency': '94% PFC Active Power Factor Corrected',
      'Protections': 'Short-circuit, Reverse polarity, Over-temp, Auto cut-off at 100%'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-thundervolt-x'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'ThunderVolt X Commuter']
  },

  {
    id: 'part-controller-sinewave',
    categoryId: 'cat-controllers',
    categoryName: 'Controllers',
    name: 'Vidyut Pro 72V 100A Programmable Vector FOC Sinewave Controller',
    slug: 'vidyut-pro-72v-100a-foc-controller',
    sku: 'CTL-72V-100A-FOC',
    brand: 'Vidyut OEM Genuine',
    mrpPrice: 11000,
    sellingPrice: 9200,
    stockQuantity: 19,
    warrantyMonths: 18,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Field Oriented Control (FOC) Sinewave motor controller. Delivers whisper-quiet motor operation, butter-smooth throttle response without jitter, and highly efficient regenerative braking that charges your battery while slowing down.',
    vendorName: 'Vidyut Central Warehouse, Pune',
    specifications: {
      'Operating Voltage': '60V - 84V DC',
      'Peak Phase Current': '100A',
      'Control Type': 'Field Oriented Control (FOC) Sine Wave',
      'Communication': 'CAN-Bus / UART Telematics Ready',
      'Regen Efficiency': 'Up to 12% energy recapture'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-shakti-cargo'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'Vidyut Shakti Cargo 3W']
  },

  {
    id: 'part-brake-pads-disc',
    categoryId: 'cat-braking',
    categoryName: 'Braking Systems',
    name: 'Genuine Ceramic-Metallic Disc Brake Pad Set (Front & Rear)',
    slug: 'genuine-ceramic-metallic-disc-brake-pads',
    sku: 'BRK-PAD-CER-04',
    brand: 'Vidyut OEM Genuine',
    mrpPrice: 1200,
    sellingPrice: 850,
    stockQuantity: 65,
    warrantyMonths: 6,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80',
    description: 'High-temperature ceramic compound pads specifically designed for EV scooter regeneration and mechanical stopping. Offers 40% less rotor wear, no squealing noise, and reliable grip in monsoon rain conditions.',
    vendorName: 'AutoParts Direct, Gurugram',
    specifications: {
      'Compound': 'Semi-metallic Ceramic Friction Material',
      'Heat Resistance': 'Up to 450°C fade-free',
      'Backplate': 'Anti-corrosion powder coated steel',
      'Position': 'Compatible with Front 200mm & Rear 190mm Callipers'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-aero-city', 'veh-thundervolt-x'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'AeroScoot City', 'ThunderVolt X Commuter']
  },

  {
    id: 'part-tyre-ev-tubeless',
    categoryId: 'cat-tyres',
    categoryName: 'Tyres & Tubes',
    name: 'CEAT Secura EV 90/90-12 Tubeless Low Rolling Resistance Tyre',
    slug: 'ceat-secura-ev-90-90-12-tubeless-tyre',
    sku: 'TYR-90-90-12-EV',
    brand: 'CEAT OEM Partner',
    mrpPrice: 1850,
    sellingPrice: 1490,
    stockQuantity: 42,
    warrantyMonths: 36,
    returnWindowDays: 10,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    description: 'Custom-designed for high-torque electric two-wheelers. Silica-enriched compound decreases rolling resistance by 15%, directly adding 6-8 km extra range to every single battery charge cycle, with deep sipes for Indian road water clearance.',
    vendorName: 'Vidyut Parts Hub, Bengaluru',
    specifications: {
      'Size': '90/90-12 54J',
      'Type': 'Tubeless',
      'Pattern': 'Secura EV Directional Rolling Sipes',
      'Max Speed': '100 km/h',
      'Load Index': '212 kg'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-aero-city', 'veh-thundervolt-x'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'AeroScoot City', 'ThunderVolt X Commuter']
  },

  {
    id: 'part-tyre-cargo-heavy',
    categoryId: 'cat-tyres',
    categoryName: 'Tyres & Tubes',
    name: 'MRF Heavy Hauler 4.00-8 6PR Commercial 3-Wheeler Heavy Tyre',
    slug: 'mrf-heavy-hauler-4-00-8-commercial-tyre',
    sku: 'TYR-400-8-6PR-COM',
    brand: 'MRF Commercial OEM',
    mrpPrice: 2450,
    sellingPrice: 2050,
    stockQuantity: 30,
    warrantyMonths: 24,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    description: '6-Ply reinforced nylon carcass engineered specifically for electric commercial cargo and passenger autos. Enhanced tread depth gives long life under 700 kg gross loads across potholed roads.',
    vendorName: 'Commercial Fleet Spares, Delhi',
    specifications: {
      'Size': '4.00-8',
      'Ply Rating': '6 PR Heavy Duty',
      'Tread Pattern': 'Lug & Rib Dual Hybrid',
      'Load Capacity': '425 kg per tyre'
    },
    compatibleVehicleIds: ['veh-yatri-e3', 'veh-shakti-cargo', 'veh-etitan-loader'],
    compatibleVehicleNames: ['Vidyut Yatri Auto E3', 'Vidyut Shakti Cargo 3W', 'GreenLoad E-Titan Loader']
  },

  {
    id: 'part-dcdc-converter',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical Components',
    name: 'High Efficiency 72V to 12V 25A DC-to-DC Step Down Converter',
    slug: '72v-to-12v-25a-dcdc-converter',
    sku: 'ELE-DCDC-72-12-25A',
    brand: 'Vidyut OEM Genuine',
    mrpPrice: 1950,
    sellingPrice: 1450,
    stockQuantity: 35,
    warrantyMonths: 12,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Powers all 12V accessories (LED headlamps, horn, USB fast charger, TFT instrument cluster, turn indicators) from the main 72V traction battery with 92% efficiency and overvoltage clamp.',
    vendorName: 'Vidyut Central Warehouse, Pune',
    specifications: {
      'Input Voltage Range': '48V - 96V DC',
      'Output Voltage': '12.2V DC Stable',
      'Output Current': '25 Amperes Constant',
      'Waterproof': 'IP67 Epoxy Sealed Casting'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-yatri-e3', 'veh-shakti-cargo', 'veh-thundervolt-x'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'Vidyut Yatri Auto E3', 'Vidyut Shakti Cargo 3W', 'ThunderVolt X Commuter']
  },

  {
    id: 'part-led-headlamp-projector',
    categoryId: 'cat-lighting',
    categoryName: 'Lighting',
    name: 'Adaptive Dual Bi-LED Projector Headlamp Assembly with DRL Ring',
    slug: 'adaptive-dual-biled-projector-headlamp',
    sku: 'LGT-BILED-PRJ-01',
    brand: 'ElectraMobility Genuine',
    mrpPrice: 3800,
    sellingPrice: 3100,
    stockQuantity: 21,
    warrantyMonths: 24,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=800&q=80',
    description: 'High-intensity dual LED projector giving 3000 lumens wide beam spread. Low power draw of only 28 Watts prevents battery drain while illuminating up to 120 metres ahead.',
    vendorName: 'Electra OEM Supply Hub, Bengaluru',
    specifications: {
      'Luminous Flux': '3000 Lumens',
      'Power Consumption': '28W Low Beam / 42W High Beam',
      'Color Temperature': '6000K Pure White',
      'Lens Material': 'UV-Resistant Hard-Coated Polycarbonate'
    },
    compatibleVehicleIds: ['veh-eglide-pro'],
    compatibleVehicleNames: ['Electra Glide Pro']
  },

  {
    id: 'part-helmet-smart-bt',
    categoryId: 'cat-accessories',
    categoryName: 'Helmets & Accessories',
    name: 'Vidyut AeroSmart ISI & DOT Certified Bluetooth Helmet with SOS LED',
    slug: 'vidyut-aerosmart-bluetooth-helmet',
    sku: 'ACC-HLM-BT-ISI-01',
    brand: 'Vidyut Gear',
    mrpPrice: 4500,
    sellingPrice: 3499,
    stockQuantity: 50,
    warrantyMonths: 12,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'Full-face aerodynamic motorcycle helmet with built-in Bluetooth 5.2 speakers and noise-cancelling mic for hands-free navigation prompts and calls while riding. Features rear flashing brake-sensing red LED beacon.',
    vendorName: 'Vidyut Rider Gear, Delhi',
    specifications: {
      'Certification': 'ISI (IS:4151) and DOT FMVSS 218 Certified',
      'Bluetooth Version': '5.2 with 18 Hours Battery Playback',
      'Visor': 'Scratch-Resistant Optical Class 1 Pinlock-Ready',
      'Size Options': 'Medium (58cm) & Large (60cm) with quick micro-ratchet strap'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-aero-city', 'veh-thundervolt-x', 'veh-yatri-e3', 'veh-shakti-cargo', 'veh-etitan-loader'],
    compatibleVehicleNames: ['Universal All Models']
  },

  {
    id: 'part-cover-allweather',
    categoryId: 'cat-accessories',
    categoryName: 'Helmets & Accessories',
    name: 'All-Weather Heavy-Duty UV & Heat Proof Vehicle Cover',
    slug: 'all-weather-heavy-duty-uv-vehicle-cover',
    sku: 'ACC-COV-ALL-UV',
    brand: 'Vidyut Gear',
    mrpPrice: 1400,
    sellingPrice: 999,
    stockQuantity: 40,
    warrantyMonths: 12,
    returnWindowDays: 7,
    isOemGenuine: true,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy 300D Oxford fabric with heat-reflective silver inner coating that lowers battery temperature by up to 10°C when parked outdoors in harsh Indian sunlight. Mirror pockets and elastic buckle clasp.',
    vendorName: 'Vidyut Rider Gear, Delhi',
    specifications: {
      'Material': '300D Waterproof Oxford Fabric',
      'UV Protection': 'UPF 50+ Sun Block',
      'Lock Holes': 'Reinforced Anti-Theft Metal Eyelets at front wheel'
    },
    compatibleVehicleIds: ['veh-eglide-pro', 'veh-sprint-plus', 'veh-aero-city', 'veh-thundervolt-x'],
    compatibleVehicleNames: ['Electra Glide Pro', 'Vidyut Sprint Plus', 'AeroScoot City', 'ThunderVolt X Commuter']
  }
];

export const SERVICE_CATEGORIES: ServiceCategoryDef[] = [
  {
    key: 'PERIODIC_MAINTENANCE',
    name: 'General Periodic Maintenance',
    shortDescription: '40-Point comprehensive EV health inspection, brake adjustment, fastener torquing, tyre pressure check, and diagnostic telemetry scan.',
    baseEstimatePrice: 499,
    estimatedMinutes: 60,
    isDoorstepAllowed: true,
    iconName: 'Wrench'
  },
  {
    key: 'BATTERY_DIAGNOSTICS',
    name: 'Battery Health & Cell Balancing',
    shortDescription: 'Specialist diagnostic for range drop, battery temperature warnings, cell voltage drift analysis, and BMS recalibration.',
    baseEstimatePrice: 699,
    estimatedMinutes: 90,
    isDoorstepAllowed: true,
    iconName: 'BatteryCharging'
  },
  {
    key: 'BRAKE_OVERHAUL',
    name: 'Brake Inspection & Fluid Service',
    shortDescription: 'Disc pad wear measurement, calliper cleaning, hydraulic fluid flush, regenerative electronic braking threshold tuning.',
    baseEstimatePrice: 399,
    estimatedMinutes: 45,
    isDoorstepAllowed: true,
    iconName: 'ShieldCheck'
  },
  {
    key: 'MOTOR_CONTROLLER_REPAIR',
    name: 'Motor & Controller Electrical Diagnostics',
    shortDescription: 'Oscilloscope phase check, hall sensor test, throttle sensor recalibration, wiring harness continuity testing.',
    baseEstimatePrice: 799,
    estimatedMinutes: 75,
    isDoorstepAllowed: true,
    iconName: 'Cpu'
  },
  {
    key: 'CHARGING_ISSUE_DIAGNOSIS',
    name: 'Charging Port & Charger Diagnosis',
    shortDescription: 'Inspection for charging cut-offs, melted port pins, thermal resistance, wall socket grounding verification.',
    baseEstimatePrice: 349,
    estimatedMinutes: 40,
    isDoorstepAllowed: true,
    iconName: 'Zap'
  },
  {
    key: 'TYRE_SUSPENSION_SERVICE',
    name: 'Tyres & Suspension Overhaul',
    shortDescription: 'Wheel alignment check, shock absorber leak check, puncture repair, tyre replacement fitment service.',
    baseEstimatePrice: 449,
    estimatedMinutes: 50,
    isDoorstepAllowed: true,
    iconName: 'Disc'
  },
  {
    key: 'EMERGENCY_BREAKDOWN',
    name: 'Doorstep Breakdown Assistance SOS',
    shortDescription: 'Rapid response technician van dispatched to your stranded location for flat tyres, battery jump-charge or towing.',
    baseEstimatePrice: 899,
    estimatedMinutes: 45,
    isDoorstepAllowed: true,
    iconName: 'AlertTriangle'
  },
  {
    key: 'PARTS_INSTALLATION',
    name: 'Spare Parts Fitment & Installation',
    shortDescription: 'Professional certified installation of genuine spare parts (battery, controller, lights, tyres, mirrors) ordered from marketplace.',
    baseEstimatePrice: 350,
    estimatedMinutes: 60,
    isDoorstepAllowed: true,
    iconName: 'Tool'
  }
];

export const GENERAL_FAQS = [
  {
    category: 'Purchasing & Subsidies',
    question: 'How do state EV subsidies and FAME-II incentives work on E-VAHAN?',
    answer: 'Electric two-wheelers and three-wheelers qualify for state EV policy benefits and central FAME-II incentives. The subsidy is deducted directly from the ex-showroom price on eligible vehicles at the time of invoicing once your Aadhaar and regional domicile KYC are validated.'
  },
  {
    category: 'Purchasing & Subsidies',
    question: 'Can I purchase an EV vehicle fully online with doorstep delivery?',
    answer: 'Yes! You can choose to pay the token booking amount (₹1,999 - ₹5,000) or complete the full payment online. After your order is placed, our partner dealer completes the RTO registration and delivers the vehicle right to your registered home or business address with high-security registration plates (HSRP).'
  },
  {
    category: 'Test Drives',
    question: 'Is the doorstep test drive completely free of cost?',
    answer: 'Yes, doorstep test drives are 100% complimentary in supported Tier-1 and Tier-2 pin codes. A certified EV mobility specialist brings the sanitized vehicle with a helmet to your doorstep at your chosen date and time slot.'
  },
  {
    category: 'Test Drives',
    question: 'What documents do I need to produce before starting a test drive?',
    answer: 'You must show a valid Indian permanent two-wheeler / three-wheeler driving license (physical or Digilocker) to our test drive executive before riding.'
  },
  {
    category: 'Quotations',
    question: 'What is the advantage of generating an Online Quotation?',
    answer: 'Our quotation system creates a clear, itemized proforma docket including ex-showroom price, GST breakdown, RTO charges, mandatory insurance, and applicable bulk fleet discounts. You can download this official PDF quote for bank loan approvals or commercial capex verification.'
  },
  {
    category: 'Spare Parts',
    question: 'How do I know if a spare part is 100% compatible with my EV model?',
    answer: 'Every spare part on E-VAHAN is mapped directly to vehicle chassis and electrical specifications. Use our interactive "Vehicle Compatibility Checker" widget on the product page: select your brand, model, and year to see a guaranteed compatibility verdict.'
  },
  {
    category: 'Doorstep Servicing',
    question: 'How does doorstep servicing work, and can the technician charge me extra without my consent?',
    answer: 'Never. Our certified mobile technician travels in a custom-tooled EV service van to your location. The technician performs a standardized digital inspection and uploads findings to your live dashboard. If any part replacement or extra labor is required, you receive a digital estimate that you must explicitly click "Approve" on before the technician can proceed.'
  },
  {
    category: 'Warranty & Returns',
    question: 'What is the return policy for spare parts and accessories?',
    answer: 'Genuine spare parts and accessories come with a 7-day or 10-day replacement/return window. If the part arrived damaged or does not fit as verified by our compatibility checker, we provide free doorstep pickup and replacement.'
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rajesh Varma',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'Seamless scooter booking and transparent subsidy deduction!',
    comment: 'Booked the Electra Glide Pro through E-VAHAN. The subsidy deduction was clear and itemized. Test drive was completed at my apartment in Indiranagar. The delivery was right on schedule within 5 days with HSRP number plate fitted.',
    verified: true,
    vehicleName: 'Electra Glide Pro',
    date: '18 October 2026'
  },
  {
    id: 'rev-2',
    name: 'Mohammed Imran',
    city: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Vidyut Yatri Auto reduced my daily fuel expenses from ₹450 to ₹70!',
    comment: 'I drive commercial passenger auto in Hyderabad. Switching from CNG auto to Vidyut Yatri Auto E3 was the best decision. I save over ₹11,000 every month. Fleet finance was arranged smoothly through the Vidyutva quotation process.',
    verified: true,
    vehicleName: 'Vidyut Yatri Auto E3',
    date: '12 October 2026'
  },
  {
    id: 'rev-3',
    name: 'Pooja Sundaram',
    city: 'Chennai, Tamil Nadu',
    rating: 5,
    title: 'Doorstep service technician was knowledgeable and transparent',
    comment: 'My scooter rear brake felt spongy. Booked doorstep service at 10 AM. Technician Santosh arrived with his mobile EV van in Adyar, bled the hydraulic fluid, replaced the brake pads, and explained everything. I approved the ₹850 pad estimate directly on my phone screen before he started.',
    verified: true,
    vehicleName: 'Doorstep Service Experience',
    date: '05 October 2026'
  },
  {
    id: 'rev-4',
    name: 'Vikas Deshmukh',
    city: 'Pune, Maharashtra',
    rating: 5,
    title: 'Genuine OEM CEAT tyres arrived with exact vehicle fitment',
    comment: 'Used the compatibility checker on the marketplace to find low rolling resistance EV tyres for my scooter. Delivered in 24 hours. Range noticeably improved by 7-8 km per charge.',
    verified: true,
    vehicleName: 'CEAT Secura EV Tyres',
    date: '28 September 2026'
  }
];

export const VALID_COUPONS = [
  { code: 'EVFIRST10', discountPercent: 10, maxDiscount: 1000, minOrder: 1500, description: '10% OFF up to ₹1,000 on your first spare parts order' },
  { code: 'GREEN500', flatDiscount: 500, minOrder: 2500, description: 'Flat ₹500 OFF on orders above ₹2,500' },
  { code: 'FESTIVE2026', discountPercent: 15, maxDiscount: 2000, minOrder: 3000, description: 'Special EV mobility festival 15% discount' },
];
