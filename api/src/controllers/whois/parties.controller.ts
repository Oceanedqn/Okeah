import { IUser } from '../../interfaces/IUser';
import pool from '../../config/database';
import { Request, Response, Router } from 'express';
import { IEnigmatoPartyParticipants } from '../../interfaces/IEnigmato';
import { hashPassword, verifyPassword } from '../../utils/auth.utils';

const router = Router();

// GET /user/parties
export const get_user_parties_async = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user; // Auth middleware injects user into request
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


export const read_parties_async = async (req: Request, res: Response) => {
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

            // Construction de la réponse
            const response: IEnigmatoPartyParticipants[] = parties.map((party: any) => ({
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
                participants_number: participantsCount[party.id_party] || 0,
            }));

            // Retourner la réponse
            res.json(response);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error executing query", err.stack);
            }
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}


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



export default router;