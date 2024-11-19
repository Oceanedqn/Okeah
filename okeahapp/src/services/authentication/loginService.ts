import axios from "axios";
import { API_LOGIN_URL, API_LOGOUT_URL } from "../../constants/constants"
import { ILoginResponse } from "../../interfaces/ILogin";
import { useNavigate } from 'react-router-dom';


export const login_async = async (email: string, password: string): Promise<ILoginResponse> => {
  const response = await axios.post(
    API_LOGIN_URL,
    { email, password },
    { withCredentials: true } // Inclut les cookies dans la requête
  );
  return response.data;
};


export const logout_async = async () => {
  await axios.post(API_LOGOUT_URL, {}, { withCredentials: true });
};

export const handleError = (error: any, navigate: ReturnType<typeof useNavigate>) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    // Rediriger vers la page d'accueil ou la page de connexion
    navigate('/login');
  } else {
    throw new Error('Erreur inconnue');
  }
};
