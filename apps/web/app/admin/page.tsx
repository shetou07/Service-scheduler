'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/admin-api';

type Report = {
  bookings: { total: number; confirmed: number; cancelled: number; completed: number };
  utilization: number;
  capacity: { total: number; reserved: number };
};
type Booking = {
  id: string;
  bookingReference: string;
  status: string;
  client: { fullName: string };
  service: { name: string };
  slot: { startAt: string };
};
type WhatsAppQr = {
  status: 'DISABLED' | 'INITIALIZING' | 'WAITING_FOR_QR' | 'READY' | 'DISCONNECTED' | 'ERROR';
  qrDataUrl?: string;
  message?: string;
};

export default function AdminOverviewPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [whatsApp, setWhatsApp] = useState<WhatsAppQr | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    void Promise.all([
      adminFetch<Report>('/admin/reports'),
      adminFetch<Booking[]>('/admin/bookings'),
    ])
      .then(([nextReport, nextBookings]) => {
        setReport(nextReport);
        setBookings(nextBookings.slice(0, 6));
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);
  useEffect(() => {
    let active = true;
    const load = () =>
      adminFetch<WhatsAppQr>('/admin/whatsapp/qr')
        .then((state) => active && setWhatsApp(state))
        .catch(() => undefined);
    load();
    const interval = window.setInterval(load, 5_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);
  return (
    <>
      <header className="admin-header">
        <div>
          <div className="eyebrow">Command center</div>
          <h1>Overview</h1>
          <p className="text-secondary">Live booking capacity and recent reservations.</p>
        </div>
        <Link className="button cut-corner" href="/admin/availability">
          Publish availability
        </Link>
      </header>
      {error && <p className="form-error">{error}</p>}
      {report && (
        <div className="metric-grid">
          <article className="metric-card cut-corner">
            <span>Total bookings</span>
            <strong>{report.bookings.total}</strong>
          </article>
          <article className="metric-card cut-corner">
            <span>Confirmed</span>
            <strong>{report.bookings.confirmed}</strong>
          </article>
          <article className="metric-card cut-corner">
            <span>Open capacity</span>
            <strong>{report.capacity.total - report.capacity.reserved}</strong>
          </article>
          <article className="metric-card cut-corner">
            <span>Utilisation</span>
            <strong>{report.utilization}%</strong>
          </article>
        </div>
      )}
      {whatsApp && (
        <section className="data-panel cut-corner">
          <div className="panel-heading">
            <div>
              <h2>WhatsApp alerts</h2>
              <p className="muted">Status: {whatsApp.status.replaceAll('_', ' ')}</p>
            </div>
          </div>
          {whatsApp.status === 'WAITING_FOR_QR' && whatsApp.qrDataUrl ? (
            <div>
              <p className="text-secondary">
                On +250 792 831 227, open WhatsApp, choose Linked devices, then scan this code.
              </p>
              <img alt="WhatsApp linked-device QR code" src={whatsApp.qrDataUrl} width={360} height={360} />
            </div>
          ) : whatsApp.message ? (
            <p className="form-error">{whatsApp.message}</p>
          ) : (
            <p className="muted">
              {whatsApp.status === 'READY'
                ? 'The studio WhatsApp sender is connected.'
                : 'Waiting for the WhatsApp session to initialise.'}
            </p>
          )}
        </section>
      )}
      <section className="data-panel cut-corner">
        <div className="panel-heading">
          <h2>Recent bookings</h2>
          <Link href="/admin/bookings">View all</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="muted">
            No bookings yet. Publish availability to start accepting reservations.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Athlete</th>
                <th>Service</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="accent">{booking.bookingReference}</td>
                  <td>{booking.client.fullName}</td>
                  <td>{booking.service.name}</td>
                  <td>
                    {new Date(booking.slot.startAt).toLocaleString('en-UG', {
                      timeZone: 'Africa/Kampala',
                    })}
                  </td>
                  <td>
                    <span className="tag">{booking.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
