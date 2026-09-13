import Link from 'next/link';

export const metadata = {
  title: 'About Coach Rickie | Performance Studio',
  description: 'Learn about Coach Rickie Performance Studio in Kampala.',
};

export default function AboutPage() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__content">
          <Link className="brand" href="/">
            COACH RICKIE<span>.</span>
          </Link>
          <nav className="site-header__actions" aria-label="Primary navigation">
            <Link className="header-link" href="/contact">
              Contact
            </Link>
            <Link className="button cut-corner-sm" href="/book">
              Book session
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <section className="about-hero bg-grid-pattern">
          <div className="container about-hero__content">
            <div>
              <div className="eyebrow">Coach Rickie Performance Studio</div>
              <h1>
                Train with purpose.
                <br />
                <span className="accent">Show up stronger.</span>
              </h1>
              <p className="text-secondary">
                Coach Rickie is a Kampala performance space for people who want structure,
                accountability, and a practical path toward their goals.
              </p>
              <Link className="button cut-corner" href="/book">
                Find a session
              </Link>
            </div>
            <div className="about-hero__image cut-corner" role="img" aria-label="Coach Rickie" />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="eyebrow">What we do</div>
            <h2 className="section-title">A space built for progress</h2>
            <div className="protocol-grid">
              <article className="protocol-card cut-corner">
                <div className="protocol-card__number">01</div>
                <h3>Personal training</h3>
                <p className="text-secondary">
                  Focused coaching sessions built around the athlete and the work that matters most.
                </p>
              </article>
              <article className="protocol-card cut-corner">
                <div className="protocol-card__number">02</div>
                <h3>Group training</h3>
                <p className="text-secondary">
                  Shared energy, disciplined programming, and live capacity-managed sessions.
                </p>
              </article>
              <article className="protocol-card cut-corner">
                <div className="protocol-card__number">03</div>
                <h3>Team experiences</h3>
                <p className="text-secondary">
                  Team building and the Smash Room give groups a memorable way to move together.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section split-section">
          <div className="container feature-split">
            <div>
              <div className="eyebrow">Our approach</div>
              <h2 className="section-title">Simple, prepared, accountable</h2>
              <p className="text-secondary">
                Every session begins with a clear booking. Live availability means the team can
                prepare for you, and a secure booking link makes it easy to manage your plans.
              </p>
              <p className="text-secondary">
                Whether you are building strength, training with a group, or planning a team day,
                the focus stays the same: arrive ready, put in the work, and leave better than you
                came.
              </p>
            </div>
            <aside className="feature-stamp feature-stamp--quiet cut-corner">
              <span>CR</span>
              <small>Kampala performance</small>
            </aside>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-band cut-corner">
              <div className="eyebrow">Ready when you are</div>
              <h2>Make your next session count.</h2>
              <p className="text-secondary">
                Choose a service and reserve from the live timetable, or contact the team to plan
                your visit.
              </p>
              <div className="hero__actions">
                <Link className="button cut-corner" href="/book">
                  Book a session
                </Link>
                <Link className="button button--secondary cut-corner" href="/contact">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
