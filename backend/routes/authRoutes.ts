import express from 'express';
import { signUp, signIn, getMe, refresh, logout, updateUsername } from '../controllers/authController';
import { verifyToken, verifyRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID auto-généré de l'utilisateur
 *         username:
 *           type: string
 *           description: Le nom d'utilisateur
 *         firstname:
 *           type: string
 *           description: Le prénom de l'utilisateur
 *         lastname:
 *           type: string
 *           description: Le nom de famille de l'utilisateur
 *         email:
 *           type: string
 *           description: L'adresse email de l'utilisateur
 *         role:
 *           type: object
 *           description: Le rôle de l'utilisateur
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         username: johndoe
 *         firstname: John
 *         lastname: Doe
 *         email: john@example.com
 *         role:
 *           _id: 60d21b4667d0d8992e610c86
 *           name: user
 */

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: API pour gérer l'authentification des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - roleName
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               roleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Utilisateur existe déjà ou rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Email ou nom d'utilisateur
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', signIn);

/**
 * @swagger
 * /auth/mon-compte:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/mon-compte', verifyToken, getMe);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchit le token d'accès
 *     tags: [Authentification]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de rafraîchissement invalide ou non trouvé
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/update-username:
 *   put:
 *     summary: Met à jour le nom d'utilisateur
 *     tags: [Authentification]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nom d'utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Nom d'utilisateur invalide ou déjà utilisé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/update-username', verifyToken, updateUsername);

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Route protégée pour les administrateurs
 *     tags: [Authentification]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Contenu administrateur
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 */
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
  res.send('Admin Content');
});

export default router;