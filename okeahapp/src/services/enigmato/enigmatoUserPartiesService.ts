import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENIGMATO_USER_PARTIES_URL } from '../../constants/constants';
import { EnigmatoParty, EnigmatoJoinParty } from '../../interfaces/IEnigmato';


// Service pour obtenir toutes les parties associées à un utilisateur
export const getUserParties = async (): Promise<EnigmatoParty[]> => {
  const accessToken = Cookies.get('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.get(`${API_ENIGMATO_USER_PARTIES_URL}/parties`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // Inclut les cookies dans la requête
    });
    return response.data; // Retourne directement un tableau de parties
  } catch (error) {
    throw new Error('Erreur lors de la récupération des parties utilisateur');
  }
};

// Service pour rejoindre une partie
export const joinParty = async (request: EnigmatoJoinParty) => {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(
            `${API_ENIGMATO_USER_PARTIES_URL}/join`,
            { 
                id_party: request.id_party,
                password: request.password 
            },  
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true, // Inclut les cookies dans la requête
            }
        );
        return response.data; // Retourner la réponse de l'API
    } catch (error) {
        throw new Error('Erreur lors de la jonction à la partie');
    }
};