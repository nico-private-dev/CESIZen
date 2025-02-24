import mongoose, { Document, Schema } from 'mongoose';
import { IInfoCategory } from './infoCategoryModel';

export interface IInfo extends Document {
  title: string;
  content: string;
  category: IInfoCategory['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const infoSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'InfoCategory',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware pour mettre à jour updatedAt
infoSchema.pre<IInfo>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IInfo>('Info', infoSchema);