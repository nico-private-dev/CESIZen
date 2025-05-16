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
    
    // Créer un mock de la requête avec un utilisateur complet
    mockRequest = {
      body: {},
      params: {},
      cookies: {}, // Ajout des cookies pour l'authentification basée sur les cookies
      user: {
        _id: 'user123',
        username: 'testadmin',
        firstname: 'Test',
        lastname: 'Admin',
        email: 'admin@test.com',
        password: 'hashedpassword',
        // Utiliser une chaîne de 24 caractères hexadécimaux valide pour l'ObjectId
        role: '507f1f77bcf86cd799439011'
      } as unknown as IUser
    };
    
    // Créer un mock de la réponse
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return responseObject;
      }),
      cookie: jest.fn().mockReturnThis() // Ajout pour gérer les cookies dans les tests
    };
    mockResponse = responseObject;
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données après tous les tests
    await mongoose.connection.close();
  });

  describe('getExercises', () => {
    it('should return all exercises', async () => {
      // Configurer les mocks
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
      
      // Mock de la méthode find() de Exercise
      (Exercise.find as jest.Mock).mockResolvedValue(mockExercises);
      
      // Appeler la fonction à tester
      await getExercises(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Exercise.find).toHaveBeenCalled();
      expect(responseObject.json).toHaveBeenCalledWith(mockExercises);
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks pour simuler une erreur
      (Exercise.find as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Appeler la fonction à tester
      await getExercises(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('getExerciseById', () => {
    it('should return a specific exercise by ID', async () => {
      // Configurer les mocks
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
      
      // Mock de la méthode findById() de Exercise
      (Exercise.findById as jest.Mock).mockResolvedValue(mockExercise);
      
      // Appeler la fonction à tester
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
      expect(responseObject.json).toHaveBeenCalledWith(mockExercise);
    });

    it('should return 404 if exercise not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      
      // Mock de la méthode findById() de Exercise pour retourner null
      (Exercise.findById as jest.Mock).mockResolvedValue(null);
      
      // Appeler la fonction à tester
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'exercise1' };
      
      // Mock de la méthode findById() de Exercise pour lancer une erreur
      (Exercise.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Appeler la fonction à tester
      await getExerciseById(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise successfully', async () => {
      // Configurer les mocks
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
      
      // Mock du constructeur Exercise et de la méthode save()
      (Exercise as unknown as jest.Mock).mockImplementation(() => ({
        ...exerciseData,
        save: jest.fn().mockResolvedValue(savedExercise)
      }));
      
      // Appeler la fonction à tester
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Exercise).toHaveBeenCalledWith(exerciseData);
      expect(responseObject.statusCode).toBe(201);
      expect(responseObject.json).toHaveBeenCalledWith(savedExercise);
    });

    it('should return 400 if required fields are missing', async () => {
      // Configurer les mocks avec des données incomplètes
      mockRequest.body = {
        title: 'Exercice incomplet',
        description: 'Description sans durées'
        // inspiration, apnee et expiration manquants
      };
      
      // Appeler la fonction à tester
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Tous les champs sont requis'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      const exerciseData = {
        title: 'Exercice avec erreur',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      mockRequest.body = exerciseData;
      
      // Mock du constructeur Exercise pour lancer une erreur lors de save()
      (Exercise as unknown as jest.Mock).mockImplementation(() => ({
        ...exerciseData,
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }));
      
      // Appeler la fonction à tester
      await createExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('updateExercise', () => {
    it('should update an exercise successfully', async () => {
      // Configurer les mocks
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
      
      // Mock de la méthode findByIdAndUpdate() de Exercise
      (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedExercise);
      
      // Appeler la fonction à tester
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Exercise.findByIdAndUpdate).toHaveBeenCalledWith(
        exerciseId,
        updateData,
        { new: true }
      );
      expect(responseObject.json).toHaveBeenCalledWith(updatedExercise);
    });

    it('should return 400 if required fields are missing', async () => {
      // Configurer les mocks avec des données incomplètes
      mockRequest.params = { id: 'exercise1' };
      mockRequest.body = {
        title: 'Mise à jour incomplète',
        description: 'Description sans durées'
        // inspiration, apnee et expiration manquants
      };
      
      // Appeler la fonction à tester
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Tous les champs sont requis'
      });
    });

    it('should return 404 if exercise not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = {
        title: 'Exercice inexistant',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      // Mock de la méthode findByIdAndUpdate() de Exercise pour retourner null
      (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      
      // Appeler la fonction à tester
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'exercise1' };
      mockRequest.body = {
        title: 'Exercice avec erreur',
        description: 'Description complète',
        inspiration: 5,
        apnee: 3,
        expiration: 7
      };
      
      // Mock de la méthode findByIdAndUpdate() de Exercise pour lancer une erreur
      (Exercise.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Appeler la fonction à tester
      await updateExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise successfully', async () => {
      // Configurer les mocks
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
      
      // Mock de la méthode findByIdAndDelete() de Exercise
      (Exercise.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedExercise);
      
      // Appeler la fonction à tester
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Exercise.findByIdAndDelete).toHaveBeenCalledWith(exerciseId);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice supprimé avec succès'
      });
    });

    it('should return 404 if exercise not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      
      // Mock de la méthode findByIdAndDelete() de Exercise pour retourner null
      (Exercise.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      
      // Appeler la fonction à tester
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Exercice non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'exercise1' };
      
      // Mock de la méthode findByIdAndDelete() de Exercise pour lancer une erreur
      (Exercise.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Appeler la fonction à tester
      await deleteExercise(mockRequest as IAuthRequest, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});