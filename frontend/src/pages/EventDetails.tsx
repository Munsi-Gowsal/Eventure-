import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, ArrowLeft, Users } from 'lucide-react';
import { eventsApi } from '../features/events/api';
import { ButtonColorful } from '../components/ui/ButtonColorful';

import { useToast } from '../components/ui/ToastContext';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEvent(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.registerForEvent(id!),
    onSuccess: (data) => {
      setRegisterStatus('success');
      toast('Successfully registered for the event!', 'success');
      queryClient.setQueryData(['event', id], data.event);
    },
    onError: (err: any) => {
      setRegisterStatus('error');
      toast(err.response?.data?.error || 'Failed to register for the event.', 'error');
    },
  });

  if (isLoading) return <div className="p-12 text-center text-gray-400">Loading event details...</div>;
  if (error || !event) return <div className="p-12 text-center text-red-500">Failed to load event.</div>;

  const isFull = event.attendees >= event.maxAttendees;

  return (
    <div className="pb-20">
      {/* Hero Header */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        {event.bannerImageUrl ? (
          <img 
            src={event.bannerImageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-bg-sidebar)] flex items-center justify-center">
            <span className="text-gray-600 text-xl">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-main)] via-[var(--color-bg-main)]/60 to-transparent"></div>
        
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full transition-all hover:bg-black/50">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-6 lg:px-12 pb-8 transform translate-y-6">
          <div className="max-w-4xl bg-[var(--color-bg-card)] rounded-2xl p-8 border border-[var(--color-border-subtle)] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-[var(--color-accent-secondary)] text-[var(--color-accent-primary)] text-xs font-bold uppercase tracking-wider mb-4">
                {event.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[var(--color-accent-primary)]" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {event.time && `at ${event.time}`}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--color-accent-primary)]" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[var(--color-accent-primary)]" />
                  <span>{event.attendees} / {event.maxAttendees} Attending</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-stretch md:items-end gap-3">
              <ButtonColorful
                onClick={() => registerMutation.mutate()}
                disabled={isFull || registerMutation.isPending || registerStatus === 'success'}
                className="w-full md:w-auto"
              >
                {isFull 
                  ? 'Event Full' 
                  : registerStatus === 'success'
                  ? '✓ Registered'
                  : registerMutation.isPending
                  ? 'Processing...'
                  : 'Book Now — Free'
                }
              </ButtonColorful>
              </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mt-32 px-6 lg:px-12">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-[var(--color-border-subtle)] pb-4">About this event</h2>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
          {event.description ? (
            <p className="whitespace-pre-wrap">{event.description}</p>
          ) : (
            <p className="italic text-gray-500">No details provided for this event.</p>
          )}
        </div>
      </div>
    </div>
  );
};
