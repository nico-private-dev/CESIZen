// Configuration centralisée pour les URLs API
// Utiliser des chemins relatifs pour le développement Docker

const API_CONFIG = {
  BASE_URL: '/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/mon-compte',
    REFRESH: '/auth/refresh',
    UPDATE_USERNAME: '/auth/update-username'
  },
  INFO: {
    ARTICLES: '/info/articles',
    CATEGORIES: '/info/categories'
  },
  USERS: {
    BASE: '/users'
  },
  EXERCISES: {
    BREATHING: '/exercice-respiration'
  }
};

export default API_CONFIG;
