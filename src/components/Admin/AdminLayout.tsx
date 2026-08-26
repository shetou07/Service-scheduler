import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminTab } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminBookings } from './AdminBookings';
import { AdminCalendar } from './AdminCalendar';
import { AdminAvailability } from './AdminAvailability';
import { AdminClients } from './AdminClients';
import { COACH_AVATAR } from '../../data/mockData';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Clock,
  Users,
  Dumbbell,
  Plus,
  ArrowLeft,
  Flame,
  Sun,
  Moon
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, setAppView, openBookingModal, theme, toggleTheme } = useBooking();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'availability', label: 'Availability', icon: <Clock className="w-4 h-4" /> },
    { id: 'clients', label: 'Athletes', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#181818] border-b md:border-b-0 md:border-r border-[#2a2a2a] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Coach Profile Widget */}
          <div className="flex items-center gap-3 p-3 bg-[#131313] border border-[#2a2a2a] cut-corner-sm">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#ff5625] shrink-0">
              <img
                src={COACH_AVATAR}
                alt="Coach Rickie"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="font-barlow font-bold text-lg uppercase text-white tracking-wider truncate flex items-center gap-1">
                <span>COACH RICKIE</span>
                <Flame className="w-3.5 h-3.5 text-[#ff5625]" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block uppercase">
                ADMIN • KAMPALA HQ
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase rounded transition-all ${
                    isActive
                      ? 'bg-[#ff5625] text-black font-bold shadow-md shadow-[#ff5625]/20'
                      : 'text-[#c6c6c7] hover:text-white hover:bg-[#222]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#2a2a2a] space-y-2 mt-6 md:mt-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full bg-[#131313] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#ff5625]/50 text-[#c6c6c7] hover:text-white text-xs font-mono py-2.5 px-3 rounded cut-corner-sm flex items-center justify-between transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#222] rounded text-[#999]">
              {theme}
            </span>
          </button>

          <button
            onClick={() => openBookingModal()}
            className="w-full bg-[#1c1b1b] hover:bg-[#252525] border border-[#ff5625]/50 text-[#ff5625] hover:text-white font-barlow font-bold uppercase text-sm tracking-wider py-2.5 cut-corner-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Book Session</span>
          </button>

          <button
            onClick={() => setAppView('landing')}
            className="w-full text-xs font-mono uppercase text-[#929090] hover:text-white py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Client View</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'bookings' && <AdminBookings />}
        {adminTab === 'calendar' && <AdminCalendar />}
        {adminTab === 'availability' && <AdminAvailability />}
        {adminTab === 'clients' && <AdminClients />}
      </main>

    </div>
  );
};
