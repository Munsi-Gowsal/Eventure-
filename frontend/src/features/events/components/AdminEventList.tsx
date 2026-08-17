import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import type { Event } from '../types';

interface AdminEventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export const AdminEventList: React.FC<AdminEventListProps> = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl">
        <p className="text-gray-500">No events found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs uppercase bg-[var(--color-bg-sidebar)] text-gray-400 border-b border-[var(--color-border-subtle)]">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Event</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Capacity</th>
            <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-sidebar)]/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                {event.bannerImageUrl ? (
                  <img src={event.bannerImageUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-800" />
                )}
                <span className="line-clamp-1">{event.title}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {event.location || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-gray-500" />
                  <span className={event.attendees >= event.maxAttendees ? 'text-orange-400 font-bold' : ''}>
                    {event.attendees} / {event.maxAttendees}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-gray-400 hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 rounded-lg transition-colors inline-block"
                  title="Edit Event"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this event?')) {
                      onDelete(event._id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-block"
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
