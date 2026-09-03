/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AdminLayout } from './components/Admin/AdminLayout';
import { BookingModal } from './components/BookingFlow/BookingModal';
import { ManageBookingModal } from './components/Modals/ManageBookingModal';

const AppContent: React.FC = () => {
  const { appView } = useBooking();

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] font-inter">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router: Landing Page vs Coach Admin Portal */}
      {appView === 'landing' ? <LandingPage /> : <AdminLayout />}

      {/* Booking Wizard Modal */}
      <BookingModal />

      {/* Lookup / Manage Booking Modal */}
      <ManageBookingModal />
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
