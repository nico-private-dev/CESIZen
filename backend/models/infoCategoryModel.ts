import mongoose, { Document, Schema } from 'mongoose';

export interface IInfoCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

const infoCategorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IInfoCategory>('InfoCategory', infoCategorySchema);