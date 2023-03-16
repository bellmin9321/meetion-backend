import { Types } from 'mongoose';

export interface PageType {
  _id: Types.ObjectId;
  creator: string;
  title: string;
  desc: string;
}

export interface UserType {
  email: string;
  image: string;
  name: string;
}
