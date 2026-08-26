import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  Clock,
  Calendar,
  ShieldAlert,
  Plus,
  Check,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';

interface DayConfig {
  day: string;
  enabled: boolean;
  morningSlots: { time: string; active: boolean; capacity: number }[];
  eveningSlots: { time: string; active: boolean; capacity: number }[];
}

const DEFAULT_DAYS_CONFIG: DayConfig[] = [
  {
    day: 'Monday',
    enabled: true,
    morningSlots: [
      { time: '06:00 AM', active: true, capacity: 15 },
      { time: '07:00 AM', active: true, capacity: 1 },
      { time: '08:00 AM', active: true, capacity: 15 },
      { time: '09:00 AM', active: false, capacity: 1 },
      { time: '10:30 AM', active: true, capacity: 1 }
    ],
    eveningSlots: [
      { time: '05:00 PM', active: true, capacity: 15 },
      { time: '06:00 PM', active: true, capacity: 15 },
      { time: '07:00 PM', active: true, capacity: 4 }
    ]
  },
  {
    day: 'Tuesday',
    enabled: true,
    morningSlots: [
      { time: '06:00 AM', active: true, capacity: 15 },
      { time: '07:00 AM', active: true, capacity: 1 },
      { time: '08:00 AM', active: true, capacity: 15 },
      { time: '10:30 AM', active: true, capacity: 1 }
    ],
    eveningSlots: [
      { time: '05:00 PM', active: true, capacity: 15 },
      { time: '06:00 PM', active: true, capacity: 15 }
    ]
  },
  {
    day: 'Wednesday',
    enabled: true,
    morningSlots: [
      { time: '06:00 AM', active: true, capacity: 15 },
      { time: '07:00 AM', active: true, capacity: 1 },
      { time: '08:00 AM', active: true, capacity: 15 },
      { time: '10:30 AM', active: true, capacity: 1 }
    ],
    eveningSlots: [
      { time: '05:00 PM', active: true, capacity: 15 },
      { time: '06:00 PM', active: true, capacity: 15 },
      { time: '07:00 PM', active: true, capacity: 4 }
    ]
  },
  {
    day: 'Thursday',
    enabled: true,
    morningSlots: [
      { time: '06:00 AM', active: true, capacity: 15 },
      { time: '07:00 AM', active: true, capacity: 1 },
      { time: '08:00 AM', active: true, capacity: 15 },
      { time: '10:30 AM', active: true, capacity: 1 }
    ],
    eveningSlots: [
      { time: '05:00 PM', active: true, capacity: 15 },
      { time: '06:00 PM', active: true, capacity: 15 },
      { time: '07:00 PM', active: true, capacity: 4 }
    ]
  },
  {
    day: 'Friday',
    enabled: true,
    morningSlots: [
      { time: '06:00 AM', active: true, capacity: 15 },
      { time: '07:00 AM', active: true, capacity: 1 },
      { time: '08:00 AM', active: true, capacity: 15 },
      { time: '10:30 AM', active: true, capacity: 1 }
    ],
    eveningSlots: [
      { time: '05:00 PM', active: true, capacity: 15 },
      { time: '06:00 PM', active: true, capacity: 15 },
      { time: '07:00 PM', active: true, capacity: 4 }
    ]
  },
  {
    day: 'Saturday',
    enabled: true,
    morningSlots: [
      { time: '07:00 AM', active: true, capacity: 20 },
      { time: '08:30 AM', active: true, capacity: 20 },
      { time: '10:00 AM', active: true, capacity: 10 }
    ],
    eveningSlots: [
      { time: '02:00 PM', active: true, capacity: 10 },
      { time: '04:00 PM', active: true, capacity: 10 }
    ]
  }
];

