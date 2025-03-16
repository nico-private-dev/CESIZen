import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel';
import RoleModel from '../models/roleModels';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../types/auth';

// Mise en place des cookies pour stocker les tokens utilisateurs
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

// Inscription 
export const signUp = async (req: IAuthRequest, res: Response) => {
  const { username, firstname, lastname, email, password, roleName } = req.body;

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
      username,
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

// Connexion
export const signIn = async (req: IAuthRequest, res: Response) => {
  const { login, password } = req.body;

  try {
    // Recherche par email OU username
    const existingUser = await UserModel.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    }).populate('role');

    if (!existingUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Reste de votre logique existante
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    setTokenCookies(res, existingUser._id);

    const { password: _, ...userResponse } = existingUser.toObject();
    res.status(200).json({ result: userResponse });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};

// Vérification token lors du refresh de la page
export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const user = await UserModel.findById(decoded._id).populate('role');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user._id);
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({ result: userResponse });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Déconnexion
export const logout = (req: Request, res: Response) => {
  res.cookie('accessToken', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0 
  });
  
  res.cookie('refreshToken', '', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0 
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

// Récupérer un utilisateur (ById)
export const getMe = async (req: IAuthRequest, res: Response) => {
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

// Mettre à jour le nom d'utilisateur
export const updateUsername = async (req: IAuthRequest, res: Response) => {
  const { username } = req.body;
  
  if (!username || username.length < 3) {
    return res.status(400).json({ message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' });
  }
  
  try {
    // Vérifier si le nom d'utilisateur est déjà pris
    const existingUser = await UserModel.findOne({ username, _id: { $ne: req.user?._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
    }
    
    // Mettre à jour le nom d'utilisateur
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user?._id,
      { username },
      { new: true }
    ).populate('role');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const { password: _, ...userResponse } = updatedUser.toObject();
    res.status(200).json({ message: 'Nom d\'utilisateur mis à jour avec succès', user: userResponse });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom d\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};