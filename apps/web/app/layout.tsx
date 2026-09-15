import type { Metadata } from 'next';
import { CookieConsent } from '../components/cookie-consent';
import { SiteFooter } from '../components/site-footer';
import { ThemeToggle } from '../components/theme-toggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coach Rickie | Book a session',
  description: 'Performance training scheduling',
  icons: {
    icon: '/icon.svg',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
        <SiteFooter />
        <CookieConsent />
        <ThemeToggle />
      </body>
    </html>
  );
}
