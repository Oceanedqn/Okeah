import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { createAccessToken } from '../utils/auth.utils';
import { getUserByEmail } from './users.controller';
import { IUserLogin } from '../interfaces/IUser';



// Fonction pour le login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Vérification de l'utilisateur
        const user: IUserLogin = await getUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user!.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Création du token d'accès
        const token = createAccessToken(user.id_user);
        console.log(token)
        // Définition du cookie avec le token
        res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

        // Retour de la réponse
        res.json({ access_token: token });
    } catch (err) {
        next(err); // Passe les erreurs au middleware d'erreurs
    }
};

// Fonction pour le logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Déconnexion réussie' });
};