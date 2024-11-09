import axios from "axios";
import { API_USERS_URL } from "../../constants/constants"
import { RegisterData, RegisterResponse } from "../../interfaces/IRegister";


// Function to register a new user
export const register_async = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await axios.post(
        API_USERS_URL,
        data,
        { withCredentials: true } // Include credentials if needed
    );
    return response.data;
};