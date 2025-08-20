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

# Exposer le port de développement
EXPOSE 4000

# Démarrer le serveur de développement
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "4000"]
