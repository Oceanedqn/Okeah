import axios from 'axios';
import { API_ENIGMATO_PARTIES_URL } from '../../constants/constants';
import { EnigmatoParty, EnigmatoPartyCreateRequest } from '../../interfaces/IEnigmato';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { useNavigate } from 'react-router-dom';


export const getPartiesAsync = async (page = 1, limit = 8, navigate: ReturnType<typeof useNavigate>): Promise<EnigmatoParty[] | null> => {
  const accessToken = checkCookie();
  const offset = (page - 1) * limit; // Calcule le décalage (offset) pour la pagination

  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}?skip=${offset}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const getPartiesCreatedByUserAsync = async (navigate: ReturnType<typeof useNavigate>): Promise<EnigmatoParty[] | null> => {
  const accessToken = checkCookie();

  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const getPartyAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>): Promise<EnigmatoParty[] | null> => {
  const accessToken = checkCookie();

  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/${id_party}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
    return null;
  }
};

export const fetchParticipants = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
  const accessToken = checkCookie();

  try {
    const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/${id_party}/participants`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};


export const createParty = async (party: EnigmatoPartyCreateRequest, navigate: ReturnType<typeof useNavigate>) => {
  const accessToken = checkCookie();

  try {
    const response = await axios.post(API_ENIGMATO_PARTIES_URL, party, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,

    });

    return response.data;
  } catch (error) {
    handleError(error, navigate);
  }
};


