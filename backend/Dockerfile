FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances
RUN pnpm install

# Copier le reste du code source
COPY . .

# Compiler le TypeScript en mode production
RUN if [ "$NODE_ENV" = "production" ]; then pnpm build; fi

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5001

# Commande pour démarrer l'application selon l'environnement
CMD if [ "$NODE_ENV" = "production" ]; then pnpm start; else pnpm dev; fi
