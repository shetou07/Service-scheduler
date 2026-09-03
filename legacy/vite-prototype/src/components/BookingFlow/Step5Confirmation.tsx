import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Check, Copy, Calendar, Download, Share2, MapPin, Dumbbell, ArrowRight } from 'lucide-react';

export const Step5Confirmation: React.FC = () => {
  const { currentConfirmedBooking, closeBookingModal, resetBookingForm, setIsLookupModalOpen, setAppView } = useBooking();
  const [copied, setCopied] = useState(false);

  const booking = currentConfirmedBooking;

  if (!booking) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-[#929090]">No active confirmed booking found.</p>
        <button
          onClick={closeBookingModal}
          className="px-6 py-2.5 bg-[#ff5625] text-black font-barlow font-bold uppercase tracking-wider"
        >
          Close
        </button>
      </div>
    );
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Coach Rickie Performance Training//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${booking.serviceName} - Coach Rickie
DESCRIPTION:${booking.serviceTag} session for ${booking.client.fullName}. Reference: ${booking.referenceNumber}
LOCATION:${booking.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CoachRickie_${booking.referenceNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 text-center sm:text-left relative overflow-hidden">
      
      {/* Locked In Stamp Effect */}
      <div className="absolute right-2 top-2 sm:right-6 sm:top-4 border-4 border-[#ff5625] text-[#ff5625] font-barlow font-black text-2xl sm:text-3xl uppercase tracking-widest px-4 py-1.5 rotate-[-8deg] opacity-80 pointer-events-none select-none shadow-lg">
        LOCKED IN
      </div>

      {/* Header with success badge */}
      <div className="pt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ff5625]/20 border border-[#ff5625] text-[#ff5625] mb-3 shadow-lg shadow-[#ff5625]/20">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#ff5625] mb-1">
          Booking Confirmed
        </div>
        <h2 className="font-barlow font-black text-3xl sm:text-5xl uppercase text-white tracking-wide leading-none">
          YOU'RE BOOKED. <br />
          <span className="text-[#ff5625]">SEE YOU ON THE MAT.</span>
        </h2>
        <p className="text-sm text-[#c6c6c7] mt-2 max-w-lg">
          A confirmation SMS and calendar invite has been dispatched. Please arrive 10 minutes prior for warm-up and equipment fitting.
        </p>
      </div>

      {/* Reference Card */}
      <div className="bg-[#1c1b1b] border border-[#ff5625]/40 cut-corner p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-[#2a2a2a]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#929090] block">
              Official Booking Reference
            </span>
            <span className="font-mono font-bold text-xl sm:text-2xl text-[#ff5625] tracking-wider">
              {booking.referenceNumber}
            </span>
          </div>

          <button
            onClick={handleCopyRef}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-xs font-mono text-white rounded border border-[#353534] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#ff5625]" />
                <span>COPY REF</span>
              </>
            )}
          </button>
        </div>

        {/* Structured Details Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
            <span className="text-[10px] font-mono uppercase text-[#929090] block">Discipline</span>
            <span className="font-barlow font-bold text-base text-white uppercase tracking-wide">
              {booking.serviceName}
            </span>
            <span className="text-[10px] font-mono text-[#ff5625] block mt-0.5">{booking.serviceTag}</span>
          </div>

          <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
            <span className="text-[10px] font-mono uppercase text-[#929090] block">Date & Time</span>
            <span className="font-barlow font-bold text-base text-white uppercase tracking-wide">
              {formattedDate}
            </span>
            <span className="text-[10px] font-mono text-[#c6c6c7] block mt-0.5">
              {booking.timeSlot} - {booking.endTime} (EAT)
            </span>
          </div>

          <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
            <span className="text-[10px] font-mono uppercase text-[#929090] block">Athlete</span>
            <span className="font-medium text-white block text-sm">{booking.client.fullName}</span>
            <span className="text-[10px] font-mono text-[#929090] block mt-0.5">{booking.client.phone}</span>
          </div>

          <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
            <span className="text-[10px] font-mono uppercase text-[#929090] block">Location</span>
            <div className="flex items-center gap-1 text-white font-medium mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#ff5625] shrink-0" />
              <span className="truncate">{booking.location}</span>
            </div>
            <span className="text-[10px] text-[#929090] block mt-0.5">Free Locker & Hydration provided</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadCalendar}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-xs font-mono text-white rounded border border-[#353534] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#ff5625]" />
            <span>Add to Calendar (.ICS)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              resetBookingForm();
              closeBookingModal();
            }}
            className="w-full sm:w-auto bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-lg uppercase tracking-wider px-8 py-2.5 cut-corner transition-all flex items-center justify-center gap-2"
          >
            <span>Done / Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
