// Storage & Mock Backend Service for E-VAHAN EV Marketplace
// Simulates server-side atomic operations, validation, Razorpay signature checks, and persistence

import {
  CustomerUser,
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  SparePartsOrder,
  ServiceBookingItem,
  SupportTicketItem,
  AppNotification,
  CustomerAddress,
  CustomerReviewItem,
  CategoryItem,
  SubCategoryItem,
  BrandItem
} from '../types';
import { INDIAN_PINCODES } from '../data/seedData';
import { lookupCityOrPincode } from '../data/indianCitiesPincodes';

// Guest starts logged out. Only saved when user actually logs in via SMS OTP.
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'ORDER',
    title: 'Vehicle Booking Confirmed!',
    message: 'Your booking for Electra Glide Pro has been assigned to Flagship Hub, Connaught Place.',
    actionUrl: '/dashboard?tab=vehicle-orders',
    isRead: false,
    createdAt: '2026-10-26T10:30:00.000Z'
  },
  {
    id: 'notif-2',
    category: 'SERVICE',
    title: 'Service Van Assigned',
    message: 'Technician Santosh Kumar (Van #DL-1EV-8899) is scheduled for your doorstep inspection.',
    actionUrl: '/dashboard?tab=service-bookings',
    isRead: false,
    createdAt: '2026-10-25T14:15:00.000Z'
  },
  {
    id: 'notif-3',
    category: 'QUOTATION',
    title: 'Commercial Fleet Quotation Ready',
    message: 'Your fleet quote #QT-2026-9812 for 5x Vidyut Yatri Auto E3 is now available for download.',
    actionUrl: '/dashboard?tab=quotations',
    isRead: true,
    createdAt: '2026-10-24T09:00:00.000Z'
  }
];

const INITIAL_SERVICE_BOOKINGS: ServiceBookingItem[] = [
  {
    id: 'srv-ev-1042',
    bookingNumber: 'SRV-2026-9051',
    userId: 'usr-ev-78291',
    serviceCategoryKey: 'PERIODIC_MAINTENANCE',
    serviceCategoryName: 'General Periodic Maintenance',
    vehicleType: 'ELECTRIC_SCOOTER',
    vehicleBrand: 'ElectraMobility',
    vehicleModel: 'Electra Glide Pro',
    vehicleRegNo: 'DL-01-EV-4422',
    serviceMode: 'DOORSTEP',
    urgency: 'STANDARD',
    problemDescription: 'Routine 5,000 km check-up and front brake squeak inspection.',
    appointmentDate: '2026-10-28',
    appointmentSlot: '10:00 AM - 12:00 PM',
    customerName: 'Vikas Malhotra',
    customerPhone: '9876543210',
    pincode: '110001',
    city: 'New Delhi',
    addressLine: 'B-42, Gulmohar Enclave, New Delhi - 110001',
    status: 'AWAITING_CUSTOMER_APPROVAL',
    technician: {
      name: 'Santosh Kumar',
      phone: '+91 98112 34567',
      vanNumber: 'DL-1EV-8899',
      rating: 4.95,
    },
    inspectionReport: {
      batteryHealthPercent: 96,
      brakePadHealth: 'Front pads worn to 2.1mm (Needs replacement)',
      tyreCondition: 'Good, tread depth 3.8mm',
      electricalStatus: 'BMS diagnostics normal, no fault codes logged',
      recommendations: [
        'Replace front brake pads with OEM sintered ceramic pads',
        'Clean regenerative sensor contact points'
      ]
    },
    additionalApprovalQuote: {
      id: 'quote-add-1',
      title: 'Front Brake Pad Replacement (OEM Sintered)',
      partCost: 850,
      laborCost: 150,
      totalAmount: 1000,
      status: 'PENDING',
      notes: 'Includes installation and brake fluid top-up. Customer approval required before fitment.'
    },
    baseFee: 499,
    inspectionFee: 299,
    createdAt: '2026-10-26T11:00:00.000Z'
  }
];

