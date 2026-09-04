'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiUrl as api } from '../../lib/api-url';

const nav = [{ href: '/admin', label: 'Overview' }, { href: '/admin/bookings', label: 'Bookings' }, { href: '/admin/calendar', label: 'Calendar' }, { href: '/admin/availability', label: 'Availability' }, { href: '/admin/services', label: 'Services' }, { href: '/admin/clients', label: 'Athletes' }, { href: '/admin/reports', label: 'Reports' }];
type Admin = { name: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname(); const [admin, setAdmin] = useState<Admin | null>(null);
  useEffect(() => { if (pathname === '/admin/login') return; fetch(`${api}/auth/me`, { credentials: 'include' }).then(async (response) => { if (!response.ok) throw new Error(); return response.json(); }).then(setAdmin).catch(() => { router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`); }); }, [pathname, router]);
  if (pathname === '/admin/login') return <>{children}</>;
  if (!admin) return <main className="booking-panel">Checking secure admin session…</main>;
  return <div className="admin-layout"><aside className="admin-sidebar"><Link className="brand" href="/">COACH RICKIE<span>.</span></Link><div><div className="eyebrow">{admin.role}</div><strong>{admin.name}</strong><p className="muted">{admin.email}</p></div><nav className="admin-nav">{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><button className="button button--secondary cut-corner" onClick={async () => { try { await fetch(`${api}/auth/logout`, { method: 'POST', credentials: 'include' }); } finally { router.replace('/'); } }}>Log out</button></aside><section className="admin-content">{children}</section></div>;
}
