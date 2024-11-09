import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENIGMATO_PARTIES_URL } from '../../constants/constants';
import { EnigmatoParty } from '../../interfaces/IEnigmato';

export const getParties = async (): Promise<EnigmatoParty[]> => {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
      }

    try {
        const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}`, {
      headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des parties en cours');
  }
};

export const getPartiesCreatedByUser = async (): Promise<EnigmatoParty[]> => {
  const accessToken = Cookies.get('access_token');
  console.log(accessToken)
  if (!accessToken) {
      throw new Error('No access token found');
  }

  try {
      const response = await axios.get(`${API_ENIGMATO_PARTIES_URL}/user`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
      });
      return response.data;
  } catch (error) {
      throw new Error('Erreur lors de la récupération des parties en cours');
  }
};