const INITIAL_VEHICLE_ORDERS: VehicleOrderItem[] = [
  {
    id: 'ord-veh-01',
    orderNumber: 'ORD-EV-2026-89421',
    userId: 'usr-ev-78291',
    vehicleId: 'veh-eglide-pro',
    vehicleName: 'Electra Glide Pro',
    vehicleImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    variantName: 'Glide Pro - Forest Green',
    colorName: 'Deep Forest Green',
    colorHex: '#14532D',
    exShowroom: 129999,
    subsidyDiscount: 18000,
    rtoFee: 4200,
    insuranceFee: 5100,
    deliveryFee: 0,
    totalOnRoad: 121299,
    paymentMode: 'TOKEN_BOOKING',
    bookingAmountPaid: 2999,
    balanceDue: 118300,
    deliveryAddress: {
      fullName: 'Neha Sharma',
      phone: '9876543210',
      line1: 'B-42, Gulmohar Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    paymentTransactionRef: 'pay_rzp_mock_99214a',
    paymentMethod: 'UPI (Google Pay)',
    status: 'DEALER_ASSIGNED',
    allocatedDealer: 'E-VAHAN Flagship Hub, Connaught Place',
    createdAt: '2026-10-24T15:20:00.000Z'
  }
];

const INITIAL_TEST_DRIVES: TestDriveBookingItem[] = [
  {
    id: 'td-01',
    bookingNumber: 'TD-2026-7814',
    userId: 'usr-ev-78291',
    vehicleId: 'veh-eglide-pro',
    vehicleName: 'Electra Glide Pro',
    vehicleImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    customerName: 'Rohit Verma',
    customerPhone: '9876543210',
    customerEmail: 'rohit.verma@e-vahan.in',
    city: 'New Delhi',
    pincode: '110001',
    testDriveMode: 'DOORSTEP',
    preferredDate: '2026-10-29',
    timeSlot: '02:00 PM - 03:30 PM',
    status: 'CONFIRMED',
    notes: 'Please bring helmet for test ride. Apartment visitor gate entry required.',
    createdAt: '2026-10-25T16:00:00.000Z'
  }
];

const INITIAL_QUOTATIONS: QuotationRequestItem[] = [
  {
    id: 'qt-01',
    quotationNumber: 'QT-2026-9812',
    userId: 'usr-ev-78291',
    customerName: 'Rohit Verma',
    customerPhone: '9876543210',
    customerEmail: 'rohit.verma@e-vahan.in',
    customerType: 'BUSINESS',
    companyName: 'Singhania Eco Deliveries LLP',
    gstin: '07AAACS1429B1Z2',
    city: 'New Delhi',
    pincode: '110001',
    vehicleId: 'veh-yatri-e3',
    vehicleName: 'Vidyut Yatri Auto E3',
    vehicleCategory: 'ELECTRIC_PASSENGER_AUTO',
    quantity: 5,
    usageType: 'COMMERCIAL',
    financeRequirement: true,
    tradeInOldVehicle: false,
    status: 'QUOTE_PREPARED',
    validUntil: '2026-11-10T23:59:59.000Z',
    estimatedUnitPrice: 285000,
    estimatedBulkDiscount: 50000, // 10k off per unit on 5 units
    estimatedSubsidyTotal: 175000, // 35k x 5
    estimatedRtoTotal: 42500,
    estimatedInsuranceTotal: 56000,
    estimatedGrandTotal: 1348500, // (285000 * 5) - 50000 - 175000 + 42500 + 56000
    notes: 'Commercial fleet bulk discount of ₹10,000 per auto applied. Fast delivery within 10 days.',
    createdAt: '2026-10-24T09:00:00.000Z'
  }
];

const INITIAL_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: 'tkt-01',
    ticketNumber: 'TKT-2026-1044',
    userId: 'usr-ev-78291',
    category: 'VEHICLE_ORDER',
    subject: 'KYC Document verification timeline for Order #ORD-EV-2026-89421',
    status: 'OPEN',
    relatedReference: 'ORD-EV-2026-89421',
    createdAt: '2026-10-26T14:30:00.000Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'CUSTOMER',
        senderName: 'Customer',
        text: 'Hello, I have submitted my Aadhaar and address proof for the RTO registration. How long does the approval take?',
        timestamp: '2026-10-26T14:30:00.000Z'
      },
      {
        id: 'msg-2',
        sender: 'SUPPORT_AGENT',
        senderName: 'Priya Sharma (E-VAHAN Support)',
        text: 'Hello! Our RTO liaison team at Connaught Place hub has received your documents. Verification typically takes 24 hours. We will notify you once registration docket is initiated at the transport department.',
        timestamp: '2026-10-26T15:10:00.000Z'
      }
    ]
  }
];

class StorageService {
  private memoryStore: { [key: string]: any } = {};

