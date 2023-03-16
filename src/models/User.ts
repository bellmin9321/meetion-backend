import mongoose, { Schema } from 'mongoose';
import { UserType } from '../types';

const userSchema = new Schema<UserType>(
  {
    email: { type: String, required: [true, 'Email not specified'] },
    image: { type: String },
    name: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model<UserType>('User', userSchema);

export default User;
