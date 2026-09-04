import { apiUrl as api } from './api-url';

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${api}${path}`, { ...init, credentials: 'include', headers: { 'content-type': 'application/json', ...init?.headers } });
  const payload = await response.json();
  if (!response.ok) throw new Error(Array.isArray(payload.message) ? payload.message[0] : payload.message || 'Request failed');
  return payload as T;
}
