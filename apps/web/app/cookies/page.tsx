import { LegalPage } from '../../components/legal-page';

export const metadata = { title: 'Cookie Policy | Coach Rickie' };

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Browser storage"
      title="Cookie Policy"
      intro="This policy explains the small pieces of browser storage used by this website."
      sections={[
        {
          title: 'What we use',
          content: (
            <p>
              The public site currently uses local browser storage to remember your light or dark
              theme and your cookie-preference choice. These are essential preference settings, not
              advertising or analytics trackers.
            </p>
          ),
        },
        {
          title: 'Session cookies',
          content: (
            <p>
              When an administrator signs in, the API uses a secure, HTTP-only session cookie to
              keep the administrator authenticated. It is not readable by website JavaScript and
              expires after the configured session period or when the administrator logs out.
            </p>
          ),
        },
        {
          title: 'Your controls',
          content: (
            <p>
              You can choose essential-only storage in the consent banner or clear browser storage
              at any time through your browser settings. Clearing storage can reset your theme and
              sign you out of the administrator area.
            </p>
          ),
        },
        {
          title: 'Future changes',
          content: (
            <p>
              If we introduce analytics or advertising technology, we will update this policy and
              request consent before enabling non-essential tracking where required.
            </p>
          ),
        },
      ]}
    />
  );
}
