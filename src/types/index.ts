export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  city?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'support_tech'
  | 'sales_marketing'
  | 'legal'
  | 'logistics'
  | 'accounting'
  | 'vendor'
  | 'society'
  | 'exhibitor';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity: number;
  planType: 'Plan A' | 'Plan B' | 'Plan C' | 'Custom';
  vendors: string[];
  societyId: string;
  createdBy: string;
  totalRevenue: number;
}

export interface Society {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  memberCount: number;
  facilities: string[];
  activeEvents: number;
  totalRevenue: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'sound_lights' | 'catering' | 'decoration' | 'security' | 'transportation' | 'housekeeping';
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  completedJobs: number;
  status: 'active' | 'inactive';
  priceRange: string;
}

export interface Exhibitor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  booth: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'checked_in' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalSocieties: number;
  totalVendors: number;
  totalExhibitors: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
}