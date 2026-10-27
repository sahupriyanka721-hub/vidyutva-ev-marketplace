# Vidyutva — Premium Indian Electric Vehicle Marketplace (Customer Panel)

A production-oriented, responsive electric mobility e-commerce platform engineered specifically for the Indian EV ecosystem. 

**Vidyutva** connects individual riders and commercial fleet operators with verified electric two-wheelers and three-wheelers, transparent on-road quotations, doorstep test drives, genuine OEM spare parts with guaranteed compatibility, and mobile van doorstep servicing.

---

## ⚡ Architectural Overview

The customer panel is **Module 1** of a comprehensive five-panel multi-vendor enterprise platform:
1. **Customer Panel** *(Completed & Navigable)*
2. **Admin Panel** *(Architecture & Schema Integrated)*
3. **Spare Parts Vendor Panel** *(Catalog & Inventory APIs Ready)*
4. **Vehicle Vendor Panel** *(Chassis Allocation & Dealer APIs Ready)*
5. **Service Partner Panel** *(Mobile Van & Technician Job Card APIs Ready)*

---

## 🎨 Design System & Brand Identity

Strictly crafted to the specification's minimalist, technology-driven identity:
- **Primary Brand Color**: `#14532D` (Deep forest green)
- **Secondary Accent**: `#16A34A` (Vibrant green)
- **High-Voltage Highlight**: `#B7F34A` (Electric lime)
- **Background**: `#F8FAF8` (Soft off-white)
- **Typography**: Inter / Manrope, Dark charcoal (`#17211B`), muted text (`#647067`), soft borders (`#E3E9E4`)
- **Imagery**: Authentic electric scooters, electric passenger autos, cargo 3-wheelers, LFP battery packs, and technician mobile vans.

---

## 🚀 Key Implemented Features

### 1. Global Header & Discovery
- **Location & PIN Code Selector**: Real-time serviceability engine covering Tier-1 and Tier-2 Indian hubs (Delhi NCR, Bengaluru, Mumbai, Pune, Hyderabad, Chennai, Ahmedabad, Jaipur, etc.).
- **Global Autocomplete Search**: Groups matching vehicles and spare parts in real time.
- **Top Announcement Bar**: Configurable ticker for subsidy alerts and test drive offers.
- **Navigation Shortcuts**: Direct links to Electric Scooters, Electric Autos, Spare Parts, Test Drives, Servicing, and Quotations.
- **Wishlist & Cart Drawers**: Real-time counts, slide-over drawer, and atomic local state.

### 2. Homepage (Sections in Ordered Sequence)
- **Hero Section**: "Your Electric Journey Starts Here" with primary & secondary CTAs and ARAI certification trust badges.
- **Quick Action Cards**: Buy an EV, Get a Quotation, Buy Spare Parts, Book Doorstep Service.
- **Shop by Category**: 8 visual category cards (Electric Scooters, Passenger Autos, Cargo Autos, Loaders, Batteries, Chargers, Spare Parts, Accessories).
- **Featured Electric Vehicles**: Dynamic variant/color switcher, verified IDC range under specified conditions, token booking amounts, and direct action triggers.
- **Find the Right EV (Interactive Matchmaker)**: Filter by budget slider, daily running km, required range, usage (personal vs commercial), charging preference, and finance requirements.
- **Why Choose Us**: 7 substantiable trust cards.
- **Spare Parts Marketplace Preview**: Curated genuine OEM parts with compatibility indicators.
- **Doorstep Service Banner**: "Expert EV Service, At Your Doorstep" with instant pricing and PIN code validation.
- **How It Works**: 5 interactive step-by-step journeys.
- **Customer Reviews & Expandable FAQs**: Verified buyer reviews and categorized EV policy FAQs.
- **Final CTA**: High-impact closing banner with 3 primary action triggers.

