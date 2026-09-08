import { LegalPage } from '../../components/legal-page';

export const metadata = { title: 'Privacy Policy | Coach Rickie' };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your information"
      title="Privacy Policy"
      intro="This policy explains how Coach Rickie collects and uses personal information when you book a session, manage a booking, or contact the studio."
      sections={[
        {
          title: 'Information we collect',
          content: (
            <p>
              We collect your name, email address, phone number, booking details, contact-form
              message, and records of booking changes. We do not ask for medical or payment details
              through this booking site.
            </p>
          ),
        },
        {
          title: 'Why we use it',
          content: (
            <p>
              We use this information to provide and manage reservations, send booking notices,
              respond to enquiries, prevent misuse, and meet applicable legal obligations. We do not
              sell personal information or use it for behavioural advertising.
            </p>
          ),
        },
        {
          title: 'Sharing and storage',
          content: (
            <p>
              Authorised Coach Rickie administrators and service providers that host our
              application, database, and transactional email may process information only as needed
              to provide the service. Data may be processed outside Uganda with appropriate
              safeguards where required.
            </p>
          ),
        },
        {
          title: 'Your choices and rights',
          content: (
            <p>
              You may ask to access, correct, delete, restrict, or object to the processing of your
              personal information where applicable. You may also withdraw optional consent at any
              time. We will assess requests in line with applicable law and may retain limited
              information where necessary for legitimate operational or legal reasons.
            </p>
          ),
        },
        {
          title: 'Security and retention',
          content: (
            <p>
              We use access controls, secure transport, and signed booking-management links to help
              protect information. No system is completely secure. We retain booking data only for
              as long as needed for scheduling, support, record-keeping, and legal obligations.
            </p>
          ),
        },
      ]}
    />
  );
}
