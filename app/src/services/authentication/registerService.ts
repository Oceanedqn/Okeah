import axios from "axios";
import { API_AUTH_URL } from "../../constants/constants"
import { IRegisterData, IRegisterResponse } from "../../interfaces/IRegister";


// Function to register a new user
export const register_async = async (data: IRegisterData): Promise<IRegisterResponse> => {
    const response = await axios.post(
        `${API_AUTH_URL}/register`,
        data,
        { withCredentials: true } // Include credentials if needed
    );
    return response.data;
};