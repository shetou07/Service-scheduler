import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { BookingStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Check,
  XCircle,
  Play,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { bookings, updateBookingStatus, openBookingModal, setAdminTab } = useBooking();
  const [filterService, setFilterService] = useState<string>('all');

  const todayStr = '2024-10-24';
  const todayBookings = bookings.filter((b) => b.date === todayStr);

  const filteredToday = todayBookings.filter((b) => {
    if (filterService === 'all') return true;
    return b.serviceId === filterService;
  });

  const totalToday = todayBookings.length;
  const confirmedCount = todayBookings.filter((b) => b.status === 'Confirmed').length;
  const arrivedCount = todayBookings.filter((b) => b.status === 'Arrived').length;
  const inProgressCount = todayBookings.filter((b) => b.status === 'In Progress').length;
  const completedCount = todayBookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = todayBookings.filter((b) => b.status === 'Cancelled').length;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Arrived':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'In Progress':
        return 'bg-[#ff5625]/20 text-[#ff5625] border-[#ff5625]/40 animate-pulse';
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-400 border-red-500/30 line-through';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>COMMAND CENTER • THURSDAY, OCT 24</span>
          </div>
          <h1 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide mt-1">
            COACH RICKIE OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openBookingModal()}
            className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-sm uppercase tracking-wider px-4 py-2 cut-corner flex items-center gap-2 transition-all shadow-md shadow-[#ff5625]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Book Client</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Total */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 cut-corner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#929090] uppercase mb-2">
            <span>Today's Sessions</span>
            <CalendarIcon className="w-4 h-4 text-[#ff5625]" />
          </div>
          <div className="font-barlow font-black text-4xl text-white">
            {totalToday}
          </div>
          <div className="text-[11px] font-mono text-[#929090] mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{completedCount} Done</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{totalToday - completedCount - cancelledCount} Pending</span>
          </div>
        </div>

        {/* Total Active Upcoming */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 cut-corner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#929090] uppercase mb-2">
            <span>Upcoming (Week)</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-barlow font-black text-4xl text-blue-400">
            {bookings.length}
          </div>
          <div className="text-[11px] font-mono text-[#929090] mt-1">
            Across 4 disciplines in Kigali
          </div>
        </div>

        {/* Open Slots */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 cut-corner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#929090] uppercase mb-2">
            <span>Open Slots Today</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-barlow font-black text-4xl text-emerald-400">
            11
          </div>
          <div className="text-[11px] font-mono text-[#929090] mt-1">
            Available on booking engine
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 cut-corner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#929090] uppercase mb-2">
            <span>Cancelled / Free</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-barlow font-black text-4xl text-red-400">
            {cancelledCount}
          </div>
          <div className="text-[11px] font-mono text-[#929090] mt-1">
            Auto-released to timetable
          </div>
        </div>
      </div>

      {/* Today's Live Schedule Roster */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#201f1f]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide">
                TODAY'S RUNNING ROSTER
              </h2>
            </div>
            <p className="text-xs text-[#929090] mt-0.5">
              Live athlete check-in and stage progression for Oct 24, 2024.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#929090]" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="bg-[#141414] border border-[#353534] text-xs text-white px-3 py-1.5 rounded outline-none focus:border-[#ff5625]"
            >
              <option value="all">All Disciplines</option>
              <option value="personal">Personal Training (1:1)</option>
              <option value="public">Public Training (HIIT)</option>
              <option value="smash">Smash Room</option>
              <option value="recovery">Recovery</option>
            </select>
          </div>
        </div>

        {/* Schedule List / Table */}
        <div className="overflow-x-auto">
          {filteredToday.length === 0 ? (
            <div className="p-12 text-center text-[#929090] text-xs font-mono">
              No sessions scheduled matching the selected filter for today.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#929090] font-mono uppercase tracking-wider text-[11px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="p-4">Time Slot</th>
                  <th className="p-4">Athlete / Client</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525]">
                {filteredToday.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#202020] transition-colors">
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ff5625]" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <span className="text-[10px] text-[#777] block mt-0.5">End: {booking.endTime}</span>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-white text-sm">{booking.client.fullName}</div>
                      <div className="font-mono text-[11px] text-[#929090]">{booking.client.phone}</div>
                      {booking.client.injuries && (
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5 truncate max-w-xs">
                          ⚠️ {booking.client.injuries}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-barlow font-bold uppercase text-white tracking-wide text-sm block">
                        {booking.serviceName}
                      </span>
                      <span className="text-[10px] font-mono text-[#ff5625] uppercase tracking-wider">
                        {booking.serviceTag}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-xs text-[#c6c6c7]">
                      {booking.referenceNumber}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded border inline-block ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Arrived')}
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded text-[11px] font-mono"
                            title="Mark Athlete Arrived at Gym"
                          >
                            Arrived
                          </button>
                        )}

                        {booking.status === 'Arrived' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'In Progress')}
                            className="px-2.5 py-1 bg-[#ff5625]/20 hover:bg-[#ff5625]/30 text-[#ff5625] border border-[#ff5625]/40 rounded text-[11px] font-mono flex items-center gap-1"
                            title="Start Session"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Start</span>
                          </button>
                        )}

                        {booking.status === 'In Progress' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded text-[11px] font-mono flex items-center gap-1"
                            title="Mark Session Completed"
                          >
                            <Check className="w-2.5 h-2.5" />
                            <span>Complete</span>
                          </button>
                        )}

                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                            className="p-1 hover:bg-red-500/20 text-[#666] hover:text-red-400 rounded transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Jump to Full Calendar */}
        <div className="p-3 bg-[#181818] border-t border-[#2a2a2a] flex items-center justify-between text-xs font-mono">
          <span className="text-[#929090]">Showing {filteredToday.length} of {totalToday} sessions today</span>
          <button
            onClick={() => setAdminTab('calendar')}
            className="text-[#ff5625] hover:underline flex items-center gap-1"
          >
            <span>View Full 7-Day Timetable Grid</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
