import { Event, IEvent } from './event.model';
import { Registration } from './registration.model';
import { AppError } from '../../utils/AppError';
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
      // Treat 'YYYY-MM-DD' as UTC calendar day by searching >= startOfDay and < startOfNextDay
      const startOfDay = new Date(date);
      if (!isNaN(startOfDay.getTime())) {
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
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
      throw new AppError('Cannot reduce maxAttendees below current attendees count', 409, 'CONFLICT');
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

  static async registerForEvent(id: string, userId: string) {
    const existingRegistration = await Registration.findOne({ userId, eventId: id });
    if (existingRegistration && existingRegistration.status === 'REGISTERED') {
      throw new AppError('You are already registered for this event.', 409, 'CONFLICT');
    }

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
        throw new AppError('This event has reached capacity.', 409, 'CONFLICT');
      }
    }

    try {
      if (existingRegistration) {
        // Reactivate cancelled registration
        existingRegistration.status = 'REGISTERED';
        existingRegistration.registeredAt = new Date();
        existingRegistration.cancelledAt = undefined;
        await existingRegistration.save();
      } else {
        await Registration.create({ userId, eventId: id });
      }
    } catch (e: any) {
      // Rollback attendee count if registration fails
      await Event.updateOne({ _id: id }, { $inc: { attendees: -1 } });
      
      // If it's a duplicate key error, we can still return a 409 Conflict
      if (e.code === 11000) {
        throw new AppError('You are already registered for this event.', 409, 'CONFLICT');
      }
      throw e;
    }

    return {
      eventId: event._id,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
    };
  }

  static async cancelRegistration(id: string, userId: string) {
    const registration = await Registration.findOne({ userId, eventId: id, status: 'REGISTERED' });
    if (!registration) {
      throw new AppError('Registration not found or already cancelled.', 404, 'NOT_FOUND');
    }

    registration.status = 'CANCELLED';
    registration.cancelledAt = new Date();
    await registration.save();

    // Atomically decrement attendees count
    await Event.updateOne(
      { _id: id },
      { $inc: { attendees: -1 } }
    );

    return { success: true };
  }

  static async getEventRegistrations(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw this.notFoundError();
    }

    const registrations = await Registration.find({ eventId: id, status: 'REGISTERED' })
      .populate('userId', 'fullName email') // Assuming we want user details
      .sort({ registeredAt: -1 });

    return registrations;
  }

  private static notFoundError() {
    return new AppError('Resource not found', 404, 'NOT_FOUND');
  }
}
