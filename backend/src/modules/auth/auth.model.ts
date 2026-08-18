import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'ATTENDEE';
  refreshTokenHash: string | null;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'ATTENDEE'], default: 'ATTENDEE' },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model<IUser>('User', userSchema);
