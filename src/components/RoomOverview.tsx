import React from 'react';
import { ROOMS } from '../data/rooms';
import { useBookings } from '../context/BookingContext';

export const RoomOverview: React.FC = () => {
  const { getOccupiedRooms } = useBookings();
  const occupiedCodes = getOccupiedRooms();

  return (
    <div className="space-y-3">
      {ROOMS.map(room => {
        const isOccupied = occupiedCodes.includes(room.code);
        return (
          <div
            key={room.code}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isOccupied ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div>
                <span className="font-semibold text-gray-900 text-sm">{room.code}</span>
                <span className="text-gray-400 mx-2">·</span>
                <span className="text-gray-600 text-sm">{room.type}</span>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOccupied
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isOccupied ? 'Occupied' : 'Available'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
