import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle2, MapPin, Calendar, Clock, User, Phone, Mail, ArrowLeft, Shield, Edit2 } from 'lucide-react';

export const Step4ReviewConfirm: React.FC = () => {
  const {
    selectedService,
    clientDetails,
    selectedDate,
    selectedTimeSlot,
    setBookingStep,
    confirmBooking
  } = useBooking();

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Huge Watermark '04' */}
      <div className="absolute right-0 top-0 text-[160px] font-barlow font-black text-white/[0.03] select-none pointer-events-none leading-none -mr-8 -mt-10">
        04
      </div>

      <div>
        <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Step 04 / 04</span>
        </div>
        <h2 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide">
          Review & Confirm Booking
        </h2>
        <p className="text-sm text-[#929090] mt-1">
          Verify your session details before locking in your reservation.
        </p>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner overflow-hidden divide-y divide-[#2a2a2a]">
        
        {/* Service Header Overview */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-[#201f1f] to-[#1c1b1b]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border border-[#353534] shrink-0">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 bg-[#ff5625]/20 text-[#ff5625] border border-[#ff5625]/30 rounded">
                  {selectedService.tag}
                </span>
                <span className="text-xs font-mono text-[#929090]">{selectedService.durationLabel}</span>
              </div>
              <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide mt-1">
                {selectedService.name}
              </h3>
              <p className="text-xs text-[#c6c6c7] line-clamp-1">{selectedService.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBookingStep(1)}
            className="text-[#929090] hover:text-[#ff5625] text-xs font-mono uppercase flex items-center gap-1 shrink-0 p-2 rounded hover:bg-[#252525]"
            title="Change service"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change</span>
          </button>
        </div>

        {/* Schedule & Location Grid */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#141414] p-3.5 rounded border border-[#2a2a2a] relative">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[11px] font-mono text-[#929090] uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ff5625]" />
                <span>Date & Time</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingStep(3)}
                className="text-[10px] font-mono text-[#ff5625] hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="font-barlow font-bold text-lg text-white uppercase tracking-wide">
              {formattedDate}
            </div>
            <div className="text-xs font-mono text-[#c6c6c7] mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#ff5625]" />
              <span>{selectedTimeSlot} (EAT)</span>
            </div>
          </div>

          <div className="bg-[#141414] p-3.5 rounded border border-[#2a2a2a]">
            <div className="text-[11px] font-mono text-[#929090] uppercase flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ff5625]" />
              <span>Training Facility</span>
            </div>
            <div className="font-barlow font-bold text-lg text-white uppercase tracking-wide">
              Coach Rickie Performance Studio
            </div>
            <div className="text-xs text-[#c6c6c7] mt-0.5">
              Lugogo Bypass, Kampala, Uganda (Free Parking Available)
            </div>
          </div>
        </div>

        {/* Athlete Info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#929090] uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#ff5625]" />
              <span>Athlete Information</span>
            </span>
            <button
              type="button"
              onClick={() => setBookingStep(2)}
              className="text-[10px] font-mono text-[#ff5625] hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#141414] p-3.5 rounded border border-[#2a2a2a]">
            <div>
              <span className="text-[#929090] block text-[10px] uppercase font-mono">Full Name</span>
              <span className="text-white font-medium">{clientDetails.fullName || 'Brian Mukasa'}</span>
            </div>
            <div>
              <span className="text-[#929090] block text-[10px] uppercase font-mono">Phone</span>
              <span className="text-white font-mono">{clientDetails.phone || '+256 772 458 912'}</span>
            </div>
            <div>
              <span className="text-[#929090] block text-[10px] uppercase font-mono">Email</span>
              <span className="text-white font-mono truncate block">{clientDetails.email || 'brian.mukasa@gmail.com'}</span>
            </div>
          </div>

          {(clientDetails.goals || clientDetails.injuries) && (
            <div className="mt-3 text-xs text-[#c6c6c7] bg-[#141414] p-3 rounded border border-[#2a2a2a] space-y-1">
              {clientDetails.goals && (
                <div>
                  <strong className="text-[#ff5625]">Goal:</strong> {clientDetails.goals}
                </div>
              )}
              {clientDetails.injuries && (
                <div>
                  <strong className="text-amber-400">Notes/Restrictions:</strong> {clientDetails.injuries}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="p-4 sm:p-5 bg-[#171717] flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#929090] uppercase block">Total Due</span>
            <span className="text-xs text-[#c6c6c7]">Pay at check-in or via monthly membership pass</span>
          </div>
          <div className="text-right">
            <span className="font-barlow font-black text-2xl sm:text-3xl text-[#ff5625] tracking-wide">
              {selectedService.price === 0 ? 'FREE / PASS' : `UGX ${selectedService.price.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Guarantee & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => setBookingStep(3)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 border border-[#353534] hover:border-white text-xs font-mono uppercase text-[#c6c6c7] hover:text-white rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => confirmBooking()}
          className="w-full sm:w-auto bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-black text-xl uppercase tracking-wider px-10 py-3.5 cut-corner transition-all duration-200 shadow-xl shadow-[#ff5625]/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Shield className="w-5 h-5 fill-black text-black" />
          <span>CONFIRM BOOKING</span>
        </button>
      </div>
    </div>
  );
};
