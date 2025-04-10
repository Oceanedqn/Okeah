import { IUser } from '../../interfaces/IUser';
import pool from '../../config/database';
import { Request, Response, Router } from 'express';
import { hashPassword, verifyPassword } from '../../utils/auth.utils';
import { calculateNumberOfBoxes, fetchParty, getNormalizedToday } from '../../utils/whois.utils';

const router = Router();

// [OK] Récupère les parties d'un utilisateur
export const get_parties_by_user_async = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
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

        // Convertir les résultats en un objet clé-valeur pour un accès rapide
        const participantCountsMap = participantCountsResult.rows.reduce(
            (acc: Record<number, number>, row) => {
                acc[row.id_party] = Number(row.participants_number);
                return acc;
            },
            {}
        );

        // Requête principale pour récupérer les parties en cours (non terminées)
        const userPartiesResult = await pool.query(
            `
            SELECT
                p.*
            FROM enigmato_parties p
            INNER JOIN enigmato_profiles ep ON p.id_party = ep.id_party
            WHERE ep.id_user = $1
            AND p.date_end >= DATE_TRUNC('day', NOW()) -- Parties non terminées (date de fin >= maintenant)
            `,
            [userId]
        );

        // Mapper les résultats pour inclure les informations supplémentaires
        const updatedParties = userPartiesResult.rows.map((party) => ({
            id_party: party.id_party,
            date_creation: party.date_creation,
            name: party.name,
            password: party.password,
            date_start: party.date_start,
            date_end: party.date_end,
            game_mode: party.game_mode,
            number_of_box: party.number_of_box,
            id_user: party.id_user,
            include_weekends: party.include_weekends,
            participants_number: participantCountsMap[party.id_party] || 0,
        }));

        res.status(200).json(updatedParties);
    } catch (error) {
        console.error('Error fetching user parties:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// [OK] Récupère les parties finies d'un utilisateur
export const get_finished_parties_by_user_async = async (req: Request, res: Response) => {
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

        // Requête principale pour récupérer les parties strictement terminées de l'utilisateur
        const userPartiesResult = await pool.query(`
            SELECT
                p.*
            FROM enigmato_parties p
            INNER JOIN enigmato_profiles ep ON p.id_party = ep.id_party
            WHERE ep.id_user = $1
            AND p.date_end < DATE_TRUNC('day', NOW()) -- Strictement terminées avant aujourd'hui
        `, [userId]);

        // Mapper les données pour correspondre au schéma attendu
        const response = userPartiesResult.rows.map((party) => ({
            id_party: party.id_party,
            date_creation: party.date_creation,
            name: party.name,
            password: party.password,
            date_start: party.date_start,
            date_end: party.date_end,
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

// [OK] Récupère les parties disponible sans celles que l'utilisateur a déjà rejoint
export const get_unjoined_parties_async = async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 8;
    const currentUser: IUser | undefined = req.user;

    const client = await pool.connect();
    if (currentUser) {
        try {
            if (currentUser.id_user === 1) {
                // Sous-requête pour récupérer les parties auxquelles l'utilisateur actuel a déjà rejoint
                const subquery = `
                SELECT id_party
                FROM enigmato_profiles
                WHERE id_user = $1
                `;

                // Requête principale pour récupérer les parties auxquelles l'utilisateur n'a pas participé
                // et dont la date de fin est après la date actuelle (parties non terminées)
                const query = `
                SELECT *
                FROM enigmato_parties
                WHERE id_party NOT IN (${subquery}) 
                AND date_end >= DATE_TRUNC('day', NOW())
                OFFSET $2 LIMIT $3
                `;

                const result = await client.query(query, [currentUser.id_user, skip, limit]);
                const parties = result.rows || [];

                if (parties.length === 0) {
                    res.json([]);
                    return;
                }

                // Sous-requête pour compter le nombre de participants par partie
                const participantsQuery = `
                SELECT id_party, COUNT(id_profil) AS participants_number
                FROM enigmato_profiles
                GROUP BY id_party
                `;
                const participantsResult = await client.query(participantsQuery);
                const participantsCount = participantsResult.rows.reduce((acc: any, row: any) => {
                    acc[row.id_party] = row.participants_number;
                    return acc;
                }, {});

                // Mapper les parties récupérées pour inclure les informations nécessaires
                const updatedParties = parties.map((party) => ({
                    id_party: party.id_party,
                    date_creation: party.date_creation,
                    name: party.name,
                    password: party.password,
                    date_start: party.date_start,
                    date_end: party.date_end,
                    game_mode: party.game_mode,
                    number_of_box: party.number_of_box,
                    id_user: party.id_user,
                    include_weekends: party.include_weekends,
                    participants_number: participantsCount[party.id_party] || 0,
                }));

                // Envoi de la réponse avec les parties mises à jour
                res.json(updatedParties);
            } else {
                // Si l'utilisateur n'est pas id_user = 1, on recherche la partie avec id = 24
                const query = `
                SELECT *
                FROM enigmato_parties
                WHERE id_party = 28
                `;
                const result = await client.query(query);
                const party = result.rows[0];

                // Si la partie est trouvée, renvoie les informations de la partie
                if (party) {
                    res.json([{
                        id_party: party.id_party,
                        date_creation: party.date_creation,
                        name: party.name,
                        password: party.password,
                        date_start: party.date_start,
                        date_end: party.date_end,
                        game_mode: party.game_mode,
                        number_of_box: party.number_of_box,
                        id_user: party.id_user,
                        include_weekends: party.include_weekends,
                        participants_number: 0,
                    }]);
                } else {
                    res.status(404).json({ error: "Party not found" });
                }
            }
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

// [DONE 03/12/2024] Crée une partie
export const create_party_async = async (req: Request, res: Response) => {
    const client = await pool.connect();
    const party = req.body; // On suppose que les données sont envoyées dans le corps de la requête
    const currentUser: IUser | undefined = req.user;

    try {
        if (currentUser?.id_user == 1) {
            if (!party.date_start || !party.date_end) {
                res.status(400).json({ error: "Start date and end date are required" });
            }

            // Calculer le nombre de jours (number_of_box)
            const numberOfBoxes = calculateNumberOfBoxes(
                party.date_start,
                party.date_end,
                party.include_weekends
            );

            // Si set_password est True, on hash le mot de passe. Sinon, on le met à null.
            const passwordToStore = party.set_password && party.password ? hashPassword(party.password) : null;

            if (!currentUser) {
                res.status(403).json({ error: "Unauthorized" });
            }

            // Début de la transaction
            await client.query('BEGIN');

            // Insertion de la nouvelle partie
            const query = `
                INSERT INTO enigmato_parties (name, date_creation, password, id_user, date_start, game_mode, number_of_box, include_weekends, set_password, date_end)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
            `;
            const values = [
                party.name,
                getNormalizedToday(new Date()),
                passwordToStore,
                currentUser!.id_user,
                party.date_start,
                party.game_mode,
                numberOfBoxes, // Utilisation de la valeur calculée
                party.include_weekends,
                party.set_password,
                party.date_end,
            ];

            const result = await client.query(query, values);
            const dbParty = result.rows[0]; // La partie insérée
            const idParty = dbParty.id_party;

            // Création des boîtes
            for (let currentDate = new Date(party.date_start); currentDate <= new Date(party.date_end); currentDate.setDate(currentDate.getDate() + 1)) {
                if (!party.include_weekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
                    continue; // Sauter les week-ends si non inclus
                }

                const formattedDate = currentDate.toISOString().split('T')[0];
                await client.query(
                    `INSERT INTO enigmato_boxes (id_party, name, date, id_enigma_user)
                        VALUES ($1, $2, $3, $4)`,
                    [idParty, `Box du ${formattedDate}`, formattedDate, null]
                );
            }

            // Si tout s'est bien passé, on valide la transaction
            await client.query('COMMIT');

            // Retourner la partie créée
            res.status(201).json(dbParty);
        } else {
            res.status(403).json({ error: "You are not authorized to perform this action" });
        }
    } catch (err) {
        // En cas d'erreur, on annule la transaction
        await client.query('ROLLBACK');
        console.error("Error in create_party_async", err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        // On libère toujours le client, qu'il y ait eu une erreur ou non
        client.release();
    }
};

// [OK] Rejoindre une partie
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
                return; // Stop execution after response
            }

            const party = partyResult.rows[0];

            // Vérifier si un mot de passe est requis et si le mot de passe est correct
            if (party.set_password) {
                if (!password) {
                    res.status(400).json({ error: 'Mot de passe manquant' });
                    return; // Stop execution after response
                }
                if (!verifyPassword(password, party.password)) {
                    res.status(400).json({ error: 'Mot de passe incorrect' });
                    return; // Stop execution after response
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
                return; // Stop execution after response
            }

            // Créer une nouvelle entrée pour lier l'utilisateur à la partie
            const joinPartyQuery = `
                INSERT INTO enigmato_profiles (id_user, id_party, date_joined_at, is_complete)
                VALUES ($1, $2, $3, $4) RETURNING *
            `;
            const joinResult = await client.query(joinPartyQuery, [
                currentUser.id_user,
                id_party,
                new Date(), // Date d'adhésion
                false,
            ]);

            const newUserParty = joinResult.rows[0];

            // Retourner la réponse avec les données du profil de la partie
            res.status(201).json(newUserParty);

            client.release(); // Relâcher la connexion à la base de données
        } catch (err) {
            console.error('Error joining party:', err);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    } else {
        // Si l'utilisateur n'est pas authentifié
        res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
};

export const get_party_by_id_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;

    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const idPartyNumber = parseInt(id_party, 10);
        if (isNaN(idPartyNumber)) {
            res.status(400).json({ message: 'Invalid id_party parameter. It must be a number.' });
        }

        const party = await fetchParty(idPartyNumber);
        res.json(party);
    } catch (err: any) {
        if (err.message === 'Party not found') {
            res.status(404).json({ message: 'Party not found' });
        }

        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const get_party_name_by_id_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;

    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const idPartyNumber = parseInt(id_party, 10);
        if (isNaN(idPartyNumber)) {
            res.status(400).json({ message: 'Invalid id_party parameter. It must be a number.' });
        }

        const party = await fetchParty(idPartyNumber);
        res.json(party.name);
    } catch (err: any) {
        if (err.message === 'Party not found') {
            res.status(404).json({ message: 'Party not found' });
        }

        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default router;