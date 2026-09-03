'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminLoginPage() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function login(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const response = await fetch(`${api}/auth/login`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to sign in.'); const next = new URLSearchParams(window.location.search).get('next'); router.replace(next?.startsWith('/admin') ? next : '/admin'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in.'); } finally { setLoading(false); } }
  return <main className="booking-panel cut-corner"><div className="eyebrow">Coach operations</div><h1>Admin sign in</h1><p className="text-secondary">Use your approved administrator account to manage services and schedule availability.</p>{error && <p className="form-error">{error}</p>}<form onSubmit={login}><input className="field" required type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} /><input className="field" required minLength={8} type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="button cut-corner" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
