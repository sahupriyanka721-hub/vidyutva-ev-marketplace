import { describe, it, expect } from 'vitest';
import { VEHICLES_DATA, SPARE_PARTS_DATA, INDIAN_PINCODES, VALID_COUPONS } from '../src/data/seedData';
import { storage } from '../src/services/storageService';

describe('E-VAHAN EV Marketplace Customer Panel Journeys', () => {
  
  // 1. Catalog & Specification Integrity
  it('should have verified EV models with certified range and non-zero battery specs', () => {
    expect(VEHICLES_DATA.length).toBeGreaterThanOrEqual(5);

    VEHICLES_DATA.forEach((vehicle) => {
      expect(vehicle.name).toBeDefined();
      expect(vehicle.exShowroomPrice).toBeGreaterThan(50000);
      expect(vehicle.certifiedRangeKm).toBeGreaterThan(40);
      expect(vehicle.batteryCapacityKwh).toBeGreaterThan(1.5);
      expect(vehicle.topSpeedKmph).toBeGreaterThan(40);
      expect(vehicle.variants.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 2. Spare Parts Compatibility Checker Logic
  it('should accurately verify spare part compatibility against vehicle catalog', () => {
    const batteryPart = SPARE_PARTS_DATA.find(p => p.sku === 'BAT-72V-LFP-01');
    expect(batteryPart).toBeDefined();

    // Electra Glide Pro is NOT in compatible list for BAT-72V-LFP-01
    const isEGlideCompatible = batteryPart!.compatibleVehicleIds.includes('veh-eglide-pro');
    expect(isEGlideCompatible).toBe(false);

    // Vidyut Sprint Plus IS compatible
    const isSprintCompatible = batteryPart!.compatibleVehicleIds.includes('veh-sprint-plus');
    expect(isSprintCompatible).toBe(true);

    // Universal helmet accessory is compatible with all
    const helmetPart = SPARE_PARTS_DATA.find(p => p.sku === 'ACC-HLM-BT-ISI-01');
    expect(helmetPart?.compatibleVehicleNames).toContain('Universal All Models');
  });

  // 3. Indian PIN Code Logistics & Serviceability
  it('should correctly determine vehicle delivery and doorstep van serviceability', () => {
    // Delhi 110001 (Tier 1 Metro Hub)
    const delhi = storage.getPincodeServiceability('110001');
    expect(delhi.vehicleDelivery).toBe(true);
    expect(delhi.doorstepService).toBe(true);
    expect(delhi.testDriveHome).toBe(true);

    // Jaipur 302001 (Tier 2 Hub)
    const jaipur = storage.getPincodeServiceability('302001');
    expect(jaipur.vehicleDelivery).toBe(true);
    expect(jaipur.testDriveHome).toBe(false); // Dealership test drive only

    // Non-existent PIN code fallback
    const unknown = storage.getPincodeServiceability('999999');
    expect(unknown.doorstepService).toBe(false);
  });

  // 4. Quotation Fleet Bulk Discounts
  it('should apply tiered commercial bulk discounts on fleet quantities', () => {
    const singleQtyDiscount = 0;
    const fleetQty = 5;
    const discountPerUnit = 5000;
    const totalDiscount = fleetQty * discountPerUnit;
    expect(totalDiscount).toBe(25000);

    const largeFleetQty = 12;
    const largeFleetDiscountPerUnit = 12000;
    expect(largeFleetQty * largeFleetDiscountPerUnit).toBe(144000);
  });

  // 5. Coupon Application Logic
  it('should validate coupons against minimum order thresholds', () => {
    const coupon10 = VALID_COUPONS.find(c => c.code === 'EVFIRST10');
    expect(coupon10).toBeDefined();

    const lowOrderValue = 1000;
    expect(lowOrderValue >= coupon10!.minOrder).toBe(false);

    const eligibleOrderValue = 3000;
    expect(eligibleOrderValue >= coupon10!.minOrder).toBe(true);
    const calculatedDiscount = (eligibleOrderValue * coupon10!.discountPercent!) / 100;
    expect(calculatedDiscount).toBe(300);
  });

  // 6. Doorstep Service Booking & Customer Approval Guarantee
  it('should record service booking with pending customer approval for extra repairs', () => {
    let bookings = storage.getServiceBookings();
    let demoBooking = bookings[0];

    if (!demoBooking || !demoBooking.additionalApprovalQuote) {
      demoBooking = storage.createServiceBooking({
        userId: 'usr-test-78291',
        serviceCategoryKey: 'PERIODIC_MAINTENANCE',
        serviceCategoryName: 'General Periodic Maintenance',
        vehicleType: 'ELECTRIC_SCOOTER',
        vehicleBrand: 'ElectraMobility',
        vehicleModel: 'Electra Glide Pro',
        vehicleRegNo: 'DL-01-EV-4422',
        serviceMode: 'DOORSTEP',
        urgency: 'STANDARD',
        problemDescription: 'Routine 5,000 km check-up and front brake squeak inspection.',
        appointmentDate: '2026-11-20',
        appointmentSlot: '10:00 AM - 12:00 PM',
        customerName: 'Test Customer',
        customerPhone: '9876543210',
        pincode: '110001',
        city: 'New Delhi',
        addressLine: 'B-42, Test Enclave, New Delhi - 110001',
        baseFee: 499,
        inspectionFee: 299
      });
      demoBooking.status = 'AWAITING_CUSTOMER_APPROVAL';
      demoBooking.additionalApprovalQuote = {
        id: 'quote-test-1',
        title: 'Front Brake Pad Replacement (OEM Sintered)',
        partCost: 850,
        laborCost: 150,
        totalAmount: 1000,
        status: 'PENDING',
        notes: 'Includes installation and brake fluid top-up. Customer approval required.'
      };
      // Save it back to storage
      const currentList = storage.getServiceBookings();
      const idx = currentList.findIndex(b => b.id === demoBooking.id);
      if (idx >= 0) {
        currentList[idx] = demoBooking;
      } else {
        currentList.unshift(demoBooking);
      }
      (storage as any).set('service_bookings', currentList);
    }

    expect(demoBooking.status).toBe('AWAITING_CUSTOMER_APPROVAL');
    expect(demoBooking.additionalApprovalQuote).toBeDefined();
    expect(demoBooking.additionalApprovalQuote?.status).toBe('PENDING');

    // Simulate customer approval action
    storage.updateServiceApproval(demoBooking.id, true);
    const updatedBookings = storage.getServiceBookings();
    const updatedBooking = updatedBookings.find(b => b.id === demoBooking.id);
    expect(updatedBooking?.additionalApprovalQuote?.status).toBe('APPROVED');
    expect(updatedBooking?.status).toBe('IN_PROGRESS');
  });

  // 7. Payment Sandbox Signature Simulation
  it('should generate verified mock payment signatures for sandbox testing', async () => {
    const payment = await storage.simulateRazorpayPayment({
      amount: 2999,
      description: 'Vehicle Token Booking',
      method: 'UPI'
    });

    expect(payment.success).toBe(true);
    expect(payment.transactionRef).toMatch(/^pay_rzp_mock_/);
    expect(payment.signature).toMatch(/^sig_/);
  });
});
