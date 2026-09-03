import { ServiceStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SchedulingService } from './scheduling.service';

describe('SchedulingService bulk availability', () => {
  const db = {
    service: { findUnique: jest.fn() },
    availability: { findMany: jest.fn() },
  } as unknown as PrismaService;
  const input = { serviceId: 'service-1', startDate: '2026-09-07', endDate: '2026-09-13', weekdays: [1, 3, 5], startTime: '08:00', endTime: '12:00', slotDuration: 60, capacity: 2, publish: true };

  beforeEach(() => {
    jest.clearAllMocks();
    db.service.findUnique = jest.fn().mockResolvedValue({ id: 'service-1', status: ServiceStatus.ACTIVE });
  });

  it('expands selected weekdays and reports overlapping dates as skipped', async () => {
    db.availability.findMany = jest.fn().mockResolvedValue([{ date: new Date('2026-09-09T00:00:00.000Z'), startTime: '09:00', endTime: '10:00' }]);
    const result = await new SchedulingService(db).previewBulkAvailability(input);
    expect(result.matchingDates).toEqual(['2026-09-07', '2026-09-09', '2026-09-11']);
    expect(result.creatableDates).toEqual(['2026-09-07', '2026-09-11']);
    expect(result.skipped).toEqual([{ date: '2026-09-09', reason: 'Overlaps existing availability for this service' }]);
    expect(result.slotsPerDay).toBe(4);
    expect(result.appointmentsPerDay).toBe(8);
  });

  it('rejects a date range that ends before it begins', async () => {
    await expect(new SchedulingService(db).previewBulkAvailability({ ...input, startDate: '2026-09-13', endDate: '2026-09-07' })).rejects.toThrow('End date must be on or after start date');
  });
});
