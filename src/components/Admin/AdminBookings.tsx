import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { BookingStatus, ServiceId } from '../../types';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Trash2,
  Plus
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { bookings, updateBookingStatus, cancelBooking, openBookingModal } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.serviceId === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Arrived':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'In Progress':
        return 'bg-[#ff5625]/20 text-[#ff5625] border-[#ff5625]/40';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40 line-through';
    }
  };

  const handleExportCSV = () => {
    const headers = 'Reference,Client Name,Phone,Email,Service,Date,Time,Status,Price\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.referenceNumber}","${b.client.fullName}","${b.client.phone}","${b.client.email}","${b.serviceName}","${b.date}","${b.timeSlot}","${b.status}","${b.price}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CoachRickie_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest">
            RESERVATIONS DATABASE
          </div>
          <h1 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide mt-1">
            ALL CLIENT BOOKINGS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#1c1b1b] hover:bg-[#252525] text-xs font-mono uppercase text-[#c6c6c7] hover:text-white rounded border border-[#353534] flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => openBookingModal()}
            className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-sm uppercase tracking-wider px-4 py-2 cut-corner flex items-center gap-1.5 transition-all shadow-md shadow-[#ff5625]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 cut-corner grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by athlete name, phone, email, or CR- reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#353534] text-xs text-white pl-10 pr-4 py-2.5 rounded outline-none focus:border-[#ff5625]"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#121212] border border-[#353534] text-xs text-white px-3 py-2.5 rounded outline-none focus:border-[#ff5625]"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Arrived">Arrived</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="sm:col-span-3">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full bg-[#121212] border border-[#353534] text-xs text-white px-3 py-2.5 rounded outline-none focus:border-[#ff5625]"
          >
            <option value="all">All Disciplines</option>
            <option value="personal">Personal Training</option>
            <option value="public">Public Training</option>
            <option value="smash">Smash Room</option>
            <option value="recovery">Recovery</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-16 text-center text-[#929090] text-xs font-mono">
              No bookings found matching your search criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#929090] font-mono uppercase tracking-wider text-[11px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Athlete Details</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#202020] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#ff5625] whitespace-nowrap">
                      {b.referenceNumber}
                      <span className="text-[10px] text-[#777] block font-normal">
                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-white text-sm">{b.client.fullName}</div>
                      <div className="font-mono text-[11px] text-[#929090]">{b.client.phone}</div>
                      <div className="font-mono text-[10px] text-[#666] truncate max-w-[180px]">{b.client.email}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-barlow font-bold uppercase text-white tracking-wide text-sm block">
                        {b.serviceName}
                      </span>
                      <span className="text-[10px] font-mono text-[#ff5625] uppercase tracking-wider">
                        {b.serviceTag}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="text-white font-medium">{b.date}</div>
                      <div className="text-xs font-mono text-[#929090] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#ff5625]" />
                        <span>{b.timeSlot}</span>
                      </div>
                    </td>

                    <td className="p-4 font-barlow font-bold text-sm text-white">
                      {b.price}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded border inline-block ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className="bg-[#141414] border border-[#353534] text-xs text-white px-2 py-1 rounded outline-none focus:border-[#ff5625]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Arrived">Arrived</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-3 bg-[#181818] border-t border-[#2a2a2a] text-xs font-mono text-[#929090] flex items-center justify-between">
          <span>Showing {filteredBookings.length} bookings</span>
          <span>Database synced live with local session storage</span>
        </div>
      </div>
    </div>
  );
};
