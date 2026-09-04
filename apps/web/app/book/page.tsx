'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiUrl as api } from '../../lib/api-url';

type Service = { id: string; name: string; description: string; durationMinutes: number; priceMinor: number };
type Slot = { id: string; startAt: string; endAt: string; capacity: number; bookedCount: number };
type Booking = { bookingReference: string };
type Details = { fullName: string; email: string; phone: string };

function BookingFlow() {
  const query = useSearchParams();
  const queryServiceId = query.get('serviceId');
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState(queryServiceId || '');
  const [step, setStep] = useState(queryServiceId ? 1 : 0);
  const [dates, setDates] = useState<{ date: string }[]>([]);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [details, setDetails] = useState<Details>({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const selectedService = useMemo(() => services.find((service) => service.id === serviceId), [services, serviceId]);
  const selectedSlot = useMemo(() => slots.find((slot) => slot.id === slotId), [slots, slotId]);

  useEffect(() => { fetch(`${api}/services`).then((response) => response.json()).then(setServices).catch(() => setError('Unable to load services. Please try again shortly.')); }, []);
  useEffect(() => {
    if (!serviceId) return;
    setLoading(true); setError(''); setDate(''); setSlots([]); setSlotId('');
    fetch(`${api}/services/${serviceId}/available-dates`).then(async (response) => {
      if (!response.ok) throw new Error('Unable to load dates'); return response.json();
    }).then(setDates).catch(() => setError('Unable to load availability for this service.')).finally(() => setLoading(false));
  }, [serviceId]);

  async function chooseDate(nextDate: string) {
    setLoading(true); setError(''); setDate(nextDate); setSlotId('');
    try {
      const response = await fetch(`${api}/services/${serviceId}/slots?date=${nextDate.slice(0, 10)}`);
      if (!response.ok) throw new Error();
      setSlots(await response.json());
    } catch { setError('Unable to load time slots. Please choose another date or retry.'); }
    finally { setLoading(false); }
  }

  async function confirmBooking() {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${api}/bookings`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...details, serviceId, slotId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(Array.isArray(result.message) ? result.message[0] : result.message);
      setBooking(result); setStep(4);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Booking could not be completed.'); }
    finally { setLoading(false); }
  }

  const formatDate = (value: string) => new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (value?: string) => value ? new Date(value).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' }) : '';

  return <main className="booking-panel cut-corner">
    <div className="eyebrow">Secure reservation · Kampala, EAT</div>
    <h1>{booking ? 'You’re booked.' : 'Book your session'}</h1>
    {!booking && <div className="booking-steps">{['Service', 'Athlete', 'Time', 'Review'].map((label, index) => <span className={step === index ? 'booking-step--active' : step > index ? 'booking-step--complete' : ''} key={label}>{index + 1}. {label}</span>)}</div>}
    {!booking && <div className="flow-actions"><Link className="button button--secondary cut-corner" href="/">Cancel and return home</Link></div>}
    {error && <p className="form-error">{error}</p>}

    {step === 0 && <section><h2>Select a discipline</h2><div className="service-grid booking-service-grid">{services.map((service) => <button className={`service-card cut-corner ${service.id === serviceId ? 'service-card--selected' : ''}`} key={service.id} onClick={() => { setServiceId(service.id); setStep(1); }}><div><div className="eyebrow">{service.durationMinutes} min</div><h3>{service.name}</h3><p className="text-secondary">{service.description}</p></div><div className="service-card__price">{service.priceMinor ? `UGX ${service.priceMinor.toLocaleString()}` : 'Included in plan'}</div></button>)}</div></section>}

    {step === 1 && <section><h2>Athlete details</h2><p className="text-secondary">{selectedService?.name} · {selectedService?.durationMinutes} minutes</p><input className="field" required placeholder="Full name" value={details.fullName} onChange={(event) => setDetails({ ...details, fullName: event.target.value })} /><input className="field" required type="email" placeholder="Email address" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} /><input className="field" required placeholder="Phone number" value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} /><div className="flow-actions"><button className="button button--secondary cut-corner" onClick={() => setStep(0)}>Back</button><button className="button cut-corner" disabled={!details.fullName.trim() || !details.email.trim() || !details.phone.trim()} onClick={() => setStep(2)}>Choose time</button></div></section>}

    {step === 2 && <section><h2>Select date and time</h2>{loading && <p className="muted">Loading live availability…</p>}<h3 className="booking-subtitle">Available dates</h3><div className="slot-list">{dates.map((item) => <button className={`slot-button ${date === item.date ? 'slot-button--selected' : ''}`} key={item.date} onClick={() => chooseDate(item.date)}>{formatDate(item.date)}</button>)}</div>{!loading && dates.length === 0 && <p className="muted">No upcoming dates are currently published for this service.</p>}{date && <><h3 className="booking-subtitle">Available times</h3><div className="slot-list">{slots.map((slot) => <button className={`slot-button ${slotId === slot.id ? 'slot-button--selected' : ''}`} key={slot.id} onClick={() => setSlotId(slot.id)}>{formatTime(slot.startAt)} <small>{slot.capacity - slot.bookedCount} left</small></button>)}</div>{!loading && slots.length === 0 && <p className="muted">No slots remain on this date.</p>}</>}<div className="flow-actions"><button className="button button--secondary cut-corner" onClick={() => setStep(1)}>Back</button><button className="button cut-corner" disabled={!slotId} onClick={() => setStep(3)}>Review booking</button></div></section>}

    {step === 3 && <section><h2>Review and confirm</h2><div className="review-card"><span>Discipline</span><strong>{selectedService?.name}</strong><span>Date & time</span><strong>{date && formatDate(date)} · {formatTime(selectedSlot?.startAt)}–{formatTime(selectedSlot?.endAt)} EAT</strong><span>Athlete</span><strong>{details.fullName}</strong><span>Price</span><strong>{selectedService?.priceMinor ? `UGX ${selectedService.priceMinor.toLocaleString()}` : 'Included in plan'}</strong></div><p className="text-secondary">Your slot is checked again when you confirm. You’ll receive a secure booking-management link by email.</p><div className="flow-actions"><button className="button button--secondary cut-corner" onClick={() => setStep(2)}>Back</button><button className="button cut-corner" disabled={loading} onClick={confirmBooking}>{loading ? 'Confirming…' : 'Confirm booking'}</button></div></section>}

    {step === 4 && booking && <section className="confirmation"><div className="eyebrow">Booking confirmed</div><h2>See you on the mat.</h2><p>Your reference is <strong className="accent">{booking.bookingReference}</strong>.</p><p className="text-secondary">A confirmation email with your secure manage-booking link is being prepared. Please arrive 10 minutes before your session.</p><Link className="button cut-corner" href="/">Return home</Link></section>}
  </main>;
}

export default function BookPage() { return <Suspense fallback={<main className="booking-panel">Loading booking form…</main>}><BookingFlow /></Suspense>; }
