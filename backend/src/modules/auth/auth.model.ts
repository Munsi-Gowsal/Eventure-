import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  refreshTokenHash: string | null;
  createdAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
