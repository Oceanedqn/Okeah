import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../interfaces/IUser';
import pool from '../../config/database';
import { IEnigmatoBoxResponse } from '../../interfaces/IEnigmato';

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


export const create_box_response_async = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupère les données envoyées dans la requête
        const boxResponseData: IEnigmatoBoxResponse = req.body;
        const currentUser = req.user; // Utilisateur authentifié grâce au middleware d'authentification

        // Prépare les données à insérer
        const data: IEnigmatoBoxResponse = {
            id_box_response: null, // Géré automatiquement par la base si auto-incrément
            id_box: boxResponseData.id_box!,
            id_user: currentUser!.id_user, // ID utilisateur authentifié
            id_user_response: boxResponseData.id_user_response || null, // Optionnel
            date: new Date().toISOString(), // Génération de la date actuelle au format ISO
            cluse_used: boxResponseData.cluse_used || false, // Valeur par défaut false si non fournie
        };

        // Exécuter la requête pour insérer les données dans la base de données
        const query = `
            INSERT INTO enigmato_box_responses (id_box, id_user, id_user_response, date, cluse_used)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            data.id_box,
            data.id_user,
            data.id_user_response,
            data.date,
            data.cluse_used,
        ];


        // Effectuer la requête SQL via le pool de connexions
        const result = await pool.query(query, values);

        // Récupérer la réponse insérée et la renvoyer au client
        const newBoxResponse = result.rows[0];

        res.status(201).json(newBoxResponse); // Retourne la nouvelle réponse de la boîte
    } catch (error) {
        next(error); // Passe l'erreur au middleware de gestion des erreurs
    }
};