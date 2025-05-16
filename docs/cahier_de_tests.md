# Cahier de Tests - Projet CESIZen

## Introduction

Ce document présente les tests implémentés pour l'application CESIZen. Il couvre les tests unitaires et fonctionnels réalisés avec Jest pour les modules suivants :
- Authentification des utilisateurs
- Gestion des informations/articles
- Exercices de respiration

## Tests Unitaires

### Module Authentification

#### Test UT-AUTH-01 : Fonction de connexion
- **Description** : Vérifier que la fonction de connexion du store d'authentification fonctionne correctement
- **Prérequis** : Mock de l'API d'authentification
- **Données de test** : Email "test@example.com", mot de passe "Password123"
- **Étapes** :
  1. Appeler la fonction `login` avec les identifiants
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API avec les bons paramètres et traite correctement la réponse
- **Implémentation** : Test Jest avec mock d'axios

#### Test UT-AUTH-02 : Fonction d'inscription
- **Description** : Vérifier que la fonction d'inscription du store d'authentification fonctionne correctement
- **Prérequis** : Mock de l'API d'authentification
- **Données de test** : Données utilisateur valides
- **Étapes** :
  1. Appeler la fonction `register` avec les données utilisateur
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API avec les bons paramètres et traite correctement la réponse
- **Implémentation** : Test Jest avec mock d'axios

#### Test UT-AUTH-03 : Validation des données d'authentification
- **Description** : Vérifier que la validation des données d'authentification fonctionne correctement
- **Prérequis** : N/A
- **Données de test** : Données valides et invalides
- **Étapes** :
  1. Appeler les fonctions de validation avec différentes données
- **Résultat attendu** : Les fonctions de validation retournent les résultats attendus
- **Implémentation** : Test Jest des fonctions de validation

### Module Informations/Articles

#### Test UT-INFO-01 : Récupération des articles
- **Description** : Vérifier que la fonction de récupération des articles fonctionne correctement
- **Prérequis** : Mock de l'API d'articles
- **Données de test** : Liste d'articles mockée
- **Étapes** :
  1. Appeler la fonction `fetchArticles`
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API et met à jour le store avec les articles reçus
- **Implémentation** : Test Jest avec mock d'axios

#### Test UT-INFO-02 : Création d'un article
- **Description** : Vérifier que la fonction de création d'article fonctionne correctement
- **Prérequis** : Mock de l'API d'articles
- **Données de test** : Données d'article valides
- **Étapes** :
  1. Appeler la fonction `createArticle` avec les données d'article
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API avec les bons paramètres et met à jour le store
- **Implémentation** : Test Jest avec mock d'axios

#### Test UT-INFO-03 : Mise à jour d'un article
- **Description** : Vérifier que la fonction de mise à jour d'article fonctionne correctement
- **Prérequis** : Mock de l'API d'articles
- **Données de test** : ID d'article et données de mise à jour
- **Étapes** :
  1. Appeler la fonction `updateArticle` avec l'ID et les données
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API avec les bons paramètres et met à jour le store
- **Implémentation** : Test Jest avec mock d'axios

### Module Exercices de Respiration

#### Test UT-EXO-01 : Récupération des exercices
- **Description** : Vérifier que la fonction de récupération des exercices fonctionne correctement
- **Prérequis** : Mock de l'API d'exercices
- **Données de test** : Liste d'exercices mockée
- **Étapes** :
  1. Appeler la fonction `fetchExercises`
  2. Vérifier la réponse de l'API
- **Résultat attendu** : La fonction appelle l'API et met à jour le store avec les exercices reçus
- **Implémentation** : Test Jest avec mock d'axios

#### Test UT-EXO-02 : Calcul des durées d'exercice
- **Description** : Vérifier que le calcul des durées totales d'exercice fonctionne correctement
- **Prérequis** : N/A
- **Données de test** : Exercice avec durées d'inspiration, d'apnée et d'expiration définies
- **Étapes** :
  1. Appeler la fonction de calcul de durée totale
- **Résultat attendu** : La fonction retourne la durée totale correcte
- **Implémentation** : Test Jest de la fonction de calcul

#### Test UT-EXO-03 : Gestion des états d'exercice
- **Description** : Vérifier que la gestion des états d'exercice fonctionne correctement
- **Prérequis** : N/A
- **Données de test** : États d'exercice (inactif, actif, pause)
- **Étapes** :
  1. Appeler les fonctions de changement d'état
  2. Vérifier les transitions d'état
