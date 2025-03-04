import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user';

//Création du Schéma pour les Utilisateurs Cesizen
const userSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true 
  },
  firstname: { 
    type: String, 
    required: true 
  },
  lastname: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  }
});

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
export { IUser };