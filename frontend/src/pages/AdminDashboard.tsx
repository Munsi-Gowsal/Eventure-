import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Users, Calendar as CalendarIcon, Map } from 'lucide-react';
import { eventsApi } from '../features/events/api';
import type { Event } from '../features/events/types';
import { AdminEventModal } from '../features/events/components/AdminEventModal';
import { EventForm } from '../features/events/components/EventForm';
import { useToast } from '../components/ui/ToastContext';
import { AdminLayout } from '../components/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => eventsApi.getEvents(),
  });

  const createMutation = useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast('Event created successfully', 'success');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast(err.response?.data?.error || 'Failed to create event', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast('Event updated successfully', 'success');
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast(err.response?.data?.error || 'Failed to update event', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast('Event deleted successfully', 'success');
    },
    onError: (err: any) => {
      toast(err.response?.data?.error || 'Failed to delete event', 'error');
    },
  });

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleFormSubmit = (data: any) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 lg:p-12 max-w-7xl mx-auto text-[#f1f1f1]">
        
        {/* Header matching the "Select Zone" / "Workspace booking" vibe */}
        <header className="mb-10">
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Eventure Management</h1>
          <p className="text-gray-400 text-sm">Select what you want to manage or create a new event.</p>
        </header>

        {/* Large Action Cards mirroring "For me" / "For Team" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl">
          {/* Card 1: Create Event */}
          <div className="bg-[#1a1a1a] rounded-[24px] p-8 border border-[#2a2a2a] relative overflow-hidden group shadow-[0_0_30px_rgba(155,81,224,0.05)] hover:shadow-[0_0_40px_rgba(155,81,224,0.15)] transition-shadow">
            {/* Soft glow behind */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#9b51e0] opacity-20 blur-[50px] rounded-full group-hover:opacity-30 transition-opacity" />
            
            <div className="mb-8">
              <div className="w-16 h-16 flex items-center justify-center">
                <User size={48} className="text-[#9b51e0]" strokeWidth={1.5} />
              </div>
            </div>
            
            <h2 className="text-3xl font-medium mb-3">Create Event</h2>
            <p className="text-gray-500 mb-8 max-w-[200px] leading-relaxed">
              I want to host a new event on the platform
            </p>
            
            <button 
              onClick={openCreateModal}
              className="bg-[#b573f0] hover:bg-[#a662e0] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors inline-block"
            >
              Get started
            </button>
          </div>

          {/* Card 2: View Events / Settings */}
          <div className="bg-[#1a1a1a] rounded-[24px] p-8 border border-[#2a2a2a] relative overflow-hidden group shadow-[0_0_30px_rgba(59,130,246,0.05)] hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-shadow">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 opacity-20 blur-[50px] rounded-full group-hover:opacity-30 transition-opacity" />
            
            <div className="mb-8">
              <div className="w-16 h-16 flex items-center justify-center">
                <Users size={48} className="text-blue-500" strokeWidth={1.5} />
              </div>
            </div>
            
            <h2 className="text-3xl font-medium mb-3">Manage Team</h2>
            <p className="text-gray-500 mb-8 max-w-[200px] leading-relaxed">
              I want to manage event organizers and settings
            </p>
            
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors inline-block">
              Settings
            </button>
          </div>
        </div>

        {/* Event List Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-medium text-white mb-1">Your Events Map</h2>
              <p className="text-gray-400 text-sm">Pick your event to edit or manage attendees</p>
            </div>
            
            <div className="flex gap-4">
               {/* Filters mirroring the dropdowns in Select Zone */}
               <div className="flex flex-col">
                 <label className="text-xs text-gray-500 mb-1">Category</label>
                 <select className="bg-[#1a1a1a] border border-[#333] text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#9b51e0]">
                   <option>All categories</option>
                   <option>Tech</option>
                   <option>Music</option>
                 </select>
               </div>
               <div className="flex items-end">
                 <button className="bg-[#b573f0] hover:bg-[#a662e0] text-black text-sm font-medium px-4 py-1.5 rounded-lg">
                   Check
                 </button>
               </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#333] p-6 rounded-xl min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
               <div className="flex items-center justify-center h-full text-gray-500">No events found. Create one above!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event._id} className="bg-[#242424] border border-[#333] rounded-lg p-5 flex flex-col group relative overflow-hidden">
                    {/* Status indicator (like the red dot in the map) */}
                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-red-500" />
                    
                    <div className="pl-6 mb-4">
                      <h3 className="text-lg font-medium text-white line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{event.category || 'General'}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CalendarIcon size={14} className="text-[#9b51e0]" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Map size={14} className="text-[#9b51e0]" />
                        <span>{event.location || 'TBA'}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#333]">
                      <span className="text-xs font-mono text-gray-400">{event.attendees} Attending</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(event)} className="text-xs text-[#b573f0] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => handleDelete(event._id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <AdminEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingEvent ? 'Edit Event' : 'Schedule an event'}
        >
          <EventForm
            initialValues={editingEvent || undefined}
            onSubmit={handleFormSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </AdminEventModal>
      </div>
    </AdminLayout>
  );
};
