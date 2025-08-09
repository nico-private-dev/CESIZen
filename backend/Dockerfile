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

# Compiler le TypeScript
RUN pnpm build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5001

# Commande pour démarrer l'application
CMD ["pnpm", "start"]
