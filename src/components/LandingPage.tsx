import React from 'react';
import { useBooking } from '../context/BookingContext';
import { ServiceId } from '../types';
import {
  COACH_RICKIE_HERO,
  COACH_AVATAR,
  SERVICES
} from '../data/mockData';
import {
  Dumbbell,
  Flame,
  Zap,
  Users,
  Shield,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Award,
  Sparkles,
  Phone,
  Mail,
  Instagram,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { openBookingModal, setAppView } = useBooking();

  const handleBookService = (serviceId: ServiceId) => {
    openBookingModal(serviceId);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] selection:bg-[#ff5625] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#2a2a2a] bg-grid-pattern">
        {/* Background Gritty Athlete Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={COACH_RICKIE_HERO}
            alt="Coach Rickie Training Facility"
            className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-[#121212]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center sm:text-left flex flex-col items-center sm:items-start justify-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ff5625]/15 border border-[#ff5625]/40 text-[#ff5625] text-xs font-mono tracking-widest uppercase cut-corner-sm mb-6 shadow-md shadow-[#ff5625]/10">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>KAMPALA ATHLETIC PERFORMANCE & RECOVERY</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-barlow font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.9] max-w-4xl">
            FORGE STRENGTH <br />
            <span className="text-[#ff5625] tracking-normal">UNLEASH POWER</span> <br />
            NO EXCUSES.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#c6c6c7] max-w-2xl font-normal leading-relaxed">
            Welcome to Coach Rickie's elite training lab in Kampala. From customized 1-on-1 mechanical overload and high-energy group conditioning to the city's premier therapeutic Smash Room.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-black text-xl uppercase tracking-wider px-8 py-4 cut-corner transition-all duration-200 shadow-xl shadow-[#ff5625]/30 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span>BOOK A SESSION</span>
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('services-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#1c1b1b] hover:bg-[#252525] text-white border border-[#353534] hover:border-white font-barlow font-bold text-lg uppercase tracking-wider px-7 py-3.5 cut-corner transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#ff5625]" />
              <span>EXPLORE SERVICES</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-12 pt-8 border-t border-[#2a2a2a] grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-2xl">
            <div>
              <span className="font-barlow font-black text-3xl sm:text-4xl text-white block">100%</span>
              <span className="text-xs font-mono text-[#929090] uppercase tracking-wider">Coach Supervised</span>
            </div>
            <div>
              <span className="font-barlow font-black text-3xl sm:text-4xl text-[#ff5625] block">45-60 MIN</span>
              <span className="text-xs font-mono text-[#929090] uppercase tracking-wider">High-Yield Protocols</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="font-barlow font-black text-3xl sm:text-4xl text-white block">LUGOGO BYPASS</span>
              <span className="text-xs font-mono text-[#929090] uppercase tracking-wider">Prime Location</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (What We Offer) */}
      <section id="services-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
              <Dumbbell className="w-4 h-4" />
              <span>TRAINING DISCIPLINES</span>
            </div>
            <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-white tracking-wide">
              WHAT WE OFFER
            </h2>
          </div>
          <p className="text-sm text-[#929090] max-w-md">
            Click any discipline below to review details and immediately secure your spot on the live timetable.
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => handleBookService(service.id)}
              className="bg-[#181818] border border-[#2a2a2a] hover:border-[#ff5625] cut-corner overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#ff5625]/10 hover:-translate-y-1"
            >
              <div>
                {/* Image Card Header */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                  
                  {/* Tag Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 bg-black/80 text-[#ff5625] border border-[#ff5625]/40 cut-corner-sm uppercase">
                      {service.tag}
                    </span>
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-mono bg-black/80 px-2 py-0.5 text-white rounded">
                    <Clock className="w-3 h-3 text-[#ff5625]" />
                    <span>{service.durationLabel}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide group-hover:text-[#ff5625] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#c6c6c7] font-medium mt-1 mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-xs text-[#929090] line-clamp-3 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-1.5 text-xs text-[#c6c6c7] pt-3 border-t border-[#252525]">
                    {service.features.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#ff5625] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-5 pt-0">
                <div className="p-3 bg-[#131313] border border-[#252525] group-hover:border-[#ff5625]/50 rounded flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-[10px] font-mono text-[#929090] uppercase block">Rates</span>
                    <span className="font-barlow font-bold text-sm text-white uppercase">
                      {service.priceLabel}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded bg-[#ff5625] text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-20 bg-[#161616] border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>THE PROTOCOL</span>
            </div>
            <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-white tracking-wide">
              HOW IT WORKS
            </h2>
            <p className="text-sm text-[#929090] mt-2">
              Three seamless steps from booking to crushing your athletic objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 01 */}
            <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 sm:p-8 cut-corner relative overflow-hidden group hover:border-[#ff5625]/60 transition-colors">
              <div className="text-outline text-7xl font-barlow font-black select-none pointer-events-none absolute right-4 top-2">
                01
              </div>
              <div className="w-12 h-12 bg-[#ff5625]/20 text-[#ff5625] flex items-center justify-center rounded mb-6 border border-[#ff5625]/30">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide mb-2">
                Pick Your Discipline
              </h3>
              <p className="text-xs text-[#929090] leading-relaxed">
                Choose between custom 1-on-1 personal coaching, high-octane group conditioning, recovery therapy, or an adrenaline smash session.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 sm:p-8 cut-corner relative overflow-hidden group hover:border-[#ff5625]/60 transition-colors">
              <div className="text-outline text-7xl font-barlow font-black select-none pointer-events-none absolute right-4 top-2">
                02
              </div>
              <div className="w-12 h-12 bg-[#ff5625]/20 text-[#ff5625] flex items-center justify-center rounded mb-6 border border-[#ff5625]/30">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide mb-2">
                Choose Your Time
              </h3>
              <p className="text-xs text-[#929090] leading-relaxed">
                Select your preferred morning or evening time slot with real-time live availability. Instant SMS & calendar confirmation provided.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 sm:p-8 cut-corner relative overflow-hidden group hover:border-[#ff5625]/60 transition-colors">
              <div className="text-outline text-7xl font-barlow font-black select-none pointer-events-none absolute right-4 top-2">
                03
              </div>
              <div className="w-12 h-12 bg-[#ff5625]/20 text-[#ff5625] flex items-center justify-center rounded mb-6 border border-[#ff5625]/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide mb-2">
                Show Up & Execute
              </h3>
              <p className="text-xs text-[#929090] leading-relaxed">
                Arrive at our Kampala facility. All specialized gear, safety equipment, lockers, and cold hydration are ready for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SMASH ROOM SPECIAL SPOTLIGHT */}
      <section id="smash-room-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c1b1b] border border-[#ff5625]/50 cut-corner overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-red-400 text-xs font-mono tracking-widest uppercase mb-2">
                <Zap className="w-4 h-4 fill-red-400" />
                <span>THERAPEUTIC DESTRUCTION CAGE</span>
              </div>
              <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-white tracking-wide leading-none">
                THE SMASH ROOM: <br />
                <span className="text-[#ff5625]">OBLITERATE STRESS.</span>
              </h2>
              <p className="text-sm text-[#c6c6c7] mt-4 leading-relaxed">
                Step inside Uganda's premier reinforced smash arena. Suit up in tactical body armor, choose from sledgehammers, steel pipes, or baseball bats, and demolish monitors, glass, appliances, and heavy targets with full audio blast.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
                <span className="text-[#ff5625] font-bold block">FULL ARMOR</span>
                <span className="text-[#929090]">Helmets, gloves & coveralls</span>
              </div>
              <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a]">
                <span className="text-[#ff5625] font-bold block">CUSTOM AUDIO</span>
                <span className="text-[#929090]">Bluetooth sound blasting</span>
              </div>
              <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a] col-span-2 sm:col-span-1">
                <span className="text-[#ff5625] font-bold block">SOLO OR SQUAD</span>
                <span className="text-[#929090]">Up to 4 people per cage</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleBookService('smash')}
                className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-lg uppercase tracking-wider px-8 py-3 cut-corner transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-[#ff5625]/30"
              >
                <span>BOOK THE SMASH ROOM</span>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNN47XqnTadfSI69GVp84m4zO8UUhv1dGCIYZKqrhzEua9m26nqDsLfUmH1xeVSReWFrJtd4U0iyYKjjGCZG9jrWoUZrsmSU-JtuxhtzTaxyhv_hX4N0j2QBtpMQDOwrJPf67r7aIFuv-Nt2Yq1oAWftPPXkr2M2yftNbhLv9MtqQQqF73RgYL1gvGA_O7WDgWIsPobdrnFkpBVgOBEk3_i4lbMLx_zjWhBRCiu7pB8pPULx3g_JYr"
              alt="Smash Room Arena"
              className="w-full h-full object-cover filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1c1b1b] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 5. TRAINER & BIO SPOTLIGHT */}
      <section id="trainers-section" className="py-20 bg-[#161616] border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative rounded overflow-hidden border-2 border-[#ff5625] cut-corner shadow-2xl">
                <img
                  src={COACH_AVATAR}
                  alt="Coach Rickie"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                  <div className="font-barlow font-black text-3xl uppercase text-white tracking-wide">
                    COACH RICKIE
                  </div>
                  <div className="text-xs font-mono text-[#ff5625] uppercase tracking-wider">
                    HEAD PERFORMANCE COACH & FOUNDER
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase">
                <Award className="w-4 h-4" />
                <span>ABOUT THE COACH</span>
              </div>
              <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-white tracking-wide leading-tight">
                "WE DON'T NEGOTIATE WITH WEAKNESS."
              </h2>
              <p className="text-sm text-[#c6c6c7] leading-relaxed">
                With over a decade of elite strength and conditioning background, Coach Rickie combines biomechanical rigor with relentless energy. Whether training Uganda Rugby athletes, corporate high-performers, or beginners starting their fitness journey, every session is engineered for measurable adaptation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-[#ff5625] pl-4">
                  <div className="font-barlow font-bold text-xl text-white uppercase">Certified CSCS</div>
                  <div className="text-xs text-[#929090]">National Strength & Conditioning</div>
                </div>
                <div className="border-l-2 border-[#ff5625] pl-4">
                  <div className="font-barlow font-bold text-xl text-white uppercase">Biomechanical Focus</div>
                  <div className="text-xs text-[#929090]">Injury Prevention & Kinetic Output</div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => openBookingModal('personal')}
                  className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-base uppercase tracking-wider px-6 py-3 cut-corner transition-all"
                >
                  Book 1-on-1 With Rickie
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. STUDIO LOCATION & SCHEDULE SECTION */}
      <section id="schedule-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 sm:p-10 cut-corner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2a2a2a]">
            <div>
              <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest mb-1">
                KAMPALA LOCATION & HOURS
              </div>
              <h3 className="font-barlow font-bold text-3xl sm:text-4xl uppercase text-white tracking-wide">
                VISIT THE LAB
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openBookingModal()}
                className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold uppercase tracking-wider px-6 py-2.5 cut-corner text-sm"
              >
                Instant Session Pass
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#ff5625] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-barlow font-bold text-base uppercase mb-1">Studio Address</strong>
                <p className="text-[#929090]">Lugogo Bypass, Kampala, Uganda<br />Free secure parking for athletes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#ff5625] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-barlow font-bold text-base uppercase mb-1">Hours of Operation</strong>
                <p className="text-[#929090]">Mon - Fri: 06:00 AM - 09:00 PM (EAT)<br />Saturday: 07:00 AM - 06:00 PM (EAT)<br />Sunday: Closed for Recovery</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#ff5625] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-barlow font-bold text-base uppercase mb-1">Direct Contact</strong>
                <p className="text-[#929090]">Phone: +256 772 100 200<br />Email: bookings@coachrickie.ug</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#2a2a2a] bg-[#101010] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1c1b1b] border border-[#ff5625]/40 flex items-center justify-center cut-corner-sm">
              <Dumbbell className="w-4 h-4 text-[#ff5625]" />
            </div>
            <div>
              <span className="font-barlow font-bold text-lg uppercase text-white tracking-wider">
                COACH RICKIE PERFORMANCE
              </span>
              <p className="text-[10px] font-mono text-[#777]">© {new Date().getFullYear()} Kampala, Uganda. All Rights Reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#929090]">
            <button
              onClick={() => setAppView('admin')}
              className="hover:text-[#ff5625] transition-colors uppercase underline underline-offset-4"
            >
              Coach Portal Sign-in
            </button>
            <span>•</span>
            <button
              onClick={() => openBookingModal()}
              className="hover:text-[#ff5625] transition-colors uppercase"
            >
              Book Session
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
