import dotenv from 'dotenv';
import RoleModel from './models/roleModels';
import connectDB from './config/db';

dotenv.config();

const initRoles = async () => {
  await connectDB();

  const roles = [
    { name: 'admin' },
    { name: 'user' },
  ];

  try {
    for (const role of roles) {
      const newRole = new RoleModel(role);
      await newRole.save();
    }
    console.log('Roles initialized');
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

initRoles();