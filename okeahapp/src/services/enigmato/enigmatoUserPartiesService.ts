import axios from 'axios';
import { API_ENIGMATO_USER_PARTIES_URL } from '../../constants/constants';
import { EnigmatoParty, EnigmatoJoinParty } from '../../interfaces/IEnigmato';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { useNavigate } from 'react-router-dom';


// Service pour obtenir toutes les parties associées à un utilisateur
export const getUserParties = async (navigate: ReturnType<typeof useNavigate>): Promise<EnigmatoParty[] | null> => {
  const accessToken = checkCookie();

  try {
    const response = await axios.get(`${API_ENIGMATO_USER_PARTIES_URL}/parties`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // Inclut les cookies dans la requête
    });
    return response.data; // Retourne directement un tableau de parties
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

// Service pour rejoindre une partie
export const joinParty = async (request: EnigmatoJoinParty, navigate: ReturnType<typeof useNavigate>) => {
  const accessToken = checkCookie();

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
    handleError(error, navigate);
    return null;
  }
};