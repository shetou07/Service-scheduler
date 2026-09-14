'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiUrl as api } from '../../lib/api-url';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  gymLocation: '',
  serviceNeed: '',
  goal: '',
  privacyAccepted: false,
};

export default function CoachGymRecommendationPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${api}/recommendations`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(
          Array.isArray(payload.message) ? payload.message[0] : payload.message || 'Request failed',
        );
      setForm(initialForm);
      setMessage(
        'Your request is in. Coach Rickie will contact you using the phone number provided.',
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to send your request. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="section">
      <div className="container booking-panel cut-corner">
        <Link className="header-link" href="/">
          ← Back to home
        </Link>
        <div className="eyebrow">Personalised guidance</div>
        <h1>Coach and Gym recommendation</h1>
        <p className="text-secondary">
          Tell us where you would like to train and what you want to achieve. We will recommend a
          suitable coach, gym, or next step and contact you directly.
        </p>
        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit}>
          <label>
            Full name
            <input
              className="field"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>
          <label>
            Phone number
            <input
              className="field"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Email address <span className="muted">(optional)</span>
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Preferred gym location
            <input
              className="field"
              required
              placeholder="For example: Ntinda, Kololo, Makindye"
              value={form.gymLocation}
              onChange={(e) => setForm({ ...form, gymLocation: e.target.value })}
            />
          </label>
          <label>
            Service or support needed
            <input
              className="field"
              required
              placeholder="For example: personal trainer, weight-loss plan, strength coach"
              value={form.serviceNeed}
              onChange={(e) => setForm({ ...form, serviceNeed: e.target.value })}
            />
          </label>
          <label>
            Your goal
            <textarea
              className="field"
              required
              rows={5}
              placeholder="Tell us what you want to achieve."
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />
          </label>
          <label className="consent-field">
            <input
              type="checkbox"
              checked={form.privacyAccepted}
              onChange={(e) => setForm({ ...form, privacyAccepted: e.target.checked })}
              required
            />
            <span>
              I consent to Coach Rickie using these details to contact me about my request, as
              described in the <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
          <button className="button cut-corner" disabled={saving}>
            {saving ? 'Sending request...' : 'Request a recommendation'}
          </button>
        </form>
      </div>
    </main>
  );
}