- **Résultat attendu** : Les transitions d'état se font correctement
- **Implémentation** : Test Jest des fonctions de gestion d'état

## Tests Fonctionnels

### Module Authentification

#### Test FT-AUTH-01 : Inscription utilisateur
- **Description** : Vérifier que l'inscription d'un nouvel utilisateur fonctionne correctement
- **Prérequis** : Application accessible
- **Données de test** : Utilisateur avec nom d'utilisateur "johndoe", email "john.doe@example.com", mot de passe "Test1234"
- **Étapes** :
  1. Accéder à la page d'inscription
  2. Remplir le formulaire avec les informations valides
  3. Soumettre le formulaire
- **Résultat attendu** : L'utilisateur est redirigé vers la page d'accueil et est connecté
- **Implémentation** : Test Jest vérifiant l'appel à la fonction register et la redirection

#### Test FT-AUTH-02 : Connexion utilisateur
- **Description** : Vérifier que la connexion d'un utilisateur existant fonctionne correctement
- **Prérequis** : Utilisateur existant
- **Données de test** : Email "nforget82@gmail.com", mot de passe "Test1234"
- **Étapes** :
  1. Accéder à la page de connexion
  2. Remplir le formulaire avec des identifiants valides
  3. Cliquer sur le bouton de connexion
- **Résultat attendu** : L'utilisateur est redirigé vers la page d'accueil et est connecté
- **Implémentation** : Test Jest vérifiant l'appel à la fonction login et la redirection

#### Test FT-AUTH-03 : Gestion des erreurs de connexion
- **Description** : Vérifier que les erreurs de connexion sont correctement affichées
- **Prérequis** : Application accessible
- **Données de test** : Email "wrong@example.com", mot de passe "WrongPassword123!"
- **Étapes** :
  1. Accéder à la page de connexion
  2. Remplir le formulaire avec des identifiants invalides
  3. Cliquer sur le bouton de connexion
- **Résultat attendu** : Un message d'erreur s'affiche
- **Implémentation** : Test Jest vérifiant l'affichage du message d'erreur

### Module Informations/Articles

#### Test FT-INFO-01 : Consultation des articles
- **Description** : Vérifier que la consultation des articles fonctionne correctement
- **Prérequis** : Articles existants
- **Données de test** : Liste d'articles mockée
- **Étapes** :
  1. Accéder à la page d'informations
  2. Vérifier l'affichage des articles
- **Résultat attendu** : La liste des articles s'affiche correctement
- **Implémentation** : Test Jest vérifiant l'affichage des articles

#### Test FT-INFO-02 : Filtrage des articles par catégorie
- **Description** : Vérifier que le filtrage des articles par catégorie fonctionne correctement
- **Prérequis** : Articles de différentes catégories
- **Données de test** : Articles mockés avec catégories "Santé" et "Bien-être"
- **Étapes** :
  1. Accéder à la page d'informations
  2. Sélectionner une catégorie dans le filtre
- **Résultat attendu** : Seuls les articles de la catégorie sélectionnée sont affichés
- **Implémentation** : Test Jest vérifiant le filtrage des articles

#### Test FT-INFO-03 : Création d'un article (admin)
- **Description** : Vérifier que la création d'un article par un admin fonctionne correctement
- **Prérequis** : Utilisateur avec rôle admin connecté
- **Données de test** : Données d'article valides (titre, contenu, catégorie)
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Remplir le formulaire de création d'article
  3. Soumettre le formulaire
- **Résultat attendu** : L'article est créé et apparaît dans la liste des articles
- **Implémentation** : Test Jest vérifiant l'appel à la fonction de création d'article

#### Test FT-INFO-04 : Modification d'un article (admin)
- **Description** : Vérifier que la modification d'un article par un admin fonctionne correctement
- **Prérequis** : Utilisateur admin connecté, article existant
- **Données de test** : Données de mise à jour valides
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Sélectionner un article à modifier
  3. Modifier les données et soumettre
- **Résultat attendu** : L'article est mis à jour et les modifications sont visibles
- **Implémentation** : Test Jest vérifiant l'appel à la fonction de mise à jour d'article

#### Test FT-INFO-05 : Suppression d'un article (admin)
- **Description** : Vérifier que la suppression d'un article par un admin fonctionne correctement
- **Prérequis** : Utilisateur admin connecté, article existant
- **Données de test** : ID d'article à supprimer
- **Étapes** :
  1. Accéder à l'interface d'administration
  2. Sélectionner un article à supprimer
  3. Confirmer la suppression
