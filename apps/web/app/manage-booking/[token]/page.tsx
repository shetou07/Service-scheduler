'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiUrl as api } from '../../../lib/api-url';

type Booking = { reference: string; status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'; serviceId: string; service: string; startAt: string; endAt: string; location: string };
type Slot = { id: string; startAt: string; endAt: string; capacity: number; bookedCount: number };

export default function ManageBookingPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [dates, setDates] = useState<{ date: string }[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState('');
  const [slotId, setSlotId] = useState('');
  const [mode, setMode] = useState<'idle' | 'reschedule'>('idle');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadBooking = async () => {
    setLoading(true); setMessage('');
    try {
      const response = await fetch(`${api}/manage-booking/${token}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'This booking link is invalid or has expired.');
      setBooking(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load this booking.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (token) void loadBooking(); }, [token]);

  async function startReschedule() {
    if (!booking) return;
    setMode('reschedule'); setMessage('');
    const response = await fetch(`${api}/services/${booking.serviceId}/available-dates`);
    if (!response.ok) { setMessage('Unable to load availability.'); return; }
    setDates(await response.json());
  }
  async function chooseDate(nextDate: string) {
    if (!booking) return;
    setDate(nextDate); setSlotId(''); setMessage('');
    const response = await fetch(`${api}/services/${booking.serviceId}/slots?date=${nextDate.slice(0, 10)}`);
    if (!response.ok) { setMessage('Unable to load slots for this date.'); return; }
    setSlots(await response.json());
  }
  async function cancelBooking() {
    if (!window.confirm('Cancel this booking? This cannot be undone.')) return;
    const response = await fetch(`${api}/manage-booking/${token}/cancel`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) { setMessage(data.message || 'Unable to cancel this booking.'); return; }
    setMessage('Your booking has been cancelled and the slot released.'); await loadBooking();
  }
  async function rescheduleBooking() {
    const response = await fetch(`${api}/manage-booking/${token}/reschedule`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slotId }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.message || 'Unable to reschedule this booking.'); return; }
    setMode('idle'); setMessage('Your booking has been rescheduled successfully.'); await loadBooking();
  }
  const format = (value: string) => new Date(value).toLocaleString('en-UG', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Kampala' });

  if (loading) return <main className="booking-panel">Loading secure booking link…</main>;
  if (!booking) return <main className="booking-panel cut-corner"><div className="eyebrow">Booking management</div><h1>Link unavailable</h1><p className="form-error">{message || 'This booking link is not available.'}</p><Link className="button cut-corner" href="/">Return home</Link></main>;

  return <main className="booking-panel cut-corner"><div className="eyebrow">Secure booking management</div><h1>Manage booking</h1><div className="review-card"><span>Reference</span><strong className="accent">{booking.reference}</strong><span>Session</span><strong>{booking.service}</strong><span>Date & time</span><strong>{format(booking.startAt)}</strong><span>Location</span><strong>{booking.location}</strong><span>Status</span><strong><span className="tag">{booking.status}</span></strong></div>{message && <p className={message.includes('success') || message.includes('cancelled') ? 'status-message' : 'form-error'}>{message}</p>}
    {booking.status === 'CONFIRMED' && mode === 'idle' && <div className="flow-actions"><button className="button button--secondary cut-corner" onClick={cancelBooking}>Cancel booking</button><button className="button cut-corner" onClick={startReschedule}>Reschedule</button></div>}
    {booking.status === 'CONFIRMED' && mode === 'reschedule' && <section><h2>Choose a new time</h2><h3 className="booking-subtitle">Available dates</h3><div className="slot-list">{dates.map((item) => <button className={`slot-button ${date === item.date ? 'slot-button--selected' : ''}`} key={item.date} onClick={() => chooseDate(item.date)}>{item.date.slice(0, 10)}</button>)}</div>{date && <><h3 className="booking-subtitle">Available times</h3><div className="slot-list">{slots.map((slot) => <button className={`slot-button ${slotId === slot.id ? 'slot-button--selected' : ''}`} key={slot.id} onClick={() => setSlotId(slot.id)}>{new Date(slot.startAt).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' })} <small>{slot.capacity - slot.bookedCount} left</small></button>)}</div></>}<div className="flow-actions"><button className="button button--secondary cut-corner" onClick={() => setMode('idle')}>Back</button><button className="button cut-corner" disabled={!slotId} onClick={rescheduleBooking}>Confirm new time</button></div></section>}
  </main>;
}
