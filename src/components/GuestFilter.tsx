import React from 'react';

interface GuestFilterProps {
  value: number | '';
  onChange: (value: number | '') => void;
}

export const GuestFilter: React.FC<GuestFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="guestFilter" className="text-sm font-medium text-gray-600">Filter by capacity:</label>
      <select
        id="guestFilter"
        className="text-sm border border-gray-200 rounded-md py-1.5 px-3 bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
      >
        <option value="">All guests</option>
        <option value={1}>1 guest</option>
        <option value={2}>2 guests</option>
        <option value={3}>3 guests</option>
        <option value={4}>4 guests</option>
      </select>
    </div>
  );
};
