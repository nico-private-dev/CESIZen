# Cahier de Tests - Projet CESIZen

## Table des matières
1. [Introduction](#introduction)
2. [Stratégie de test](#stratégie-de-test)
3. [Environnements de test](#environnements-de-test)
4. [Tests unitaires](#tests-unitaires)
5. [Tests fonctionnels](#tests-fonctionnels)
6. [Tests de non-régression](#tests-de-non-régression)
7. [Automatisation des tests](#automatisation-des-tests)
8. [Responsabilités](#responsabilités)

## Introduction

Ce document décrit la stratégie de test pour l'application CESIZen, conformément aux exigences du cahier des charges. Il couvre les tests unitaires, fonctionnels et de non-régression pour les modules suivants :
- Authentification des utilisateurs
- Gestion des informations/articles
- Exercices de respiration

## Stratégie de test

La stratégie de test repose sur trois niveaux de tests :
1. **Tests unitaires** : Vérification du bon fonctionnement de chaque composant isolé
2. **Tests fonctionnels** : Vérification du bon fonctionnement des fonctionnalités de bout en bout
3. **Tests de non-régression** : Vérification que les modifications n'ont pas introduit de régressions

## Environnements de test

- **Environnement de développement** : Tests unitaires et fonctionnels pendant le développement
- **Environnement de pré-production** : Tests fonctionnels et de non-régression avant déploiement
- **Environnement de production** : Validation finale

## Tests unitaires

### Module Authentification

#### Test UT-AUTH-01 : Inscription utilisateur
- **Description** : Vérifier que l'inscription d'un nouvel utilisateur fonctionne correctement
- **Prérequis** : Base de données accessible
- **Données de test** : Utilisateur avec email unique, mot de passe valide
- **Étapes** :
  1. Appeler la fonction `signUp` avec les données utilisateur valides
- **Résultat attendu** : L'utilisateur est créé en base de données avec le mot de passe hashé
- **Responsable** : Développeur backend

#### Test UT-AUTH-02 : Connexion utilisateur
- **Description** : Vérifier que la connexion d'un utilisateur existant fonctionne correctement
- **Prérequis** : Utilisateur existant en base de données
- **Données de test** : Identifiants valides d'un utilisateur existant
- **Étapes** :
  1. Appeler la fonction `signIn` avec les identifiants valides
- **Résultat attendu** : Les tokens d'authentification sont générés et les cookies sont définis
- **Responsable** : Développeur backend

#### Test UT-AUTH-03 : Validation du token
- **Description** : Vérifier que le middleware de validation du token fonctionne correctement
- **Prérequis** : Token JWT valide
- **Données de test** : Token JWT valide et invalide
- **Étapes** :
  1. Appeler le middleware `verifyToken` avec un token valide
  2. Appeler le middleware `verifyToken` avec un token invalide
- **Résultat attendu** : Le middleware autorise l'accès avec un token valide et le refuse avec un token invalide
- **Responsable** : Développeur backend

### Module Informations/Articles

#### Test UT-INFO-01 : Création d'un article
- **Description** : Vérifier que la création d'un nouvel article fonctionne correctement
- **Prérequis** : Catégorie existante en base de données
- **Données de test** : Données d'article valides avec catégorie existante
- **Étapes** :
  1. Appeler la fonction `createInfo` avec les données d'article valides
- **Résultat attendu** : L'article est créé en base de données et retourné avec sa catégorie
- **Responsable** : Développeur backend

#### Test UT-INFO-02 : Récupération des articles
- **Description** : Vérifier que la récupération des articles fonctionne correctement
- **Prérequis** : Articles existants en base de données
- **Données de test** : N/A
- **Étapes** :
  1. Appeler la fonction `getInfo`
- **Résultat attendu** : La liste des articles est retournée avec leurs catégories
- **Responsable** : Développeur backend

#### Test UT-INFO-03 : Mise à jour d'un article
- **Description** : Vérifier que la mise à jour d'un article fonctionne correctement
- **Prérequis** : Article existant en base de données
- **Données de test** : Données de mise à jour valides
- **Étapes** :
  1. Appeler la fonction `updateInfo` avec l'ID d'un article existant et les données de mise à jour
- **Résultat attendu** : L'article est mis à jour en base de données et retourné avec sa catégorie
- **Responsable** : Développeur backend

### Module Exercices de Respiration

#### Test UT-EXO-01 : Création d'un exercice
- **Description** : Vérifier que la création d'un nouvel exercice fonctionne correctement
- **Prérequis** : Base de données accessible
- **Données de test** : Données d'exercice valides
- **Étapes** :
  1. Appeler la fonction `createExercise` avec les données d'exercice valides
- **Résultat attendu** : L'exercice est créé en base de données et retourné
- **Responsable** : Développeur backend

#### Test UT-EXO-02 : Récupération des exercices
- **Description** : Vérifier que la récupération des exercices fonctionne correctement
- **Prérequis** : Exercices existants en base de données
- **Données de test** : N/A
- **Étapes** :
  1. Appeler la fonction `getExercises`
- **Résultat attendu** : La liste des exercices est retournée
- **Responsable** : Développeur backend

#### Test UT-EXO-03 : Validation des données d'exercice
- **Description** : Vérifier que la validation des données d'exercice fonctionne correctement
- **Prérequis** : N/A
- **Données de test** : Données d'exercice valides et invalides
- **Étapes** :
  1. Appeler la fonction `createExercise` avec des données d'exercice incomplètes
- **Résultat attendu** : Une erreur 400 est retournée avec un message approprié
- **Responsable** : Développeur backend

## Tests fonctionnels

### Module Authentification

#### Test FT-AUTH-01 : Parcours d'inscription
- **Description** : Vérifier que le parcours d'inscription fonctionne correctement de bout en bout
- **Prérequis** : Application accessible
- **Données de test** : Informations utilisateur valides
- **Étapes** :
  1. Accéder à la page d'inscription
  2. Remplir le formulaire avec des informations valides
  3. Soumettre le formulaire
- **Résultat attendu** : L'utilisateur est redirigé vers la page d'accueil et est connecté
- **Responsable** : Testeur fonctionnel

#### Test FT-AUTH-02 : Parcours de connexion
- **Description** : Vérifier que le parcours de connexion fonctionne correctement de bout en bout
- **Prérequis** : Utilisateur existant
- **Données de test** : Identifiants valides
- **Étapes** :
  1. Accéder à la page de connexion
  2. Remplir le formulaire avec des identifiants valides
  3. Soumettre le formulaire
- **Résultat attendu** : L'utilisateur est redirigé vers la page d'accueil et est connecté
- **Responsable** : Testeur fonctionnel

#### Test FT-AUTH-03 : Accès aux pages protégées
- **Description** : Vérifier que l'accès aux pages protégées est correctement contrôlé
- **Prérequis** : Utilisateur avec rôle admin et utilisateur avec rôle user
- **Données de test** : Identifiants des deux utilisateurs
- **Étapes** :
  1. Se connecter avec l'utilisateur admin
  2. Accéder à une page réservée aux admins
  3. Se déconnecter
  4. Se connecter avec l'utilisateur standard
  5. Tenter d'accéder à une page réservée aux admins
- **Résultat attendu** : L'admin peut accéder à la page réservée, l'utilisateur standard est redirigé
- **Responsable** : Testeur fonctionnel

### Module Informations/Articles

#### Test FT-INFO-01 : Consultation des articles
- **Description** : Vérifier que la consultation des articles fonctionne correctement
- **Prérequis** : Articles existants
- **Données de test** : N/A
- **Étapes** :
  1. Accéder à la page d'informations
  2. Vérifier l'affichage des articles
  3. Cliquer sur un article
- **Résultat attendu** : La liste des articles s'affiche correctement et le détail d'un article s'affiche au clic
- **Responsable** : Testeur fonctionnel

#### Test FT-INFO-02 : Création d'un article (admin)
- **Description** : Vérifier que la création d'un article par un admin fonctionne correctement
- **Prérequis** : Utilisateur avec rôle admin connecté
- **Données de test** : Données d'article valides
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Accéder au formulaire de création d'article
  3. Remplir le formulaire avec des données valides
  4. Soumettre le formulaire
- **Résultat attendu** : L'article est créé et apparaît dans la liste des articles
- **Responsable** : Testeur fonctionnel

#### Test FT-INFO-03 : Modification d'un article (admin)
- **Description** : Vérifier que la modification d'un article par un admin fonctionne correctement
- **Prérequis** : Utilisateur avec rôle admin connecté, article existant
- **Données de test** : Données de mise à jour valides
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Accéder à la liste des articles
  3. Cliquer sur le bouton de modification d'un article
  4. Modifier les données de l'article
  5. Soumettre le formulaire
- **Résultat attendu** : L'article est mis à jour et les modifications sont visibles
- **Responsable** : Testeur fonctionnel

### Module Exercices de Respiration

#### Test FT-EXO-01 : Consultation des exercices
- **Description** : Vérifier que la consultation des exercices fonctionne correctement
- **Prérequis** : Exercices existants
- **Données de test** : N/A
- **Étapes** :
  1. Accéder à la page des exercices de respiration
  2. Vérifier l'affichage des exercices
  3. Cliquer sur un exercice
- **Résultat attendu** : La liste des exercices s'affiche correctement et le détail d'un exercice s'affiche au clic
- **Responsable** : Testeur fonctionnel

#### Test FT-EXO-02 : Utilisation d'un exercice
- **Description** : Vérifier que l'utilisation d'un exercice fonctionne correctement
- **Prérequis** : Exercice existant
- **Données de test** : N/A
- **Étapes** :
  1. Accéder à la page de détail d'un exercice
  2. Démarrer l'exercice
  3. Suivre les instructions de respiration
  4. Terminer l'exercice
- **Résultat attendu** : L'exercice se déroule correctement avec les temps d'inspiration, d'apnée et d'expiration conformes
- **Responsable** : Testeur fonctionnel

#### Test FT-EXO-03 : Gestion des exercices (admin)
- **Description** : Vérifier que la gestion des exercices par un admin fonctionne correctement
- **Prérequis** : Utilisateur avec rôle admin connecté
- **Données de test** : Données d'exercice valides
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Accéder à la gestion des exercices
  3. Créer un nouvel exercice
  4. Modifier un exercice existant
  5. Supprimer un exercice
- **Résultat attendu** : Les opérations CRUD sur les exercices fonctionnent correctement
- **Responsable** : Testeur fonctionnel

## Tests de non-régression

### Module Authentification

#### Test NR-AUTH-01 : Persistance de la session
- **Description** : Vérifier que la session utilisateur persiste correctement après une mise à jour
- **Prérequis** : Utilisateur connecté avant la mise à jour
- **Données de test** : Session utilisateur valide
- **Étapes** :
  1. Se connecter avec un utilisateur valide
  2. Déployer la mise à jour
  3. Rafraîchir la page
- **Résultat attendu** : L'utilisateur reste connecté après la mise à jour
- **Responsable** : Testeur de non-régression

#### Test NR-AUTH-02 : Validation des rôles
- **Description** : Vérifier que les restrictions d'accès basées sur les rôles fonctionnent toujours après une mise à jour
- **Prérequis** : Utilisateurs avec différents rôles
- **Données de test** : Identifiants des utilisateurs
- **Étapes** :
  1. Se connecter avec différents utilisateurs
  2. Tenter d'accéder à des pages protégées
- **Résultat attendu** : Les restrictions d'accès sont toujours respectées
- **Responsable** : Testeur de non-régression

### Module Informations/Articles

#### Test NR-INFO-01 : Affichage des articles
- **Description** : Vérifier que l'affichage des articles fonctionne toujours correctement après une mise à jour
- **Prérequis** : Articles existants
- **Données de test** : N/A
- **Étapes** :
  1. Accéder à la page d'informations
  2. Vérifier l'affichage des articles
- **Résultat attendu** : Les articles s'affichent correctement avec leurs catégories
- **Responsable** : Testeur de non-régression

#### Test NR-INFO-02 : CRUD des articles
- **Description** : Vérifier que les opérations CRUD sur les articles fonctionnent toujours correctement après une mise à jour
- **Prérequis** : Utilisateur admin connecté
- **Données de test** : Données d'article valides
- **Étapes** :
  1. Créer un nouvel article
  2. Modifier un article existant
  3. Supprimer un article
- **Résultat attendu** : Les opérations CRUD fonctionnent comme avant la mise à jour
- **Responsable** : Testeur de non-régression

### Module Exercices de Respiration

#### Test NR-EXO-01 : Fonctionnement des exercices
- **Description** : Vérifier que les exercices de respiration fonctionnent toujours correctement après une mise à jour
- **Prérequis** : Exercices existants
- **Données de test** : N/A
- **Étapes** :
  1. Accéder à un exercice
  2. Démarrer l'exercice
  3. Vérifier le déroulement de l'exercice
- **Résultat attendu** : L'exercice se déroule correctement avec les temps appropriés
- **Responsable** : Testeur de non-régression

#### Test NR-EXO-02 : Gestion des exercices
- **Description** : Vérifier que la gestion des exercices fonctionne toujours correctement après une mise à jour
- **Prérequis** : Utilisateur admin connecté
- **Données de test** : Données d'exercice valides
- **Étapes** :
  1. Créer un nouvel exercice
  2. Modifier un exercice existant
  3. Supprimer un exercice
- **Résultat attendu** : Les opérations de gestion fonctionnent comme avant la mise à jour
- **Responsable** : Testeur de non-régression

## Automatisation des tests

### Tests unitaires
- Les tests unitaires sont automatisés avec Jest
- Exécution automatique à chaque commit via GitHub Actions
- Couverture de code minimale requise : 80%

### Tests fonctionnels
- Les tests fonctionnels critiques sont automatisés avec Cypress
- Exécution manuelle avant chaque déploiement
- Exécution automatique hebdomadaire

### Tests de non-régression
- Les tests de non-régression sont automatisés avec Cypress
- Exécution automatique avant chaque déploiement en production
- Rapport de non-régression généré automatiquement

## Responsabilités

- **Développeurs** : Création et maintenance des tests unitaires
- **Testeurs fonctionnels** : Exécution des tests fonctionnels et création des tests automatisés
- **Responsable qualité** : Validation des tests de non-régression et approbation des déploiements