export const AdminAvailability: React.FC = () => {
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS_CONFIG);
  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string }[]>([
    { date: '2024-11-01', reason: 'Facility Deep Clean & Rig Inspection' },
    { date: '2024-11-15', reason: 'Coach Rickie CSCS Pro Seminar' }
  ]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSlot = (dayIdx: number, section: 'morning' | 'evening', slotIdx: number) => {
    setDays((prev) => {
      const copy = [...prev];
      const targetList = section === 'morning' ? copy[dayIdx].morningSlots : copy[dayIdx].eveningSlots;
      targetList[slotIdx].active = !targetList[slotIdx].active;
      return copy;
    });
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockReason) return;
    setBlockedDates((prev) => [...prev, { date: newBlockDate, reason: newBlockReason }]);
    setNewBlockDate('');
    setNewBlockReason('');
  };

  const handleRemoveBlock = (idx: number) => {
    setBlockedDates((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest">
            SESSION CAPACITY & TIMING RULES
          </div>
          <h1 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide mt-1">
            AVAILABILITY & ROSTER RULES
          </h1>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-sm uppercase tracking-wider px-6 py-2.5 cut-corner flex items-center gap-2 transition-all shadow-md shadow-[#ff5625]/20"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span>{savedSuccess ? 'Changes Deployed Live!' : 'Save Weekly Schedule'}</span>
        </button>
      </div>

      {/* Weekly Grid Template */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {days.map((dayConfig, dIdx) => (
          <div key={dayConfig.day} className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
              <h3 className="font-barlow font-bold text-xl uppercase text-white tracking-wide">
                {dayConfig.day}
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                Active Days
              </span>
            </div>

            {/* Morning Slots */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#929090] uppercase mb-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Sessions</span>
              </div>
              <div className="space-y-1.5">
                {dayConfig.morningSlots.map((slot, sIdx) => (
                  <div
                    key={slot.time}
                    onClick={() => toggleSlot(dIdx, 'morning', sIdx)}
                    className={`flex items-center justify-between p-2 rounded text-xs font-mono cursor-pointer transition-colors border ${
                      slot.active
                        ? 'bg-[#141414] border-[#353534] text-white hover:border-[#ff5625]'
                        : 'bg-[#101010] border-[#222] text-[#555] line-through'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#929090]">Cap: {slot.capacity}</span>
                      <span className={`w-2 h-2 rounded-full ${slot.active ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening Slots */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#929090] uppercase mb-2">
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Evening Sessions</span>
              </div>
              <div className="space-y-1.5">
                {dayConfig.eveningSlots.map((slot, sIdx) => (
                  <div
                    key={slot.time}
                    onClick={() => toggleSlot(dIdx, 'evening', sIdx)}
                    className={`flex items-center justify-between p-2 rounded text-xs font-mono cursor-pointer transition-colors border ${
                      slot.active
                        ? 'bg-[#141414] border-[#353534] text-white hover:border-[#ff5625]'
                        : 'bg-[#101010] border-[#222] text-[#555] line-through'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#929090]">Cap: {slot.capacity}</span>
                      <span className={`w-2 h-2 rounded-full ${slot.active ? 'bg-emerald-400' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blocked Dates / Maintenance Section */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono tracking-widest uppercase mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>EXCEPTIONS & TIME-OFF BLOCKS</span>
          </div>
          <h2 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide">
            FACILITY CLOSURES & BLOCKED DATES
          </h2>
          <p className="text-xs text-[#929090] mt-1">
            Any dates added here will automatically hide time slots on the client booking engine.
          </p>
        </div>

        {/* Add Block Form */}
        <form onSubmit={handleAddBlock} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="date"
              value={newBlockDate}
              onChange={(e) => setNewBlockDate(e.target.value)}
              className="w-full bg-[#121212] border border-[#353534] text-xs text-white px-3 py-2.5 rounded outline-none focus:border-[#ff5625]"
              required
            />
          </div>

          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Reason (e.g. Smash Cage Re-armoring, Rig Welding, Holiday)"
              value={newBlockReason}
              onChange={(e) => setNewBlockReason(e.target.value)}
              className="w-full bg-[#121212] border border-[#353534] text-xs text-white px-3 py-2.5 rounded outline-none focus:border-[#ff5625]"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold uppercase text-xs tracking-wider py-2.5 cut-corner flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>
        </form>

        {/* Active Blocked List */}
        <div className="divide-y divide-[#252525] border-t border-[#252525] pt-3">
          {blockedDates.map((block, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#ff5625]" />
                <span className="font-mono font-bold text-white">{block.date}</span>
                <span className="text-[#929090]">— {block.reason}</span>
              </div>

              <button
                onClick={() => handleRemoveBlock(idx)}
                className="p-1 text-[#777] hover:text-red-400 transition-colors"
                title="Remove Block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
