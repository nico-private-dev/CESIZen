import jwt from 'jsonwebtoken';

// Fonction pour générer un token d'authentification
export const generateAccessToken = (id: string) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

// Fonction pour générer un token de rafraichissement
export const generateRefreshToken = (id: string) => {
  return jwt.sign({ _id: id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export default generateAccessToken;