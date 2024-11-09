import axios from "axios";

const API_URL = 'http://localhost:8000/login';


interface LoginResponse {
    access_token: string;
  }


export const login_async = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(
      API_URL,
      { email, password },
      { withCredentials: true } // Inclut les cookies dans la requête
    );
    return response.data;
  };