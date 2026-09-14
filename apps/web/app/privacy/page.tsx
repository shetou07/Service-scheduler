import { LegalPage } from '../../components/legal-page';

export const metadata = { title: 'Privacy Policy | Coach Rickie' };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your information"
      title="Privacy Policy"
      intro="This policy explains how Coach Rickie collects and uses personal information when you book a session, request a coach or gym recommendation, manage a booking, or contact the studio."
      sections={[
        {
          title: 'Information we collect',
          content: (
            <p>
              We collect your name, email address, phone number, booking details, coach or gym
              recommendation preferences, contact-form message, and records of booking changes. We
              do not ask for medical or payment details through this booking site.
            </p>
          ),
        },
        {
          title: 'Coach and gym recommendation requests',
          content: (
            <p>
              When you request a coach or gym recommendation, we collect your name, phone number,
              optional email address, preferred gym location, the service you are seeking, and the
              goal you describe. Please do not include medical diagnoses, injuries, disability
              information, or other sensitive health information in this form. It is not a medical
              assessment service.
            </p>
          ),
        },
        {
          title: 'Why we use it',
          content: (
            <p>
              We use this information to provide and manage reservations, send booking notices,
              respond to enquiries and recommendation requests, contact you about the coach, gym, or
              training support you asked for, prevent misuse, and meet applicable legal obligations.
              We do not sell personal information or use it for behavioural advertising.
            </p>
          ),
        },
        {
          title: 'Consent and contact',
          content: (
            <p>
              We process recommendation-request information after you actively tick the consent box
              and submit the form. That consent allows authorised studio staff to contact you by the
              phone number, email address, or other contact method you provide solely about that
              request. You can withdraw your consent or ask us to stop follow-up at any time by
              contacting the studio through the Contact page or on +256 765 463 811. Withdrawal does
              not affect processing already completed before your request.
            </p>
          ),
        },
        {
          title: 'Sharing and storage',
          content: (
            <p>
              Authorised Coach Rickie administrators and service providers that host our
              application, database, transactional email, and WhatsApp messaging providers may
              process information only as needed to provide the service. WhatsApp alerts for new
              bookings and coach or gym recommendation requests are sent only to authorised studio
              administrators through WhatsApp, so they can respond to you. Recommendation alerts
              include the contact details and preferences you choose to submit. WhatsApp/Meta and
              our hosting, database, and email providers may process information on our behalf. Data
              may be processed outside Uganda with appropriate safeguards where required.
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
              protect information. No system is completely secure. We retain recommendation requests
              for up to 12 months after the last interaction, then delete or anonymise them unless a
              longer period is required for a legal obligation, dispute, or an ongoing service
              relationship. We retain booking data only for as long as needed for scheduling,
              support, record-keeping, and legal obligations.
            </p>
          ),
        },
      ]}
    />
  );
}
