import mongoose, { Schema } from 'mongoose';
import { PageType } from '../types';

const pageSchema = new Schema<PageType>(
  {
    creator: { type: String, required: [true, 'Creator is required'] },
    title: { type: String },
    desc: { type: String },
    sharedUsers: { type: [String] },
  },
  { timestamps: true },
);

const Page = mongoose.model<PageType>('Page', pageSchema);

export default Page;
