import axios from "axios";
import { IUser, IUserCreate } from "../interfaces/IUser"; // Assurez-vous d'avoir défini les types User et UserCreate dans un fichier types.ts
import { API_USERS_URL } from "../constants/constants";


export const getCurrentUser = async (): Promise<IUser> => {
    try {
        const response = await axios.get(`${API_USERS_URL}/me`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch current user');
    }
};


// Récupère tous les utilisateurs
export const fetchUsers = async (): Promise<IUser[]> => {
    try {
        const response = await axios.get<IUser[]>(`${API_USERS_URL}/`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Erreur lors de la récupération des utilisateurs");
    }
};


// Récupère un utilisateur spécifique par ID
export const fetchUserById = async (userId: number): Promise<IUser> => {
    try {
        const response = await axios.get<IUser>(`${API_USERS_URL}/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || `Erreur lors de la récupération de l'utilisateur ID: ${userId}`);
    }
};


// Met à jour les informations d'un utilisateur
export const updateUser = async (userId: number, user: IUserCreate): Promise<IUser> => {
    try {
        const response = await axios.put<IUser>(`${API_USERS_URL}/${userId}`, user, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || `Erreur lors de la mise à jour de l'utilisateur ID: ${userId}`);
    }
};


// Supprime un utilisateur
export const deleteUser = async (userId: number): Promise<IUser> => {
    try {
        const response = await axios.delete<IUser>(`${API_USERS_URL}/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || `Erreur lors de la suppression de l'utilisateur ID: ${userId}`);
    }
};