import pool from '../../config/database';
import { Request, Response } from 'express';
import { IEnigmatoBoxEnigmaUser, IEnigmatoParticipants, IEnigmatoParticipantsScores } from '../../interfaces/IEnigmato';
import { bufferToBase64, fetch_participants_completed_async, get_profile_by_id_from_db, get_today_box_in_game_with_response_async } from '../../utils/whois.utils';
import { IUser } from '../../interfaces/IUser';

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


interface Participant {
    id_user: number;
    firstname: string;
    name: string;
    time: Date;
    clue_used: boolean;
}

interface BoxParticipants {
    [boxId: string]: {
        participants: Participant[];
    };
}

export const get_participants_with_scores_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    const { user } = req;

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const partyQuery = await pool.query(
            'SELECT * FROM enigmato_parties WHERE id_party = $1',
            [id_party]
        );

        if (partyQuery.rows.length === 0) {
            res.status(404).json({ message: 'No such party found' });
            return;
        }

        // Récupération des participants
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
            return;
        }

        // Récupération des scores et des réponses
        const scoresQuery = await pool.query(
            `SELECT r.id_user, b.id_enigma_user, r.cluse_used, r.id_user_response, r.date, b.date AS box_date, b.id_box
            FROM enigmato_boxes b
            JOIN enigmato_box_responses r ON b.id_box = r.id_box
            WHERE b.id_party = $1`,
            [id_party]
        );

        const scores = scoresQuery.rows;

        // Création d'un objet pour stocker les participants par id_box
        const boxParticipants: BoxParticipants = {};

        scores.forEach(score => {
            if (score.id_user_response === score.id_enigma_user) { // Ne considérer que les réponses correctes
                if (!boxParticipants[score.id_box]) {
                    boxParticipants[score.id_box] = { participants: [] };
                }

                const participant = participants.find(p => p.id_user === score.id_user);
                if (participant) {
                    boxParticipants[score.id_box].participants.push({
                        id_user: score.id_user,
                        firstname: participant.firstname,
                        name: participant.name,
                        time: new Date(score.date),
                        clue_used: score.cluse_used
                    });
                }
            }
        });

        // Calcul des scores et tri par rapidité pour chaque boîte
        const participantsWithScores: IEnigmatoParticipantsScores[] = participants.map((participant) => {
            let totalScore = 0;

            // Vérifier les réponses pour chaque boîte
            Object.keys(boxParticipants).forEach((boxId: string) => {
                const participantsInBox = boxParticipants[boxId].participants;

                // Trier les participants de chaque boîte par ordre croissant de temps
                participantsInBox.sort((a, b) => a.time.getTime() - b.time.getTime());

                // Trouver la réponse de ce participant pour cette boîte
                const participantInBox = participantsInBox.find(p => p.id_user === participant.id_user);

                if (participantInBox) {
                    const clueUsed = participantInBox.clue_used;

                    // Attribution des points en fonction du rang pour les réponses correctes
                    const rank = participantsInBox.indexOf(participantInBox);
                    if (rank === 0) {
                        totalScore += clueUsed ? 1.5 : 3; // 1er à répondre
                    } else if (rank === 1) {
                        totalScore += clueUsed ? 1 : 2; // 2e à répondre
                    } else if (rank === 2) {
                        totalScore += clueUsed ? 0.5 : 1; // 3e à répondre
                    }
                }
            });

            // Filtrer les réponses pour l'utilisateur pour calculer le score des énigmes
            const participantScores = scores.filter(score => score.id_user === participant.id_user);
            participantScores.forEach((score, index) => {
                if (score.id_user_response === score.id_enigma_user) {
                    if (score.cluse_used) {
                        totalScore += 0.5;
                    } else {
                        totalScore += 1;
                    }
                }
            });

            return {
                id_user: participant.id_user,
                id_party: Number(id_party),
                id_profil: participant.id_profil,
                name: participant.name,
                firstname: participant.firstname,
                gender: participant.gender,
                picture2: participant.picture2 ? bufferToBase64(participant.picture2) : null,
                is_complete: !!(participant.picture1 && participant.picture2),
                scores: totalScore
            };
        });

        // Trier les participants par score décroissant
        participantsWithScores.sort((a, b) => b.scores - a.scores);

        res.json(participantsWithScores);
        return;

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
};

