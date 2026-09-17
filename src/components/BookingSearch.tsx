import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface BookingSearchProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (val: number) => void;
  errors: Record<string, string>;
}

export const BookingSearch: React.FC<BookingSearchProps> = ({
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  errors
}) => {
  const getTodayStr = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();

  return (
    <section 
      className="relative text-white py-16 px-4"
      style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto text-center pb-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Find your perfect stay</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose your dates and discover a room that fits your stay.
        </p>
      </div>

      <div className="absolute left-0 right-0 -bottom-8 flex justify-center px-4">
        <div className="bg-surface rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] border border-gray-100 p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
          
          <div className="flex-1 flex flex-col md:flex-row gap-6">
            {/* Check-in */}
            <div className="flex-1 relative">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <Calendar className="w-4 h-4" /> Check-in
              </label>
              <input 
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg py-2.5 px-4 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                  errors.checkIn ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-200'
                }`}
                aria-invalid={!!errors.checkIn}
              />
              {errors.checkIn && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500 whitespace-nowrap" aria-live="polite">{errors.checkIn}</span>
              )}
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />
            
            {/* Check-out */}
            <div className="flex-1 relative">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <Calendar className="w-4 h-4" /> Check-out
              </label>
              <input 
                type="date"
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className={`w-full bg-gray-50 border rounded-lg py-2.5 px-4 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                  errors.checkOut ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-200'
                }`}
                aria-invalid={!!errors.checkOut}
              />
              {errors.checkOut && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500 whitespace-nowrap" aria-live="polite">{errors.checkOut}</span>
              )}
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-200" />
            
            {/* Guests */}
            <div className="w-full md:w-32 relative">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <Users className="w-4 h-4" /> Guests
              </label>
              <select 
                value={guests}
                onChange={(e) => onGuestsChange(parseInt(e.target.value, 10))}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>
          </div>
          
          <button 
            className="md:self-end h-[46px] px-8 bg-accent text-white font-medium rounded-lg hover:bg-teal-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            onClick={() => document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Find Rooms
          </button>
        </div>
      </div>
    </section>
  );
};
