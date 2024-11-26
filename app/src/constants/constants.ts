// src/constants/constants.ts

// Définir la racine de l'API une seule fois
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Connexion et Inscription d'un utilisateur
export const API_USERS_URL = `${BASE_URL}/api/users`;
export const API_AUTH_URL = `${BASE_URL}/api/auth`;

// Enigmato
export const API_ENIGMATO_PARTIES_URL = `${BASE_URL}/api/whois/parties`;
export const API_ENIGMATO_USER_PARTIES_URL = `${BASE_URL}/api/whois/parties/user`;
export const API_ENIGMATO_JOIN_PARTIES_URL = `${BASE_URL}/api/whois/parties/join`;
export const API_ENIGMATO_PROFILES_URL = `${BASE_URL}/api/whois/profiles`;
export const API_ENIGMATO_PARTICIPANTS_URL = `${BASE_URL}/api/whois/participants`;
export const API_ENIGMATO_BOXES_URL = `${BASE_URL}/api/whois/boxes`;
export const API_ENIGMATO_BOX_RESPONSES_URL = `${BASE_URL}/api/whois/responses`;