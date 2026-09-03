import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CLIENT_PROFILES } from '../../data/mockData';
import { Search, User, Phone, Mail, Award, Target, AlertTriangle, Plus, Calendar, Dumbbell } from 'lucide-react';

export const AdminClients: React.FC = () => {
  const { openBookingModal, setClientDetails } = useBooking();
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState(CLIENT_PROFILES);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookForClient = (client: typeof CLIENT_PROFILES[0]) => {
    setClientDetails({
      fullName: client.name,
      email: client.email,
      phone: client.phone,
      goals: client.goals,
      injuries: client.injuries
    });
    openBookingModal();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#ff5625] uppercase tracking-widest">
            ATHLETE ROSTER & PROFILES
          </div>
          <h1 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide mt-1">
            CLIENT DIRECTORY
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athletes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1c1b1b] border border-[#353534] text-xs text-white pl-10 pr-4 py-2.5 rounded outline-none focus:border-[#ff5625]"
          />
        </div>
      </div>

      {/* Athlete Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-[#1c1b1b] border border-[#2a2a2a] cut-corner overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-[#ff5625]/60 transition-colors group"
          >
            <div>
              {/* Header with Avatar & Tier */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#2a2a2a]">
                <div className="w-14 h-14 rounded overflow-hidden border-2 border-[#ff5625] shrink-0">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-barlow font-bold text-2xl uppercase text-white tracking-wide group-hover:text-[#ff5625] transition-colors">
                    {client.name}
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#ff5625]/20 text-[#ff5625] border border-[#ff5625]/40 rounded inline-block mt-0.5">
                    {client.tier}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="py-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#c6c6c7]">
                  <Phone className="w-3.5 h-3.5 text-[#ff5625]" />
                  <span className="font-mono">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#c6c6c7]">
                  <Mail className="w-3.5 h-3.5 text-[#ff5625]" />
                  <span className="font-mono truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#c6c6c7]">
                  <Dumbbell className="w-3.5 h-3.5 text-[#ff5625]" />
                  <span><strong>{client.sessionsAttended}</strong> Sessions Completed</span>
                </div>
              </div>

              {/* Goals & Injuries */}
              <div className="bg-[#141414] p-3 rounded border border-[#2a2a2a] text-xs space-y-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#ff5625] block flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Focus / Goals</span>
                  </span>
                  <p className="text-white mt-0.5">{client.goals}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Injury History / Notes</span>
                  </span>
                  <p className="text-[#929090] mt-0.5">{client.injuries}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              <button
                onClick={() => handleBookForClient(client)}
                className="w-full bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold uppercase text-sm tracking-wider py-2.5 cut-corner flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Book Session for Athlete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
