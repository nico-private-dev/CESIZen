import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { getExercises, getExerciseById, createExercise, updateExercise, deleteExercise } from '../controllers/exerciseController';
import Exercise from '../models/exerciseModel';
import { IAuthRequest } from '../types/auth';
import { IUser } from '../types/user';

// Mock des modèles
jest.mock('../models/exerciseModel');

describe('Exercise Controller Tests', () => {
  let mockRequest: Partial<IAuthRequest>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {},
      params: {},
      cookies: {},
      user: {
        _id: 'user123',
        username: 'testadmin',
        firstname: 'Test',
        lastname: 'Admin',
        email: 'admin@test.com',
        password: 'hashedpassword',
        role: '507f1f77bcf86cd799439011'
      } as unknown as IUser
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

  // Tests unitaires récupération exercices
  describe('UT-EXO-01 : Fonction de récupération de tous les exercices', () => {
    it('should return all exercises', async () => {
      const mockExercises = [
        {
          _id: 'exercise1',
          title: 'Respiration carrée',
          description: 'Technique de respiration pour la relaxation',
          inspiration: 4,
          apnee: 4,
          expiration: 4
        },
        {
          _id: 'exercise2',
          title: 'Respiration profonde',
          description: 'Technique de respiration pour le calme',
          inspiration: 6,
          apnee: 2,
          expiration: 8
        }
      ];
      
      (Exercise.find as jest.Mock).mockResolvedValue(mockExercises);
      
      await getExercises(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(Exercise.find).toHaveBeenCalled();
      expect(responseObject.json).toHaveBeenCalledWith(mockExercises);
    });

    it('should handle errors and return 500', async () => {
      (Exercise.find as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      await getExercises(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires récupération exercice par ID
  describe('UT-EXO-02 : Fonction de récupération d\'un exercice par ID', () => {
    it('should return a specific exercise by ID', async () => {
      const exerciseId = 'exercise1';
      mockRequest.params = { id: exerciseId };
      
      const mockExercise = {
        _id: exerciseId,
        title: 'Respiration carrée',
        description: 'Technique de respiration pour la relaxation',
        inspiration: 4,
        apnee: 4,
        expiration: 4
      };
      
      (Exercise.findById as jest.Mock).mockResolvedValue(mockExercise);
      
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
      expect(responseObject.json).toHaveBeenCalledWith(mockExercise);
    });

    it('should return 404 if exercise not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      
      (Exercise.findById as jest.Mock).mockResolvedValue(null);
      
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      mockRequest.params = { id: 'exercise1' };
      
      (Exercise.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires création exercice
  describe('UT-EXO-03 : Fonction de création d\'un exercice', () => {
    it('should create a new exercise successfully', async () => {
      const exerciseData = {
        title: 'Nouvelle respiration',
        description: 'Nouvelle technique de respiration',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      mockRequest.body = exerciseData;
      
      const savedExercise = {
        _id: 'newexercise',
        ...exerciseData
      };
      
      (Exercise as unknown as jest.Mock).mockImplementation(() => ({
        ...exerciseData,
        save: jest.fn().mockResolvedValue(savedExercise)
      }));
      
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(Exercise).toHaveBeenCalledWith(exerciseData);
      expect(responseObject.statusCode).toBe(201);
      expect(responseObject.json).toHaveBeenCalledWith(savedExercise);
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = {
        title: 'Exercice incomplet',
        description: 'Description sans durées'
      };
      
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Tous les champs sont requis'
      });
    });

    it('should handle errors and return 500', async () => {
      const exerciseData = {
        title: 'Exercice avec erreur',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      mockRequest.body = exerciseData;
      
      (Exercise as unknown as jest.Mock).mockImplementation(() => ({
        ...exerciseData,
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }));
      
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires mise à jour exercice
  describe('UT-EXO-04 : Fonction de mise à jour d\'un exercice', () => {
    it('should update an exercise successfully', async () => {
      const exerciseId = 'exercise1';
      const updateData = {
        title: 'Respiration mise à jour',
        description: 'Description mise à jour',
        inspiration: 6,
        apnee: 4,
        expiration: 8
      };
      
      mockRequest.params = { id: exerciseId };
      mockRequest.body = updateData;
      
      const updatedExercise = {
        _id: exerciseId,
        ...updateData
      };
      
      (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedExercise);
      
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(Exercise.findByIdAndUpdate).toHaveBeenCalledWith(
        exerciseId,
        updateData,
        { new: true }
      );
      expect(responseObject.json).toHaveBeenCalledWith(updatedExercise);
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.params = { id: 'exercise1' };
      mockRequest.body = {
        title: 'Mise à jour incomplète',
        description: 'Description sans durées'
      };
      
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Tous les champs sont requis'
      });
    });

    it('should return 404 if exercise not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = {
        title: 'Exercice inexistant',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      mockRequest.params = { id: 'exercise1' };
      mockRequest.body = {
        title: 'Exercice avec erreur',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      (Exercise.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires suppression exercice
  describe('UT-EXO-05 : Fonction de suppression d\'un exercice', () => {
    it('should delete an exercise successfully', async () => {
      const exerciseId = 'exercise1';
      mockRequest.params = { id: exerciseId };
      
      const deletedExercise = {
        _id: exerciseId,
        title: 'Exercice à supprimer',
        description: 'Description à supprimer',
        inspiration: 4,
        apnee: 4,
        expiration: 4
      };
      
      (Exercise.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedExercise);
      
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(Exercise.findByIdAndDelete).toHaveBeenCalledWith(exerciseId);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice supprimé avec succès'
      });
    });

    it('should return 404 if exercise not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      
      (Exercise.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      mockRequest.params = { id: 'exercise1' };
      
      (Exercise.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});