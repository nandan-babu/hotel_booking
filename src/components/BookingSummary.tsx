import React from 'react';
import { Room } from '../data/rooms';
import { format, parseISO } from 'date-fns';

interface BookingSummaryProps {
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  onConfirm: () => void;
  isValid: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  totalPrice,
  onConfirm,
  isValid
}) => {
  if (!room || !checkIn || !checkOut || !isValid || nights <= 0) {
    return (
      <div className="bg-surface border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
        <h2 className="text-xl font-bold text-ink mb-6">Your stay</h2>
        <div className="text-gray-500 text-sm py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Please select valid dates and a room to see your summary.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-2xl overflow-hidden shadow-sm sticky top-6">
      {/* Room Photo Thumbnail */}
      <div className="w-full h-40 overflow-hidden bg-gray-100">
        <img
          src={room.imageUrl}
          alt={room.type}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Your stay</h2>
      
      <div className="space-y-4">
        <div>
          <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Room</span>
          <p className="font-semibold text-ink">{room.code}</p>
          <p className="text-sm text-gray-600">{room.type}</p>
        </div>
        
        <div className="flex gap-6 pt-4 border-t border-gray-100">
          <div className="flex-1">
            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Check-in</span>
            <p className="font-semibold text-ink">{format(parseISO(checkIn), 'd MMM yyyy')}</p>
          </div>
          <div className="flex-1">
            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Check-out</span>
            <p className="font-semibold text-ink">{format(parseISO(checkOut), 'd MMM yyyy')}</p>
          </div>
        </div>
        
        <div className="flex gap-6 pt-4 border-t border-gray-100">
          <div className="flex-1">
            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Guests</span>
            <p className="font-semibold text-ink">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
          </div>
          <div className="flex-1">
            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Duration</span>
            <p className="font-semibold text-ink">{nights} {nights === 1 ? 'night' : 'nights'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>Price</span>
          <span className="font-mono">₹{room.price.toLocaleString('en-IN')} / night</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-bold text-ink">Total</span>
          <span className="font-bold text-xl text-ink font-mono tracking-tight">₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
      
      <button 
        onClick={onConfirm}
        className="w-full mt-6 bg-ink text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink"
      >
        Confirm Booking
      </button>
      </div>
    </div>
  );
};
