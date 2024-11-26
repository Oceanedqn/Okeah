import axios from 'axios';
import { API_ENIGMATO_JOIN_PARTIES_URL, API_ENIGMATO_PARTICIPANTS_URL, API_ENIGMATO_PARTIES_URL, API_ENIGMATO_USER_PARTIES_URL } from '../../constants/constants';
import { IEnigmatoJoinParty, IEnigmatoParty, IEnigmatoPartyCreateRequest, IEnigmatoPartyParticipants } from '../../interfaces/IEnigmato';
import { handleError } from '../authentication/loginService';
import { useNavigate } from 'react-router-dom';


export const getPartiesAsync = async (page = 1, limit = 8, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoPartyParticipants[] | null> => {
  const offset = (page - 1) * limit; // Calcule le décalage (offset) pour la pagination

  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}?skip=${offset}&limit=${limit}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const getPartyAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoParty | null> => {
  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/${id_party}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const getPartyNameAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoParty | null> => {
  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/${id_party}/name`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

// Service pour obtenir toutes les parties associées à un utilisateur
export const getUserPartiesAsync = async (navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoPartyParticipants[] | null> => {

  try {
    const response = await axios.get(`${API_ENIGMATO_USER_PARTIES_URL}/parties`, {
      withCredentials: true, // Inclut les cookies dans la requête
    });
    return response.data; // Retourne directement un tableau de parties
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

// Service pour obtenir toutes les parties associées à un utilisateur
export const getUserFinishedPartiesAsync = async (navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoPartyParticipants[] | null> => {
  try {
    const response = await axios.get(`${API_ENIGMATO_USER_PARTIES_URL}/parties/finished`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const fetchParticipantsAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await axios.get(`${API_ENIGMATO_PARTICIPANTS_URL}/${id_party}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};


export const fetchCompletedParticipantsAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await axios.get(`${API_ENIGMATO_PARTICIPANTS_URL}/${id_party}/completed`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};

export const fetchCompletedRandomParticipantsAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await axios.get(`${API_ENIGMATO_PARTICIPANTS_URL}/${id_party}/completed/random`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};


export const createPartyAsync = async (party: IEnigmatoPartyCreateRequest, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await axios.post(API_ENIGMATO_PARTIES_URL, party, {
      withCredentials: true,

    });

    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};

// Service pour rejoindre une partie
export const joinPartyAsync = async (request: IEnigmatoJoinParty, navigate: ReturnType<typeof useNavigate>) => {
  try {
    const response = await axios.post(
      `${API_ENIGMATO_JOIN_PARTIES_URL}`,
      {
        id_party: request.id_party,
        password: request.password
      },
      {
        withCredentials: true, // Inclut les cookies dans la requête
      }
    );
    return response.data; // Retourner la réponse de l'API
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};


