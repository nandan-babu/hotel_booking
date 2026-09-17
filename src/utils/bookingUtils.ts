import { parseISO, differenceInDays, startOfDay, isBefore, isAfter, isEqual } from 'date-fns';

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const inDate = startOfDay(parseISO(checkIn));
  const outDate = startOfDay(parseISO(checkOut));
  
  if (isBefore(outDate, inDate) || isEqual(outDate, inDate)) {
    return 0; // Invalid
  }
  
  return differenceInDays(outDate, inDate);
}

export function calculateTotalPrice(nights: number, pricePerNight: number): number {
  return Math.max(0, nights) * pricePerNight;
}

export function checkAvailability(
  roomCode: string,
  checkIn: string,
  checkOut: string,
  existingBookings: { roomCode: string; checkIn: string; checkOut: string }[]
): boolean {
  if (!checkIn || !checkOut) return true;
  
  const requestedIn = startOfDay(parseISO(checkIn));
  const requestedOut = startOfDay(parseISO(checkOut));
  
  // If requested dates are invalid, don't flag as unavailable based on existing bookings
  if (isBefore(requestedOut, requestedIn) || isEqual(requestedOut, requestedIn)) {
    return true; 
  }

  const overlaps = existingBookings.some(booking => {
    if (booking.roomCode !== roomCode) return false;
    
    const existingIn = startOfDay(parseISO(booking.checkIn));
    const existingOut = startOfDay(parseISO(booking.checkOut));
    
    // Check overlap: requested in < existing out AND requested out > existing in
    return isBefore(requestedIn, existingOut) && isAfter(requestedOut, existingIn);
  });
  
  return !overlaps;
}

export function validateDates(checkIn: string, checkOut: string): Record<string, string> {
  const errors: Record<string, string> = {};
  const today = startOfDay(new Date());

  if (!checkIn) {
    errors.checkIn = "Please select a check-in date.";
  } else {
    const inDate = startOfDay(parseISO(checkIn));
    if (isBefore(inDate, today)) {
      errors.checkIn = "Check-in date cannot be in the past.";
    }
  }

  if (!checkOut) {
    errors.checkOut = "Please select a check-out date.";
  } else if (checkIn) {
    const inDate = startOfDay(parseISO(checkIn));
    const outDate = startOfDay(parseISO(checkOut));
    if (isBefore(outDate, inDate) || isEqual(outDate, inDate)) {
      errors.checkOut = "Check-out date must be after check-in.";
    }
  }

  return errors;
}
