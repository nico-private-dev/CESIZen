import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel, { IUser } from '../models/userModel';
import RoleModel from '../models/roleModels';
import generateToken from '../utils/generateToken';

export const signUp = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, roleName } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const role = await RoleModel.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role._id
    });

    const token = generateToken(user._id);

    const { password: _, ...userResponse } = user.toObject();

    res.status(201).json({
      result: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email }).populate('role');
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(existingUser._id);

    const { password: _, ...userResponse } = existingUser.toObject();

    res.status(200).json({ result: userResponse, token });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!._id).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};