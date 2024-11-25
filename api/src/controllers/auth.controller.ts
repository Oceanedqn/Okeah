import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { createAccessToken, hashPassword } from '../utils/auth.utils';
import { getUserByEmail } from './users.controller';
import { IUserLogin } from '../interfaces/IUser';
import { IRegisterData } from '../interfaces/IRegister';
import pool from '../config/database';



// Fonction pour le login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Vérification de l'utilisateur
        const user: IUserLogin = await getUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        } else {
            // Vérification du mot de passe
            const isPasswordValid = await bcrypt.compare(password, user!.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            } else {
                // Création du token d'accès
                const token = createAccessToken(user.id_user);

                // Définition du cookie avec le token
                res.cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });

                // Retour de la réponse
                res.json({ access_token: token });
            }
        }
    } catch (err) {
        next(err); // Passe les erreurs au middleware d'erreurs
    }
};

// Fonction pour le logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Déconnexion réussie' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, firstname, mail, password, gender }: IRegisterData = req.body;

        // Validation des données
        if (!name || !firstname || !mail || !password) {
            res.status(400).json({ message: 'Tous les champs sont requis.' });
        } else {
            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await pool.query('SELECT * FROM users WHERE mail = $1', [mail]);
            if (existingUser.rows.length > 0) {
                res.status(409).json({ message: 'Cet email est déjà utilisé.' });
            } else {
                // Hacher le mot de passe avant insertion
                const hashedPassword = hashPassword(password);

                // Insérez un nouvel utilisateur
                const result = await pool.query(
                    'INSERT INTO users (name, firstname, mail, password, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [name, firstname, mail, hashedPassword, gender]
                );

                // Retourner les informations de l'utilisateur créé
                res.status(201).json({
                    message: 'Utilisateur créé avec succès.'
                });
            }
        }
    } catch (err) {
        console.error('Erreur lors de la création de l\'utilisateur :', err);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};