'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiUrl as api } from '../../lib/api-url';

const initialForm = { fullName: '', email: '', phone: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch(`${api}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
        throw new Error(message || 'We could not send your message. Please call us instead.');
      }
      setForm(initialForm);
      setStatus({ type: 'success', text: 'Thank you — your feedback has been sent. We will get back to you shortly.' });
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'We could not send your message. Please call us instead.' });
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <header className="site-header"><div className="container site-header__content"><Link className="brand" href="/">COACH RICKIE<span>.</span></Link><nav className="site-header__actions" aria-label="Primary navigation"><Link className="header-link" href="/">Home</Link><Link className="button cut-corner-sm" href="/book">Book session</Link></nav></div></header>
    <main className="section">
      <div className="container">
        <div className="eyebrow">Get in touch</div>
        <h1 className="section-title">Contact the studio</h1>
        <p className="contact-intro text-secondary">Call, visit, or leave feedback for the Coach Rickie team. Messages go directly to the company inbox.</p>
        <div className="contact-grid">
          <section className="contact-card cut-corner" aria-labelledby="contact-details-title">
            <h2 id="contact-details-title">Studio details</h2>
            <div className="contact-details">
              <div><span>Call or WhatsApp</span><a href="tel:+256772100200">+256 772 100 200</a></div>
              <div><span>Location</span><p>Coach Rickie Studio<br />Lugogo Bypass, Kampala, Uganda</p></div>
              <div><span>Visiting</span><p>Book a session before visiting so the team can prepare for you.</p></div>
            </div>
            <Link className="button button--secondary cut-corner" href="/book">Book a session</Link>
          </section>
          <section className="contact-card cut-corner" aria-labelledby="feedback-title">
            <h2 id="feedback-title">Send feedback</h2>
            <p className="text-secondary">Tell us what you need, ask a question, or share your experience.</p>
            <form className="contact-form" onSubmit={submit}>
              <label htmlFor="fullName">Full name</label>
              <input className="field" id="fullName" required minLength={2} maxLength={100} value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
              <label htmlFor="email">Email address</label>
              <input className="field" id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <label htmlFor="phone">Phone number <span className="muted">(optional)</span></label>
              <input className="field" id="phone" type="tel" maxLength={40} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              <label htmlFor="message">Message</label>
              <textarea className="field" id="message" required minLength={10} maxLength={3000} rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
              {status && <p className={status.type === 'error' ? 'form-error' : 'status-message'} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
              <button className="button cut-corner" disabled={submitting} type="submit">{submitting ? 'Sending…' : 'Send feedback'}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  </>;
}
