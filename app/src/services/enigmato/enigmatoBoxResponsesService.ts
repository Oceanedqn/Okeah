import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { IEnigmatoBoxResponse } from '../../interfaces/IEnigmato'; // Assurez-vous de définir cette interface
import { API_ENIGMATO_BOX_RESPONSES_URL } from '../../constants/constants';

// Créer une réponse pour une case
export const createBoxResponseAsync = async (boxResponse: IEnigmatoBoxResponse, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.post(`${API_ENIGMATO_BOX_RESPONSES_URL}`, boxResponse, {
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

// Récupérer toutes les réponses de cases avec pagination
export const getBoxResponsesAsync = async (navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.get(`${API_ENIGMATO_BOX_RESPONSES_URL}`, {
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

// Récupérer une réponse spécifique
export const getBoxResponseByIdBoxAsync = async (id_box: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.get(`${API_ENIGMATO_BOX_RESPONSES_URL}/box/${id_box}`, {
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

// Mettre à jour une réponse pour une case
export const updateBoxResponseAsync = async (id_box_response: number, id_enigmato_user: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.put(
            `${API_ENIGMATO_BOX_RESPONSES_URL}/${id_box_response}`,
            {
                id_user_response: id_enigmato_user
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        handleError(error, navigate);
    }
};

// Supprimer une réponse pour une case
export const deleteBoxResponseAsync = async (responseId: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.delete(`${API_ENIGMATO_BOX_RESPONSES_URL}/${responseId}`, {
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