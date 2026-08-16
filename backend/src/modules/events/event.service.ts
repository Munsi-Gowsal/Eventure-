import { Event, IEvent } from './event.model';
import mongoose from 'mongoose';

export class EventService {
  static async listEvents(query: { category?: string; date?: string; search?: string; page: number; limit: number }) {
    const { category, date, search, page, limit } = query;
    const filter: Record<string, any> = { isDeleted: false };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (date) {
      // Treat 'YYYY-MM-DD' as calendar day by searching >= startOfDay and < startOfNextDay
      const startOfDay = new Date(date);
      if (!isNaN(startOfDay.getTime())) {
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        filter.date = { $gte: startOfDay, $lt: endOfDay };
      }
    }

    const total = await Event.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  static async getEventById(id: string) {
    const event = await Event.findOne({ _id: id, isDeleted: false });
    if (!event) {
      throw this.notFoundError();
    }
    return event;
  }

  static async createEvent(data: Partial<IEvent>) {
    const event = new Event({
      ...data,
      attendees: 0,
      isDeleted: false,
    });
    await event.save();
    return event;
  }

  static async updateEvent(id: string, data: Partial<IEvent>) {
    const event = await Event.findOne({ _id: id, isDeleted: false });
    if (!event) {
      throw this.notFoundError();
    }

    if (data.maxAttendees !== undefined && data.maxAttendees < event.attendees) {
      const err: any = new Error('Cannot reduce maxAttendees below current attendees count');
      err.statusCode = 409;
      err.code = 'CONFLICT';
      throw err;
    }

    Object.assign(event, data);
    await event.save();
    return event;
  }

  static async softDeleteEvent(id: string) {
    const event = await Event.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!event) {
      throw this.notFoundError();
    }
  }

  static async registerForEvent(id: string) {
    // Atomic update to prevent race conditions
    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        $expr: {
          $lt: ["$attendees", "$maxAttendees"]
        }
      },
      {
        $inc: { attendees: 1 }
      },
      { new: true }
    );

    if (!event) {
      // Determine if event doesn't exist/deleted or just full
      const existingEvent = await Event.findById(id);
      if (!existingEvent || existingEvent.isDeleted) {
        throw this.notFoundError();
      } else {
        const err: any = new Error('This event has reached capacity.');
        err.statusCode = 409;
        err.code = 'CONFLICT';
        throw err;
      }
    }

    return {
      eventId: event._id,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
    };
  }

  private static notFoundError() {
    const err: any = new Error('Resource not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    return err;
  }
}
