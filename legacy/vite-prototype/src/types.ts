export type ServiceId = 'personal' | 'public' | 'smash' | 'recovery';

export interface Service {
  id: ServiceId;
  name: string;
  tag: string;
  tagVariant: 'intense' | 'dynamic' | 'extreme' | 'chill';
  duration: number; // minutes
  durationLabel: string;
  subtitle: string;
  description: string;
  price: number;
  priceLabel: string;
  icon: string;
  image: string;
  intensity: string;
  features: string[];
}

export interface ClientDetails {
  fullName: string;
  email: string;
  phone: string;
  goals?: string;
  injuries?: string;
}

export type BookingStatus = 'Confirmed' | 'Arrived' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  referenceNumber: string;
  serviceId: ServiceId;
  serviceName: string;
  serviceTag: string;
  client: ClientDetails;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "07:00 AM"
  endTime: string; // e.g. "07:45 AM"
  status: BookingStatus;
  price: string;
  location: string;
  createdAt: string;
  notes?: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  date?: string; // Optional specific date YYYY-MM-DD
  startTime: string; // "07:00 AM"
  endTime: string; // "08:00 AM"
  serviceType: ServiceId | 'any';
  capacity: number;
  bookedCount: number;
  isBlocked?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'PUB' | 'PT' | 'SMR' | 'REC' | 'BLOCKED';
  serviceName: string;
  dayOfWeek: number; // 1 = Mon .. 7 = Sun (matching calendar columns)
  date: string; // YYYY-MM-DD
  startTime: string; // "08:00"
  endTime: string; // "09:00"
  clientName?: string;
  clientAvatar?: string;
  attendees?: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export type AppView = 'landing' | 'admin';
export type AdminTab = 'overview' | 'bookings' | 'calendar' | 'availability' | 'clients';
export type BookingStep = 1 | 2 | 3 | 4 | 5;
export type ThemeMode = 'dark' | 'light';