### 3. Vehicle Catalog & Dedicated Details Page
- **Dedicated Listings**: Category tabs, grid/list view toggle, brand and battery capacity filters, active filter chips, and empty state handlers.
- **Product Detail Page**:
  - Image gallery with thumbnail selection and zoom.
  - Variant and color switcher updating active photo, stock, and price difference.
  - Transparent price breakdown separating confirmed ex-showroom from estimated state subsidies, RTO registration, and 1+4 year comprehensive insurance.
  - PIN code serviceability checker showing delivery timeline and nearest dealership hub.
  - Collapsible technical specifications grouped into Performance, Battery/Charging, Brakes/Wheels, and Smart Connectivity.
  - Model-specific FAQs and brochure download links.

### 4. Online Vehicle Purchase & Multi-Step Checkout
- **Step 1: Variant Selection**: Model, variant, color, and optional genuine accessories.
- **Step 2: Delivery & RTO Registration**: Full legal name, mobile, address, and PIN code.
- **Step 3: Itemized Price Summary**: Ex-showroom, state subsidy deduction, RTO, insurance, and accessories.
- **Step 4: Purchase Preference**: Refundable booking amount token (₹1,999 - ₹5,000) vs full online payment vs low-interest EV loan EMI assistance (with bank picker & monthly EMI calculator).
- **Step 5: Secure Payment**: Razorpay Sandbox simulation supporting UPI, Credit/Debit cards, and Net Banking with server-side signature verification.
- **Step 6: Confirmation Docket**: Generates order reference (`ORD-EV-2026-XXXX`) with delivery milestones roadmap.

### 5. Complimentary Test Drive Booking
- Date selection disallowing past dates (strictly next 14 days).
- Real-time time slot availability and duplicate prevention.
- Choice between **Doorstep Test Ride** (specialist visits address) or **Dealership Experience Centre**.
- Mobile number validation and instant Booking ID generation (`TD-2026-XXXX`).

### 6. Online Quotation System ("Get a Quotation")
- Supports Individual buyers and Commercial Fleet buyers (with GSTIN and company fields).
- Volume discount tiers for commercial fleet orders (automatic savings indicator).
- Instant itemized indicative on-road quotation breakdown.
- Print/Download official proforma docket.
- One-click "Convert to Online Order" workflow.

### 7. Genuine Spare Parts E-Commerce & Compatibility Checker
- Dedicated marketplace across Batteries, Chargers, Motors, Controllers, Brakes, Tyres, Electrical, Lighting, and Accessories.
- **Mandatory Vehicle Compatibility Checker**: Select brand, model, and year to receive an explicit verdict:
  - 🟢 **Guaranteed 100% Compatible**
  - 🔴 **Not Compatible**
  - 🟡 **Compatibility Not Confirmed**
- Cart drawer and full cart page with stock quantity enforcement, coupon codes (`EVFIRST10`, `GREEN500`), free shipping above ₹1,999, and itemized 18% GST.
- Multi-step spare parts checkout with courier tracking (`ORD-SP-2026-XXXX`).

### 8. Doorstep Service Booking & Customer Approval Guarantee
- 6-Step service booking wizard across 8+ specialized EV packages.
- Strict adherence to core business rule: **"The service partner must not start paid additional repairs without the required customer approval."**
- Live digital inspection findings (Battery SOH %, brake pad wear, tyre tread).
- Dedicated customer approval card on dashboard to approve or decline technician estimates.

### 9. Customer Account Dashboard
- 11 sidebar tabs: Overview, My Vehicle Orders, Test Drive Bookings, My Quotations, Spare Parts Orders, Doorstep Services, Wishlist & Saved, My Addresses, Support Tickets, Notifications, and Profile/KYC.
- Address management (add, delete, set default).
- Support ticket thread viewer with customer reply submission.
- Real-time notification mark-as-read toggles.

### 10. Vehicle Comparison Tool (`/compare`)
- Benchmarks up to 4 vehicles side-by-side across price, category, certified IDC range, battery capacity, charging time, top speed, motor power, payload, and warranty.

---

## 🛠️ Tech Stack & Directory Structure

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS (custom brand color extensions & shadows)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Database Schema**: Prisma ORM with PostgreSQL relational model (`prisma/schema.prisma` covering 43 entities)
- **Testing**: Vitest automated customer journey tests

