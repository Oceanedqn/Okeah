import axios from "axios";
import { API_LOGIN_URL, API_LOGOUT_URL } from "../../constants/constants"
import { LoginResponse } from "../../interfaces/ILogin";


export const login_async = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(
      API_LOGIN_URL,
      { email, password },
      { withCredentials: true } // Inclut les cookies dans la requête
    );
    return response.data;
  };


  export const logout_async = async () => {
    const response = await axios.post(
        API_LOGOUT_URL,
        {}, // No body needed for the logout
        { withCredentials: true } // Includes cookies in the request
    );

    console.log(response.data);  // Should log something like { detail: "Logout successful" }
};