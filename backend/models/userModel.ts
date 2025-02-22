import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from './roleModels';

interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: IRole['_id'];
}

const userSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
export { IUser };