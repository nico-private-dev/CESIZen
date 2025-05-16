import express from 'express';
import { getInfo, createInfo, getInfoById, updateInfo, deleteInfo } from '../controllers/infoController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Info:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de l'article
 *         title:
 *           type: string
 *           description: Le titre de l'article
 *         content:
 *           type: string
 *           description: Le contenu de l'article
 *         category:
 *           type: object
 *           description: La catégorie de l'article
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             description:
 *               type: string
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         title: Comment gérer le stress
 *         content: Voici quelques techniques pour gérer le stress au quotidien...
 *         category:
 *           _id: 60d21b4667d0d8992e610c86
 *           name: Bien-être
 *           description: Articles sur le bien-être et la santé mentale
 */

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API pour gérer les articles d'information
 */

/**
 * @swagger
 * /info/articles:
 *   get:
 *     summary: Récupère la liste de tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Info'
 *       500:
 *         description: Erreur serveur
 */
// Routes pour tous les users
router.get('/articles', getInfo);

/**
 * @swagger
 * /info/articles/{id}:
 *   get:
 *     summary: Récupère un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Détails de l'article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Info'
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
// Route pour un article spécifique
router.get('/articles/:id', getInfoById);

/**
 * @swagger
 * /info/articles:
 *   post:
 *     summary: Crée un nouvel article
 *     tags: [Articles]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: ID de la catégorie
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Info'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
// Routes protégées (admin seulement) + permet de créer, mettre à jour et supprimer des articles
router.post('/articles', verifyToken, verifyRole(['admin']), createInfo);

/**
 * @swagger
 * /info/articles/{id}:
 *   put:
 *     summary: Met à jour un article existant
 *     tags: [Articles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Article mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Info'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/articles/:id', verifyToken, verifyRole(['admin']), updateInfo);

/**
 * @swagger
 * /info/articles/{id}:
 *   delete:
 *     summary: Supprime un article
 *     tags: [Articles]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/articles/:id', verifyToken, verifyRole(['admin']), deleteInfo);

export default router;