import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/IUser';
import { getUserByEmail, getUserById } from '../controllers/users.controller';

// Assurez-vous que ces variables sont définies dans votre environnement
const SECRET_KEY = process.env.SECRET_KEY!;
const ALGORITHM = process.env.ALGORITHM as jwt.Algorithm;



// Middleware pour vérifier le JWT dans le cookie
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['access_token']; // Le cookie 'access_token' est automatiquement envoyé avec la requête
    if (!token) {
        res.status(401).json({ message: 'Pas de token, accès non autorisé' });
    } else {
        try {
            // Vérification du JWT avec la clé secrète
            const decoded: any = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });

            const id_user = decoded.sub;
            if (!id_user) {
                res.status(401).json({ message: 'Token invalide' });
            } else {
                // Utilisation d'await car getUserById retourne une promesse
                const user: IUser | null = await getUserById(id_user);
                if (!user) {
                    res.status(401).json({ message: 'Utilisateur introuvable' });
                } else {
                    req.user = user!; // Ajoutez l'utilisateur à la requête
                    next(); // L'utilisateur est authentifié, continuez avec le middleware suivant
                }
            }
        } catch (err) {
            // Gérer les erreurs de validation ou d'expiration du token
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter' });
            } else {
                res.status(401).json({ message: 'Token invalide ou expiré' });
            }
        }
    }
};


// Middleware pour vérifier le token de réinitialisation de mot de passe
export const authenticateResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['reset_password_token']; // Le cookie 'reset_password_token'
    if (!token) {
        res.status(401).json({ message: 'Token de réinitialisation manquant ou invalide.' });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });

        const email = decoded.email;
        if (!email) {
            res.status(401).json({ message: 'Token invalide.' });
            return;
        }

        const user: IUser | null = await getUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Utilisateur introuvable pour ce token de réinitialisation.' });
            return;
        }

        req.user = user!; // Ajouter l'utilisateur à la requête
        next();  // Token validé, passer au prochain middleware

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token de réinitialisation expiré.' });
        } else {
            res.status(401).json({ message: 'Token de réinitialisation invalide ou expiré.' });
        }
    }
};