- **Résultat attendu** : L'article est supprimé de la liste
- **Implémentation** : Test Jest vérifiant l'appel à la fonction de suppression d'article

### Module Exercices de Respiration

#### Test FT-EXO-01 : Affichage de la liste des exercices de respiration
- **Description** : Vérifier que la liste des exercices de respiration s'affiche correctement
- **Prérequis** : Exercices existants
- **Données de test** : Exercices préchargés (Respiration carrée, Respiration profonde)
- **Étapes** :
  1. Accéder à la page des exercices de respiration
  2. Vérifier que la liste des exercices s'affiche
  3. Vérifier que les durées des phases sont affichées pour chaque exercice
- **Résultat attendu** : La liste des exercices s'affiche correctement avec leurs titres et durées des phases
- **Implémentation** : Test Jest vérifiant l'affichage des exercices et de leurs durées

#### Test FT-EXO-02 : Sélection et affichage des détails d'un exercice
- **Description** : Vérifier qu'un exercice peut être sélectionné et que ses détails s'affichent correctement
- **Prérequis** : Exercices existants
- **Données de test** : Exercice "Respiration carrée"
- **Étapes** :
  1. Accéder à la page des exercices de respiration
  2. Cliquer sur l'exercice "Respiration carrée"
  3. Vérifier que les détails de l'exercice s'affichent
- **Résultat attendu** : Les détails de l'exercice (titre, description, durées) s'affichent correctement et le bouton "Commencer" est disponible
- **Implémentation** : Test Jest vérifiant l'affichage des détails de l'exercice sélectionné

#### Test FT-EXO-03 : Démarrage et exécution d'un exercice de respiration
- **Description** : Vérifier qu'un exercice peut être démarré et que les phases se déroulent correctement
- **Prérequis** : Exercice "Respiration carrée" sélectionné
- **Données de test** : Exercice avec phases d'inspiration (4s), apnée (4s) et expiration (4s)
- **Étapes** :
  1. Cliquer sur le bouton "Commencer"
  2. Observer le déroulement des phases (Inspirez, Retenez, Expirez)
  3. Vérifier que le compteur de temps fonctionne pour chaque phase
  4. Vérifier que le compteur de cycles s'incrémente correctement
- **Résultat attendu** : L'exercice se déroule correctement avec les temps d'inspiration, d'apnée et d'expiration conformes, et le compteur de cycles s'incrémente
- **Implémentation** : Test Jest utilisant jest.useFakeTimers() pour simuler le passage du temps et vérifier les transitions de phases

#### Test FT-EXO-04 : Ajustement du nombre de cycles
- **Description** : Vérifier que le nombre de cycles peut être ajusté avant de démarrer un exercice
- **Prérequis** : Exercice sélectionné
- **Données de test** : N/A
- **Étapes** :
  1. Sélectionner un exercice
  2. Utiliser les boutons + et - pour ajuster le nombre de cycles
  3. Saisir directement une valeur dans le champ de cycles
- **Résultat attendu** : Le nombre de cycles est correctement mis à jour et pris en compte lors du démarrage de l'exercice
- **Implémentation** : Test Jest vérifiant les interactions avec les contrôles de cycles et la mise à jour de la valeur

#### Test FT-EXO-05 : Exécution complète d'une session d'exercice
- **Description** : Vérifier qu'une session complète d'exercice se déroule correctement jusqu'à la fin
- **Prérequis** : Exercice "Respiration profonde" sélectionné
- **Données de test** : Exercice avec 1 cycle configuré
- **Étapes** :
  1. Réduire le nombre de cycles à 1
  2. Démarrer l'exercice
  3. Laisser l'exercice se dérouler jusqu'à la fin du cycle
- **Résultat attendu** : L'exercice se termine correctement après un cycle complet et revient à l'état "Prêt"
- **Implémentation** : Test Jest simulant un cycle complet et vérifiant le retour à l'état initial

## Exécution des Tests

Les tests sont exécutés avec Jest en utilisant la commande :

```bash
pnpm test
```

Pour exécuter un groupe spécifique de tests :

```bash
pnpm test auth     # Tests d'authentification
pnpm test info     # Tests de gestion des articles
pnpm test exercise # Tests des exercices de respiration
```

## Maintenance des Tests

Pour maintenir les tests à jour :
1. Mettre à jour les mocks lorsque les interfaces des composants changent
2. Ajouter de nouveaux tests lorsque de nouvelles fonctionnalités sont développées
3. Vérifier que les attributs data-testid sont présents dans les composants
4. Exécuter régulièrement les tests pour détecter les régressions