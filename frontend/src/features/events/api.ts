import { client } from '../../lib/api/client';
import type { Event, CreateEventPayload, UpdateEventPayload } from './types';

export const eventsApi = {
  getEvents: async (params?: { search?: string; category?: string; date?: string; limit?: number }): Promise<Event[]> => {
    const { data } = await client.get('/events', { params });
    return data.data; // Assumes backend wraps response in { data: [...] }
  },

  getEvent: async (id: string): Promise<Event> => {
    const { data } = await client.get(`/events/${id}`);
    return data.data;
  },

  registerForEvent: async (id: string): Promise<{ message: string; event: Event }> => {
    const { data } = await client.post(`/events/${id}/register`);
    return data;
  },

  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await client.post('/events', payload);
    return data.data;
  },

  updateEvent: async (id: string, payload: UpdateEventPayload): Promise<Event> => {
    const { data } = await client.patch(`/events/${id}`, payload);
    return data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await client.delete(`/events/${id}`);
  },
};
