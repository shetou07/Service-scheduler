import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { User, Phone, Mail, Target, AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const Step2ClientDetails: React.FC = () => {
  const { clientDetails, setClientDetails, setBookingStep, selectedService } = useBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!clientDetails.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!clientDetails.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    }
    if (!clientDetails.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(clientDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setBookingStep(3);
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#ff5625] text-xs font-mono tracking-widest uppercase mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Step 02 / 04</span>
        </div>
        <h2 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-wide">
          Athlete Profile & Bio
        </h2>
        <p className="text-sm text-[#929090] mt-1">
          Providing these details allows Coach Rickie to prepare custom gear and tailor drills to your level.
        </p>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-6 cut-corner space-y-5">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#c6c6c7] mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#ff5625]" />
            <span>Full Legal Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Brian Mukasa"
            value={clientDetails.fullName}
            onChange={(e) => {
              setClientDetails((prev) => ({ ...prev, fullName: e.target.value }));
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            className={`w-full bg-[#121212] border ${
              errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#353534] focus:border-[#ff5625]'
            } text-white px-4 py-3 text-sm rounded outline-none transition-colors placeholder:text-[#555]`}
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1.5 font-mono">{errors.fullName}</p>}
        </div>

        {/* Contact Grid: Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#c6c6c7] mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#ff5625]" />
              <span>Mobile Phone *</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#181818] border border-r-0 border-[#353534] text-xs font-mono text-[#929090] rounded-l">
                🇺🇬 +256
              </span>
              <input
                type="tel"
                placeholder="772 123 456"
                value={clientDetails.phone.replace(/^\+256\s*/, '')}
                onChange={(e) => {
                  const val = e.target.value;
                  setClientDetails((prev) => ({ ...prev, phone: `+256 ${val}` }));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                className={`w-full bg-[#121212] border ${
                  errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-[#353534] focus:border-[#ff5625]'
                } text-white px-4 py-3 text-sm rounded-r outline-none transition-colors placeholder:text-[#555]`}
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-mono">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#c6c6c7] mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#ff5625]" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              placeholder="athlete@gmail.com"
              value={clientDetails.email}
              onChange={(e) => {
                setClientDetails((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full bg-[#121212] border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#353534] focus:border-[#ff5625]'
              } text-white px-4 py-3 text-sm rounded outline-none transition-colors placeholder:text-[#555]`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5 font-mono">{errors.email}</p>}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#c6c6c7] mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#ff5625]" />
            <span>Primary Focus / Goals (Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder={
              selectedService.id === 'smash'
                ? "e.g. Venting work stress, explosive hammer strikes"
                : "e.g. Explosive sprint power, hypertrophy, core strength"
            }
            value={clientDetails.goals}
            onChange={(e) => setClientDetails((prev) => ({ ...prev, goals: e.target.value }))}
            className="w-full bg-[#121212] border border-[#353534] focus:border-[#ff5625] text-white px-4 py-2.5 text-sm rounded outline-none transition-colors placeholder:text-[#555] resize-none"
          />
        </div>

        {/* Injuries & Conditions */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#c6c6c7] mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Injuries or Physical Restrictions (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Recovering from ankle sprain, right shoulder impingement"
            value={clientDetails.injuries}
            onChange={(e) => setClientDetails((prev) => ({ ...prev, injuries: e.target.value }))}
            className="w-full bg-[#121212] border border-[#353534] focus:border-[#ff5625] text-white px-4 py-2.5 text-sm rounded outline-none transition-colors placeholder:text-[#555]"
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-[#929090] bg-[#121212] p-3 rounded border border-[#2a2a2a]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your biometric & contact data is strictly confidential and used solely for workout preparation.</span>
        </div>
      </div>

      {/* Nav Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setBookingStep(1)}
          className="flex items-center gap-2 px-5 py-3 border border-[#353534] hover:border-white text-xs font-mono uppercase text-[#c6c6c7] hover:text-white rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="bg-[#ff5625] hover:bg-[#ff4500] text-black font-barlow font-bold text-lg uppercase tracking-wider px-8 py-3 cut-corner transition-all duration-200 shadow-md shadow-[#ff5625]/20 flex items-center gap-2"
        >
          <span>Select Date & Time</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
