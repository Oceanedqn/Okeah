import axios from "axios";
import { API_LOGIN_URL } from "../../constants/constants"




interface LoginResponse {
    access_token: string;
  }


export const login_async = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(
      API_LOGIN_URL,
      { email, password },
      { withCredentials: true } // Inclut les cookies dans la requête
    );
    return response.data;
  };