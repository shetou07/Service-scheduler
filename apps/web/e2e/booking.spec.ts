import { expect, test } from '@playwright/test';

test('client can progress through an API-backed booking flow', async ({ page }) => {
  await page.route('**/api/services', route => route.fulfill({ json: [{ id: 'pt', name: 'Personal Training', description: 'Focused coaching session.', durationMinutes: 60, priceMinor: 150000 }] }));
  await page.route('**/api/services/pt/available-dates', route => route.fulfill({ json: [{ date: '2027-01-10T00:00:00.000Z' }] }));
  await page.route('**/api/services/pt/slots?date=2027-01-10', route => route.fulfill({ json: [{ id: 'slot-1', startAt: '2027-01-10T07:00:00.000Z', endAt: '2027-01-10T08:00:00.000Z', capacity: 1, bookedCount: 0 }] }));
  await page.route('**/api/bookings', route => route.fulfill({ json: { bookingReference: 'CR-20270110-10000' } }));
  await page.goto('/book?serviceId=pt');
  await page.getByPlaceholder('Full name').fill('Amina Athlete');
  await page.getByPlaceholder('Email address').fill('amina@example.com');
  await page.getByPlaceholder('Phone number').fill('+256700000000');
  await page.getByRole('button', { name: 'Choose time' }).click();
  await page.getByRole('button', { name: /Sunday, 10 January/ }).click();
  await page.getByRole('button', { name: /07:00/ }).click();
  await page.getByRole('button', { name: 'Review booking' }).click();
  await page.getByRole('button', { name: 'Confirm booking' }).click();
  await expect(page.getByText('CR-20270110-10000')).toBeVisible();
});
