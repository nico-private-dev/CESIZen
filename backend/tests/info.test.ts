import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getInfo, getInfoById, createInfo, updateInfo, deleteInfo } from '../controllers/infoController';
import Info from '../models/infoModel';
import { IAuthRequest } from '../types/auth';

// Mock des modèles
jest.mock('../models/infoModel');

describe('Info Controller Tests', () => {
  let mockRequest: Partial<IAuthRequest>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Créer un mock de la requête
    mockRequest = {
      body: {},
      params: {},
      user: undefined
    };
    
    // Créer un mock de la réponse
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return responseObject;
      })
    };
    mockResponse = responseObject;
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données après tous les tests
    await mongoose.connection.close();
  });

  describe('getInfo', () => {
    it('should return all articles with their categories', async () => {
      // Configurer les mocks
      const mockArticles = [
        {
          _id: 'article1',
          title: 'Article 1',
          content: 'Content 1',
          category: {
            _id: 'category1',
            name: 'Category 1'
          }
        },
        {
          _id: 'article2',
          title: 'Article 2',
          content: 'Content 2',
          category: {
            _id: 'category2',
            name: 'Category 2'
          }
        }
      ];
      
      // Mock de la méthode find() de Info
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockArticles)
      };
      
      (Info.find as jest.Mock).mockReturnValue(mockFind);
      
      // Appeler la fonction à tester
      await getInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Info.find).toHaveBeenCalled();
      expect(mockFind.populate).toHaveBeenCalledWith('category');
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(responseObject.json).toHaveBeenCalledWith(mockArticles);
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks pour simuler une erreur
      const mockError = new Error('Database error');
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(mockError)
      };
      
      (Info.find as jest.Mock).mockReturnValue(mockFind);
      
      // Appeler la fonction à tester
      await getInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('getInfoById', () => {
    it('should return a specific article by ID', async () => {
      // Configurer les mocks
      const articleId = 'article1';
      mockRequest.params = { id: articleId };
      
      const mockArticle = {
        _id: articleId,
        title: 'Article 1',
        content: 'Content 1',
        category: {
          _id: 'category1',
          name: 'Category 1'
        }
      };
      
      // Mock de la méthode findById() de Info avec populate
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(mockArticle);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      // Appeler la fonction à tester
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Info.findById).toHaveBeenCalledWith(articleId);
      expect(mockFindByIdPopulate).toHaveBeenCalledWith('category');
      expect(responseObject.json).toHaveBeenCalledWith(mockArticle);
    });

    it('should return 404 if article not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      
      // Mock de la méthode findById() de Info avec populate
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(null);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      // Appeler la fonction à tester
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'article1' };
      
      // Mock de la méthode findById() de Info pour lancer une erreur
      const mockError = new Error('Database error');
      jest.spyOn(Info, 'findById').mockImplementation(() => {
        throw mockError;
      });
      
      // Appeler la fonction à tester
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('createInfo', () => {
    it('should create a new article successfully', async () => {
      // Configurer les mocks
      const articleData = {
        title: 'New Article',
        content: 'New Content',
        category: 'category1'
      };
      
      mockRequest.body = articleData;
      
      const savedArticle = {
        _id: 'newarticle',
        ...articleData
      };
      
      const populatedArticle = {
        _id: 'newarticle',
        title: 'New Article',
        content: 'New Content',
        category: {
          _id: 'category1',
          name: 'Category 1'
        }
      };
      
      // Mock du constructeur et save
      const mockSave = jest.fn().mockResolvedValue(savedArticle);
      (Info as unknown as jest.Mock).mockImplementation(() => ({
        ...articleData,
        save: mockSave
      }));
      
      // Mock de findById avec populate
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(populatedArticle);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      // Appeler la fonction à tester
      await createInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(201);
      expect(responseObject.json).toHaveBeenCalledWith(populatedArticle);
    });

    it('should handle validation errors and return 400', async () => {
      // Configurer les mocks avec des données incomplètes
      mockRequest.body = {
        title: 'Incomplete Article'
        // content et category manquants
      };
      
      // Mock du constructeur pour lancer une erreur
      const mockError = new Error('Validation error');
      const mockSave = jest.fn().mockRejectedValue(mockError);
      (Info as unknown as jest.Mock).mockImplementation(() => ({
        ...mockRequest.body,
        save: mockSave
      }));
      
      // Appeler la fonction à tester
      await createInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });
  });

  describe('updateInfo', () => {
    it('should update an article successfully', async () => {
      // Configurer les mocks
      const articleId = 'article1';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: 'updatedcategory'
      };
      
      mockRequest.params = { id: articleId };
      mockRequest.body = updateData;
      
      const updatedArticle = {
        _id: articleId,
        ...updateData,
        category: {
          _id: 'updatedcategory',
          name: 'Updated Category'
        }
      };
      
      // Mock de la méthode findByIdAndUpdate() de Info avec populate
      const mockFindByIdAndUpdatePopulate = jest.fn().mockResolvedValue(updatedArticle);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ populate: mockFindByIdAndUpdatePopulate });
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(mockFindByIdAndUpdate);
      
      // Appeler la fonction à tester
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        articleId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(mockFindByIdAndUpdatePopulate).toHaveBeenCalledWith('category');
      expect(responseObject.json).toHaveBeenCalledWith(updatedArticle);
    });

    it('should return 404 if article not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: 'updatedcategory'
      };
      
      // Mock de la méthode findByIdAndUpdate() de Info avec populate
      const mockFindByIdAndUpdatePopulate = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ populate: mockFindByIdAndUpdatePopulate });
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(mockFindByIdAndUpdate);
      
      // Appeler la fonction à tester
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 400', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'article1' };
      mockRequest.body = {
        title: 'Invalid Title'
        // Données incomplètes pour provoquer une erreur
      };
      
      // Mock de la méthode findByIdAndUpdate() de Info pour lancer une erreur
      const mockError = new Error('Validation error');
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(() => {
        throw mockError;
      });
      
      // Appeler la fonction à tester
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });
  });

  describe('deleteInfo', () => {
    it('should delete an article successfully', async () => {
      // Configurer les mocks
      const articleId = 'article1';
      mockRequest.params = { id: articleId };
      
      const deletedArticle = {
        _id: articleId,
        title: 'Article à supprimer',
        content: 'Contenu à supprimer',
        category: {
          _id: 'category1',
          name: 'Category 1'
        }
      };
      
      // Mock de la méthode findByIdAndDelete() de Info avec jest.spyOn
      jest.spyOn(Info, 'findByIdAndDelete').mockResolvedValue(deletedArticle);
      
      // Appeler la fonction à tester
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(Info.findByIdAndDelete).toHaveBeenCalledWith(articleId);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article supprimé avec succès'
      });
    });

    it('should return 404 if article not found', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'nonexistent' };
      
      // Mock de la méthode findByIdAndDelete() de Info avec jest.spyOn
      jest.spyOn(Info, 'findByIdAndDelete').mockResolvedValue(null);
      
      // Appeler la fonction à tester
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      // Configurer les mocks
      mockRequest.params = { id: 'article1' };
      
      // Mock de la méthode findByIdAndDelete() de Info avec jest.spyOn
      const mockError = new Error('Database error');
      jest.spyOn(Info, 'findByIdAndDelete').mockImplementation(() => {
        throw mockError;
      });
      
      // Appeler la fonction à tester
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      // Vérifier les résultats
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});