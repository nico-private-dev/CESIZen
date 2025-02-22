import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel, { IUser } from '../models/userModel';
import RoleModel from '../models/roleModels';
import generateToken from '../utils/generateToken';

export const signUp = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, roleName } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Vérifier si le rôle existe
    const role = await RoleModel.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer un nouvel utilisateur
    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role._id
    });

    // Générer un token
    const token = generateToken(user._id);

    // Exclure le mot de passe de la réponse
    const { password: _, ...userResponse } = user.toObject();

    // Répondre avec le résultat et le token
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
    // Vérifier si l'utilisateur existe
    const existingUser = await UserModel.findOne({ email }).populate('role');
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Vérifier le mot de passe de l'utilisateur
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Générer un token
    const token = generateToken(existingUser._id);

    // Exclure le mot de passe de la réponse
    const { password: _, ...userResponse } = existingUser.toObject();

    // Répondre avec le résultat et le token
    res.status(200).json({ result: userResponse, token });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};