```
vidyutva-ev-marketplace/
├── dist/                     # Optimized production bundle
├── prisma/
│   ├── schema.prisma         # 43 Relational models with decimal currency safety
│   └── seed.ts               # Database seed script
├── src/
│   ├── components/
│   │   ├── common/           # Header, Footer, AnnouncementBar, LocationModal, CartDrawer, AuthModal, CompareBar
│   │   ├── home/             # Hero, QuickActions, Categories, Finder, WhyUs, HowItWorks, Reviews/FAQ
│   │   ├── vehicles/         # VehicleCard, Filters, Gallery, Specs
│   │   ├── parts/            # PartCard, CompatibilityChecker
│   │   └── service/          # BookingWizard, Tracker
│   ├── context/              # AuthContext, LocationContext, CartContext, WishlistContext, CompareContext, NotificationContext
│   ├── data/                 # seedData.ts (Verified Indian EV models, spare parts, pincodes)
│   ├── pages/                # 15 Complete customer panel routed pages
│   ├── services/             # storageService.ts (Atomic storage, Razorpay sandbox, mock backend)
│   ├── types/                # index.ts (Full TypeScript contracts)
│   ├── App.tsx               # Main routed application
│   └── main.tsx
├── tests/
│   └── customerJourneys.test.ts  # Vitest test suite
├── .env.example              # Clean secrets template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Local Development Setup

1. **Navigate to the project directory**:
   ```bash
   cd "C:\Users\HP\.gemini\antigravity\scratch\vidyutva-ev-marketplace"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run automated test suite**:
   ```bash
   npm run test
   ```

5. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 📋 Feature Implementation Status Matrix

| Domain | Feature | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Catalog** | Electric Scooters | ✅ Live | 4.0 kWh, 170 km IDC, Ather/Ola class specs |
| **Catalog** | Electric Passenger Autos | ✅ Live | 8.0 kWh LFP, 140 km range, 4+1 seating |
| **Catalog** | Electric Cargo & Loaders | ✅ Live | 600kg & 750kg payload, reinforced chassis |
| **Ordering** | Token Booking vs Full Payment | ✅ Live | Configurable token deposits (₹1,999 - ₹5,000) |
| **Financing**| EV Loan / EMI Calculator | ✅ Live | 12-48 month tenure, 9.5% p.a. banking simulation |
| **Test Drives**| Doorstep Slot Booking | ✅ Live | Past date prevention, duplicate slot protection |
| **Quotations**| Online Proforma & PDF Docket | ✅ Live | Bulk fleet discounts, download/print docket |
| **Spare Parts**| OEM Parts Marketplace | ✅ Live | Batteries, fast chargers, brake pads, CEAT EV tyres |
| **Compatibility**| Vehicle Fitment Matchmaker | ✅ Live | Explicit Compatible / Not Compatible verdicts |
| **Servicing**| Doorstep Mobile Service Van | ✅ Live | 8+ packages, 40-point digital scan report |
| **Compliance**| Additional Repair Approval | ✅ Live | Strict customer one-click digital approval |
| **Pincodes** | Indian Logistics Serviceability | ✅ Live | Tier-1 & Tier-2 delivery and doorstep van rules |
| **Gateway** | Payment Gateway | 🧪 Sandbox | High-fidelity Razorpay India sandbox simulator |
| **Auth** | Mobile OTP Login / Signup | 🧪 Sandbox | Instant demo verification mode (`123456`) |
| **Database** | Relational PostgreSQL Schema | 🗄️ Ready | Prisma schema with 43 models & seed scripts |

---

## 🛡️ Security & Compliance Standards
- Monetary amounts are strictly decimal-safe.
- No raw credit/debit card numbers or UPI MPINs are ever collected or stored.
- Sandbox payment flows generate mock cryptographically verified transaction signatures before updating order state.
- Order, test drive, quotation, and service booking statuses reflect verified states with no frontend-only illusions.
- Ready for full multi-vendor backend hookup (Admin, Vehicle Vendor, Parts Vendor, Service Partner).
