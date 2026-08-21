import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Calendar as CalendarIcon, Map, Plus } from 'lucide-react';
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
      toast('your event is created successfully', 'success');
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
      <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 border-b-[6px] border-black pb-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-display uppercase tracking-tighter mb-4 text-black text-shadow-[4px_4px_0px_#FFD23F]">Eventure Management</h1>
          <p className="font-bold text-base md:text-lg bg-white border-2 border-black inline-block px-4 py-2 shadow-[2px_2px_0px_0px_#000]">Select what you want to manage or create a new event.</p>
        </header>

        {/* Large Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Create Event */}
          <div className="neo-card bg-white p-10 flex flex-col justify-between group">
            <div>
              <div className="w-20 h-20 bg-[#FFD23F] border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center mb-8 rotate-[-5deg] group-hover:rotate-0 transition-transform">
                <Plus size={40} className="text-black" strokeWidth={3} />
              </div>
              <h2 className="text-4xl font-black font-display uppercase mb-4">Create Event</h2>
              <p className="font-bold text-lg mb-8 max-w-[250px] border-l-[4px] border-[#FF3366] pl-3">
                Host a new event on the platform.
              </p>
            </div>
            
            <button 
              onClick={openCreateModal}
              className="neo-button py-4 text-xl w-full bg-[#00E5FF] hover:bg-[#FF3366] hover:text-white"
            >
              GET STARTED
            </button>
          </div>

          {/* Card 2: Manage Team */}
          <div className="neo-card bg-white p-10 flex flex-col justify-between group">
            <div>
              <div className="w-20 h-20 bg-[#00E5FF] border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center mb-8 rotate-[5deg] group-hover:rotate-0 transition-transform">
                <Users size={40} className="text-black" strokeWidth={3} />
              </div>
              <h2 className="text-4xl font-black font-display uppercase mb-4">Manage Team</h2>
              <p className="font-bold text-lg mb-8 max-w-[250px] border-l-[4px] border-[#FFD23F] pl-3">
                Manage event organizers and settings.
              </p>
            </div>
            
            <button className="neo-button py-4 text-xl w-full bg-[#FF3366] text-white hover:bg-black">
              SETTINGS
            </button>
          </div>
        </div>

        {/* Event List Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div>
              <h2 className="text-4xl font-black font-display uppercase mb-2">Your Events Map</h2>
              <p className="font-bold bg-[#FFD23F] border-2 border-black inline-block px-3 py-1 text-sm shadow-[2px_2px_0_0_#000]">Pick your event to edit or manage attendees.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
               <div className="flex flex-col">
                 <label className="font-black font-display uppercase mb-2 ml-1 text-sm">Category</label>
                 <select className="neo-input py-3 px-4 font-bold uppercase min-w-[150px] cursor-pointer">
                   <option>All categories</option>
                   <option>Tech</option>
                   <option>Music</option>
                 </select>
               </div>
               <div className="flex items-end">
                 <button className="neo-button px-6 py-3 bg-black text-white hover:bg-[#00E5FF] hover:text-black">
                   FILTER
                 </button>
               </div>
            </div>
          </div>

          <div className="neo-card bg-white p-4 md:p-8 lg:p-12 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full font-black font-display uppercase text-2xl text-gray-400">Loading events...</div>
            ) : events.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-black">
                 <div className="w-24 h-24 bg-gray-200 border-[3px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#000]">
                    <CalendarIcon size={40} strokeWidth={3} />
                 </div>
                 <h3 className="text-3xl font-black font-display uppercase mb-2">No events found</h3>
                 <p className="font-bold">Create one above!</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event._id} className="neo-card flex flex-col bg-[#f4f4f0] relative">
                    {/* Status indicator */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#00E5FF] border-[3px] border-black shadow-[2px_2px_0_0_#000]" />
                    
                    <div className="p-6 border-b-[3px] border-black bg-white">
                      <p className="inline-block px-2 py-1 bg-[#FFD23F] border-2 border-black font-bold text-xs uppercase mb-3 shadow-[2px_2px_0_0_#000]">{event.category || 'General'}</p>
                      <h3 className="text-2xl font-black font-display uppercase line-clamp-1">{event.title}</h3>
                    </div>

                    <div className="p-6 space-y-4 bg-white flex-1 border-b-[3px] border-black">
                      <div className="flex items-start gap-3 font-bold text-sm">
                        <CalendarIcon size={20} strokeWidth={2.5} className="text-[#FF3366] shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-start gap-3 font-bold text-sm">
                        <Map size={20} strokeWidth={2.5} className="text-[#00E5FF] shrink-0" />
                        <span className="line-clamp-1">{event.location || 'TBA'}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-[#f4f4f0] flex justify-between items-center">
                      <span className="font-bold uppercase text-sm border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0_0_#000]">{event.attendees} Attending</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(event)} className="neo-button px-4 py-2 bg-white text-sm">Edit</button>
                        <button onClick={() => handleDelete(event._id)} className="neo-button px-4 py-2 bg-[#FF3366] text-white text-sm">Del</button>
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