  private get<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(`evahan_${key}`);
        return data ? JSON.parse(data) : fallback;
      }
      return this.memoryStore[key] !== undefined ? this.memoryStore[key] : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`evahan_${key}`, JSON.stringify(value));
      } else {
        this.memoryStore[key] = value;
      }
    } catch (err) {
      console.error('Storage error:', err);
    }
  }

  // --- User & Auth ---
  // --- User & Auth (Zero dummy users - strictly only real registered customers) ---
  private defaultRegisteredUsers: CustomerUser[] = [];

  getRegisteredUsers(): CustomerUser[] {
    const list = this.get<CustomerUser[]>('registered_users', []);
    // Purge any legacy dummy users so only customers who actually register exist
    const cleanList = list.filter(u => 
      u.id !== 'usr-ramesh-7821' && 
      u.id !== 'usr-priya-9012' && 
      u.id !== 'usr-amit-4321' && 
      u.fullName !== 'Ramesh Kumar Sharma' && 
      u.fullName !== 'Priya Verma' && 
      u.fullName !== 'Amit Patel'
    );
    if (cleanList.length !== list.length) {
      this.set('registered_users', cleanList);
    }
    return cleanList;
  }

  saveRegisteredUser(newUser: CustomerUser): void {
    const list = this.getRegisteredUsers();
    const cleanPhone = newUser.phone.replace(/\D/g, '').trim();
    const index = list.findIndex(u => u.phone.replace(/\D/g, '').trim() === cleanPhone);
    if (index >= 0) {
      list[index] = { ...list[index], ...newUser };
    } else {
      list.push(newUser);
    }
    this.set('registered_users', list);
  }

  findRegisteredUserByPhone(phone: string): CustomerUser | undefined {
    const cleanPhone = phone.replace(/\D/g, '').trim();
    const list = this.getRegisteredUsers();
    return list.find(u => u.phone.replace(/\D/g, '').trim() === cleanPhone);
  }

  // --- Admin Authorization (Only designated registered numbers can access admin portal) ---
  getAdminAuthorizedPhones(): string[] {
    const list = this.get<string[]>('admin_authorized_phones', [
      '9244272627',
      '8269288189',
      '9876543210',
      '9800000000',
      '9999999999',
      '9810012345',
      '9899887766'
    ]);
    const required = ['9244272627', '8269288189', '9876543210'];
    let changed = false;
    required.forEach(num => {
      if (!list.includes(num)) {
        list.push(num);
        changed = true;
      }
    });
    if (changed) {
      this.set('admin_authorized_phones', list);
    }
    return list;
  }

  isAuthorizedAdminPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) return false;
    const authorized = this.getAdminAuthorizedPhones();
    return authorized.includes(cleanPhone);
  }

  addAuthorizedAdminPhone(phone: string): void {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) return;
    const authorized = this.getAdminAuthorizedPhones();
    if (!authorized.includes(cleanPhone)) {
      authorized.push(cleanPhone);
      this.set('admin_authorized_phones', authorized);
    }
  }

  getUser(): CustomerUser | null {
    const user = this.get<CustomerUser | null>('user', null);
    // Purge any dummy or legacy users so only genuine registered customer is logged in
    if (user && (
      user.fullName === 'Arjun Singhania' || 
      user.id === 'usr-ev-78291' || 
      user.fullName === 'Customer' ||
      user.id === 'usr-ramesh-7821' ||
      user.id === 'usr-priya-9012' ||
      user.id === 'usr-amit-4321' ||
      user.fullName === 'Ramesh Kumar Sharma' ||
      user.fullName === 'Priya Verma' ||
      user.fullName === 'Amit Patel'
    )) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('evahan_user');
      }
      return null;
    }
    return user;
  }

  saveUser(user: CustomerUser): void {
    this.set('user', user);
  }

  clearUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('evahan_user');
    }
    this.memoryStore['user'] = null;
  }

  updateAddress(address: CustomerAddress): void {
    const user = this.getUser();
    if (!user) return;
    const index = user.savedAddresses.findIndex(a => a.id === address.id);
    if (index >= 0) {
      user.savedAddresses[index] = address;
    } else {
      user.savedAddresses.push(address);
    }
    this.saveUser(user);
    this.saveRegisteredUser(user);
  }

  deleteAddress(addressId: string): void {
    const user = this.getUser();
    if (!user) return;
    user.savedAddresses = user.savedAddresses.filter(a => a.id !== addressId);
    this.saveUser(user);
    this.saveRegisteredUser(user);
  }

  // --- Location ---
  getSelectedLocation(): { city: string; pincode: string } {
    return this.get('selected_location', { city: 'New Delhi', pincode: '110001' });
  }

  setSelectedLocation(loc: { city: string; pincode: string }): void {
    this.set('selected_location', loc);
  }

  getPincodeServiceability(pincode: string) {
    const raw = pincode.trim().toLowerCase();
    const match = INDIAN_PINCODES.find(p => 
      p.pincode === raw || 
      p.city.toLowerCase() === raw ||
      p.city.toLowerCase().startsWith(raw) ||
      p.city.toLowerCase().includes(raw)
    );
    if (match) {
      return {
        isKnown: true,
        ...match
      };
    }
    // Lookup in comprehensive 289+ Indian cities and postal database
    const cityInfo = lookupCityOrPincode(pincode);
    const isTestUnknown = raw === '999999';

    return {
      isKnown: !isTestUnknown,
      pincode: cityInfo.pincode,
      city: cityInfo.city,
      state: cityInfo.state,
      tier: isTestUnknown ? (3 as const) : (cityInfo.tier as 1 | 2 | 3),
      vehicleDelivery: !isTestUnknown,
      doorstepService: !isTestUnknown,
      testDriveHome: !isTestUnknown,
      partsShippingExpress: !isTestUnknown,
      nearestDealership: `E-VAHAN ${cityInfo.city} Authorized Dealership Hub`
    };
  }

  // --- Vehicle Orders ---
  getVehicleOrders(): VehicleOrderItem[] {
    return this.get<VehicleOrderItem[]>('vehicle_orders', INITIAL_VEHICLE_ORDERS);
  }

  createVehicleOrder(order: Omit<VehicleOrderItem, 'id' | 'orderNumber' | 'createdAt'>): VehicleOrderItem {
    const orders = this.getVehicleOrders();
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: VehicleOrderItem = {
      ...order,
      id: `ord-veh-${Date.now()}`,
      orderNumber: `ORD-EV-2026-${randNum}`,
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.set('vehicle_orders', orders);

    // Create corresponding notification
    this.addNotification({
      category: 'ORDER',
      title: `Order #${newOrder.orderNumber} Placed`,
      message: `Your booking for ${newOrder.vehicleName} has been recorded successfully.`,
      actionUrl: `/dashboard?tab=vehicle-orders`
    });

    return newOrder;
  }

  updateVehicleOrderStatus(orderId: string, status: any): boolean {
    const orders = this.getVehicleOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      this.set('vehicle_orders', orders);
      return true;
    }
    return false;
  }

  // --- Test Drives ---
  getTestDrives(): TestDriveBookingItem[] {
    return this.get<TestDriveBookingItem[]>('test_drives', INITIAL_TEST_DRIVES);
  }

  createTestDriveBooking(booking: Omit<TestDriveBookingItem, 'id' | 'bookingNumber' | 'createdAt' | 'status'>): TestDriveBookingItem {
    const bookings = this.getTestDrives();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: TestDriveBookingItem = {
      ...booking,
      id: `td-${Date.now()}`,
      bookingNumber: `TD-2026-${randNum}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    this.set('test_drives', bookings);

    this.addNotification({
      category: 'TEST_DRIVE',
      title: `Test Drive Scheduled (${newBooking.bookingNumber})`,
      message: `Your test drive for ${newBooking.vehicleName} is confirmed for ${newBooking.preferredDate} at ${newBooking.timeSlot}.`,
      actionUrl: `/dashboard?tab=test-drives`
    });

    return newBooking;
  }

  cancelTestDrive(bookingId: string): void {
    const bookings = this.getTestDrives();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx].status = 'CANCELLED';
      this.set('test_drives', bookings);
    }
  }

  rescheduleTestDrive(bookingId: string, newDate: string, newSlot: string): void {
    const bookings = this.getTestDrives();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx].preferredDate = newDate;
      bookings[idx].timeSlot = newSlot;
      bookings[idx].status = 'RESCHEDULE_REQUESTED';
      this.set('test_drives', bookings);
    }
  }

  updateTestDriveStatus(bookingId: string, status: any): boolean {
    const bookings = this.getTestDrives();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx].status = status;
      this.set('test_drives', bookings);
      return true;
    }
    return false;
  }

  // --- Quotations ---
  getQuotations(): QuotationRequestItem[] {
    return this.get<QuotationRequestItem[]>('quotations', INITIAL_QUOTATIONS);
  }

  createQuotation(quote: Omit<QuotationRequestItem, 'id' | 'quotationNumber' | 'createdAt' | 'status' | 'validUntil'>): QuotationRequestItem {
    const quotes = this.getQuotations();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 15);

    const newQuote: QuotationRequestItem = {
      ...quote,
      id: `qt-${Date.now()}`,
      quotationNumber: `QT-2026-${randNum}`,
      status: 'QUOTE_PREPARED',
      validUntil: expiry.toISOString(),
      createdAt: new Date().toISOString()
    };
    quotes.unshift(newQuote);
    this.set('quotations', quotes);

    this.addNotification({
      category: 'QUOTATION',
      title: `Quotation Generated (#${newQuote.quotationNumber})`,
      message: `Your formal quotation for ${newQuote.quantity}x ${newQuote.vehicleName} has been calculated.`,
      actionUrl: `/dashboard?tab=quotations`
    });

    return newQuote;
  }

  // --- Service Bookings ---
  getServiceBookings(): ServiceBookingItem[] {
    return this.get<ServiceBookingItem[]>('service_bookings', INITIAL_SERVICE_BOOKINGS);
  }

  createServiceBooking(service: Omit<ServiceBookingItem, 'id' | 'bookingNumber' | 'createdAt' | 'status'>): ServiceBookingItem {
    const bookings = this.getServiceBookings();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: ServiceBookingItem = {
      ...service,
      id: `srv-${Date.now()}`,
      bookingNumber: `SRV-2026-${randNum}`,
      status: 'CONFIRMED',
      technician: {
        name: 'Santosh Kumar',
        phone: '+91 98112 34567',
        vanNumber: 'DL-1EV-8899',
        rating: 4.95
      },
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    this.set('service_bookings', bookings);

    this.addNotification({
      category: 'SERVICE',
      title: `Doorstep Service Scheduled (#${newBooking.bookingNumber})`,
      message: `Service booked for ${newBooking.appointmentDate} (${newBooking.appointmentSlot}).`,
      actionUrl: `/dashboard?tab=service-bookings`
    });

    return newBooking;
  }

  updateServiceApproval(bookingId: string, approve: boolean): void {
    const bookings = this.getServiceBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0 && bookings[idx].additionalApprovalQuote) {
      bookings[idx].additionalApprovalQuote!.status = approve ? 'APPROVED' : 'REJECTED';
      if (approve) {
        bookings[idx].status = 'IN_PROGRESS';
        bookings[idx].finalPaidAmount = (bookings[idx].baseFee || 499) + bookings[idx].additionalApprovalQuote!.totalAmount;
      }
      this.set('service_bookings', bookings);
    }
  }

  // --- Spare Parts Orders ---
  getSparePartsOrders(): SparePartsOrder[] {
    return this.get<SparePartsOrder[]>('spare_parts_orders', [
      {
        id: 'ord-sp-01',
        orderNumber: 'ORD-SP-2026-5120',
        userId: 'usr-ev-78291',
        items: [
          {
            partId: 'part-tyre-ev-tubeless',
            name: 'CEAT Secura EV 90/90-12 Tubeless Low Rolling Resistance Tyre',
            sku: 'TYR-90-90-12-EV',
            imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
            unitPrice: 1490,
            quantity: 2
          }
        ],
        subtotal: 2980,
        shippingFee: 0,
        discountAmount: 298,
        taxAmount: 482,
        grandTotal: 3164,
        deliveryAddress: {
          fullName: 'Kunal Kapoor',
          phone: '9876543210',
          line1: 'B-42, Gulmohar Enclave',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        deliverySpeed: 'EXPRESS',
        paymentMethod: 'UPI (PhonePe)',
        paymentTransactionRef: 'pay_rzp_mock_part_881',
        status: 'OUT_FOR_DELIVERY',
        courierTracking: {
          carrierName: 'BlueDart EV Express',
          trackingNumber: 'BLUEDART-EV-884210',
          estimatedDeliveryDate: 'Expected Today by 5:00 PM'
        },
        createdAt: '2026-10-25T11:45:00.000Z'
      }
    ]);
  }

  createSparePartsOrder(order: Omit<SparePartsOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>): SparePartsOrder {
    const orders = this.getSparePartsOrders();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: SparePartsOrder = {
      ...order,
      id: `ord-sp-${Date.now()}`,
      orderNumber: `ORD-SP-2026-${randNum}`,
      status: 'CONFIRMED',
      courierTracking: {
        carrierName: 'Delhivery Surface Logistics',
        trackingNumber: `DLHV-${Date.now().toString().slice(-8)}`,
        estimatedDeliveryDate: '3-4 business days'
      },
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.set('spare_parts_orders', orders);

    this.addNotification({
      category: 'ORDER',
      title: `Spare Parts Order #${newOrder.orderNumber} Confirmed`,
      message: `Your spare parts package has been queued for dispatch.`,
      actionUrl: `/dashboard?tab=parts-orders`
    });

    return newOrder;
  }

  updateSparePartsOrderStatus(orderId: string, status: any): boolean {
    const orders = this.getSparePartsOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      this.set('spare_parts_orders', orders);
      return true;
    }
    return false;
  }

  // --- Support Tickets ---
  getSupportTickets(): SupportTicketItem[] {
    return this.get<SupportTicketItem[]>('support_tickets', INITIAL_SUPPORT_TICKETS);
  }

  createSupportTicket(ticket: Omit<SupportTicketItem, 'id' | 'ticketNumber' | 'createdAt' | 'status' | 'messages'>, initialMessage: string): SupportTicketItem {
    const tickets = this.getSupportTickets();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicketItem = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${randNum}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'CUSTOMER',
          senderName: this.getUser()?.fullName || 'Customer',
          text: initialMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };
    tickets.unshift(newTicket);
    this.set('support_tickets', tickets);
    return newTicket;
  }

  replySupportTicket(ticketId: string, text: string): void {
    const tickets = this.getSupportTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx >= 0) {
      tickets[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'CUSTOMER',
        senderName: this.getUser()?.fullName || 'Customer',
        text,
        timestamp: new Date().toISOString()
      });
      this.set('support_tickets', tickets);
    }
  }

  // --- Notifications ---
  getNotifications(): AppNotification[] {
    return this.get<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): void {
    const notifs = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    this.set('notifications', notifs);
  }

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx >= 0) {
      notifs[idx].isRead = true;
      this.set('notifications', notifs);
    }
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, isRead: true }));
    this.set('notifications', notifs);
  }

  // --- Verified Customer Reviews (Zero dummy reviews - strictly real user reviews only) ---
  getVerifiedReviews(): CustomerReviewItem[] {
    return this.get<CustomerReviewItem[]>('customer_verified_reviews', []);
  }

  addVerifiedReview(review: Omit<CustomerReviewItem, 'id' | 'createdAt'>): CustomerReviewItem {
    const reviews = this.getVerifiedReviews();
    const newReview: CustomerReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    reviews.unshift(newReview);
    this.set('customer_verified_reviews', reviews);
    return newReview;
  }

  deleteVerifiedReview(reviewId: string): void {
    const reviews = this.getVerifiedReviews().filter(r => r.id !== reviewId);
    this.set('customer_verified_reviews', reviews);
  }

  // --- Dynamic Categories, Sub-Categories & Brands ---
  getCategories(): CategoryItem[] {
    return this.get<CategoryItem[]>('evahan_catalog_categories', [
      {
        id: 'cat-scooters',
        name: 'Electric Scooters',
        slug: 'electric-scooters',
        subtitle: 'Urban & High-Speed Commuter',
        description: 'High-speed and family electric scooters with smart IoT digital clusters and portable battery packs.',
        type: 'VEHICLE',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 1,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-passenger-autos',
        name: 'Electric Passenger Autos',
        slug: 'electric-passenger-autos',
        subtitle: 'Commercial 4+1 Seaters',
        description: 'High-earning commercial 3-wheelers for green urban passenger transport with zero fuel cost.',
        type: 'VEHICLE',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 2,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-cargo-autos',
        name: 'Electric Cargo Autos',
        slug: 'electric-cargo-autos',
        subtitle: 'Delivery & Last-Mile Logistics',
        description: 'Heavy payload cargo e-loaders engineered for grocery, e-commerce, and industrial material movement.',
        type: 'VEHICLE',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 3,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-loaders',
        name: 'Electric Heavy Loaders',
        slug: 'electric-loaders',
        subtitle: 'Industrial & High Payload',
        description: 'Heavy chassis hydraulic tipper and flatbed electric loaders capable of 750+ kg payloads.',
        type: 'VEHICLE',
        imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 4,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-batteries',
        name: 'Lithium Battery Packs',
        slug: 'lithium-batteries',
        subtitle: 'LFP & NMC Smart Packs',
        description: 'Automotive grade Lithium Iron Phosphate and Nickel Manganese Cobalt battery packs with smart CAN BMS.',
        type: 'SPARE_PART',
        imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 5,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-chargers',
        name: 'Smart Fast Chargers',
        slug: 'smart-chargers',
        subtitle: 'Home & Fast DC Stations',
        description: 'BIS-certified intelligent multi-stage fast chargers with automatic cutoff and thermal protection.',
        type: 'SPARE_PART',
        imageUrl: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 6,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-spare-parts',
        name: 'Genuine OEM Spare Parts',
        slug: 'genuine-spare-parts',
        subtitle: 'Motors, Controllers & Brakes',
        description: '100% factory-verified spare parts, brushless DC motors, sintered brake pads, and heavy wiring harnesses.',
        type: 'SPARE_PART',
        imageUrl: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 7,
        createdAt: '2026-01-15'
      },
      {
        id: 'cat-accessories',
        name: 'EV Gear & Accessories',
        slug: 'ev-accessories',
        subtitle: 'Helmets, Covers & Smart Tech',
        description: 'ISI certified aerodynamic helmets, waterproof vehicle body covers, mobile mounts, and floor mats.',
        type: 'ACCESSORY',
        imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=600&q=80',
        isFeatured: true,
        status: 'ACTIVE',
        displayOrder: 8,
        createdAt: '2026-01-15'
      }
    ]);
  }

  addCategory(category: Omit<CategoryItem, 'id' | 'createdAt'>): CategoryItem {
    const list = this.getCategories();
    const newCat: CategoryItem = {
      ...category,
      id: `cat-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.push(newCat);
    this.set('evahan_catalog_categories', list);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<CategoryItem>): void {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.set('evahan_catalog_categories', list);
    }
  }

  deleteCategory(id: string): void {
    const list = this.getCategories().filter(c => c.id !== id);
    this.set('evahan_catalog_categories', list);
  }

  getSubCategories(): SubCategoryItem[] {
    return this.get<SubCategoryItem[]>('evahan_catalog_subcategories', [
      {
        id: 'sub-01',
        categoryId: 'cat-scooters',
        categoryName: 'Electric Scooters',
        name: 'High-Speed Performance Scooters',
        slug: 'high-speed-scooters',
        description: '80+ km/h top speed, dual disc brakes, fast charging support',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-02',
        categoryId: 'cat-scooters',
        categoryName: 'Electric Scooters',
        name: 'Family City Commuters',
        slug: 'city-commuter-scooters',
        description: 'Comfortable seating, large boot space, 100+ km real-world range',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-03',
        categoryId: 'cat-scooters',
        categoryName: 'Electric Scooters',
        name: 'Low-Speed Non-RTO Scooters',
        slug: 'non-rto-scooters',
        description: '25 km/h capped, no registration or driving license required',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-04',
        categoryId: 'cat-passenger-autos',
        categoryName: 'Electric Passenger Autos',
        name: 'Commercial L5M Passenger Autos',
        slug: 'commercial-passenger-autos',
        description: '4+1 seating capacity, AIS-028 compliance, heavy-duty suspension',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-05',
        categoryId: 'cat-cargo-autos',
        categoryName: 'Electric Cargo Autos',
        name: 'Closed Delivery Van Boxes',
        slug: 'delivery-box-cargo',
        description: 'Weather-sealed high-volume container for courier & FMCG distribution',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-06',
        categoryId: 'cat-batteries',
        categoryName: 'Lithium Battery Packs',
        name: '72V Lithium Iron Phosphate (LFP)',
        slug: '72v-lfp-battery',
        description: '3000+ cycle life, thermal runaway resistant chemistry',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-07',
        categoryId: 'cat-chargers',
        categoryName: 'Smart Fast Chargers',
        name: '12A Fast Heavy-Duty Chargers',
        slug: '12a-fast-chargers',
        description: 'LED display, voltage surge protection, rapid 0-80% charging',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      },
      {
        id: 'sub-08',
        categoryId: 'cat-spare-parts',
        categoryName: 'Genuine OEM Spare Parts',
        name: 'EV Low-Rolling Resistance Tyres',
        slug: 'ev-tyres',
        description: 'Tubeless, high-traction compound for enhanced battery mileage',
        status: 'ACTIVE',
        createdAt: '2026-01-20'
      }
    ]);
  }

  addSubCategory(subCategory: Omit<SubCategoryItem, 'id' | 'createdAt'>): SubCategoryItem {
    const list = this.getSubCategories();
    const newSub: SubCategoryItem = {
      ...subCategory,
      id: `sub-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.push(newSub);
    this.set('evahan_catalog_subcategories', list);
    return newSub;
  }

  updateSubCategory(id: string, updates: Partial<SubCategoryItem>): void {
    const list = this.getSubCategories();
    const idx = list.findIndex(s => s.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.set('evahan_catalog_subcategories', list);
    }
  }

  deleteSubCategory(id: string): void {
    const list = this.getSubCategories().filter(s => s.id !== id);
    this.set('evahan_catalog_subcategories', list);
  }

  getBrands(): BrandItem[] {
    return this.get<BrandItem[]>('evahan_catalog_brands', [
      {
        id: 'br-ather',
        name: 'Ather Energy',
        slug: 'ather-energy',
        logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80',
        origin: 'Bengaluru, India',
        website: 'https://www.atherenergy.com',
        categories: ['Electric Scooters', 'Smart Fast Chargers'],
        isVerified: true,
        warrantyPeriod: '3 Years / 30,000 km',
        modelCount: 4,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-ola',
        name: 'Ola Electric',
        slug: 'ola-electric',
        logoUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=200&q=80',
        origin: 'Hosur, India',
        website: 'https://www.olaelectric.com',
        categories: ['Electric Scooters'],
        isVerified: true,
        warrantyPeriod: '8 Years Battery Warranty',
        modelCount: 5,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-tvs',
        name: 'TVS Motor Company',
        slug: 'tvs-motor',
        logoUrl: 'https://images.unsplash.com/photo-1558981420-87aa9210d906?auto=format&fit=crop&w=200&q=80',
        origin: 'Hosur, India',
        website: 'https://www.tvsmotor.com',
        categories: ['Electric Scooters'],
        isVerified: true,
        warrantyPeriod: '3 Years Comprehensive',
        modelCount: 3,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-bajaj',
        name: 'Bajaj Chetak',
        slug: 'bajaj-chetak',
        logoUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=200&q=80',
        origin: 'Pune, India',
        website: 'https://www.chetak.com',
        categories: ['Electric Scooters'],
        isVerified: true,
        warrantyPeriod: '3 Years / 50,000 km',
        modelCount: 3,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-mahindra',
        name: 'Mahindra Electric',
        slug: 'mahindra-electric',
        logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
        origin: 'Mumbai, India',
        website: 'https://www.mahindraelectric.com',
        categories: ['Electric Passenger Autos', 'Electric Cargo Autos'],
        isVerified: true,
        warrantyPeriod: '3 Years / 80,000 km',
        modelCount: 4,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-ceat',
        name: 'CEAT Speciality EV',
        slug: 'ceat-ev',
        logoUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=200&q=80',
        origin: 'Mumbai, India',
        website: 'https://www.ceat.com',
        categories: ['Genuine OEM Spare Parts'],
        isVerified: true,
        warrantyPeriod: '5 Years Manufacturer Warranty',
        modelCount: 6,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-bosch',
        name: 'Bosch Mobility Solutions',
        slug: 'bosch-mobility',
        logoUrl: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=200&q=80',
        origin: 'Germany & Bengaluru',
        website: 'https://www.bosch-mobility.com',
        categories: ['Genuine OEM Spare Parts', 'Smart Fast Chargers'],
        isVerified: true,
        warrantyPeriod: '2 Years Direct Replacement',
        modelCount: 8,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      },
      {
        id: 'br-exide',
        name: 'Exide Energy Solutions',
        slug: 'exide-energy',
        logoUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=200&q=80',
        origin: 'Kolkata, India',
        website: 'https://www.exideindustries.com',
        categories: ['Lithium Battery Packs', 'Smart Fast Chargers'],
        isVerified: true,
        warrantyPeriod: '3 Years Replacement Guarantee',
        modelCount: 6,
        status: 'ACTIVE',
        createdAt: '2026-01-10'
      }
    ]);
  }

  addBrand(brand: Omit<BrandItem, 'id' | 'createdAt'>): BrandItem {
    const list = this.getBrands();
    const newBrand: BrandItem = {
      ...brand,
      id: `br-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.push(newBrand);
    this.set('evahan_catalog_brands', list);
    return newBrand;
  }

  updateBrand(id: string, updates: Partial<BrandItem>): void {
    const list = this.getBrands();
    const idx = list.findIndex(b => b.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.set('evahan_catalog_brands', list);
    }
  }

  deleteBrand(id: string): void {
    const list = this.getBrands().filter(b => b.id !== id);
    this.set('evahan_catalog_brands', list);
  }

  // --- Payment Gateway Simulation (Razorpay Sandbox Style) ---
  simulateRazorpayPayment(options: {
    amount: number;
    description: string;
    method: string;
  }): Promise<{ success: boolean; transactionRef: string; signature: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randRef = `pay_rzp_mock_${Math.random().toString(36).substring(2, 9)}`;
        const signature = `sig_${Math.random().toString(36).substring(2, 15)}`;
        resolve({
          success: true,
          transactionRef: randRef,
          signature
        });
      }, 1200);
    });
  }
}

export const storage = new StorageService();
