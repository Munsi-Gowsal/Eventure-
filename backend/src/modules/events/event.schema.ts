import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validation for MongoDB ObjectId
const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ID format',
});

export const paramIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(150, 'Title must be <= 150 characters'),
    description: z.string().trim().optional(),
    category: z.string().trim().min(1, 'Category is required'),
    date: z.string().datetime({ message: "Invalid date format, expected UTC ISO 8601 string" }).transform(str => new Date(str)),
    time: z.string().optional(),
    location: z.string().optional(),
    bannerImageUrl: z.string().trim().optional(),
    maxAttendees: z.number().int().positive('Max attendees must be a positive integer'),
    // attendees is intentionally not in the create schema as it's server-controlled
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().optional(),
    category: z.string().trim().min(1).optional(),
    date: z.string().datetime({ message: "Invalid date format, expected UTC ISO 8601 string" }).transform(str => new Date(str)).optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    bannerImageUrl: z.string().trim().optional(),
    maxAttendees: z.number().int().positive().optional(),
  }),
});

export const listEventsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    date: z.string().optional(), // Expected format: YYYY-MM-DD
    search: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
