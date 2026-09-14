import { LegalPage } from '../../components/legal-page';

export const metadata = { title: 'Terms and Conditions | Coach Rickie' };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Booking rules"
      title="Terms and Conditions"
      intro="These terms apply when you use the Coach Rickie scheduling website or reserve a session."
      sections={[
        {
          title: 'Bookings and availability',
          content: (
            <p>
              A booking is confirmed only after the system returns a booking reference.
              Availability, capacity, times, services, and prices can change before confirmation.
              Please ensure your details and selected session are correct before confirming.
            </p>
          ),
        },
        {
          title: 'Changes and cancellation',
          content: (
            <p>
              You may cancel or reschedule through your secure booking-management link until 24
              hours before the appointment. After that time, contact the studio; any exception is at
              the administrator&apos;s discretion. Cancellation releases the reservation but does
              not erase the booking record automatically.
            </p>
          ),
        },
        {
          title: 'Coach and gym recommendations',
          content: (
            <p>
              A recommendation request is an enquiry, not a booking, medical assessment, guarantee
              of placement, endorsement, or promise that a particular coach, gym, price, result, or
              availability will be provided. Any training, gym, or coach arrangement is subject to
              your own assessment and any separate terms agreed with the relevant provider.
            </p>
          ),
        },
        {
          title: 'Attendance and conduct',
          content: (
            <p>
              Arrive ready and on time, follow staff safety instructions, and treat people and
              property respectfully. Coach Rickie may refuse or end a session where safety, conduct,
              or capacity requires it.
            </p>
          ),
        },
        {
          title: 'Smash Room notice',
          content: (
            <p>
              The Smash Room is entertainment only and is not a medical, mental-health, diagnostic,
              or therapeutic service. If you need medical or mental-health care, seek assistance
              from a licensed professional.
            </p>
          ),
        },
        {
          title: 'Changes to these terms',
          content: (
            <p>
              We may update these terms to reflect service, operational, or legal changes. The
              effective date above shows when they were last updated. Continued use after an update
              means you accept the revised terms where permitted by law.
            </p>
          ),
        },
      ]}
    />
  );
}
