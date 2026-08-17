export interface Event {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  time?: string;
  location?: string;
  bannerImageUrl?: string;
  maxAttendees: number;
  attendees: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  category: string;
  date: string;
  time?: string;
  location?: string;
  bannerImageUrl?: string;
  maxAttendees: number;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;
