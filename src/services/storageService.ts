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
  CustomerAddress
} from '../types';
import { INDIAN_PINCODES } from '../data/seedData';

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
  getUser(): CustomerUser | null {
    const user = this.get<CustomerUser | null>('user', null);
    // Purge legacy "Arjun Singhania" if persisted in localStorage
    if (user && (user.fullName === 'Arjun Singhania' || user.id === 'usr-ev-78291')) {
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
  }

  deleteAddress(addressId: string): void {
    const user = this.getUser();
    if (!user) return;
    user.savedAddresses = user.savedAddresses.filter(a => a.id !== addressId);
    this.saveUser(user);
  }

  // --- Location ---
  getSelectedLocation(): { city: string; pincode: string } {
    return this.get('selected_location', { city: 'New Delhi', pincode: '110001' });
  }

  setSelectedLocation(loc: { city: string; pincode: string }): void {
    this.set('selected_location', loc);
  }

  getPincodeServiceability(pincode: string) {
    const match = INDIAN_PINCODES.find(p => p.pincode === pincode.trim());
    if (match) {
      return {
        isKnown: true,
        ...match
      };
    }
    // Generic fallback for any other valid 6-digit Indian PIN
    const isValidPin = /^[1-9][0-9]{5}$/.test(pincode.trim());
    return {
      isKnown: false,
      pincode: pincode.trim(),
      city: 'Local Area',
      state: 'India',
      tier: 3 as const,
      vehicleDelivery: isValidPin,
      doorstepService: false,
      testDriveHome: false,
      partsShippingExpress: isValidPin,
      nearestDealership: 'Regional Authorized Dealership Point'
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
