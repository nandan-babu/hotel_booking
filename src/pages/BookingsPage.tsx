import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { BookingTable } from '../components/BookingTable';
import { BookingRecord } from '../context/BookingContext';
import { ROOMS } from '../data/rooms';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings } = useBookings();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingRecord['status'] | ''>('');
  const [roomFilter, setRoomFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filtered = useMemo(() => {
    let list = [...bookings];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.roomCode.toLowerCase().includes(q)
      );
    }
    if (statusFilter) list = list.filter(b => b.status === statusFilter);
    if (roomFilter) list = list.filter(b => b.roomCode === roomFilter);
    if (sortOrder === 'newest') list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    return list;
  }, [bookings, search, statusFilter, roomFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-gray-500 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Booking
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, guest, or room..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as BookingRecord['status'] | '')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={roomFilter}
            onChange={e => setRoomFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">All Rooms</option>
            {ROOMS.map(r => <option key={r.code} value={r.code}>{r.code} — {r.type}</option>)}
          </select>

          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <BookingTable bookings={filtered} onNavigateToBooking={() => navigate('/')} />
        </div>

      </div>
    </div>
  );
};
