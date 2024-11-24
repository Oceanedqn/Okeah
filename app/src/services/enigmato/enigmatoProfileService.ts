// services/enigmato/enigmatoProfilService.ts
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { API_ENIGMATO_PROFILES_URL } from '../../constants/constants';
import { IEnigmatoProfil } from '../../interfaces/IEnigmato';


export const fetchProfile = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    try {
        const response = await axios.get(`${API_ENIGMATO_PROFILES_URL}/${id_party}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        handleError(error, navigate);
    }
};

export const updateProfile = async (enigmatoProfil: IEnigmatoProfil, navigate: ReturnType<typeof useNavigate>) => {
    try {
        // Envoi des données sous la forme d'un objet JSON, et non plus via FormData
        const response = await axios.put(
            `${API_ENIGMATO_PROFILES_URL}`,  // Suppression de l'ID dans l'URL
            enigmatoProfil, // Envoie les données en format JSON avec les informations du profil
            {
                withCredentials: true, // Inclut les cookies dans la requête
            }
        );

        return response.data; // Retourne les données mises à jour du profil
    } catch (error) {
        handleError(error, navigate); // Gère les erreurs si la requête échoue
    }
};