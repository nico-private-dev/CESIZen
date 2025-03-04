import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel, { IUser } from '../models/userModel';
import RoleModel from '../models/roleModels';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: IUser;
}

const setTokenCookies = (res: Response, userId: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const signUp = async (req: AuthRequest, res: Response) => {
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

    setTokenCookies(res, user._id);

    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json({ result: userResponse });
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const signIn = async (req: AuthRequest, res: Response) => {
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

    setTokenCookies(res, existingUser._id);

    const { password: _, ...userResponse } = existingUser.toObject();
    res.status(200).json({ result: userResponse });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const accessToken = generateAccessToken(decoded._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('accessToken', '', { maxAge: 0 });
  res.cookie('refreshToken', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?._id).populate('role');
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