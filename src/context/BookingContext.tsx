import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parseISO, startOfDay, isBefore, isAfter, isEqual } from 'date-fns';

export interface BookingRecord {
  id: string;
  roomCode: string;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: 'confirmed' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  removeBooking: (id: string) => void;
  getTotalBookings: () => number;
  getUpcomingBookings: () => BookingRecord[];
  getActiveBookings: () => BookingRecord[];
  getCompletedBookings: () => BookingRecord[];
  getTotalRevenue: () => number;
  getOccupiedRooms: () => string[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'raintech_hotel_bookings';

const getStatus = (checkIn: string, checkOut: string): BookingRecord['status'] => {
  const today = startOfDay(new Date());
  const inDate = startOfDay(parseISO(checkIn));
  const outDate = startOfDay(parseISO(checkOut));

  if (isBefore(outDate, today) || isEqual(outDate, today)) return 'completed';
  if ((isBefore(inDate, today) || isEqual(inDate, today)) && isAfter(outDate, today)) return 'active';
  return 'upcoming';
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback((booking: BookingRecord) => {
    const withStatus = { ...booking, status: getStatus(booking.checkIn, booking.checkOut) };
    setBookings(prev => [withStatus, ...prev]);
  }, []);

  const removeBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const getTotalBookings = useCallback(() => bookings.length, [bookings]);

  const getActiveBookings = useCallback(() => {
    const today = startOfDay(new Date());
    return bookings.filter(b => {
      const inDate = startOfDay(parseISO(b.checkIn));
      const outDate = startOfDay(parseISO(b.checkOut));
      return (isBefore(inDate, today) || isEqual(inDate, today)) && isAfter(outDate, today);
    });
  }, [bookings]);

  const getUpcomingBookings = useCallback(() => {
    const today = startOfDay(new Date());
    return bookings.filter(b => isAfter(startOfDay(parseISO(b.checkIn)), today));
  }, [bookings]);

  const getCompletedBookings = useCallback(() => {
    const today = startOfDay(new Date());
    return bookings.filter(b => {
      const outDate = startOfDay(parseISO(b.checkOut));
      return isBefore(outDate, today) || isEqual(outDate, today);
    });
  }, [bookings]);

  const getTotalRevenue = useCallback(() =>
    bookings.reduce((sum, b) => sum + b.totalPrice, 0), [bookings]);

  const getOccupiedRooms = useCallback(() => {
    const today = startOfDay(new Date());
    const occupied = new Set<string>();
    bookings.forEach(b => {
      const inDate = startOfDay(parseISO(b.checkIn));
      const outDate = startOfDay(parseISO(b.checkOut));
      if ((isBefore(inDate, today) || isEqual(inDate, today)) && isAfter(outDate, today)) {
        occupied.add(b.roomCode);
      }
    });
    return Array.from(occupied);
  }, [bookings]);

  return (
    <BookingContext.Provider value={{
      bookings, addBooking, removeBooking,
      getTotalBookings, getUpcomingBookings, getActiveBookings,
      getCompletedBookings, getTotalRevenue, getOccupiedRooms
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = (): BookingContextType => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
};
