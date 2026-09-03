import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface TimeSlotOption {
  time: string;
  spots: number;
  status: 'available' | 'full';
  section: 'morning' | 'evening';
}

const AVAILABLE_SLOTS: TimeSlotOption[] = [
  { time: '06:00 AM', spots: 3, status: 'available', section: 'morning' },
  { time: '07:00 AM', spots: 1, status: 'available', section: 'morning' },
  { time: '08:00 AM', spots: 4, status: 'available', section: 'morning' },
  { time: '09:00 AM', spots: 0, status: 'full', section: 'morning' },
  { time: '10:30 AM', spots: 2, status: 'available', section: 'morning' },
  { time: '01:00 PM', spots: 2, status: 'available', section: 'morning' },
  { time: '05:00 PM', spots: 1, status: 'available', section: 'evening' },
  { time: '06:00 PM', spots: 5, status: 'available', section: 'evening' },
  { time: '07:00 PM', spots: 2, status: 'available', section: 'evening' }
];

export const Step3DateTime: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    setBookingStep
  } = useBooking();

  // Calendar days for October 2024
  // Oct 1st is Tuesday
  const daysInMonth = 31;
  const startDayOffset = 2; // Tue

  const availableDays = [24, 25, 26, 27, 28, 29, 30, 31];

  const currentSelectedDayNum = parseInt(selectedDate.split('-')[2], 10) || 24;

  const handleDaySelect = (day: number) => {
    const formatted = `2024-10-${day.toString().padStart(2, '0')}`;
    setSelectedDate(formatted);
  };

  const morningSlots = AVAILABLE_SLOTS.filter((s) => s.section === 'morning');
  const eveningSlots = AVAILABLE_SLOTS.filter((s) => s.section === 'evening');

  const formattedDateString = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Step 03 / 04</span>
        </div>
        <h2 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide">
          Select Date & Time
        </h2>
        <p className="text-sm text-[#929090] mt-1">
          Lock in your training slot. Live availability is updated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: October Calendar Picker */}
        <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#2a2a2a] p-5 cut-corner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2a2a]">
              <div className="font-barlow font-bold text-xl uppercase text-white tracking-wider flex items-center gap-2">
                <span>October 2024</span>
                <span className="text-xs font-mono px-2 py-0.5 bg-[#ff5625]/20 text-[#ff5625] rounded">
                  Kampala Time (EAT)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#2a2a2a] text-[#929090] hover:text-white"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#2a2a2a] text-[#929090] hover:text-white"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono text-[#929090] uppercase mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty placeholder cells before month starts */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = dayNum === currentSelectedDayNum;
                const isAvailable = availableDays.includes(dayNum);
                const isPast = dayNum < 24;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDaySelect(dayNum)}
                    className={`h-9 relative rounded text-xs font-mono flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#ff5625] text-black font-bold shadow-md shadow-[#ff5625]/30'
                        : isPast
                        ? 'text-[#444] cursor-not-allowed'
                        : isAvailable
                        ? 'text-white hover:bg-[#2a2a2a] font-medium'
                        : 'text-[#666] hover:bg-[#222]'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isAvailable && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#ff5625] absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#929090]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5625]" />
              <span>Available Date</span>
            </div>
            <div className="text-[11px] font-mono text-[#c6c6c7]">
              Selected: <strong className="text-[#ff5625]">{formattedDateString}</strong>
            </div>
          </div>
        </div>

        {/* Right: Time Slots Selection */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#2a2a2a] p-5 cut-corner flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Morning Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c6c6c7] mb-2.5 pb-1 border-b border-[#2a2a2a]">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Sessions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {morningSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  const isFull = slot.status === 'full';
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-3 rounded border text-left transition-all ${
                        isFull
                          ? 'border-[#262626] bg-[#141414] opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#ff5625] bg-[#ff5625]/15 ring-1 ring-[#ff5625]'
                          : 'border-[#2e2e2e] bg-[#161616] hover:border-[#444] hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#ff5625]' : 'text-white'}`}>
                          {slot.time}
                        </span>
                        {isFull ? (
                          <span className="text-[9px] font-mono uppercase text-red-400 bg-red-950/40 px-1 py-0.5 rounded">
                            Full
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                            {slot.spots} left
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#929090] mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Lugogo Bypass</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c6c6c7] mb-2.5 pb-1 border-b border-[#2a2a2a]">
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Evening Sessions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {eveningSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  const isFull = slot.status === 'full';
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-3 rounded border text-left transition-all ${
                        isFull
                          ? 'border-[#262626] bg-[#141414] opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#ff5625] bg-[#ff5625]/15 ring-1 ring-[#ff5625]'
                          : 'border-[#2e2e2e] bg-[#161616] hover:border-[#444] hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#ff5625]' : 'text-white'}`}>
                          {slot.time}
                        </span>
                        {isFull ? (
                          <span className="text-[9px] font-mono uppercase text-red-400 bg-red-950/40 px-1 py-0.5 rounded">
                            Full
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                            {slot.spots} left
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#929090] mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>High Voltage</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#121212] p-3 rounded border border-[#2a2a2a] flex items-center justify-between text-xs">
            <span className="text-[#929090]">Selected Slot:</span>
            <span className="font-mono font-bold text-[#ff5625] uppercase tracking-wider">
              {formattedDateString} @ {selectedTimeSlot}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setBookingStep(2)}
          className="flex items-center gap-2 px-5 py-3 border border-[#353534] hover:border-white text-xs font-mono uppercase text-[#c6c6c7] hover:text-white rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => setBookingStep(4)}
          className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-lg uppercase tracking-wider px-8 py-3 cut-corner transition-all duration-200 shadow-md shadow-[#ff5625]/20 flex items-center gap-2"
        >
          <span>Review Booking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
