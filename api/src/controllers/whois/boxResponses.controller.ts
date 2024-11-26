import { Request, Response } from 'express';
import { IUser } from '../../interfaces/IUser';
import pool from '../../config/database';

export const get_box_response_async = async (req: Request, res: Response) => {
    const { id_box } = req.params;
    const currentUser = req.user as IUser; // Supposons que l'utilisateur actuel soit injecté dans la requête (middleware d'authentification)

    try {
        // Exécution de la requête pour obtenir la réponse de la box par id_box et id_user
        const result = await pool.query(
            'SELECT * FROM enigmato_box_responses WHERE id_box = $1 AND id_user = $2',
            [id_box, currentUser.id_user]
        );

        const boxResponse = result.rows[0] || null; // Renvoie la première réponse trouvée ou null si aucune réponse n'existe

        if (boxResponse) {
            res.json(boxResponse); // Si la réponse existe, on la renvoie
        } else {
            res.status(204).json({ message: 'Box response not found' }); // Si aucune réponse trouvée, renvoyer 404
        }

    } catch (err: any) {
        console.error('Error fetching box response:', err);
        // Gestion des erreurs, envoyer une réponse générique ou détaillée en fonction de l'erreur
        res.status(500).json({ message: `An error occurred: ${err.message}` });
    }
};