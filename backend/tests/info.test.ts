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
    
    mockRequest = {
      body: {},
      params: {},
      user: undefined
    };
    
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
    await mongoose.connection.close();
  });

  // Tests unitaires récupération articles
  describe('UT-INFO-01 : Fonction de récupération de tous les articles', () => {
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
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockArticles)
      };
      
      (Info.find as jest.Mock).mockReturnValue(mockFind);
      
      await getInfo(mockRequest as Request, mockResponse as Response);
      
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
      
      await getInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires récupération un article
  describe('UT-INFO-02 : Fonction de récupération d\'un article par ID', () => {
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
      
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(mockArticle);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      expect(Info.findById).toHaveBeenCalledWith(articleId);
      expect(mockFindByIdPopulate).toHaveBeenCalledWith('category');
      expect(responseObject.json).toHaveBeenCalledWith(mockArticle);
    });

    it('should return 404 if article not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(null);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      mockRequest.params = { id: 'article1' };
      
      const mockError = new Error('Database error');
      jest.spyOn(Info, 'findById').mockImplementation(() => {
        throw mockError;
      });
      
      await getInfoById(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  // Tests unitaires création article
  describe('UT-INFO-03 : Fonction de création d\'un article', () => {
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
      
      const mockSave = jest.fn().mockResolvedValue(savedArticle);
      (Info as unknown as jest.Mock).mockImplementation(() => ({
        ...articleData,
        save: mockSave
      }));
      
      const mockFindByIdPopulate = jest.fn().mockResolvedValue(populatedArticle);
      const mockFindById = jest.fn().mockReturnValue({ populate: mockFindByIdPopulate });
      jest.spyOn(Info, 'findById').mockImplementation(mockFindById);
      
      await createInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(201);
      expect(responseObject.json).toHaveBeenCalledWith(populatedArticle);
    });

    it('should handle validation errors and return 400', async () => {
      mockRequest.body = {
        title: 'Incomplete Article'
      };
      
      const mockError = new Error('Validation error');
      const mockSave = jest.fn().mockRejectedValue(mockError);
      (Info as unknown as jest.Mock).mockImplementation(() => ({
        ...mockRequest.body,
        save: mockSave
      }));
      
      await createInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });
  });

  // Tests unitaires mise à jour article
  describe('UT-INFO-04 : Fonction de mise à jour d\'un article', () => {
    it('should update an article successfully', async () => {
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
      
      const mockFindByIdAndUpdatePopulate = jest.fn().mockResolvedValue(updatedArticle);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ populate: mockFindByIdAndUpdatePopulate });
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(mockFindByIdAndUpdate);
      
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        articleId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(mockFindByIdAndUpdatePopulate).toHaveBeenCalledWith('category');
      expect(responseObject.json).toHaveBeenCalledWith(updatedArticle);
    });

    it('should return 404 if article not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = {
        title: 'Updated Title',
        content: 'Updated Content',
        category: 'updatedcategory'
      };
      
      const mockFindByIdAndUpdatePopulate = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ populate: mockFindByIdAndUpdatePopulate });
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(mockFindByIdAndUpdate);
      
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 400', async () => {
      mockRequest.params = { id: 'article1' };
      mockRequest.body = {
        title: 'Invalid Title'
      };
      
      const mockError = new Error('Validation error');
      jest.spyOn(Info, 'findByIdAndUpdate').mockImplementation(() => {
        throw mockError;
      });
      
      await updateInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });
  });

  // Tests unitaires suppression article
  describe('UT-INFO-05 : Fonction de suppression d\'un article', () => {
    it('should delete an article successfully', async () => {
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
      
      jest.spyOn(Info, 'findByIdAndDelete').mockResolvedValue(deletedArticle);
      
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      expect(Info.findByIdAndDelete).toHaveBeenCalledWith(articleId);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article supprimé avec succès'
      });
    });

    it('should return 404 if article not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      
      jest.spyOn(Info, 'findByIdAndDelete').mockResolvedValue(null);
      
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Article non trouvé'
      });
    });

    it('should handle errors and return 500', async () => {
      mockRequest.params = { id: 'article1' };
      
      const mockError = new Error('Database error');
      jest.spyOn(Info, 'findByIdAndDelete').mockImplementation(() => {
        throw mockError;
      });
      
      await deleteInfo(mockRequest as Request, mockResponse as Response);
      
      expect(responseObject.statusCode).toBe(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});