'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '../../../lib/admin-api';

type Service = { id: string; name: string };
type Availability = { id: string; date: string; startTime: string; endTime: string; status: string; capacity: number; slotDuration: number; service: { name: string }; slots: { id: string; status: string; bookedCount: number; capacity: number }[] };
type BulkForm = { serviceId: string; startDate: string; endDate: string; weekdays: number[]; startTime: string; endTime: string; slotDuration: number; capacity: number; publish: boolean };
type BulkPreview = { matchingDates: string[]; creatableDates: string[]; skipped: { date: string; reason: string }[]; slotsPerDay: number; appointmentsPerDay: number };
type BulkResult = { createdDates: string[]; skipped: { date: string; reason: string }[]; slotsPerDay: number; appointmentsPerDay: number };
const initialForm = { serviceId: '', date: '', startTime: '08:00', endTime: '12:00', slotDuration: 60, capacity: 1, publish: true };
const initialBulkForm: BulkForm = { serviceId: '', startDate: '', endDate: '', weekdays: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '12:00', slotDuration: 60, capacity: 1, publish: true };
const weekdays = [{ value: 1, label: 'Mon' }, { value: 2, label: 'Tue' }, { value: 3, label: 'Wed' }, { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' }, { value: 6, label: 'Sat' }, { value: 0, label: 'Sun' }];
const validDate = (value: string | null) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

export default function Availability() {
  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<Availability[]>([]);
  const [form, setForm] = useState(initialForm);
  const [bulkForm, setBulkForm] = useState(initialBulkForm);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkPreview, setBulkPreview] = useState<BulkPreview | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateReady, setDateReady] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const load = (date = selectedDate) => adminFetch<Availability[]>(`/admin/availability${date ? `?date=${encodeURIComponent(date)}` : ''}`).then(setItems).catch((reason: Error) => setError(reason.message));

  useEffect(() => {
    const query = new URLSearchParams(window.location.search); const date = query.get('date');
    if (query.get('mode') === 'bulk') setMode('bulk');
    if (validDate(date)) { setSelectedDate(date!); setForm((current) => ({ ...current, date: date! })); }
    adminFetch<Service[]>('/admin/services').then((loaded) => setServices(loaded)).catch((reason: Error) => setError(reason.message));
    setDateReady(true);
  }, []);
  useEffect(() => { if (dateReady) void load(); }, [dateReady, selectedDate]);
  useEffect(() => { if (services[0]) { setForm((current) => current.serviceId ? current : { ...current, serviceId: services[0].id }); setBulkForm((current) => current.serviceId ? current : { ...current, serviceId: services[0].id }); } }, [services]);

  const preview = useMemo(() => {
    const [startHour, startMinute] = form.startTime.split(':').map(Number); const [endHour, endMinute] = form.endTime.split(':').map(Number); const minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes % form.slotDuration !== 0) return null; const slots = minutes / form.slotDuration; return { slots, appointments: slots * form.capacity };
  }, [form.capacity, form.endTime, form.slotDuration, form.startTime]);

  function updateBulk(next: Partial<BulkForm>) { setBulkPreview(null); setBulkResult(null); setBulkForm((current) => ({ ...current, ...next })); }
  function toggleWeekday(day: number) { updateBulk({ weekdays: bulkForm.weekdays.includes(day) ? bulkForm.weekdays.filter((item) => item !== day) : [...bulkForm.weekdays, day].sort() }); }
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { await adminFetch('/admin/availability', { method: 'POST', body: JSON.stringify(form) }); setSelectedDate(form.date); await load(form.date); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save availability'); } finally { setSaving(false); } }
  async function previewBulk(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { setBulkResult(null); setBulkPreview(await adminFetch<BulkPreview>('/admin/availability/bulk-preview', { method: 'POST', body: JSON.stringify(bulkForm) })); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to preview bulk availability'); } finally { setSaving(false); } }
  async function publishBulk() { if (!bulkPreview) return; setSaving(true); setError(''); try { const result = await adminFetch<BulkResult>('/admin/availability/bulk', { method: 'POST', body: JSON.stringify(bulkForm) }); setBulkResult(result); setBulkPreview(null); setSelectedDate(''); await load(''); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to publish bulk availability'); } finally { setSaving(false); } }

  const selectedLabel = selectedDate ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'All dates';
  return <>
    <header className="admin-header"><div><div className="eyebrow">Supply management</div><h1>Availability</h1><p className="text-secondary">Managing: {selectedLabel}</p></div><Link className="button button--secondary cut-corner" href="/admin/calendar">Back to calendar</Link></header>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="table-actions"><button className={`button ${mode === 'single' ? '' : 'button--secondary'} cut-corner`} type="button" onClick={() => setMode('single')}>One day</button><button className={`button ${mode === 'bulk' ? '' : 'button--secondary'} cut-corner`} type="button" onClick={() => setMode('bulk')}>Many days</button></div>
    {mode === 'single' ? <section className="data-panel cut-corner"><h2>Create availability for one day</h2><p className="text-secondary">Choose the session length and the number of athletes allowed in each session. The system generates the actual booking slots.</p><form onSubmit={submit}>
      <label>Service<select className="field" required value={form.serviceId} onChange={(event) => setForm({ ...form, serviceId: event.target.value })}>{services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label>
      <label>Date<input className="field" required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>Start time<input className="field" required type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></label><label>End time<input className="field" required type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} /></label><label>Length of each slot (minutes)<input className="field" required type="number" min="5" step="5" value={form.slotDuration} onChange={(event) => setForm({ ...form, slotDuration: Number(event.target.value) })} /></label><label>Clients allowed per slot<input className="field" required type="number" min="1" step="1" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })} /></label>
      {preview ? <p className="text-secondary" aria-live="polite">This will publish <strong>{preview.slots} booking {preview.slots === 1 ? 'slot' : 'slots'}</strong> with <strong>{preview.appointments} total appointment {preview.appointments === 1 ? 'place' : 'places'}</strong>.</p> : <p className="form-error" role="status">The time range must divide evenly into the selected slot length.</p>}<button className="button cut-corner" disabled={saving || !preview}>{saving ? 'Publishing...' : 'Publish slots'}</button>
    </form></section> : <section className="data-panel cut-corner"><h2>Create availability for many days</h2><p className="text-secondary">Apply one timetable to selected weekdays in an inclusive date range. Existing overlapping availability is skipped and left unchanged.</p><form onSubmit={previewBulk}>
      <label>Service<select className="field" required value={bulkForm.serviceId} onChange={(event) => updateBulk({ serviceId: event.target.value })}>{services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label>
      <label>Start date<input className="field" required type="date" value={bulkForm.startDate} onChange={(event) => updateBulk({ startDate: event.target.value })} /></label><label>End date<input className="field" required type="date" value={bulkForm.endDate} onChange={(event) => updateBulk({ endDate: event.target.value })} /></label>
      <fieldset className="weekday-picker"><legend>Repeat on</legend><div>{weekdays.map((day) => <button className={`weekday-picker__day ${bulkForm.weekdays.includes(day.value) ? 'weekday-picker__day--selected' : ''}`} type="button" aria-pressed={bulkForm.weekdays.includes(day.value)} onClick={() => toggleWeekday(day.value)} key={day.value}>{day.label}</button>)}</div></fieldset>
      <label>Start time<input className="field" required type="time" value={bulkForm.startTime} onChange={(event) => updateBulk({ startTime: event.target.value })} /></label><label>End time<input className="field" required type="time" value={bulkForm.endTime} onChange={(event) => updateBulk({ endTime: event.target.value })} /></label><label>Length of each slot (minutes)<input className="field" required type="number" min="5" step="5" value={bulkForm.slotDuration} onChange={(event) => updateBulk({ slotDuration: Number(event.target.value) })} /></label><label>Clients allowed per slot<input className="field" required type="number" min="1" step="1" value={bulkForm.capacity} onChange={(event) => updateBulk({ capacity: Number(event.target.value) })} /></label>
      <button className="button cut-corner" disabled={saving || !bulkForm.weekdays.length}>{saving ? 'Checking...' : 'Preview availability'}</button>
    </form>{bulkPreview && <div className="bulk-preview" aria-live="polite"><h3>Ready to publish</h3><p><strong>{bulkPreview.creatableDates.length}</strong> of {bulkPreview.matchingDates.length} matching days can be created. Each day has {bulkPreview.slotsPerDay} slots and {bulkPreview.appointmentsPerDay} appointment places.</p>{bulkPreview.skipped.length > 0 && <p className="form-error">Skipped: {bulkPreview.skipped.map((item) => item.date).join(', ')}. These dates overlap existing availability.</p>}<button className="button cut-corner" type="button" disabled={saving || bulkPreview.creatableDates.length === 0} onClick={() => void publishBulk()}>{saving ? 'Publishing...' : `Publish ${bulkPreview.creatableDates.length} days`}</button></div>}{bulkResult && <p className="status-message" role="status">Published availability for {bulkResult.createdDates.length} days.{bulkResult.skipped.length > 0 ? ` ${bulkResult.skipped.length} dates were skipped.` : ''}</p>}</section>}
    <section className="data-panel cut-corner"><div className="panel-heading"><h2>{selectedDate ? 'Availability on selected day' : 'All availability'}</h2>{selectedDate && <Link href="/admin/availability">Clear date filter</Link>}</div><table className="data-table"><thead><tr><th>Service</th><th>Date</th><th>Range</th><th>Slot length</th><th>Slots</th><th>Capacity</th><th>Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.service.name}</td><td>{item.date.slice(0, 10)}</td><td>{item.startTime}-{item.endTime}</td><td>{item.slotDuration} min</td><td>{item.slots.length}</td><td>{item.slots.reduce((total, slot) => total + slot.capacity, 0)} places</td><td><span className="tag">{item.status}</span></td></tr>)}</tbody></table>{items.length === 0 && <p className="muted">No availability has been created for this day.</p>}</section>
  </>;
}
