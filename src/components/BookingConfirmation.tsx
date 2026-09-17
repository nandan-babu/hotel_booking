import React from 'react';
import { Room } from '../data/rooms';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, LayoutDashboard } from 'lucide-react';

interface BookingConfirmationProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  onReset: () => void;
  onViewDashboard?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  room, checkIn, checkOut, guests, nights, totalPrice, onReset, onViewDashboard
}) => {
  const [reference] = React.useState(() => {
    return 'RT-' + Array.from({ length: 5 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking confirmed</h2>
          <p className="text-emerald-700 text-sm">Your room has been selected successfully.</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500">Reference</span>
            <span className="font-mono font-bold tracking-widest text-gray-900">{reference}</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-medium">{room.type} ({room.code})</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-medium">{format(parseISO(checkIn), 'd MMM yyyy')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-medium">{format(parseISO(checkOut), 'd MMM yyyy')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-medium">{guests}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span></div>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={onReset}
              className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm">
              Book another
            </button>
            {onViewDashboard && (
              <button onClick={onViewDashboard}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors text-sm">
                <LayoutDashboard className="w-4 h-4" /> View Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
