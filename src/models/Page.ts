import mongoose, { Schema } from 'mongoose';
import { PageType } from '../types';

const pageSchema = new Schema<PageType>(
  {
    creator: { type: String },
    title: { type: String, required: [true, 'title not specified'] },
    desc: { type: String },
  },
  { timestamps: true },
);

const Page = mongoose.model<PageType>('Page', pageSchema);

export default Page;
