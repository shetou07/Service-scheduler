import Link from 'next/link';

export const metadata = {
  title: 'About Coach Rickie | Rickie Fitness',
  description:
    'Learn about Coach Rickie, the fitness coach, entrepreneur, and community advocate building a fitter, stronger and more active Uganda.',
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
              <div className="eyebrow">About Coach Rickie</div>
              <h1>
                Building a Fitter, Stronger and More Active <span className="accent">Uganda.</span>
              </h1>
              <p className="text-secondary">
                Coach Rickie is a Ugandan fitness coach, entrepreneur, lifestyle influencer, and
                community fitness advocate with more than 15 years of experience in the fitness
                industry.
              </p>
              <Link className="button cut-corner" href="/book">
                Train with Coach Rickie
              </Link>
            </div>
            <figure className="about-photo about-photo--hero cut-corner">
              <img
                src="/images/coach-rickie-award.jpg"
                alt="Coach Rickie receiving the 2024 Pulse Africa Lifestyle Influencer of the Year award"
              />
            </figure>
          </div>
        </section>

        <section className="section">
          <div className="container about-story">
            <div>
              <div className="eyebrow">The story</div>
              <h2 className="section-title">Fitness for every Ugandan</h2>
            </div>
            <div className="about-copy">
              <p className="text-secondary">
                He is the Founder and CEO of Rickie Fitness, a fitness company established in 2023
                with a vision to make fitness more accessible, enjoyable, and community-driven.
                Through group workouts, fitness events, seminars, community initiatives, and
                educational programs, Rickie Fitness continues to create opportunities for people
                from different backgrounds to become more active and take better care of their
                health.
              </p>
              <p className="text-secondary">
                Coach Rickie believes that fitness is more than lifting weights or changing how you
                look—it is about building healthier communities and improving the quality of life.
                His approach combines exercise, education, community, and entertainment to make
                fitness something people can genuinely enjoy and sustain.
              </p>
              <p className="text-secondary">
                Over the years, Coach Rickie has become an active voice in Uganda&apos;s fitness
                movement. He has travelled across Africa and Europe on gym tours, visiting
                different fitness facilities, meeting coaches and gym owners, experiencing
                different approaches to fitness, and using those experiences to contribute to the
                growth of the industry back home.
              </p>
              <p className="text-secondary">
                His experience also extends behind the scenes. Coach Rickie has been involved in
                the setup, development, and running of different gyms in Uganda, giving him a
                practical understanding of what it takes to build and operate successful fitness
                spaces.
              </p>
            </div>
          </div>
        </section>

        <section className="section split-section">
          <div className="container feature-split about-recognition">
            <figure className="about-photo about-photo--support cut-corner">
              <img
                src="/images/coach-rickie-award-smile.jpg"
                alt="Coach Rickie with the 2024 Pulse Africa Lifestyle Influencer of the Year award"
              />
            </figure>
            <div className="about-copy">
              <div className="eyebrow">Recognition</div>
              <h2 className="section-title">A voice for fitness</h2>
              <p className="text-secondary">
                His contribution to lifestyle and fitness has also received recognition. In 2024,
                Coach Rickie was named a Pulse Africa Award winner for Lifestyle Influencer of the
                Year, recognizing his influence in the lifestyle space and his work connecting
                fitness with a wider audience.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container about-story">
            <div>
              <div className="eyebrow">Beyond Fitness</div>
              <h2 className="section-title">New ways to release and reconnect</h2>
            </div>
            <div className="about-copy">
              <p className="text-secondary">
                Coach Rickie&apos;s entrepreneurial journey has also expanded beyond traditional
                fitness.
              </p>
              <p className="text-secondary">
                He is the Founder and CEO of Rickie Smash Room, a controlled and safety-focused
                entertainment experience designed to give individuals and groups a unique way to
                release stress and frustration through structured smash activities. The concept
                introduces a new form of recreational entertainment to Uganda and is positioned as
                the country&apos;s first rage/smash room.
              </p>
            </div>
          </div>
        </section>

        <section className="section split-section">
          <div className="container">
            <div className="cta-band cut-corner about-vision">
              <div className="eyebrow">The Vision</div>
              <h2>A healthier, stronger, and more active Uganda.</h2>
              <div className="about-copy">
                <p className="text-secondary">
                  Coach Rickie&apos;s work is driven by one bigger purpose: to contribute to a
                  healthier, stronger, and more active Uganda.
                </p>
                <p className="text-secondary">
                  From gyms and group workouts to community initiatives, fitness education,
                  events, media, and new wellness experiences, he continues to look for innovative
                  ways to bring people together through fitness.
                </p>
                <p className="text-secondary about-vision__closing">
                  This is more than a career for Coach Rickie. It is a movement.
                </p>
              </div>
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
