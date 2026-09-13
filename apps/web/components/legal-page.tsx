import Link from 'next/link';
import type { ReactNode } from 'react';

type LegalSection = { title: string; content: ReactNode };

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__content">
          <Link className="brand" href="/">
            COACH RICKIE<span>.</span>
          </Link>
          <Link className="button cut-corner-sm" href="/book">
            Book session
          </Link>
        </div>
      </header>
      <main className="section">
        <article className="container legal-page">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="section-title">{title}</h1>
          <p className="legal-page__intro text-secondary">{intro}</p>
          <p className="muted">Effective date: 11 September 2026</p>
          {sections.map((section) => (
            <section className="legal-page__section" key={section.title}>
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
          <p className="legal-page__contact">
            Questions or requests? Please use our <Link href="/contact">contact page</Link> or call
            +256 765 463 811.
          </p>
        </article>
      </main>
    </>
  );
}
