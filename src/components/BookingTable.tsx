import React from 'react';
import { format, parseISO } from 'date-fns';
import { BookingRecord } from '../context/BookingContext';

interface BookingTableProps {
  bookings: BookingRecord[];
  onNavigateToBooking?: () => void;
  showEmpty?: boolean;
}

const statusConfig: Record<BookingRecord['status'], { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  upcoming:  { label: 'Upcoming',  className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  active:    { label: 'Active',    className: 'bg-teal-50 text-teal-700 border border-teal-200' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-500 border border-gray-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-200' },
};

export const BookingTable: React.FC<BookingTableProps> = ({ bookings, onNavigateToBooking, showEmpty = true }) => {
  if (bookings.length === 0 && showEmpty) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="font-semibold text-gray-700 mb-1">No bookings yet</p>
        <p className="text-sm text-gray-400 mb-6">Your confirmed bookings will appear here.</p>
        {onNavigateToBooking && (
          <button
            onClick={onNavigateToBooking}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Book a Room
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nights</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {bookings.map(b => {
            const cfg = statusConfig[b.status] ?? statusConfig['confirmed'];
            return (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 font-mono font-semibold text-gray-900">{b.id}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{b.guestName}</div>
                  <div className="text-xs text-gray-400">{b.guests} guest{b.guests !== 1 ? 's' : ''}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{b.roomCode}</div>
                  <div className="text-xs text-gray-400">{b.roomType}</div>
                </td>
                <td className="px-4 py-4 text-gray-600">{format(parseISO(b.checkIn), 'd MMM yyyy')}</td>
                <td className="px-4 py-4 text-gray-600">{format(parseISO(b.checkOut), 'd MMM yyyy')}</td>
                <td className="px-4 py-4 text-gray-700 font-medium">{b.nights}n</td>
                <td className="px-4 py-4 font-semibold text-gray-900 font-mono">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
                    {cfg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
