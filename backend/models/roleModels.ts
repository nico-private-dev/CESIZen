import mongoose, { Schema } from 'mongoose';
import { IRole } from '../types/role';

const roleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

const RoleModel = mongoose.model<IRole>('Role', roleSchema);

export default RoleModel;
export { IRole };