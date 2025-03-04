import { Document } from 'mongoose';

export interface IInfo extends Document {
  title: string;
  content: string;
  category: IInfoCategory['_id'];
}

export interface IInfoCategory extends Document {
  name: string;
  description?: string;
}