export const get_participant_by_id_async = async (req: Request, res: Response) => {
    const { id_user } = req.params;
    const { id_party } = req.params;

    try {
        // Vérification si l'utilisateur existe
        const userQuery = await pool.query(
            `SELECT u.id_user, u.name, u.firstname, p.id_profil, p.picture2, p.id_party
            FROM users u
            LEFT JOIN enigmato_profiles p ON p.id_user = u.id_user
            WHERE u.id_user = $1 AND p.id_party = $2`,
            [id_user, id_party] // Vous passez ici id_user et id_party
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


export const get_responses_participants_in_percentages_async = async (req: Request, res: Response) => {
    const { id_box, id_party } = req.params;
    const currentUser = req.user as IUser; // Supposons que l'utilisateur actuel soit injecté dans la requête (middleware d'authentification)

    try {
        // Étape 1 : Récupérer la réponse de l'utilisateur actuel pour la box donnée
        const userResponseResult = await pool.query(
            'SELECT * FROM enigmato_box_responses WHERE id_box = $1 AND id_user = $2',
            [id_box, currentUser.id_user]
        );

        const boxUserResponse = userResponseResult.rows[0] || null;

        if (!boxUserResponse) {
            res.status(204).json({ message: 'Box response not found' });
            return;
        }

        // Étape 2 : Récupérer toutes les réponses pour cette box
        const allResponsesResult = await pool.query(
            'SELECT * FROM enigmato_box_responses WHERE id_box = $1',
            [id_box]
        );

        const allBoxResponses = allResponsesResult.rows;

        if (allBoxResponses.length === 0) {
            res.status(204).json({ message: 'No responses found for this box' });
            return;
        }

        // Étape 3 : Compter les occurrences de chaque `id_user_response`
        const responseCount: { [key: number]: number } = {};
        allBoxResponses.forEach((response) => {
            const userResponseId = response.id_user_response;
            if (userResponseId !== null) {
                responseCount[userResponseId] = (responseCount[userResponseId] || 0) + 1;
            }
        });

        // Étape 4 : Calculer les pourcentages
        const totalResponses = allBoxResponses.length;
        const responsePercentages = Object.entries(responseCount).map(([userId, count]) => ({
            id_user_response: parseInt(userId, 10),
            percentage: (count / totalResponses * 100).toFixed(2), // Limiter à deux décimales
        }));

        // Étape 5 : Récupérer les informations des participants
        const participants = await fetch_participants_completed_async(Number(id_party));

        if ('message' in participants) {
            res.status(404).json({ message: participants.message });
            return;
        }

        // Étape 6 : Assembler les données finales
        const enrichedParticipants = participants.map((participant) => {
            const percentageInfo = responsePercentages.find(
                (percent) => percent.id_user_response === participant.id_user
            );

            return {
                id_user: currentUser.id_user,
                id_party: Number(id_party),
                id_box: Number(id_box),
                id_profil: participant.id_profil,
                name: participant.name,
                firstname: participant.firstname,
                picture2: participant.picture2,
                percentage: percentageInfo ? parseFloat(percentageInfo.percentage) : 0,
                isChoiceByUser: participant.id_user === boxUserResponse.id_user_response,
            };
        })
            .filter(participant => participant.percentage > 0) // Exclure les participants avec un pourcentage de 0
            .sort((a, b) => b.percentage - a.percentage); // Trier par pourcentage, du plus élevé au plus bas
        res.status(200).json(enrichedParticipants);
    } catch (err) {
        console.error('Error fetching responses and participants:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};