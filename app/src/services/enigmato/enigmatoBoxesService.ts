import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../authentication/loginService';
import { API_ENIGMATO_BOXES_URL } from '../../constants/constants';




// Utiliser dans Game Info
export const getTodayBoxAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/today`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        handleError(error, navigate);
    }
};

export const getTodayBoxGameAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/today/game`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        handleError(error, navigate);
    }
};


export const getBeforeBoxAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
    try {
        const response = await axios.get(`${API_ENIGMATO_BOXES_URL}/${id_party}/before`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        handleError(error, navigate);
    }
};