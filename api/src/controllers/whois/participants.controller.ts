import pool from '../../config/database';
import { Request, Response } from 'express';
import { IEnigmatoBoxEnigmaUser, IEnigmatoParticipants } from '../../interfaces/IEnigmato';
import { bufferToBase64, fetch_participants_completed_async, get_profile_by_id_from_db, get_today_box_in_game_with_response_async } from '../../utils/whois.utils';

// [OK] Récupère les participants d'une partie
export const get_participants_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    const { user } = req; // Utilisateur actuel de la requête (généralement venant d'un middleware d'auth)

    if (user) {
        try {
            // Vérification si la partie existe
            const partyQuery = await pool.query(
                'SELECT * FROM enigmato_parties WHERE id_party = $1',
                [id_party]
            );

            if (partyQuery.rows.length === 0) {
                res.status(404).json({ message: 'No such party found' });
            }

            // Récupérer les participants de la partie avec leur profil
            const participantsQuery = await pool.query(
                `SELECT u.id_user, u.gender, u.name, u.firstname, p.id_profil, p.picture1, p.picture2
                FROM users u
                JOIN enigmato_profiles p ON p.id_user = u.id_user
                WHERE p.id_party = $1`,
                [id_party]
            );

            const participants = participantsQuery.rows;

            if (participants.length === 0) {
                res.status(404).json({ message: 'No participants found for this party' });
            }

            // Préparer la liste des participants avec leur statut `is_complete`
            const participantsWithStatus: IEnigmatoParticipants[] = participants.map((participant) => {
                return {
                    id_user: participant.id_user,
                    id_party: Number(id_party),
                    id_profil: participant.id_profil,
                    name: participant.name,
                    firstname: participant.firstname,
                    gender: participant.gender,
                    picture2: participant.picture2 ? bufferToBase64(participant.picture2) : null,
                    is_complete: !!(participant.picture1 && participant.picture2),
                };
            });

            res.json(participantsWithStatus);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const get_participant_by_id_async = async (req: Request, res: Response) => {
    const { id_user } = req.params;

    try {
        // Vérification si l'utilisateur existe
        const userQuery = await pool.query(
            `SELECT u.id_user, u.name, u.firstname, p.id_profil, p.picture2
             FROM users u
             LEFT JOIN enigmato_profiles p ON p.id_user = u.id_user
             WHERE u.id_user = $1`,
            [id_user]
        );

        if (userQuery.rows.length === 0) {
            res.status(404).json({ message: 'No such user found' });
        }

        const user = userQuery.rows[0];

        // Préparer les informations de l'utilisateur avec son statut `is_complete`
        const userWithStatus = {
            id_user: user.id_user,
            id_profil: user.id_profil,
            name: user.name,
            firstname: user.firstname,
            picture2: user.picture2 ? bufferToBase64(user.picture2) : null,
        };

        res.json(userWithStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const get_participants_completed_async = async (req: Request, res: Response) => {
    const { id_party } = req.params; // Récupération de l'id de la partie depuis les paramètres de la requête

    try {
        // Appel de la fonction utilitaire pour récupérer les participants complets
        const participants = await fetch_participants_completed_async(Number(id_party));

        // Vérifier si participants est un objet avec un message d'erreur
        if ('message' in participants) {
            res.status(404).json({ message: participants.message }); // Envoie un message d'erreur si la partie n'existe pas
        }

        // Vérifier si participants est un tableau et qu'il contient des éléments
        if (Array.isArray(participants) && participants.length === 0) {
            res.status(200).json([]); // Aucun participant complet trouvé, renvoie un tableau vide
        }

        // Si les participants existent et sont un tableau, on les renvoie
        res.status(200).json(participants);
    } catch (err) {
        console.error('Error fetching participants completed:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const get_random_participant_completed_async = async (id_party: number): Promise<IEnigmatoParticipants> => {
    try {
        // 1. Récupérer les participants ayant complété leur profil
        const completed_participants = await fetch_participants_completed_async(id_party);

        if (!Array.isArray(completed_participants) || completed_participants.length === 0) {
            throw new Error(`No completed participants found`);
        }

        // 2. Récupérer les participants déjà utilisés dans des boîtes pour cette `id_party`
        const resultUsedParticipants = await pool.query(
            'SELECT id_enigma_user FROM enigmato_boxes WHERE id_party = $1',
            [id_party]
        );

        const usedParticipants = new Set<number>(resultUsedParticipants.rows.map((row: IEnigmatoBoxEnigmaUser) => row.id_enigma_user));

        // 3. Filtrer les participants pour ne garder que ceux qui n'ont pas encore été utilisés
        const availableParticipants = completed_participants.filter(
            (p) => !usedParticipants.has(p.id_user)
        );

        if (availableParticipants.length === 0) {
            throw new Error('Tous les participants ont déjà été utilisés pour cette partie.');
        }

        // 4. Sélectionner un participant aléatoire parmi ceux qui n'ont pas encore été utilisés
        const selectedParticipant = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];

        return selectedParticipant;
    } catch (err) {
        console.error(err);
        throw new Error('Erreur lors de la récupération d\'un participant aléatoire.');
    }
};


export const get_random_participants_completed_async = async (req: Request, res: Response) => {
    const { id_party } = req.params; // Récupération de l'id de la partie depuis les paramètres de la requête

    if (!id_party || isNaN(parseInt(id_party))) {
        res.status(400).json({ message: 'Invalid or missing id_party parameter' });
        return; // Stop further execution
    }

    try {
        // Étape 1 : Récupérer la box d'aujourd'hui
        const today_box = await get_today_box_in_game_with_response_async(parseInt(id_party));

        // Étape 2 : Récupérer le profil correct
        const correct_profile = await get_profile_by_id_from_db(parseInt(id_party), today_box.id_enigma_user);

        if (!correct_profile) {
            res.status(404).json({ message: "Correct profile not found for today's box" });
            return; // Stop further execution
        }

        // Étape 3 : Récupérer les participants ayant terminé
        const completed_participants = await fetch_participants_completed_async(parseInt(id_party));

        // Vérifiez si `completed_participants` est un tableau
        if (!Array.isArray(completed_participants)) {
            res.status(500).json({ message: 'Unexpected response format from fetch_participants_completed_async' });
            return; // Stop further execution
        }

        if (completed_participants.length === 0) {
            res.status(404).json({ message: 'No completed participants found' });
            return; // Stop further execution
        }

        // Étape 4 : Filtrer les participants et construire la réponse
        const same_gender_participants = completed_participants.filter(
            (p) => p.gender === correct_profile.gender && p.id_user !== correct_profile.id_user
        );

        const other_gender_participants = completed_participants.filter(
            (p) => p.gender !== correct_profile.gender && p.id_user !== correct_profile.id_user
        );

        let chosen_participants = [correct_profile];

        if (same_gender_participants.length >= 3) {
            chosen_participants = chosen_participants.concat(randomSample(same_gender_participants, 3));
        } else {
            chosen_participants = chosen_participants.concat(same_gender_participants);
            const remaining_needed = Math.min(
                6 - chosen_participants.length,
                other_gender_participants.length
            );
            if (remaining_needed > 0) {
                chosen_participants = chosen_participants.concat(randomSample(other_gender_participants, remaining_needed));
            }
        }

        const unique_participants = deduplicateParticipants(chosen_participants);

        // Retourner la liste des participants choisis
        res.status(200).json(unique_participants);
    } catch (err) {
        console.error(`Error in get_random_participants_completed_async:`, err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


function randomSample<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helper function to remove duplicates based on `id_user`
function deduplicateParticipants(participants: IEnigmatoParticipants[]): IEnigmatoParticipants[] {
    const seenIds = new Set<number>();
    const uniqueParticipants: IEnigmatoParticipants[] = [];

    participants.forEach((participant) => {
        if (!seenIds.has(participant.id_user)) {
            uniqueParticipants.push(participant);
            seenIds.add(participant.id_user);
        }
    });

    return uniqueParticipants;
}