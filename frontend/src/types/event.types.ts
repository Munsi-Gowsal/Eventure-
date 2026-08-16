export interface EventData {
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
}

export interface ListEventsResponse {
  success: boolean;
  data: EventData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleEventResponse {
  success: boolean;
  data: EventData;
}

export interface EventQueryParams {
  category?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}
