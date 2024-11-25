import { Request, Response } from 'express';
import pool from '../config/database';
import { IUser } from '../interfaces/IUser';


export const getMe = async (req: Request, res: Response) => {
    if (req.user) {
        const { id_user, name, firstname } = req.user;
        res.json({ id_user, name, firstname }); // Renvoie l'utilisateur authentifié
    } else {
        res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
};

// Methode pour récupérer un user par son email
// Utile lors de l'inscription
export const getUserByEmail = async (email: string) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE mail = $1', [email]);

        if (result.rows.length === 0) {
            return null; // Aucun utilisateur trouvé
        }

        return result.rows[0]; // Retourne les données utilisateur
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        throw new Error('Erreur interne du serveur');
    }
};


// Recupere l'utilisateur par son id
export const getUserById = async (id_user: number): Promise<IUser | null> => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id_user = $1', [id_user]);

        if (result.rows.length === 0) {
            return null; // Aucun utilisateur trouvé
        }

        return result.rows[0]; // Retourne les données utilisateur
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        throw new Error('Erreur interne du serveur');
    }
};