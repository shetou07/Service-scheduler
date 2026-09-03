import type { Metadata } from 'next';
import { ThemeToggle } from '../components/theme-toggle';
import './globals.css';

export const metadata: Metadata = { title: 'Coach Rickie | Book a session', description: 'Performance training scheduling' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><div className="app-shell">{children}</div><ThemeToggle /></body></html>; }
