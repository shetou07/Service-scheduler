import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { ServiceId } from '../../types';
import { Check, Flame, Users, Zap, HeartPulse, Clock, Sparkles } from 'lucide-react';

export const Step1Service: React.FC = () => {
  const { services, selectedServiceId, setSelectedServiceId, setBookingStep } = useBooking();

  const getTagBadge = (tag: string, variant: string) => {
    switch (variant) {
      case 'intense':
        return 'bg-[#ff5625]/20 text-[#ff5625] border-[#ff5625]/40';
      case 'dynamic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'extreme':
        return 'bg-red-600/20 text-red-400 border-red-600/40';
      case 'chill':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-neutral-800 text-white border-neutral-700';
    }
  };

  const getIcon = (id: ServiceId) => {
    switch (id) {
      case 'personal':
        return <Flame className="w-4 h-4 text-[#ff5625]" />;
      case 'public':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'smash':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'recovery':
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 01 / 04</span>
        </div>
        <h2 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide">
          Select Your Discipline
        </h2>
        <p className="text-sm text-[#929090] mt-1">
          Choose the training format that aligns with your athletic targets today.
        </p>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`relative cursor-pointer transition-all duration-200 cut-corner border p-4 sm:p-5 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'bg-[#1c1b1b] border-[#ff5625] ring-1 ring-[#ff5625] shadow-lg shadow-[#ff5625]/10'
                  : 'bg-[#181818] border-[#2a2a2a] hover:border-[#3d3d3d] hover:bg-[#1e1e1e]'
              }`}
            >
              {/* Background preview image banner */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded overflow-hidden border border-[#2a2a2a] relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[10px] font-mono font-bold text-white bg-black/60 px-1 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5 text-[#ff5625]" />
                    <span>{service.durationLabel}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 border rounded-full ${getTagBadge(
                        service.tag,
                        service.tagVariant
                      )}`}
                    >
                      {service.tag}
                    </span>
                    
                    {/* Radio indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#ff5625] bg-[#ff5625] text-black'
                          : 'border-[#444] bg-[#121212]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="font-barlow font-bold text-xl uppercase text-white tracking-wide truncate">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#929090] line-clamp-2 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom features & price */}
              <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#c6c6c7]">
                  {getIcon(service.id)}
                  <span className="truncate max-w-[170px] text-[11px] font-medium">
                    {service.features[0]}
                  </span>
                </div>
                <div className="font-barlow font-bold text-sm sm:text-base text-[#ff5625] uppercase tracking-wide">
                  {service.price === 0 ? 'FREE / INCLUDED' : `UGX ${service.price.toLocaleString()} / SES`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => setBookingStep(2)}
          className="w-full sm:w-auto bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-lg uppercase tracking-wider px-8 py-3 cut-corner transition-all duration-200 shadow-md shadow-[#ff5625]/20 flex items-center justify-center gap-2"
        >
          <span>Continue to Details</span>
          <span className="text-black font-mono">→</span>
        </button>
      </div>
    </div>
  );
};
