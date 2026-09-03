import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Shield, Calendar, Search, LayoutDashboard, Dumbbell, ArrowRight, Sun, Moon } from 'lucide-react';
import { COACH_RICKIE_LOGO } from '../data/mockData';

export const Navbar: React.FC = () => {
  const { appView, setAppView, openBookingModal, setIsLookupModalOpen, theme, toggleTheme } = useBooking();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#2A2A2A] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppView('landing')}>
          <div className="relative w-10 h-10 bg-[#1c1b1b] border border-[#ff5625]/40 flex items-center justify-center cut-corner-sm shadow-sm">
            <img 
              src={COACH_RICKIE_LOGO} 
              alt="Coach Rickie Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback icon if URL is unreachable
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Dumbbell className="w-5 h-5 text-[#ff5625] absolute" />
          </div>
          <div>
            <div className="font-barlow font-black text-2xl tracking-wider text-white uppercase flex items-center gap-1.5 leading-none">
              COACH RICKIE <span className="text-[#ff5625]">.</span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#929090] uppercase">
              PERFORMANCE TRAINING
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button 
            onClick={() => {
              setAppView('landing');
              const el = document.getElementById('services-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#c6c6c7] hover:text-[#ff5625] transition-colors uppercase font-barlow tracking-wider text-base"
          >
            Services
          </button>
          <button 
            onClick={() => {
              setAppView('landing');
              const el = document.getElementById('smash-room-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#c6c6c7] hover:text-[#ff5625] transition-colors uppercase font-barlow tracking-wider text-base"
          >
            Smash Room
          </button>
          <button 
            onClick={() => {
              setAppView('landing');
              const el = document.getElementById('schedule-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#c6c6c7] hover:text-[#ff5625] transition-colors uppercase font-barlow tracking-wider text-base"
          >
            Schedule
          </button>
          <button 
            onClick={() => {
              setAppView('landing');
              const el = document.getElementById('trainers-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#c6c6c7] hover:text-[#ff5625] transition-colors uppercase font-barlow tracking-wider text-base"
          >
            About Rickie
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:px-2.5 sm:py-2 text-xs font-mono text-[#c6c6c7] hover:text-white bg-[#1c1b1b] border border-[#2a2a2a] hover:border-[#ff5625]/60 transition-all rounded cut-corner-sm flex items-center gap-1.5 shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-[11px] font-mono uppercase text-amber-400/90 font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-500" />
                <span className="hidden lg:inline text-[11px] font-mono uppercase text-blue-600 font-semibold">Dark</span>
              </>
            )}
          </button>

          {/* Lookup Existing Booking */}
          <button
            onClick={() => setIsLookupModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#c6c6c7] hover:text-white bg-[#1c1b1b] border border-[#2a2a2a] hover:border-[#ff5625]/50 transition-all rounded"
            title="Check booking reference"
          >
            <Search className="w-3.5 h-3.5 text-[#ff5625]" />
            <span>FIND BOOKING</span>
          </button>

          {/* Mode Switch (Coach Admin vs Client View) */}
          <button
            onClick={() => setAppView(appView === 'landing' ? 'admin' : 'landing')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wider transition-all cut-corner-sm border ${
              appView === 'admin'
                ? 'bg-[#ff5625] text-black border-[#ff5625] font-bold'
                : 'bg-[#1c1b1b] text-[#c6c6c7] border-[#353534] hover:text-white hover:border-[#ff5625]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{appView === 'admin' ? 'CLIENT VIEW' : 'COACH ADMIN'}</span>
          </button>

          {/* Primary CTA Book */}
          <button
            onClick={() => openBookingModal()}
            className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-sm sm:text-base uppercase tracking-wider px-3.5 sm:px-5 py-2 sm:py-2.5 cut-corner transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff5625]/20 flex items-center gap-1.5 sm:gap-2"
          >
            <span>BOOK</span>
            <span className="hidden sm:inline">SESSION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
