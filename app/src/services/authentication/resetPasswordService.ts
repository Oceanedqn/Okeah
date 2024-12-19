import axios from "axios";
import { API_AUTH_URL } from "src/constants/constants";
import { toast } from 'react-toastify';


// Demande à mettre à jour le mot de passe de l'utilisateur
export const resetPasswordRequestAsync = async (email: string, t: Function): Promise<void> => {
    try {
        await axios.post(
            `${API_AUTH_URL}/reset-password-request`,
            { email },
            { withCredentials: true } // Include credentials if needed
        );
        toast.success(t("toast.emailSend"));
    } catch (error) {
        toast.error(t("toast.errorEmailSend"));
    }
};


// Met à jour le mot de passe de l'utilisateur
export const resetPasswordAsync = async (password: string, t: Function): Promise<void> => {
    try {
        const response = await axios.post(
            `${API_AUTH_URL}/reset-password`,
            { password },
            { withCredentials: true } // Inclure les cookies si nécessaire
        );
        toast.success(t("toast.resetPasswordSucces"));
    } catch (error) {
        toast.error(t("toast.errorResetPassword"));
    }
}