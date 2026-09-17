import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, BarChart3, IndianRupee, ArrowLeft, Plus, ListOrdered, BedDouble } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { StatCard } from '../components/StatCard';
import { BookingTable } from '../components/BookingTable';
import { RoomOverview } from '../components/RoomOverview';
import { ROOMS } from '../data/rooms';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    bookings,
    getTotalBookings,
    getActiveBookings,
    getUpcomingBookings,
    getTotalRevenue,
    getOccupiedRooms,
  } = useBookings();

  const totalRooms = ROOMS.length;
  const occupiedRooms = getOccupiedRooms().length;
  const occupancyPct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your hotel bookings and room activity.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Booking
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Bookings"
            value={getTotalBookings()}
            subtitle="All confirmed bookings"
            icon={<CalendarDays className="w-6 h-6 text-teal-600" />}
            color="bg-teal-50"
          />
          <StatCard
            title="Active Bookings"
            value={getActiveBookings().length}
            subtitle="Currently staying"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Upcoming Bookings"
            value={getUpcomingBookings().length}
            subtitle="Future stays"
            icon={<BarChart3 className="w-6 h-6 text-violet-600" />}
            color="bg-violet-50"
          />
          <StatCard
            title="Total Revenue"
            value={getTotalRevenue()}
            prefix="₹"
            subtitle="From confirmed bookings"
            icon={<IndianRupee className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50"
          />
        </div>

        {/* Main content: table + room overview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Recent Bookings Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Recent Bookings</h2>
            <BookingTable bookings={bookings} onNavigateToBooking={() => navigate('/')} />
          </div>

          {/* Room Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Room Overview</h2>
            <RoomOverview />
          </div>
        </div>

        {/* Bottom row: occupancy + quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Occupancy Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Room Occupancy</h2>
            <p className="text-sm text-gray-400 mb-6">{occupiedRooms} of {totalRooms} rooms occupied</p>

            <div className="flex items-end gap-4 mb-4">
              <span className="text-5xl font-bold text-gray-900 font-mono">{occupancyPct}%</span>
              <span className="text-sm text-gray-400 mb-2">occupancy rate</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-700"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>

            {/* Mini room dots */}
            <div className="flex gap-2 mt-4">
              {ROOMS.map(room => {
                const occupied = getOccupiedRooms().includes(room.code);
                return (
                  <div key={room.code} title={`${room.code} — ${occupied ? 'Occupied' : 'Available'}`}
                    className={`flex-1 h-2 rounded-full ${occupied ? 'bg-amber-400' : 'bg-emerald-300'}`} />
                );
              })}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-emerald-300" /> Available
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-amber-400" /> Occupied
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-5 h-5" />
                New Booking
              </button>
              <button
                onClick={() => navigate('/bookings')}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                <ListOrdered className="w-5 h-5 text-gray-500" />
                View All Bookings
              </button>
              <button
                onClick={() => { navigate('/'); document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                <BedDouble className="w-5 h-5 text-gray-500" />
                Rooms
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
