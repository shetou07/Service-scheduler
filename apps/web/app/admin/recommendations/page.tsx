'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../../lib/admin-api';

type Recommendation = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  gymLocation: string;
  serviceNeed: string;
  goal: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  whatsAppStatus: 'PENDING' | 'SENT' | 'FAILED';
  whatsAppError: string | null;
  createdAt: string;
};

export default function RecommendationsPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setItems(await adminFetch<Recommendation[]>('/admin/recommendations'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load requests');
    }
  };
  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: Recommendation['status']) {
    try {
      await adminFetch(`/admin/recommendations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update request');
    }
  }

  return (
    <main>
      <header className="admin-header">
        <div>
          <div className="eyebrow">Follow-up</div>
          <h1>Coach & gym recommendations</h1>
        </div>
      </header>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <section className="data-panel cut-corner">
        {items.length === 0 ? (
          <p className="muted">No recommendation requests yet.</p>
        ) : (
          <div className="admin-list">
            {items.map((item) => (
              <article className="data-panel cut-corner" key={item.id}>
                <div className="admin-header">
                  <div>
                    <h2>{item.fullName}</h2>
                    <p className="muted">
                      {new Date(item.createdAt).toLocaleString('en-UG', {
                        timeZone: 'Africa/Kampala',
                      })}
                    </p>
                  </div>
                  <span className="tag">{item.status}</span>
                </div>
                <p>
                  <strong>Phone:</strong> <a href={`tel:${item.phone}`}>{item.phone}</a>
                  {item.email ? (
                    <>
                      {' '}
                      · <a href={`mailto:${item.email}`}>{item.email}</a>
                    </>
                  ) : null}
                </p>
                <p>
                  <strong>Preferred area:</strong> {item.gymLocation}
                </p>
                <p>
                  <strong>Needs:</strong> {item.serviceNeed}
                </p>
                <p>
                  <strong>Goal:</strong> {item.goal}
                </p>
                <p className="muted">
                  WhatsApp: {item.whatsAppStatus}
                  {item.whatsAppError ? ` — ${item.whatsAppError}` : ''}
                </p>
                <div className="flow-actions">
                  {(['NEW', 'CONTACTED', 'CLOSED'] as const).map((status) => (
                    <button
                      className="button button--secondary cut-corner"
                      disabled={item.status === status}
                      key={status}
                      onClick={() => void updateStatus(item.id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
