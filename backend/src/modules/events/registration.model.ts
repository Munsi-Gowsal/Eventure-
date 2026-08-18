import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  status: 'REGISTERED' | 'CANCELLED';
  registeredAt: Date;
  cancelledAt?: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['REGISTERED', 'CANCELLED'], default: 'REGISTERED' },
    cancelledAt: { type: Date }
  },
  { timestamps: { createdAt: 'registeredAt', updatedAt: false } }
);

// Ensure a user can only register once per event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Registration = mongoose.model<IRegistration>('Registration', registrationSchema);
