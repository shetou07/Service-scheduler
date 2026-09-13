import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <p>© {new Date().getFullYear()} Coach Rickie. Kampala, Uganda.</p>
        <nav aria-label="Legal information">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
