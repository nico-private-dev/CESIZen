# CESIZen

CESIZen est une application web dédiée à la gestion du stress et au bien-être mental, développée spécifiquement pour les étudiants et le personnel du CESI.

## Fonctionnalités

- **Authentification** : Système complet d'inscription, connexion et gestion de compte
- **Articles d'information** : Consultation d'articles sur la gestion du stress et le bien-être
- **Exercices de respiration** : Accès à des exercices guidés pour la relaxation
- **Rôles utilisateurs** : Distinction entre utilisateurs standards et administrateurs
- **Interface administrateur** : Gestion des articles et des exercices

## Technologies utilisées

### Backend
- Node.js avec Express et TypeScript
- MongoDB (via Mongoose) pour la base de données
- JWT et cookies pour l'authentification
- bcryptjs pour le hachage des mots de passe

### Frontend
- React avec TypeScript
- Vite comme bundler
- Tailwind CSS pour le style
- React Router pour la navigation
- Zustand pour la gestion d'état
- Axios pour les requêtes API

## Installation et configuration

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou pnpm

### Installation du backend

1. Naviguez vers le dossier backend :
   ```bash
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Créez un fichier `.env` à la racine du dossier backend avec les variables suivantes :
   ```
   PORT=5001
   MONGODB_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   JWT_REFRESH_SECRET=votre_secret_refresh_jwt
   NODE_ENV=development
   ```

4. Initialisez les rôles dans la base de données :
   ```bash
   npm run initRoles
   # ou
   pnpm run initRoles
   ```

5. Lancez le serveur en mode développement :
   ```bash
   npm run dev
   # ou
   pnpm run dev
   ```

### Installation du frontend

1. Naviguez vers le dossier frontend :
   ```bash
   cd frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   # ou
   pnpm run dev
   ```

## Structure du projet

```
cesizen/
├── backend/                # Serveur Express
│   ├── config/             # Configuration (base de données, etc.)
│   ├── controllers/        # Contrôleurs pour la logique métier
│   ├── middleware/         # Middleware (authentification, etc.)
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── types/              # Types TypeScript
│   ├── utils/              # Utilitaires
│   └── server.ts           # Point d'entrée du serveur
│
├── frontend/               # Application React
│   ├── public/             # Fichiers statiques
│   └── src/                # Code source
│       ├── components/     # Composants React
│       ├── pages/          # Pages de l'application
│       ├── services/       # Services pour les appels API
│       ├── stores/         # Stores Zustand
│       └── types/          # Types TypeScript
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/mon-compte` - Informations utilisateur
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/logout` - Déconnexion
- `PUT /api/auth/update-username` - Mettre à jour le nom d'utilisateur

### Articles d'information
- `GET /api/info/articles` - Liste tous les articles
- `GET /api/info/articles/:id` - Récupère un article spécifique
- `POST /api/info/articles` - Crée un nouvel article (admin)
- `PUT /api/info/articles/:id` - Met à jour un article (admin)
- `DELETE /api/info/articles/:id` - Supprime un article (admin)

### Exercices de respiration
- `GET /api/exercice-respiration` - Liste tous les exercices
- `GET /api/exercice-respiration/:id` - Récupère un exercice spécifique
- `POST /api/exercice-respiration` - Crée un nouvel exercice (admin)
- `PUT /api/exercice-respiration/:id` - Met à jour un exercice (admin)
- `DELETE /api/exercice-respiration/:id` - Supprime un exercice (admin)

## Notes importantes

- Le backend fonctionne sur le port 5001
- L'authentification utilise des cookies et non des headers
- Toutes les requêtes authentifiées doivent utiliser l'option `withCredentials: true` avec axios
- Les routes frontend utilisent le pluriel pour les informations/articles (/informations, /informations/:id)

## Développement

Pour construire le projet pour la production :

### Backend
```bash
cd backend
npm run build
# ou
pnpm run build
```

### Frontend
```bash
cd frontend
npm run build
# ou
pnpm run build
```

## Licence

Ce projet est développé dans le cadre d'un projet étudiant pour le CESI.

coucou