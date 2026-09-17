import React from 'react';
import { Room } from '../data/rooms';
import { Check } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, isSelected, isAvailable, onSelect }) => {
  return (
    <div 
      className={`relative bg-surface rounded-2xl overflow-hidden transition-all duration-200 border ${
        isSelected 
          ? 'border-accent shadow-[0_8px_24px_rgba(45,212,191,0.15)] ring-1 ring-accent' 
          : 'border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer'
      } ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => isAvailable && onSelect(room)}
      onKeyDown={(e) => {
        if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(room);
        }
      }}
      tabIndex={isAvailable ? 0 : -1}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Room Photo */}
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100">
        <img
          src={room.imageUrl}
          alt={room.type}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to gradient placeholder if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="bg-white text-ink text-sm font-semibold px-3 py-1 rounded shadow-sm">
              Unavailable for selected dates
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{room.code}</span>
            <h3 className="text-lg font-semibold text-ink leading-tight mt-0.5">{room.type}</h3>
          </div>
          <div className="text-right">
            <span className="block font-semibold text-lg text-ink font-mono tracking-tight">
              ₹{room.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-500">/ night</span>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Up to {room.maxGuests} {room.maxGuests === 1 ? 'guest' : 'guests'}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {room.amenities.map(amenity => (
            <span key={amenity} className="px-2 py-1 bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 rounded-full">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <button 
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'bg-gray-50 text-ink border border-gray-200 hover:bg-gray-100'
            }`}
            tabIndex={-1} // Handled by card wrapper
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                Selected
              </>
            ) : (
              'Select Room'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
