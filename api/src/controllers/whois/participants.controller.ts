import pool from '../../config/database';
import { Request, Response } from 'express';
import { IEnigmatoBoxEnigmaUser, IEnigmatoParticipants } from '../../interfaces/IEnigmato';
import { bufferToBase64, get_participants_completed_async } from '../../utils/whois.utils';

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


export const get_random_participant_completed_async = async (id_party: number): Promise<IEnigmatoParticipants> => {
    try {
        // 1. Récupérer les participants ayant complété leur profil
        const completed_participants = await get_participants_completed_async(id_party);

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


// export const get_random_participant_completed_async = async (id_party: number) => {
//     try {
//         // Step 1: Get the today's box
//         const today_box = await get_today_box_in_game_with_response_async(id_party);

//         // Step 2: Fetch the correct profile
//         const correct_profile = await get_profile_by_id_from_db(
//             id_party,
//             today_box.id_enigma_user
//         );

//         if (!correct_profile) {
//             throw new Error(`Correct profile not found for today's box`);
//         }

//         // Step 3: Retrieve completed participants
//         const completed_participants = await get_participants_completed_async(id_party);

//         if (!Array.isArray(completed_participants) || completed_participants.length === 0) {
//             throw new Error(`No completed participants found`);
//         }

//         // Step 4: Filter participants and construct response
//         const same_gender_participants = completed_participants.filter(
//             (p) => p.gender === correct_profile.gender && p.id_user !== correct_profile.id_user
//         );

//         const other_gender_participants = completed_participants.filter(
//             (p) => p.gender !== correct_profile.gender && p.id_user !== correct_profile.id_user
//         );

//         let chosen_participants = [correct_profile];

//         if (same_gender_participants.length >= 3) {
//             chosen_participants = chosen_participants.concat(randomSample(same_gender_participants, 3));
//         } else {
//             chosen_participants = chosen_participants.concat(same_gender_participants);
//             const remaining_needed = Math.min(
//                 6 - chosen_participants.length,
//                 other_gender_participants.length
//             );
//             if (remaining_needed > 0) {
//                 chosen_participants = chosen_participants.concat(randomSample(other_gender_participants, remaining_needed));
//             }
//         }

//         return deduplicateParticipants(chosen_participants);
//     } catch (err) {
//         console.error(`Error in get_random_participant_completed_async:`, err);
//         throw new Error(`Failed to retrieve a valid participant for the box.`);
//     }
// };


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