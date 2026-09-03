import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { ScheduleEvent } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Flame,
  Users,
  Dumbbell,
  Zap,
  Trash2,
  Clock
} from 'lucide-react';

interface NewEventFormState {
  title: string;
  serviceName: string;
  type: 'PUB' | 'PT' | 'SMR' | 'REC' | 'BLOCKED';
  dayIndex: number;
  startTime: string;
  endTime: string;
  clientName: string;
}

export const AdminCalendar: React.FC = () => {
  const { scheduleEvents, addScheduleEvent, deleteScheduleEvent } = useBooking();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // 0 = Oct 24
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState<NewEventFormState>({
    title: '1:1 Personal Training',
    serviceName: 'Personal Training',
    type: 'PT',
    dayIndex: 0,
    startTime: '08:00',
    endTime: '09:00',
    clientName: ''
  });

  const weekDays = [
    { name: 'THU', date: '24', fullDate: '2024-10-24', isToday: true, dayOfWeek: 4 },
    { name: 'FRI', date: '25', fullDate: '2024-10-25', isToday: false, dayOfWeek: 5 },
    { name: 'SAT', date: '26', fullDate: '2024-10-26', isToday: false, dayOfWeek: 6 },
    { name: 'SUN', date: '27', fullDate: '2024-10-27', isToday: false, dayOfWeek: 7 },
    { name: 'MON', date: '28', fullDate: '2024-10-28', isToday: false, dayOfWeek: 1 },
    { name: 'TUE', date: '29', fullDate: '2024-10-29', isToday: false, dayOfWeek: 2 },
    { name: 'WED', date: '30', fullDate: '2024-10-30', isToday: false, dayOfWeek: 3 }
  ];

  const hours = [
    '06:00', '07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDay = weekDays[newEvent.dayIndex];
    let bg = '#1e2329';
    let border = '#60a5fa';
    let text = '#93c5fd';

    if (newEvent.type === 'PUB') {
      bg = '#3d1a11';
      border = '#ff5625';
      text = '#ffb5a0';
    } else if (newEvent.type === 'SMR') {
      bg = '#2a0e0e';
      border = '#ffb4ab';
      text = '#ffb4ab';
    } else if (newEvent.type === 'BLOCKED') {
      bg = 'rgba(53, 53, 52, 0.6)';
      border = '#929090';
      text = '#c8c6c5';
    }

    addScheduleEvent({
      title: newEvent.title,
      type: newEvent.type,
      serviceName: newEvent.serviceName,
      dayOfWeek: targetDay.dayOfWeek,
      date: targetDay.fullDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      clientName: newEvent.clientName || undefined,
      colorBg: bg,
      colorBorder: border,
      colorText: text
    });

    setIsAddEventModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>FACILITY MASTER TIMETABLE</span>
          </div>
          <h1 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide mt-1">
            OCTOBER 24 – 30, 2024
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Today Button */}
          <button
            onClick={() => setSelectedDayOffset(0)}
            className="px-3 py-1.5 bg-[#1c1b1b] hover:bg-[#252525] text-xs font-mono uppercase text-[#c6c6c7] hover:text-white rounded border border-[#353534]"
          >
            Today
          </button>

          {/* Prev/Next */}
          <div className="flex items-center bg-[#1c1b1b] rounded border border-[#353534]">
            <button className="p-1.5 hover:bg-[#2a2a2a] text-[#929090] hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2 text-[#929090]">Week 43</span>
            <button className="p-1.5 hover:bg-[#2a2a2a] text-[#929090] hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-[#1c1b1b] p-0.5 rounded border border-[#353534]">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-mono uppercase rounded ${
                viewMode === 'week' ? 'bg-[#ff5625] text-black font-bold' : 'text-[#929090] hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-mono uppercase rounded ${
                viewMode === 'day' ? 'bg-[#ff5625] text-black font-bold' : 'text-[#929090] hover:text-white'
              }`}
            >
              Day
            </button>
          </div>

          {/* Add Slot Button */}
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-sm uppercase tracking-wider px-3.5 py-1.5 cut-corner flex items-center gap-1.5 transition-all shadow-md shadow-[#ff5625]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot / Block</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#929090] bg-[#1c1b1b] p-3 rounded border border-[#2a2a2a]">
        <span className="text-[#c6c6c7] font-bold uppercase">DISCIPLINE KEY:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#ff5625]" />
          <span>Public Training (PUB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#60a5fa]" />
          <span>1:1 Strength (PT)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#ffb4ab]" />
          <span>Smash Cage (SMR)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#929090]" />
          <span>Blocked / Staff Setup</span>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-[#181818] border border-[#2a2a2a] cut-corner overflow-x-auto shadow-2xl">
        <div className="min-w-[850px]">
          
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-[#2a2a2a] bg-[#1f1f1f] sticky top-0 z-10">
            <div className="p-3 text-center text-xs font-mono text-[#929090] uppercase border-r border-[#2a2a2a]">
              GMT+2
            </div>
            {weekDays.map((d, i) => (
              <div
                key={d.fullDate}
                className={`p-3 text-center border-r border-[#2a2a2a] last:border-r-0 ${
                  d.isToday ? 'bg-[#ff5625]/10' : ''
                }`}
              >
                <div className="font-mono text-xs text-[#929090]">{d.name}</div>
                <div
                  className={`font-barlow font-bold text-xl uppercase ${
                    d.isToday ? 'text-[#ff5625]' : 'text-white'
                  }`}
                >
                  {d.date}
                </div>
              </div>
            ))}
          </div>

          {/* Hours Rows */}
          <div className="divide-y divide-[#252525]">
            {hours.map((hour) => {
              const hourInt = parseInt(hour.split(':')[0], 10);
              return (
                <div key={hour} className="grid grid-cols-8 min-h-[64px]">
                  {/* Time label column */}
                  <div className="p-2.5 text-center text-xs font-mono text-[#777] border-r border-[#2a2a2a] bg-[#141414] flex items-center justify-center">
                    {hour}
                  </div>

                  {/* 7 Days Columns for this hour */}
                  {weekDays.map((day, dIdx) => {
                    // Match events that start at this hour or span it
                    const dayEvents = scheduleEvents.filter((ev) => {
                      const evDateMatch = ev.date === day.fullDate || ev.dayOfWeek === day.dayOfWeek;
                      const evHour = parseInt(ev.startTime.split(':')[0], 10);
                      return evDateMatch && evHour === hourInt;
                    });

                    return (
                      <div
                        key={`${day.fullDate}-${hour}`}
                        onClick={() => {
                          setNewEvent((prev) => ({
                            ...prev,
                            dayIndex: dIdx,
                            startTime: hour,
                            endTime: `${(hourInt + 1).toString().padStart(2, '0')}:00`
                          }));
                          setIsAddEventModalOpen(true);
                        }}
                        className={`p-1 border-r border-[#2a2a2a] last:border-r-0 relative hover:bg-[#222]/60 cursor-pointer transition-colors group ${
                          day.isToday ? 'bg-[#ff5625]/[0.02]' : ''
                        }`}
                      >
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              backgroundColor: ev.colorBg,
                              borderColor: ev.colorBorder,
                              color: ev.colorText
                            }}
                            className="w-full h-full min-h-[52px] p-2 rounded border cut-corner-sm text-xs shadow-md flex flex-col justify-between group/ev"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-barlow font-bold uppercase tracking-wider truncate text-xs">
                                {ev.title}
                              </span>
                              <button
                                onClick={() => deleteScheduleEvent(ev.id)}
                                className="opacity-0 group-hover/ev:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
                                title="Remove Event"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono opacity-90 mt-1">
                              <span>
                                {ev.startTime} - {ev.endTime}
                              </span>
                              {ev.clientName && <span className="font-bold truncate max-w-[60px]">{ev.clientName}</span>}
                              {ev.attendees && <span>{ev.attendees}</span>}
                            </div>
                          </div>
                        ))}

                        {/* Quick hover add prompt */}
                        {dayEvents.length === 0 && (
                          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-4 h-4 text-[#ff5625]/60" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181818] border border-[#2a2a2a] cut-corner p-6 shadow-2xl">
            <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide mb-4">
              Add Timetable Session / Block
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-mono uppercase text-[#929090] mb-1">Session Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-[#121212] border border-[#353534] text-white px-3 py-2 rounded outline-none focus:border-[#ff5625]"
                  required
                />
              </div>

              <div>
                <label className="block text-mono uppercase text-[#929090] mb-1">Type / Category</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    let defTitle = newEvent.title;
                    if (t === 'PUB') defTitle = 'HIIT Group Conditioning';
                    if (t === 'PT') defTitle = '1:1 Personal Strength';
                    if (t === 'SMR') defTitle = 'Smash Cage Session';
                    if (t === 'BLOCKED') defTitle = 'Staff Floor Setup / Maintenance';
                    setNewEvent({ ...newEvent, type: t, title: defTitle });
                  }}
                  className="w-full bg-[#121212] border border-[#353534] text-white px-3 py-2 rounded outline-none focus:border-[#ff5625]"
                >
                  <option value="PT">1:1 Strength (Personal Training)</option>
                  <option value="PUB">Public Training (HIIT Squad)</option>
                  <option value="SMR">Smash Room Cage</option>
                  <option value="BLOCKED">Blocked Time / Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-mono uppercase text-[#929090] mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full bg-[#121212] border border-[#353534] text-white px-3 py-2 rounded font-mono outline-none focus:border-[#ff5625]"
                    placeholder="08:00"
                  />
                </div>
                <div>
                  <label className="block text-mono uppercase text-[#929090] mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full bg-[#121212] border border-[#353534] text-white px-3 py-2 rounded font-mono outline-none focus:border-[#ff5625]"
                    placeholder="09:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-mono uppercase text-[#929090] mb-1">Client Name (Optional)</label>
                <input
                  type="text"
                  value={newEvent.clientName}
                  onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                  className="w-full bg-[#121212] border border-[#353534] text-white px-3 py-2 rounded outline-none focus:border-[#ff5625]"
                  placeholder="e.g. Marcus J."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 border border-[#353534] text-[#c6c6c7] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold uppercase tracking-wider px-6 py-2 cut-corner"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
