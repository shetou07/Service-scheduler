'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { adminFetch } from '../../../lib/admin-api';

type Availability = { id: string; date: string; status: string; service: { name: string }; slots: { id: string; status: string; bookedCount: number; capacity: number }[] };
const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function CalendarPage() {
  const [items, setItems] = useState<Availability[]>([]);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [error, setError] = useState('');
  useEffect(() => { void adminFetch<Availability[]>('/admin/availability').then(setItems).catch((reason: Error) => setError(reason.message)); }, []);

  const availabilityByDate = useMemo(() => items.reduce<Record<string, Availability[]>>((grouped, item) => {
    const key = item.date.slice(0, 10); (grouped[key] ||= []).push(item); return grouped;
  }, {}), [items]);
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(month.getFullYear(), month.getMonth(), 1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  }, [month]);
  const today = dateKey(new Date());
  const title = month.toLocaleDateString('en-UG', { month: 'long', year: 'numeric' });

  return <>
    <header className="admin-header"><div><div className="eyebrow">Facility timetable</div><h1>Calendar</h1><p className="text-secondary">Select a day to create or review that day&apos;s availability.</p></div><div className="table-actions"><Link className="button cut-corner" href="/admin/availability?mode=bulk">Add many days</Link><Link className="button button--secondary cut-corner" href="/admin/availability">Manage all availability</Link></div></header>
    {error && <p className="form-error" role="alert">{error}</p>}
    <section className="data-panel cut-corner">
      <div className="calendar-toolbar"><button className="button button--secondary cut-corner" type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>Previous</button><h2>{title}</h2><button className="button button--secondary cut-corner" type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>Next</button></div>
      <div className="month-calendar" role="grid" aria-label={`${title} availability calendar`}>{weekdayNames.map((day) => <div className="month-calendar__weekday" role="columnheader" key={day}>{day}</div>)}{days.map((day) => {
        const key = dateKey(day); const availability = availabilityByDate[key] || []; const slots = availability.flatMap((item) => item.slots); const remaining = slots.reduce((total, slot) => total + Math.max(0, slot.capacity - slot.bookedCount), 0); const inMonth = day.getMonth() === month.getMonth();
        return <Link key={key} role="gridcell" className={`month-calendar__day ${inMonth ? '' : 'month-calendar__day--outside'} ${key === today ? 'month-calendar__day--today' : ''}`} href={`/admin/availability?date=${key}`} aria-label={`Manage availability for ${day.toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}><span className="month-calendar__date">{day.getDate()}</span>{availability.length > 0 ? <><span className="month-calendar__count">{availability.length} {availability.length === 1 ? 'service' : 'services'}</span><span className="month-calendar__capacity">{remaining} places left</span></> : <span className="month-calendar__empty">Manage day</span>}</Link>;
      })}</div>
    </section>
  </>;
}
