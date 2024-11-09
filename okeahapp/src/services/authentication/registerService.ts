import axios from "axios";
import { API_URL } from "../../constants/constants"


interface RegisterResponse {
    name: string;
    firstname: string;
    mail: string;
    gender: boolean;
}

// Create an interface for the registration data
interface RegisterData {
    name: string;
    firstname: string;
    mail: string;
    password: string;
    gender: boolean;
}

// Function to register a new user
export const register_async = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await axios.post(
        API_URL,
        data,
        { withCredentials: true } // Include credentials if needed
    );
    return response.data;
};