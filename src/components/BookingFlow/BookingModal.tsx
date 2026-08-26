import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Step1Service } from './Step1Service';
import { Step2ClientDetails } from './Step2ClientDetails';
import { Step3DateTime } from './Step3DateTime';
import { Step4ReviewConfirm } from './Step4ReviewConfirm';
import { Step5Confirmation } from './Step5Confirmation';
import { X, Check } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { isBookingOpen, closeBookingModal, bookingStep, setBookingStep } = useBooking();

  if (!isBookingOpen) return null;

  const steps = [
    { num: 1, label: 'SERVICE' },
    { num: 2, label: 'ATHLETE' },
    { num: 3, label: 'TIME' },
    { num: 4, label: 'REVIEW' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Outer Click Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={() => {
          if (bookingStep === 5) {
            closeBookingModal();
          } else {
            if (window.confirm('Are you sure you want to exit booking? Your progress will be saved in session.')) {
              closeBookingModal();
            }
          }
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#141414] border border-[#2a2a2a] cut-corner shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-4 bg-[#181818] border-b border-[#2a2a2a] flex items-center justify-between shrink-0">
          
          {/* Breadcrumb Steps (Visible during steps 1-4) */}
          {bookingStep <= 4 ? (
            <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto py-1">
              {steps.map((s, idx) => {
                const isActive = bookingStep === s.num;
                const isCompleted = bookingStep > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <button
                      type="button"
                      disabled={bookingStep < s.num}
                      onClick={() => setBookingStep(s.num as any)}
                      className={`flex items-center gap-1.5 text-xs font-mono tracking-wider transition-colors uppercase ${
                        isActive
                          ? 'text-[#ff5625] font-bold'
                          : isCompleted
                          ? 'text-white hover:text-[#ff5625]'
                          : 'text-[#555] cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${
                          isActive
                            ? 'bg-[#ff5625] text-black font-bold'
                            : isCompleted
                            ? 'bg-[#2a2a2a] text-emerald-400 border border-emerald-500/40'
                            : 'bg-[#1e1e1e] text-[#666]'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {idx < steps.length - 1 && (
                      <span className="text-[#333] text-xs font-mono">/</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-[#c6c6c7] uppercase">RESERVATION COMPLETE</span>
            </div>
          )}

          {/* Close X */}
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded hover:bg-[#252525] text-[#929090] hover:text-white transition-colors"
            title="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {bookingStep === 1 && <Step1Service />}
          {bookingStep === 2 && <Step2ClientDetails />}
          {bookingStep === 3 && <Step3DateTime />}
          {bookingStep === 4 && <Step4ReviewConfirm />}
          {bookingStep === 5 && <Step5Confirmation />}
        </div>
      </div>
    </div>
  );
};
