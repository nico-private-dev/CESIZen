import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signUp, signIn, logout } from '../controllers/authController';
import UserModel from '../models/userModel';
import RoleModel from '../models/roleModels';
import { IAuthRequest } from '../types/auth';

// Mock des modèles et des fonctions externes
jest.mock('../models/userModel');
jest.mock('../models/roleModels');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');


describe('Auth Controller Tests', () => {
  let mockRequest: Partial<IAuthRequest>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {},
      cookies: {},
      user: undefined
    };
    
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return responseObject;
      }),
      cookie: jest.fn().mockReturnThis()
    };
    mockResponse = responseObject;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Tests unitaires inscription
  describe('UT-AUTH-01 : Fonction de connexion', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123',
        roleName: 'user'
      };
      
      mockRequest.body = userData;
      
      const mockRole = { _id: 'role123', name: 'user' };
      const mockUser = {
        _id: 'user123',
        ...userData,
        password: 'hashedPassword',
        role: mockRole._id,
        toObject: jest.fn().mockReturnValue({
          _id: 'user123',
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          role: mockRole._id
        })
      };
      
      (RoleModel.findOne as jest.Mock).mockResolvedValue(mockRole);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');
      
      await signUp(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(RoleModel.findOne).toHaveBeenCalledWith({ name: userData.roleName });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(UserModel.create).toHaveBeenCalledWith({
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: 'hashedPassword',
        role: mockRole._id
      });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(responseObject.statusCode).toBe(201);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        result: expect.any(Object)
      }));
    });

    it('should return 400 if user already exists', async () => {
      mockRequest.body = {
        username: 'existinguser',
        firstname: 'Existing',
        lastname: 'User',
        email: 'existing@example.com',
        password: 'password123',
        roleName: 'user'
      };
      
      (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'existing123' });
      
      await signUp(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email already exists'
      }));
    });
  });

  // Tests unitaires connexion
  describe('UT-AUTH-02 : Fonction de connexion', () => {
    it('should sign in a user successfully', async () => {
      mockRequest.body = {
        login: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        role: { _id: 'role123', name: 'user' },
        toObject: jest.fn().mockReturnValue({
          _id: 'user123',
          email: 'test@example.com',
          username: 'testuser',
          role: { _id: 'role123', name: 'user' }
        })
      };
      
      (UserModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');
      
      await signIn(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(UserModel.findOne).toHaveBeenCalledWith({
        $or: [
          { email: mockRequest.body.login },
          { username: mockRequest.body.login }
        ]
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockRequest.body.password, mockUser.password);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(responseObject.statusCode).toBe(200);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        result: expect.any(Object)
      }));
    });

    it('should return 404 if user not found', async () => {
      mockRequest.body = {
        login: 'nonexistent@example.com',
        password: 'password123'
      };
      
      (UserModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      
      await signIn(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Utilisateur non trouvé'
      }));
    });

    it('should return 400 if password is incorrect', async () => {
      mockRequest.body = {
        login: 'test@example.com',
        password: 'wrongpassword'
      };
      
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      (UserModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      await signIn(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Mot de passe incorrect'
      }));
    });
  });

  // Tests unitaires déconnexion
  describe('UT-AUTH-03 : Fonction de déconnexion', () => {
    it('should clear cookies and return success message', async () => {
      await logout(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith('accessToken', '', expect.any(Object));
      expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', '', expect.any(Object));
      expect(responseObject.statusCode).toBe(200);
      expect(responseObject.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Logged out successfully'
      }));
    });
  });
});
