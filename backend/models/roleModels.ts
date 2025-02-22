import mongoose, { Document, Schema } from 'mongoose';

interface IRole extends Document {
  name: string;
}

const roleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

const RoleModel = mongoose.model<IRole>('Role', roleSchema);

export default RoleModel;
export { IRole };