// services/enigmato/enigmatoProfilService.ts
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../authentication/loginService';
import { API_ENIGMATO_PROFILES_URL } from '../../constants/constants';


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

export const updateProfile = async (enigmatoProfil: any, navigate: ReturnType<typeof useNavigate>) => {
    try {
        // Envoi des données sous la forme d'un objet JSON, et non plus via FormData
        const response = await axios.put(`${API_ENIGMATO_PROFILES_URL}`, enigmatoProfil, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
        });

        return response.data; // Retourne les données mises à jour du profil
    } catch (error) {
        handleError(error, navigate); // Gère les erreurs si la requête échoue
    }
};