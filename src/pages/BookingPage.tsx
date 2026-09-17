import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingSearch } from '../components/BookingSearch';
import { RoomCard } from '../components/RoomCard';
import { GuestFilter } from '../components/GuestFilter';
import { BookingSummary } from '../components/BookingSummary';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { ROOMS, Room } from '../data/rooms';
import { calculateNights, calculateTotalPrice, checkAvailability, validateDates } from '../utils/bookingUtils';
import { useBookings, BookingRecord } from '../context/BookingContext';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, addBooking } = useBookings();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestFilter, setGuestFilter] = useState<number | ''>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Guest detail form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  // Snapshot the room at the moment of confirmation so it can't be cleared by the availability effect
  const [confirmedRoom, setConfirmedRoom] = useState<Room | null>(null);

  // Derive existing bookings from context for availability check
  const existingMockBookings = useMemo(() =>
    bookings.map(b => ({ roomCode: b.roomCode, checkIn: b.checkIn, checkOut: b.checkOut })),
    [bookings]
  );

  const errors = validateDates(checkIn, checkOut);
  const isValidDates = Object.keys(errors).length === 0 && checkIn !== '' && checkOut !== '';

  const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);
  const selectedRoom = useMemo(() => ROOMS.find(r => r.code === selectedRoomId) || null, [selectedRoomId]);
  const totalPrice = useMemo(() =>
    selectedRoom ? calculateTotalPrice(nights, selectedRoom.price) : 0,
    [nights, selectedRoom]
  );

  const displayRooms = useMemo(() => {
    return ROOMS.filter(room => {
      if (guestFilter !== '' && room.maxGuests < guestFilter) return false;
      if (room.maxGuests < guests) return false;
      return true;
    }).map(room => ({
      room,
      isAvailable: checkAvailability(room.code, checkIn, checkOut, existingMockBookings)
    }));
  }, [guests, guestFilter, checkIn, checkOut, existingMockBookings]);

  useEffect(() => {
    // Don't auto-deselect while the confirmation modal is visible
    if (confirmedBooking) return;
    if (selectedRoomId) {
      const room = ROOMS.find(r => r.code === selectedRoomId);
      if (room) {
        if (room.maxGuests < guests || !checkAvailability(room.code, checkIn, checkOut, existingMockBookings)) {
          setSelectedRoomId(null);
        }
      }
    }
  }, [checkIn, checkOut, guests, selectedRoomId, existingMockBookings, confirmedBooking]);

  const handleConfirm = () => {
    if (!isValidDates || !selectedRoom) return;

    const id = 'RT-' + Array.from({ length: 5 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

    const newBooking: BookingRecord = {
      id,
      roomCode: selectedRoom.code,
      roomType: selectedRoom.type,
      guestName: guestName.trim() || 'Guest',
      guestEmail: guestEmail.trim() || '',
      guests,
      checkIn,
      checkOut,
      nights,
      pricePerNight: selectedRoom.price,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    setConfirmedRoom(selectedRoom); // snapshot before availability effect can clear it
    setConfirmedBooking(newBooking);
  };

  const handleReset = () => {
    setCheckIn(''); setCheckOut('');
    setGuests(1); setSelectedRoomId(null);
    setGuestName(''); setGuestEmail('');
    setConfirmedBooking(null);
    setConfirmedRoom(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <BookingSearch
          checkIn={checkIn} checkOut={checkOut} guests={guests}
          onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} onGuestsChange={setGuests}
          errors={errors}
        />

        <section id="room-list" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available rooms</h2>
                <p className="text-gray-500 mt-1">Select a room for your stay</p>
              </div>
              <GuestFilter value={guestFilter} onChange={setGuestFilter} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayRooms.map(({ room, isAvailable }) => (
                <RoomCard
                  key={room.code} room={room}
                  isSelected={selectedRoomId === room.code}
                  isAvailable={isAvailable}
                  onSelect={(r: Room) => setSelectedRoomId(selectedRoomId === r.code ? null : r.code)}
                />
              ))}
              {displayRooms.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No rooms match your criteria. Try adjusting your guest count.
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-96 lg:shrink-0">
            {/* Guest name input (optional, shown if room is selected) */}
            {selectedRoom && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Guest Information</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Guest name" value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <input type="email" placeholder="Email address (optional)" value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>
            )}
            <BookingSummary
              room={selectedRoom} checkIn={checkIn} checkOut={checkOut}
              guests={guests} nights={nights} totalPrice={totalPrice}
              isValid={isValidDates} onConfirm={handleConfirm}
            />
          </aside>
        </section>
      </main>

      {confirmedBooking && confirmedRoom && (
        <BookingConfirmation
          room={confirmedRoom}
          checkIn={confirmedBooking.checkIn}
          checkOut={confirmedBooking.checkOut}
          guests={confirmedBooking.guests}
          nights={confirmedBooking.nights}
          totalPrice={confirmedBooking.totalPrice}
          onReset={handleReset}
          onViewDashboard={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
};
