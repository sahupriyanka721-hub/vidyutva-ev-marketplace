// Central Backend API Service for E-VAHAN Electric Vehicle Marketplace
// Connects Frontend to Backend REST API (/api/...) for Real Data Operations

import {
  VehicleOrderItem,
  TestDriveBookingItem,
  QuotationRequestItem,
  ServiceBookingItem,
  SparePartsOrder,
  SupportTicketItem,
  CustomerUser,
  CategoryItem,
  SubCategoryItem,
  BrandItem,
  CustomerReviewItem
} from '../types';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.API_BASE_URL || 'http://localhost:5173/api';
};

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
      // In Node.js testing/SSR environments without an explicit server URL, return null gracefully
      if (typeof window === 'undefined' && !process.env.API_BASE_URL) {
        return null;
      }
      const res = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      if (!res.ok) {
        console.warn(`API [${options.method || 'GET'}] ${endpoint} returned ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- Health ---
  async getHealth() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // --- Real Vehicle Orders ---
  async getOrders(): Promise<VehicleOrderItem[] | null> {
    return this.request<VehicleOrderItem[]>('/orders');
  }

  async createOrder(order: any): Promise<VehicleOrderItem | null> {
    return this.request<VehicleOrderItem>('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<VehicleOrderItem | null> {
    return this.request<VehicleOrderItem>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // --- Real Test Drives ---
  async getTestDrives(): Promise<TestDriveBookingItem[] | null> {
    return this.request<TestDriveBookingItem[]>('/test-drives');
  }

  async createTestDrive(booking: any): Promise<TestDriveBookingItem | null> {
    return this.request<TestDriveBookingItem>('/test-drives', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  }

  async updateTestDriveStatus(id: string, status: string): Promise<TestDriveBookingItem | null> {
    return this.request<TestDriveBookingItem>(`/test-drives/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // --- Real Quotations ---
  async getQuotations(): Promise<QuotationRequestItem[] | null> {
    return this.request<QuotationRequestItem[]>('/quotations');
  }

  async createQuotation(quote: any): Promise<QuotationRequestItem | null> {
    return this.request<QuotationRequestItem>('/quotations', {
      method: 'POST',
      body: JSON.stringify(quote)
    });
  }

  async updateQuotationStatus(id: string, status: string): Promise<QuotationRequestItem | null> {
    return this.request<QuotationRequestItem>(`/quotations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // --- Real Doorstep Services ---
  async getServices(): Promise<ServiceBookingItem[] | null> {
    return this.request<ServiceBookingItem[]>('/services');
  }

  async createService(service: any): Promise<ServiceBookingItem | null> {
    return this.request<ServiceBookingItem>('/services', {
      method: 'POST',
      body: JSON.stringify(service)
    });
  }

  async updateServiceStatus(id: string, updates: any): Promise<ServiceBookingItem | null> {
    return this.request<ServiceBookingItem>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // --- Real Spare Parts Orders ---
  async getPartsOrders(): Promise<SparePartsOrder[] | null> {
    return this.request<SparePartsOrder[]>('/parts-orders');
  }

  async createPartsOrder(order: any): Promise<SparePartsOrder | null> {
    return this.request<SparePartsOrder>('/parts-orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  // --- Real Support Tickets ---
  async getTickets(): Promise<SupportTicketItem[] | null> {
    return this.request<SupportTicketItem[]>('/tickets');
  }

  async createTicket(ticket: any): Promise<SupportTicketItem | null> {
    return this.request<SupportTicketItem>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket)
    });
  }

  async replyTicket(id: string, text: string, senderName = 'E-VAHAN Support'): Promise<SupportTicketItem | null> {
    return this.request<SupportTicketItem>(`/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text, senderName })
    });
  }

  // --- Categories Master ---
  async getCategories(): Promise<CategoryItem[] | null> {
    return this.request<CategoryItem[]>('/categories');
  }

  async createCategory(cat: any): Promise<CategoryItem | null> {
    return this.request<CategoryItem>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    });
  }

  async updateCategory(id: string, data: any): Promise<CategoryItem | null> {
    return this.request<CategoryItem>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteCategory(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE'
    });
    return !!res?.success;
  }

  // --- Sub-Categories ---
  async getSubCategories(): Promise<SubCategoryItem[] | null> {
    return this.request<SubCategoryItem[]>('/subcategories');
  }

  async createSubCategory(sub: any): Promise<SubCategoryItem | null> {
    return this.request<SubCategoryItem>('/subcategories', {
      method: 'POST',
      body: JSON.stringify(sub)
    });
  }

  async updateSubCategory(id: string, data: any): Promise<SubCategoryItem | null> {
    return this.request<SubCategoryItem>(`/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteSubCategory(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/subcategories/${id}`, {
      method: 'DELETE'
    });
    return !!res?.success;
  }

  // --- Brands & OEMs ---
  async getBrands(): Promise<BrandItem[] | null> {
    return this.request<BrandItem[]>('/brands');
  }

  async createBrand(brand: any): Promise<BrandItem | null> {
    return this.request<BrandItem>('/brands', {
      method: 'POST',
      body: JSON.stringify(brand)
    });
  }

  async updateBrand(id: string, data: any): Promise<BrandItem | null> {
    return this.request<BrandItem>(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteBrand(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/brands/${id}`, {
      method: 'DELETE'
    });
    return !!res?.success;
  }

  // --- Registered Users ---
  async getUsers(): Promise<CustomerUser[] | null> {
    return this.request<CustomerUser[]>('/users');
  }

  async saveUser(user: CustomerUser): Promise<CustomerUser | null> {
    return this.request<CustomerUser>('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }

  // --- Announcements ---
  async getAnnouncements(): Promise<string[] | null> {
    return this.request<string[]>('/announcements');
  }

  async saveAnnouncements(list: string[]): Promise<string[] | null> {
    return this.request<string[]>('/announcements', {
      method: 'POST',
      body: JSON.stringify(list)
    });
  }

  // --- Verified Reviews ---
  async getReviews(): Promise<CustomerReviewItem[] | null> {
    return this.request<CustomerReviewItem[]>('/reviews');
  }

  async submitReview(review: any): Promise<CustomerReviewItem | null> {
    return this.request<CustomerReviewItem>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    });
  }
}

export const api = new ApiService();
