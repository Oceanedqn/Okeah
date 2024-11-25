import { Router, Request, Response } from 'express';
import { IUser } from '../../interfaces/IUser';
import { IEnigmatoProfil, IEnigmatoParticipants } from '../../interfaces/IEnigmato';
import pool from '../../config/database';
import { base64ToBuffer, bufferToBase64 } from '../../utils/whois.utils';

const router = Router();

// [OK] Retourne un profil en fonction de l'id de la party et de l'id de l'user trouvé dans le token
export const get_profile = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    const currentUser = req.user as IUser;

    try {
        const result = await pool.query(
            'SELECT * FROM enigmato_profiles WHERE id_party = $1 AND id_user = $2',
            [id_party, currentUser.id_user]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Profile not found' });
        }

        const profile = result.rows[0];

        // Utilisation de la fonction `bufferToBase64` pour les images
        const picture1Base64 = profile.picture1 ? bufferToBase64(profile.picture1) : null;
        const picture2Base64 = profile.picture2 ? bufferToBase64(profile.picture2) : null;

        res.json({
            ...profile,
            picture1: picture1Base64,
            picture2: picture2Base64,
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).send('Internal server error');
    }
};



// [OK] Met à jour le profil de l'utilisateur
export const update_profile = async (req: Request, res: Response) => {
    const { id_party, picture1, picture2 } = req.body;
    const currentUser = req.user as IUser;

    try {
        // Vérifier l'existence du profil
        const profileResult = await pool.query(
            'SELECT * FROM enigmato_profiles WHERE id_party = $1 AND id_user = $2',
            [id_party, currentUser.id_user]
        );

        if (profileResult.rows.length === 0) {
            res.status(404).json({ message: 'Profile not found' });
        }

        const profile = profileResult.rows[0];

        // Vérifier si la partie a commencé
        const partyResult = await pool.query('SELECT date_start FROM enigmato_parties WHERE id_party = $1', [id_party]);
        const party = partyResult.rows[0];
        const currentDate = new Date();

        if (new Date(party.date_start) <= currentDate && profile.is_complete) {
            res.status(403).json({
                message: 'You cannot update your profile after the start date or if your profile is complete',
            });
        }

        // Préparer les mises à jour
        const updates: Partial<IEnigmatoProfil> = {};

        //Convertir et traiter les images en Base64 si elles existent
        if (picture1) {
            updates.picture1 = base64ToBuffer(picture1);
        }
        if (picture2) {
            updates.picture2 = base64ToBuffer(picture2);
        }

        // Vérifier si le profil est complet
        updates.is_complete = !!updates.picture1 && !!updates.picture2;

        // Mettre à jour dans la base de données
        const updateQuery = `
            UPDATE enigmato_profiles
            SET picture1 = $1, picture2 = $2, is_complete = $3
            WHERE id_party = $4 AND id_user = $5
            RETURNING *`;

        await pool.query(updateQuery, [
            updates.picture1,
            updates.picture2,
            updates.is_complete,
            id_party,
            currentUser.id_user,
        ]);

        res.status(201).send('Profil mis à jour');
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).send('Internal server error');
    }
};

// [OK] Retourne un profil en fonction de l'id de la party et de l'id de l'user
export const get_profil_by_id = async (req: Request, res: Response) => {
    const { id_party, id_user } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM enigmato_profiles WHERE id_party = $1 AND id_user = $2',
            [id_party, id_user]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Profile not found' });
        }

        const profile = result.rows[0];
        const userResult = await pool.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        const user = userResult.rows[0];

        const participant: IEnigmatoParticipants = {
            id_user: user.id_user,
            id_party: Number(id_party),
            id_profil: profile.id_profil,
            name: user.name,
            firstname: user.firstname,
            picture2: profile.picture2
                ? `data:image/png;base64,${profile.picture2.toString('base64')}`
                : '', // Convert null to an empty string
            is_complete: profile.is_complete,
        };

        res.json(participant);
    } catch (err) {
        console.error('Error fetching profile by ID:', err);
        res.status(500).send('Internal server error');
    }
};

// Export du router
export default router;