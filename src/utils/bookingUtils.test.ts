import { describe, it, expect } from 'vitest';
import { calculateNights, calculateTotalPrice, checkAvailability, validateDates } from './bookingUtils';
import { format, addDays, subDays } from 'date-fns';

describe('bookingUtils', () => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

  describe('calculateNights', () => {
    it('calculates valid multi-night stays correctly', () => {
      // 2026-09-15 to 2026-09-18 = 3 nights
      expect(calculateNights('2026-09-15', '2026-09-18')).toBe(3);
    });

    it('calculates one-night stay', () => {
      expect(calculateNights('2026-09-15', '2026-09-16')).toBe(1);
    });

    it('returns 0 for same-day dates', () => {
      expect(calculateNights('2026-09-15', '2026-09-15')).toBe(0);
    });

    it('returns 0 for checkout before check-in', () => {
      expect(calculateNights('2026-09-18', '2026-09-15')).toBe(0);
    });

    it('returns 0 for empty dates', () => {
      expect(calculateNights('', '')).toBe(0);
    });
  });

  describe('calculateTotalPrice', () => {
    it('calculates standard totals', () => {
      expect(calculateTotalPrice(3, 3500)).toBe(10500);
      expect(calculateTotalPrice(2, 5800)).toBe(11600);
    });
    
    it('returns 0 for zero or negative nights', () => {
      expect(calculateTotalPrice(0, 3500)).toBe(0);
      expect(calculateTotalPrice(-2, 3500)).toBe(0);
    });
  });

  describe('validateDates', () => {
    it('rejects empty dates', () => {
      const errors = validateDates('', '');
      expect(errors.checkIn).toBeDefined();
      expect(errors.checkOut).toBeDefined();
    });

    it('rejects past check-in', () => {
      const errors = validateDates(yesterdayStr, tomorrowStr);
      expect(errors.checkIn).toBeDefined();
    });

    it('accepts today as check-in', () => {
      const errors = validateDates(todayStr, tomorrowStr);
      expect(errors.checkIn).toBeUndefined();
    });

    it('rejects checkout before check-in', () => {
      const errors = validateDates(tomorrowStr, todayStr);
      expect(errors.checkOut).toBeDefined();
    });
  });

  describe('checkAvailability (Bonus)', () => {
    const existingBookings = [
      { roomCode: 'R101', checkIn: '2026-09-15', checkOut: '2026-09-20' }
    ];

    it('allows booking before existing booking', () => {
      expect(checkAvailability('R101', '2026-09-10', '2026-09-15', existingBookings)).toBe(true);
    });

    it('allows booking after existing booking', () => {
      expect(checkAvailability('R101', '2026-09-20', '2026-09-25', existingBookings)).toBe(true);
    });

    it('prevents overlapping bookings', () => {
      // Overlaps start
      expect(checkAvailability('R101', '2026-09-14', '2026-09-16', existingBookings)).toBe(false);
      // Overlaps end
      expect(checkAvailability('R101', '2026-09-19', '2026-09-21', existingBookings)).toBe(false);
      // Contained within
      expect(checkAvailability('R101', '2026-09-16', '2026-09-18', existingBookings)).toBe(false);
      // Surrounds
      expect(checkAvailability('R101', '2026-09-14', '2026-09-21', existingBookings)).toBe(false);
    });
    
    it('ignores overlaps for other rooms', () => {
      expect(checkAvailability('R102', '2026-09-14', '2026-09-16', existingBookings)).toBe(true);
    });
  });
});
