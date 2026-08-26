import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Search, X, Check, Calendar, Clock, MapPin, AlertCircle, Dumbbell, Trash2 } from 'lucide-react';

export const ManageBookingModal: React.FC = () => {
  const {
    isLookupModalOpen,
    setIsLookupModalOpen,
    searchBookingRef,
    lookupRefResult,
    cancelBooking
  } = useBooking();

  const [inputRef, setInputRef] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);

  if (!isLookupModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;
    const found = searchBookingRef(inputRef);
    setHasSearched(true);
    setSearchError(!found);
  };

  const handleCancelThisBooking = () => {
    if (!lookupRefResult) return;
    if (window.confirm('Are you sure you want to cancel this booking? Your slot will be made available to other athletes.')) {
      cancelBooking(lookupRefResult.id);
      searchBookingRef(lookupRefResult.referenceNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsLookupModalOpen(false)} />

      <div className="relative z-10 w-full max-w-lg bg-[#181818] border border-[#2a2a2a] cut-corner shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div>
            <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest">
              ATHLETE SELF-SERVICE
            </div>
            <h3 className="font-barlow font-black text-2xl uppercase text-white tracking-wide">
              LOOK UP YOUR BOOKING
            </h3>
          </div>
          <button
            onClick={() => setIsLookupModalOpen(false)}
            className="p-1 rounded text-[#929090] hover:text-white hover:bg-[#252525]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-mono uppercase text-[#c6c6c7]">
            Enter Booking Reference ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. CR-20241015-00482"
                value={inputRef}
                onChange={(e) => {
                  setInputRef(e.target.value);
                  setSearchError(false);
                }}
                className="w-full bg-[#121212] border border-[#353534] text-xs font-mono text-white pl-10 pr-3 py-2.5 rounded outline-none focus:border-[#ff5625] uppercase"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold uppercase text-sm px-5 py-2.5 cut-corner-sm tracking-wider"
            >
              Search
            </button>
          </div>

          <div className="text-[11px] text-[#777] font-mono">
            Tip: Try sample reference: <button type="button" onClick={() => { setInputRef('CR-20241015-00482'); searchBookingRef('CR-20241015-00482'); setHasSearched(true); }} className="text-[#ff5625] underline">CR-20241015-00482</button>
          </div>
        </form>

        {/* Not Found Alert */}
        {hasSearched && searchError && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>No reservation found matching this reference code. Please verify and retry.</span>
          </div>
        )}

        {/* Found Result Card */}
        {lookupRefResult && (
          <div className="bg-[#141414] border border-[#ff5625]/40 cut-corner p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#929090] block">Status</span>
                <span
                  className={`text-xs font-mono uppercase font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                    lookupRefResult.status === 'Cancelled'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {lookupRefResult.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#929090] block">Reference</span>
                <span className="font-mono font-bold text-xs text-white">
                  {lookupRefResult.referenceNumber}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#929090]">Athlete:</span>
                <span className="text-white font-medium">{lookupRefResult.client.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929090]">Discipline:</span>
                <span className="text-[#ff5625] font-bold uppercase">{lookupRefResult.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929090]">Scheduled Date:</span>
                <span className="text-white font-mono">{lookupRefResult.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929090]">Time Slot:</span>
                <span className="text-white font-mono">{lookupRefResult.timeSlot} - {lookupRefResult.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#929090]">Location:</span>
                <span className="text-white">{lookupRefResult.location}</span>
              </div>
            </div>

            {lookupRefResult.status !== 'Cancelled' && lookupRefResult.status !== 'Completed' && (
              <div className="pt-3 border-t border-[#2a2a2a] flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelThisBooking}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/40 text-xs font-mono rounded flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
