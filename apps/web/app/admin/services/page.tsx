'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '../../../lib/admin-api';

type ServiceStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
type Service = { id: string; name: string; description: string; durationMinutes: number; priceMinor: number; status: ServiceStatus };
type ServiceForm = Omit<Service, 'id' | 'status'> & { status?: ServiceStatus };
const emptyForm: ServiceForm = { name: '', description: '', durationMinutes: 60, priceMinor: 0 };

export default function Services() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editing, setEditing] = useState<Service | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const load = async () => {
    try { setItems(await adminFetch<Service[]>('/admin/services')); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load services'); }
  };

  useEffect(() => { void load(); }, []);

  async function createService(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try { await adminFetch('/admin/services', { method: 'POST', body: JSON.stringify(form) }); setForm(emptyForm); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create service'); }
    finally { setSaving(false); }
  }

  async function updateService(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const { id, ...changes } = editing;
    try { await adminFetch(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }); setEditing(null); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update service'); }
    finally { setSaving(false); }
  }

  async function deleteService(service: Service) {
    if (!window.confirm(`Delete ${service.name}? It will be removed from public booking, but existing booking history will be kept.`)) return;
    setSaving(true); setError('');
    try {
      await adminFetch(`/admin/services/${service.id}`, { method: 'DELETE' });
      if (editing?.id === service.id) setEditing(null);
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to delete service'); }
    finally { setSaving(false); }
  }

  return <>
    <header className="admin-header"><div><div className="eyebrow">Catalogue</div><h1>Services</h1></div></header>
    {error && <p className="form-error" role="alert">{error}</p>}
    <section className="data-panel cut-corner">
      <h2>Add a service</h2>
      <form onSubmit={createService}>
        <label>Service name<input className="field" required minLength={2} placeholder="e.g. Speed development" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Description<input className="field" required minLength={5} placeholder="Brief description shown to athletes" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <label>Session length (minutes)<input className="field" required type="number" min="5" step="5" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })} /></label>
        <label>Price per session (UGX)<input className="field" required type="number" min="0" step="1" value={form.priceMinor} onChange={(event) => setForm({ ...form, priceMinor: Number(event.target.value) })} /></label>
        <button className="button cut-corner" disabled={saving}>{saving ? 'Saving...' : 'Add service'}</button>
      </form>
    </section>
    {editing && <section className="data-panel cut-corner">
      <div className="admin-header"><div><div className="eyebrow">Editing catalogue item</div><h2>Edit {editing.name}</h2></div></div>
      <form onSubmit={updateService}>
        <label>Service name<input className="field" required minLength={2} value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label>
        <label>Description<input className="field" required minLength={5} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
        <label>Session length (minutes)<input className="field" required type="number" min="5" step="5" value={editing.durationMinutes} onChange={(event) => setEditing({ ...editing, durationMinutes: Number(event.target.value) })} /></label>
        <label>Price per session (UGX)<input className="field" required type="number" min="0" step="1" value={editing.priceMinor} onChange={(event) => setEditing({ ...editing, priceMinor: Number(event.target.value) })} /></label>
        <label>Availability<select className="field" value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as ServiceStatus })}><option value="ACTIVE">Active — visible to clients</option><option value="INACTIVE">Inactive — hidden from clients</option><option value="ARCHIVED">Archived — retained for history</option></select></label>
        <div className="flow-actions"><button type="button" className="button button--secondary cut-corner" disabled={saving} onClick={() => setEditing(null)}>Cancel</button><button className="button cut-corner" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </section>}
    <section className="data-panel cut-corner">
      <h2>Current services</h2>
      <table className="data-table"><thead><tr><th>Name</th><th>Duration</th><th>Price per session</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map((service) => <tr key={service.id}><td><strong>{service.name}</strong><br /><span className="muted">{service.description}</span></td><td>{service.durationMinutes} min</td><td>UGX {service.priceMinor.toLocaleString()}</td><td><span className="tag">{service.status}</span></td><td><div className="table-actions"><button type="button" className="button button--secondary cut-corner" disabled={saving} onClick={() => setEditing({ ...service })}>Edit</button>{service.status !== 'ARCHIVED' && <button type="button" className="button button--secondary cut-corner" disabled={saving} onClick={() => void deleteService(service)}>Delete</button>}</div></td></tr>)}</tbody></table>
    </section>
  </>;
}
