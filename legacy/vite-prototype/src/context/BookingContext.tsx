import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Service,
  ServiceId,
  ClientDetails,
  Booking,
  BookingStep,
  AppView,
  AdminTab,
  ScheduleEvent,
  ThemeMode
} from '../types';
import { SERVICES, INITIAL_BOOKINGS, INITIAL_SCHEDULE_EVENTS } from '../data/mockData';

interface BookingContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // App view & Admin
  appView: AppView;
  setAppView: (view: AppView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Booking Flow Modal State
  isBookingOpen: boolean;
  openBookingModal: (serviceId?: ServiceId) => void;
  closeBookingModal: () => void;
  bookingStep: BookingStep;
  setBookingStep: (step: BookingStep) => void;

  // Selected Booking Details in Wizard
  selectedServiceId: ServiceId;
  setSelectedServiceId: (id: ServiceId) => void;
  selectedService: Service;
  clientDetails: ClientDetails;
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetails>>;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  selectedTimeSlot: string; // "08:00 AM"
  setSelectedTimeSlot: (slot: string) => void;

  // Confirmed booking reference after submit
  currentConfirmedBooking: Booking | null;

  // Actions
  confirmBooking: () => Booking;
  resetBookingForm: () => void;

  // All Bookings data
  bookings: Booking[];
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingByReference: (ref: string) => Booking | undefined;

  // Schedule Events
  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  deleteScheduleEvent: (id: string) => void;

  // Lookup modal
  isLookupModalOpen: boolean;
  setIsLookupModalOpen: (open: boolean) => void;
  lookupRefResult: Booking | null;
  searchBookingRef: (ref: string) => boolean;

  // Services list
  services: Service[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('cr_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('cr_theme', newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cr_theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }
  }, [theme]);

  const [appView, setAppView] = useState<AppView>('landing');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Booking Flow
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>('personal');
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    fullName: '',
    email: '',
    phone: '',
    goals: '',
    injuries: ''
  });
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-24');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('08:00 AM');
  const [currentConfirmedBooking, setCurrentConfirmedBooking] = useState<Booking | null>(null);

  // Bookings list
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cr_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Schedule events
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('cr_schedule_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SCHEDULE_EVENTS;
  });

  // Lookup Modal
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [lookupRefResult, setLookupRefResult] = useState<Booking | null>(null);

  useEffect(() => {
    localStorage.setItem('cr_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cr_schedule_events', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  const openBookingModal = (serviceId?: ServiceId) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setBookingStep(1);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  const resetBookingForm = () => {
    setBookingStep(1);
    setSelectedServiceId('personal');
    setClientDetails({
      fullName: '',
      email: '',
      phone: '',
      goals: '',
      injuries: ''
    });
    setSelectedDate('2024-10-24');
    setSelectedTimeSlot('08:00 AM');
    setCurrentConfirmedBooking(null);
  };

  const confirmBooking = (): Booking => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const dateCode = selectedDate.replace(/-/g, '');
    const referenceNumber = `CR-${dateCode}-${randomNum}`;

    // Calculate end time
    const [time, period] = selectedTimeSlot.split(' ');
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    let min = parseInt(minStr, 10);
    const duration = selectedService.duration;
    min += duration;
    while (min >= 60) {
      min -= 60;
      hour += 1;
    }
    const endPeriod = period;
    const formattedEndHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const endTime = `${formattedEndHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${endPeriod}`;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      referenceNumber,
      serviceId: selectedService.id,
      serviceName: `${selectedService.name} Session`,
      serviceTag: selectedService.tag,
      client: { ...clientDetails },
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      endTime,
      status: 'Confirmed',
      price: selectedService.priceLabel,
      location: 'Coach Rickie Studio, Lugogo Bypass, Kampala',
      createdAt: new Date().toISOString(),
      notes: clientDetails.goals || undefined
    };

    setBookings(prev => [newBooking, ...prev]);
    setCurrentConfirmedBooking(newBooking);

    // Also add to schedule events for the admin calendar
    const dayOfWeekNumber = new Date(selectedDate).getDay() === 0 ? 7 : new Date(selectedDate).getDay();
    const newEvent: ScheduleEvent = {
      id: `ev-${Date.now()}`,
      title: selectedService.name,
      type: selectedService.id === 'personal' ? 'PT' : selectedService.id === 'public' ? 'PUB' : selectedService.id === 'smash' ? 'SMR' : 'REC',
      serviceName: selectedService.name,
      dayOfWeek: dayOfWeekNumber,
      date: selectedDate,
      startTime: selectedTimeSlot.split(' ')[0],
      endTime: endTime.split(' ')[0],
      clientName: clientDetails.fullName || 'New Athlete',
      colorBg: selectedService.id === 'personal' ? '#1e2329' : selectedService.id === 'public' ? '#3d1a11' : '#2a0e0e',
      colorBorder: selectedService.id === 'personal' ? '#60a5fa' : selectedService.id === 'public' ? '#ff5625' : '#ffb4ab',
      colorText: '#ffffff'
    };
    setScheduleEvents(prev => [...prev, newEvent]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5625', '#ffffff', '#ffb4ab', '#e5e2e1']
      });
    } catch (e) {
      console.error(e);
    }

    setBookingStep(5);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const getBookingByReference = (ref: string): Booking | undefined => {
    const cleanRef = ref.trim().toUpperCase();
    return bookings.find(b => b.referenceNumber.toUpperCase() === cleanRef);
  };

  const searchBookingRef = (ref: string): boolean => {
    const found = getBookingByReference(ref);
    if (found) {
      setLookupRefResult(found);
      return true;
    }
    setLookupRefResult(null);
    return false;
  };

  const addScheduleEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    setScheduleEvents(prev => [...prev, newEvent]);
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <BookingContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        appView,
        setAppView,
        adminTab,
        setAdminTab,
        isBookingOpen,
        openBookingModal,
        closeBookingModal,
        bookingStep,
        setBookingStep,
        selectedServiceId,
        setSelectedServiceId,
        selectedService,
        clientDetails,
        setClientDetails,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        currentConfirmedBooking,
        confirmBooking,
        resetBookingForm,
        bookings,
        updateBookingStatus,
        cancelBooking,
        getBookingByReference,
        scheduleEvents,
        addScheduleEvent,
        deleteScheduleEvent,
        isLookupModalOpen,
        setIsLookupModalOpen,
        lookupRefResult,
        searchBookingRef,
        services: SERVICES
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
