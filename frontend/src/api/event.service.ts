import { api } from './client';
import { handleApiError } from './errors';
import type { EventData, ListEventsResponse, SingleEventResponse, EventQueryParams } from '../types/event.types';

export const EventService = {
  listEvents: async (params?: EventQueryParams): Promise<ListEventsResponse> => {
    try {
      const response = await api.get<ListEventsResponse>('/events', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getEventById: async (id: string): Promise<EventData> => {
    try {
      const response = await api.get<SingleEventResponse>(`/events/${id}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createEvent: async (eventData: Partial<EventData>): Promise<EventData> => {
    try {
      const response = await api.post<SingleEventResponse>('/events', eventData);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateEvent: async (id: string, eventData: Partial<EventData>): Promise<EventData> => {
    try {
      const response = await api.patch<SingleEventResponse>(`/events/${id}`, eventData);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  registerForEvent: async (id: string): Promise<{ attendees: number; maxAttendees: number }> => {
    try {
      const response = await api.post<{ success: boolean; data: { attendees: number; maxAttendees: number } }>(`/events/${id}/register`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
