'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const consentKey = 'coach-rickie-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(consentKey));
  }, []);

  function saveChoice(choice: 'accepted' | 'necessary') {
    window.localStorage.setItem(consentKey, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Cookie preferences" role="dialog">
      <div>
        <strong>Your privacy choices</strong>
        <p>
          We use essential storage to remember your theme and this choice. We do not use advertising
          cookies. Read our <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button
          className="button button--secondary cut-corner-sm"
          onClick={() => saveChoice('necessary')}
        >
          Essential only
        </button>
        <button className="button cut-corner-sm" onClick={() => saveChoice('accepted')}>
          Accept
        </button>
      </div>
    </section>
  );
}
