// TypeScript Types for E-VAHAN EV Marketplace

export type VehicleCategoryType =
  | 'ELECTRIC_SCOOTER'
  | 'ELECTRIC_PASSENGER_AUTO'
  | 'ELECTRIC_CARGO_AUTO'
  | 'ELECTRIC_LOADER';

export type VehicleUsageType = 'PERSONAL' | 'COMMERCIAL' | 'FLEET';

export interface VehicleColorVariant {
  id: string;
  variantName: string;
  colorName: string;
  colorHex: string;
  priceDifference: number;
  batteryCapacity: number;
  realWorldRangeKm: number;
  stockCount: number;
  imageUrl: string;
  isDefault: boolean;
}

export interface VehicleSpecGroup {
  groupName: string;
  specs: {
    key: string;
    value: string;
    unit?: string;
  }[];
}

export interface VehicleItem {
  id: string;
  brand: string;
  brandOrigin?: string;
  category: VehicleCategoryType;
  name: string;
  modelSlug: string;
  tagline: string;
  description: string;
  usageType: VehicleUsageType;
  exShowroomPrice: number;
  subsidyEstimate: number;
  rtoEstimate: number;
  insuranceEstimate: number;
  bookingTokenAmount: number;
  certifiedRangeKm: number;
  certifiedRangeCondition: string;
  topSpeedKmph: number;
  batteryCapacityKwh: number;
  chargingTimeHours: number;
  fastChargingTimeMin?: number;
  motorType: string;
  motorPowerWatts: number;
  warrantyYears: number;
  warrantyKm: number;
  isFeatured: boolean;
  inStock: boolean;
  images: {
    url: string;
    label: string;
    isPrimary?: boolean;
  }[];
  variants: VehicleColorVariant[];
  specifications: VehicleSpecGroup[];
  deliveryEstimateDays: number;
  brochurePdfUrl?: string;
  faqs?: { question: string; answer: string }[];
}

export interface SparePartItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  mrpPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  warrantyMonths: number;
  returnWindowDays: number;
  isOemGenuine: boolean;
  imageUrl: string;
  description: string;
  vendorName: string;
  specifications: { [key: string]: string };
  compatibleVehicleIds: string[]; // references VehicleItem.id or modelSlug
  compatibleVehicleNames: string[];
}

export interface ServiceCategoryDef {
  key: string;
  name: string;
  shortDescription: string;
  baseEstimatePrice: number;
  estimatedMinutes: number;
  isDoorstepAllowed: boolean;
  iconName: string;
}

export interface ServiceBookingItem {
  id: string;
  bookingNumber: string;
  userId: string;
  serviceCategoryKey: string;
  serviceCategoryName: string;
  vehicleType: VehicleCategoryType;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleRegNo?: string;
  serviceMode: 'DOORSTEP' | 'SERVICE_CENTRE';
  urgency: 'STANDARD' | 'PRIORITY' | 'EMERGENCY_BREAKDOWN';
  problemDescription: string;
  mediaUrls?: string[];
  appointmentDate: string;
  appointmentSlot: string;
  customerName: string;
  customerPhone: string;
  pincode: string;
  city: string;
  addressLine: string;
  status:
    | 'REQUESTED'
    | 'AWAITING_CONFIRMATION'
    | 'CONFIRMED'
    | 'PARTNER_ASSIGNED'
    | 'ON_THE_WAY'
    | 'VEHICLE_INSPECTION'
    | 'AWAITING_CUSTOMER_APPROVAL'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
  technician?: {
    name: string;
    phone: string;
    vanNumber: string;
    rating: number;
    photoUrl?: string;
  };
  inspectionReport?: {
    batteryHealthPercent: number;
    brakePadHealth: string;
    tyreCondition: string;
    electricalStatus: string;
    recommendations: string[];
  };
  additionalApprovalQuote?: {
    id: string;
    title: string;
    partCost: number;
    laborCost: number;
    totalAmount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    notes: string;
  };
  baseFee: number;
  inspectionFee: number;
  totalApprovedAmount?: number;
  isCustomerApproved?: boolean;
  finalPaidAmount?: number;
  createdAt: string;
}

export interface TestDriveBookingItem {
  id: string;
  bookingNumber: string;
  userId?: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  pincode: string;
  testDriveMode: 'DOORSTEP' | 'DEALERSHIP';
  dealershipName?: string;
  preferredDate: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface QuotationRequestItem {
  id: string;
  quotationNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  companyName?: string;
  gstin?: string;
  city: string;
  pincode: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: VehicleCategoryType;
  quantity: number;
  usageType: VehicleUsageType;
  financeRequirement: boolean;
  tradeInOldVehicle: boolean;
  oldVehicleDetails?: string;
  status:
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'QUOTE_PREPARED'
    | 'SENT_TO_CUSTOMER'
    | 'ACCEPTED'
    | 'EXPIRED'
    | 'REJECTED';
  validUntil: string;
  estimatedUnitPrice: number;
  estimatedBulkDiscount: number;
  estimatedSubsidyTotal: number;
  estimatedRtoTotal: number;
  estimatedInsuranceTotal: number;
  estimatedGrandTotal: number;
  notes?: string;
  createdAt: string;
}

export interface VehicleOrderItem {
  id: string;
  orderNumber: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  variantName: string;
  colorName: string;
  colorHex: string;
  exShowroom: number;
  subsidyDiscount: number;
  rtoFee: number;
  insuranceFee: number;
  deliveryFee: number;
  totalOnRoad: number;
  paymentMode: 'TOKEN_BOOKING' | 'FULL_PAYMENT' | 'FINANCE_LOAN';
  bookingAmountPaid: number;
  balanceDue: number;
  financeDetails?: {
    bankPreference: string;
    loanTenureMonths: number;
    estimatedEmiMonthly: number;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentTransactionRef: string;
  paymentMethod: string;
  status:
    | 'BOOKING_CONFIRMED'
    | 'DEALER_ASSIGNED'
    | 'KYC_SUBMITTED'
    | 'REGISTRATION_IN_PROGRESS'
    | 'READY_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  allocatedDealer: string;
  createdAt: string;
}

export interface SparePartCartItem {
  sparePart: SparePartItem;
  quantity: number;
}

export interface SparePartsOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: {
    partId: string;
    name: string;
    sku: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliverySpeed: 'STANDARD' | 'EXPRESS';
  paymentMethod: string;
  paymentTransactionRef: string;
  status: 'CONFIRMED' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  courierTracking?: {
    carrierName: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
  };
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  label: 'HOME' | 'OFFICE' | 'DEALERSHIP_PICKUP';
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  userId: string;
  category: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  relatedReference?: string;
  createdAt: string;
  messages: {
    id: string;
    sender: 'CUSTOMER' | 'SUPPORT_AGENT';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AppNotification {
  id: string;
  category: 'ORDER' | 'TEST_DRIVE' | 'SERVICE' | 'QUOTATION' | 'SYSTEM';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  drivingLicenseNo?: string;
  isKycVerified: boolean;
  savedAddresses: CustomerAddress[];
}
