import { IUser } from '../../interfaces/IUser';
import pool from '../../config/database';
import { Request, Response, Router } from 'express';
import { IEnigmatoParticipants, IEnigmatoParty, IEnigmatoPartyParticipants } from '../../interfaces/IEnigmato';
import { hashPassword, verifyPassword } from '../../utils/auth.utils';
import { bufferToBase64, checkAndUpdatePartyStatus } from '../../utils/whois.utils';

const router = Router();

// GET /user/parties
export const get_user_parties_async = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user; // Auth middleware injects user dans la requête
        const userId = currentUser!.id_user;

        // Sous-requête pour compter les participants par partie
        const participantCountsResult = await pool.query(
            `
            SELECT
                id_party,
                COUNT(id_profil) AS participants_number
            FROM enigmato_profiles
            GROUP BY id_party
            `
        );

        // Convertir les résultats de participantCounts en un objet clé-valeur
        const participantCountsMap = participantCountsResult.rows.reduce(
            (acc: Record<number, number>, row) => {
                acc[row.id_party] = Number(row.participants_number);
                return acc;
            },
            {}
        );

        // Requête principale pour récupérer les parties de l'utilisateur
        const userPartiesResult = await pool.query(
            `
            SELECT
                p.*
            FROM enigmato_parties p
            INNER JOIN enigmato_profiles ep ON p.id_party = ep.id_party
            WHERE ep.id_user = $1 AND p.is_finished = false
            `,
            [userId]
        );

        // Vérifier et mettre à jour l'état des parties
        const updatedParties = await Promise.all(
            userPartiesResult.rows.map(async (party) => {
                const updatedParty = await checkAndUpdatePartyStatus(party);
                return {
                    id_party: updatedParty.id_party,
                    date_creation: updatedParty.date_creation,
                    name: updatedParty.name,
                    password: updatedParty.password,
                    date_start: updatedParty.date_start,
                    date_end: updatedParty.date_end,
                    is_finished: updatedParty.is_finished,
                    game_mode: updatedParty.game_mode,
                    number_of_box: updatedParty.number_of_box,
                    id_user: updatedParty.id_user,
                    include_weekends: updatedParty.include_weekends,
                    participants_number: participantCountsMap[updatedParty.id_party] || 0,
                };
            })
        );

        // Filtrer uniquement les parties qui sont encore en cours (is_finished == false)
        const ongoingParties = updatedParties.filter(party => !party.is_finished);

        res.status(200).json(ongoingParties);
    } catch (error) {
        console.error('Error fetching user parties:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const get_user_parties_finished_async = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user; // Auth middleware injects user into request
        const userId = currentUser!.id_user;

        // Sous-requête pour compter les participants par partie
        const participantCountsResult = await pool.query(`
            SELECT
                id_party,
                COUNT(id_profil) AS participants_number
            FROM enigmato_profiles
            GROUP BY id_party
        `);

        // Convertir les résultats de participantCounts en un objet clé-valeur
        const participantCountsMap = participantCountsResult.rows.reduce(
            (acc: Record<number, number>, row) => {
                acc[row.id_party] = Number(row.participants_number);
                return acc;
            },
            {}
        );

        // Requête principale pour récupérer les parties terminées de l'utilisateur
        const userPartiesResult = await pool.query(`
            SELECT
                p.*
            FROM enigmato_parties p
            INNER JOIN enigmato_profiles ep ON p.id_party = ep.id_party
            WHERE ep.id_user = $1 AND p.is_finished = true
        `, [userId]);

        // Mapper les données pour correspondre au schéma attendu
        const response = userPartiesResult.rows.map((party) => ({
            id_party: party.id_party,
            date_creation: party.date_creation,
            name: party.name,
            password: party.password,
            date_start: party.date_start,
            date_end: party.date_end,
            is_finished: party.is_finished,
            game_mode: party.game_mode,
            number_of_box: party.number_of_box,
            id_user: party.id_user,
            include_weekends: party.include_weekends,
            participants_number: participantCountsMap[party.id_party] || 0,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching finished user parties:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const get_parties_async = async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 8;
    const currentUser: IUser | undefined = req.user;

    const client = await pool.connect();
    if (currentUser) {
        try {
            // Sous-requête pour récupérer les parties auxquelles l'utilisateur actuel n'a pas encore rejoint
            const subquery = `
            SELECT id_party
            FROM enigmato_profiles
            WHERE id_user = $1
            `;

            // Requête pour récupérer les parties auxquelles l'utilisateur n'a pas participé et qui ne sont pas terminées
            const query = `
            SELECT * FROM enigmato_parties
            WHERE id_party NOT IN (${subquery})
            AND is_finished = false
            OFFSET $2 LIMIT $3
            `;

            // Exécution de la requête principale pour récupérer les parties
            const result = await client.query(query, [currentUser.id_user, skip, limit]);
            const parties = result.rows;

            // Sous-requête pour compter le nombre de participants par partie
            const participantsQuery = `
            SELECT id_party, COUNT(id_profil) AS participants_number
            FROM enigmato_profiles
            GROUP BY id_party
            `;

            // Exécution de la requête pour récupérer le nombre de participants par partie
            const participantsResult = await client.query(participantsQuery);
            const participantsCount = participantsResult.rows.reduce((acc: any, row: any) => {
                acc[row.id_party] = row.participants_number;
                return acc;
            }, {});

            // Vérifier et mettre à jour le statut des parties
            const updatedParties = await Promise.all(
                parties.map(async (party) => {
                    const updatedParty = await checkAndUpdatePartyStatus(party);
                    return {
                        id_party: updatedParty.id_party,
                        date_creation: updatedParty.date_creation,
                        name: updatedParty.name,
                        password: updatedParty.password,
                        date_start: updatedParty.date_start,
                        date_end: updatedParty.date_end,
                        is_finished: updatedParty.is_finished,
                        game_mode: updatedParty.game_mode,
                        number_of_box: updatedParty.number_of_box,
                        id_user: updatedParty.id_user,
                        include_weekends: updatedParty.include_weekends,
                        participants_number: participantsCount[updatedParty.id_party] || 0,
                    };
                })
            );

            // Filtrer uniquement les parties en cours (is_finished === false)
            const ongoingParties = updatedParties.filter(party => !party.is_finished);

            // Retourner les parties filtrées
            res.json(ongoingParties);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error executing query", err.stack);
            }
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};


export const create_party_async = async (req: Request, res: Response) => {
    try {
        const party = req.body; // On suppose que les données sont envoyées dans le corps de la requête
        const currentUser: IUser | undefined = req.user;

        // Si set_password est True, on hash le mot de passe. Sinon, on le met à None.
        const passwordToStore = party.set_password && party.password ? hashPassword(party.password) : null;

        // Créer la nouvelle partie
        const client = await pool.connect();
        if (currentUser) {
            try {
                const query = `
        INSERT INTO enigmato_parties (name, date_creation, password, id_user, date_start, game_mode, number_of_box, include_weekends, set_password, date_end, is_finished)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
      `;

                const values = [
                    party.name,
                    new Date(),
                    passwordToStore,
                    currentUser.id_user,
                    party.date_start,
                    party.game_mode,
                    party.number_of_box,
                    party.include_weekends,
                    party.set_password,
                    null, // date_end sera null lors de la création de la partie
                    false, // Partie non terminée au départ
                ];

                // Exécution de la requête
                const result = await client.query(query, values);
                const dbParty = result.rows[0]; // Récupérer la première ligne de la réponse

                // Retourner la partie créée
                res.status(201).json(dbParty);

            } catch (err) {
                console.error("Error executing query", err);
                res.status(500).json({ error: "Internal Server Error" });
            } finally {
                client.release();
            }
        }


    } catch (err) {
        console.error("Error in createPartyAsync", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const join_party_async = async (req: Request, res: Response) => {
    const { id_party, password } = req.body; // Données envoyées dans le corps de la requête
    const currentUser: IUser | undefined = req.user;

    if (currentUser) {
        try {
            const client = await pool.connect();

            // Vérifier si la partie existe
            const partyQuery = 'SELECT * FROM enigmato_parties WHERE id_party = $1';
            const partyResult = await client.query(partyQuery, [id_party]);

            if (partyResult.rows.length === 0) {
                res.status(404).json({ error: 'Partie non trouvée' });
            }

            const party = partyResult.rows[0];

            // Vérifier si un mot de passe est requis et si le mot de passe est correct
            if (party.set_password) {
                if (!password) {
                    res.status(400).json({ error: 'Mot de passe manquant' });
                }
                if (!verifyPassword(password, party.password)) {
                    res.status(400).json({ error: 'Mot de passe incorrect' });
                }
            }

            // Vérifier si l'utilisateur est déjà membre de la partie
            const checkUserPartyQuery = `
      SELECT * FROM enigmato_profiles
      WHERE id_user = $1 AND id_party = $2
    `;
            const userPartyResult = await client.query(checkUserPartyQuery, [currentUser.id_user, id_party]);

            if (userPartyResult.rows.length > 0) {
                res.status(400).json({ error: 'Utilisateur déjà membre de cette partie' });
            }

            // Créer une nouvelle entrée pour lier l'utilisateur à la partie
            const joinPartyQuery = `
      INSERT INTO enigmato_profiles (id_user, id_party, date_joined_at, is_complete)
VALUES ($1, $2, $3, $4) RETURNING *
    `;
            const joinResult = await client.query(joinPartyQuery, [
                currentUser.id_user,
                id_party,
                new Date(), // Date d'adhésion,
                false
            ]);

            const newUserParty = joinResult.rows[0];

            // Retourner la réponse avec les données du profil de la partie
            res.status(201).json(newUserParty);

            client.release();
        } catch (err) {
            console.error('Error joining party:', err);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

}

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


export const get_party_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    const { user } = req;  // Utilisateur actuel de la requête (généralement venant d'un middleware d'auth)

    // Si l'utilisateur n'est pas authentifié, renvoyer une erreur 401
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Vérification si la partie existe
        const partyQuery = await pool.query(
            'SELECT * FROM enigmato_parties WHERE id_party = $1',
            [parseInt(id_party)]
        );

        // Si aucune partie n'est trouvée, retourner 404
        if (partyQuery.rows.length === 0) {
            res.status(404).json({ message: 'Party not found' });
        }

        // Récupérer la première ligne de la réponse (la partie trouvée)
        const party = partyQuery.rows[0];

        // Vérification si la partie existe avant d'y accéder
        if (!party || !party.id_party) {
            res.status(404).json({ message: 'Party not found' });
        }


        // Envoyer la réponse avec les informations de la partie
        res.json(party); // Utiliser return pour éviter des réponses multiples

    } catch (err) {
        // Gérer l'erreur et retourner une erreur serveur interne
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export default router;