import { Types } from 'mongoose';

export interface PageType {
  _id: Types.ObjectId;
  creator: string;
  title: string;
  desc: string;
}
