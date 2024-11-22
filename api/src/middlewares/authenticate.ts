import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/IUser';
import { getUserById } from '../controllers/users.controller';

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