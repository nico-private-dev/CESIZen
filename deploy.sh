#!/bin/bash

# Script de déploiement pour CESIZen
# Usage: ./deploy.sh [dev|test|prod]

# Vérification des arguments
if [ $# -ne 1 ]; then
    echo "Usage: ./deploy.sh [dev|test|prod]"
    exit 1
fi

# Définition de l'environnement
ENV=$1
VALID_ENVS=("dev" "test" "prod")

# Vérification de l'environnement
if [[ ! " ${VALID_ENVS[@]} " =~ " ${ENV} " ]]; then
    echo "Environnement invalide. Utilisez dev, test ou prod."
    exit 1
fi

echo "Déploiement de CESIZen dans l'environnement: $ENV"

# Sélection du fichier d'environnement approprié
if [ "$ENV" == "dev" ]; then
    ENV_FILE=".env.development"
elif [ "$ENV" == "test" ]; then
    ENV_FILE=".env.test"
else
    ENV_FILE=".env.production"
fi

# Vérification de l'existence du fichier d'environnement
if [ ! -f "$ENV_FILE" ]; then
    echo "Erreur: Le fichier $ENV_FILE n'existe pas."
    exit 1
fi

# Copie du fichier d'environnement
echo "Utilisation du fichier d'environnement: $ENV_FILE"
cp "$ENV_FILE" .env

# Arrêt des conteneurs existants
echo "Arrêt des conteneurs existants..."
docker-compose down

# Construction et démarrage des conteneurs
echo "Construction et démarrage des conteneurs..."
docker-compose up -d --build

# Vérification du statut des conteneurs
echo "Vérification du statut des conteneurs..."
docker-compose ps

echo "Déploiement terminé avec succès!"
exit 0
