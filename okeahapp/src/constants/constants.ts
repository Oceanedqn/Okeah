// src/constants/constants.ts

// Définir la racine de l'API une seule fois
const BASE_URL = 'http://localhost:8000';

// Connexion et Inscription d'un utilisateur
export const API_USERS_URL = `${BASE_URL}/users`;
export const API_LOGIN_URL = `${BASE_URL}/login/`;
export const API_LOGOUT_URL = `${BASE_URL}/logout/`;

// Enigmato
export const API_ENIGMATO_PARTIES_URL = `${BASE_URL}/enigmato/parties`;
export const API_ENIGMATO_USER_PARTIES_URL = `${BASE_URL}/enigmato/parties/user`;
export const API_ENIGMATO_JOIN_PARTIES_URL = `${BASE_URL}/enigmato/parties/join`;
export const API_ENIGMATO_PROFILES_URL = `${BASE_URL}/enigmato/parties/profiles`;

export const API_ENIGMATO_BOXES_URL = `${BASE_URL}/enigmato/boxes`;