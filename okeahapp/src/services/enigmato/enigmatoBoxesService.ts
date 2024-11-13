import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { IEnigmatoBox } from '../../interfaces/IEnigmato';
import { API_ENIGMATO_BOXES_URL } from '../../constants/constants';




// Utiliser dans Game Info
export const getTodayBoxAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/today`, {
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

export const getTodayBoxGameAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/today/game`, {
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


export const getBeforeBoxAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    const accessToken = checkCookie();
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/before`, {
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