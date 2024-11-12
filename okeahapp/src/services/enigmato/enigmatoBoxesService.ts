import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkCookie } from '../../utils/utils';
import { handleError } from '../authentication/loginService';
import { IEnigmatoBox } from '../../interfaces/IEnigmato';
import { API_ENIGMATO_BOXES_URL } from '../../constants/constants';


// export const getBoxesByParty = async (id_party: number, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoBox[] | null> => {
//     const accessToken = checkCookie();

//     try {
//         // Première requête pour récupérer les détails de la partie
//         const response = await axios.get(`/enigmato/parties/${id_party}/boxes`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             withCredentials: true, // Inclut les cookies dans la requête
//         });

//         // Si aucune box n'est trouvée, retourner un tableau vide
//         if (!response.data || response.data.length === 0) {
//             return [];
//         }

//         return response.data;

//     } catch (error) {
//         handleError(error, navigate);
//         return null;
//     }
// };


// export const getBoxesBeforeToday = async (id_party: number, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoBox[] | null> => {
//     const accessToken = checkCookie();

//     try {
//         // Requête pour récupérer les boxes avant aujourd'hui pour une partie spécifique
//         const today = new Date().toISOString().split('T')[0];  // Format YYYY-MM-DD
//         const response = await axios.get(`/enigmato/boxes/${id_party}/before-today`, {
//             params: {
//                 date: today,  // Passer la date d'aujourd'hui
//             },
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             withCredentials: true, // Inclut les cookies dans la requête
//         });

//         // Si aucune box n'est trouvée, retourner un tableau vide
//         if (!response.data || response.data.length === 0) {
//             return [];
//         }

//         return response.data;

//     } catch (error) {
//         handleError(error, navigate);
//         return null;
//     }
// };


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


// export const createTodayBoxAsync = async (id_party: number, navigate: ReturnType<typeof useNavigate>) => {
//     const accessToken = checkCookie();

//     try {
//         const response = await axios.post(`${API_ENIGMATO_BOXES_URL}/${id_party}/today`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             withCredentials: true,

//         });

//         return response.data;
//     } catch (error) {
//         handleError(error, navigate);
//     }
// };

// export const getPartyBoxById = async (id_party: number, id_box: number, navigate: ReturnType<typeof useNavigate>): Promise<IEnigmatoBox[] | null> => {
//     const accessToken = checkCookie();

//     try {
//         // Première requête pour récupérer les détails de la partie
//         const response = await axios.get(`/enigmato/parties/${id_party}/boxes/${id_box}`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             withCredentials: true, // Inclut les cookies dans la requête
//         });

//         // Si aucune box n'est trouvée, retourner un tableau vide
//         if (!response.data || response.data.length === 0) {
//             return [];
//         }

//         return response.data;

//     } catch (error) {
//         handleError(error, navigate);
//         return null;
//     }
// };