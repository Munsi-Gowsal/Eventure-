import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  category: string;
  date: Date;
  time?: string;
  location?: string;
  bannerImageUrl?: string;
  maxAttendees: number;
  attendees: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String },
    bannerImageUrl: { type: String, trim: true },
    maxAttendees: { type: Number, required: true, min: 1 },
    attendees: { type: Number, default: 0, min: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
// - Text index on title for case-insensitive search
// - Compound index on category, date, and isDeleted for efficient filtering
eventSchema.index({ title: 'text' });
eventSchema.index({ isDeleted: 1, category: 1, date: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
