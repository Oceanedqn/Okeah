import { Router, Request, Response } from 'express';
import { IEnigmatoBoxGame, IEnigmatoBoxRightResponse } from '../../interfaces/IEnigmato';
import pool from '../../config/database';
import { bufferToBase64, fetchParty, getNormalizedToday, update_box_async } from '../../utils/whois.utils';

const router = Router();
const partyLocks: Record<number, boolean> = {};

// [GET] Récupère la boîte du jour pour une partie
export const get_today_box_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    const idPartyNumber = parseInt(id_party, 10);

    // Verrouillage de la partie pour éviter les conflits
    partyLocks[idPartyNumber] = true;

    try {
        // Vérifiez la date de début de la partie
        const party = await fetchParty(idPartyNumber);
        const todayDate = getNormalizedToday(new Date());

        // Vérifier si la partie est terminée
        if (todayDate > getNormalizedToday(new Date(party.date_end))) {
            if (!res.headersSent) {
                res.status(204).json({ message: "La partie est terminée." });
            }
        } else {
            // Vérifier si la partie a déjà commencé
            if (new Date(todayDate) < new Date(party.date_start)) {
                if (!res.headersSent) {
                    res.status(202).json({ message: "La partie n'a pas encore commencé." });
                }
            } else {
                // Vérifiez si la boîte du jour existe déjà
                const boxExistQuery = await pool.query(
                    'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
                    [idPartyNumber, todayDate]
                );

                let box = boxExistQuery.rows[0];

                if (!box) {
                    // Si aucune boîte n'est trouvée, renvoyer une erreur 404
                    if (!res.headersSent) {
                        res.status(404).json({ message: "Aucune boîte trouvée pour aujourd'hui." });
                    }
                    return; // On arrête le traitement ici si aucune boîte n'est trouvée
                }

                // Vérification si la boîte a déjà une réponse, et l'exclusion de `id_enigma_user`
                if (!box.id_enigma_user) {
                    // Mise à jour de la boîte si pas de réponse
                    box = await update_box_async(idPartyNumber, box);
                }

                // Exclure `id_enigma_user` de la boîte avant de l'envoyer
                const { id_enigma_user, ...sanitizedBox } = box;

                if (!res.headersSent) {
                    res.json(sanitizedBox);
                }
            }
        }
    } catch (err) {
        console.error('Error fetching today’s box:', err);
        // Assurez-vous de ne pas envoyer deux réponses dans le bloc catch
        if (!res.headersSent) {
            res.status(500).send('Internal server error');
        }
    } finally {
        // Libérer le verrouillage de la partie
        partyLocks[idPartyNumber] = false;
    }
};

// [GET] Récupère les détails de la boîte du jour pour le jeu
export const get_today_box_in_game_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;

    try {
        const todayDate = new Date().toISOString().split('T')[0];

        const boxQuery = await pool.query(
            'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
            [id_party, todayDate]
        );

        const box = boxQuery.rows[0];
        if (!box) {
            res.status(404).json({ message: 'Box not found' });
        }

        const profileQuery = await pool.query(
            'SELECT * FROM enigmato_profiles WHERE id_user = $1 AND id_party = $2',
            [box.id_enigma_user, id_party]
        );

        const profile = profileQuery.rows[0];
        if (!profile) {
            res.status(404).json({ message: 'Profile image not found' });
        }

        const gameData: IEnigmatoBoxGame = {
            id_box: box.id_box,
            id_party: box.id_party,
            name: box.name,
            date: box.date,
            picture1: bufferToBase64(profile.picture1)!,
        };

        res.json(gameData);
    } catch (err) {
        console.error('Error fetching today’s box game:', err);
        res.status(500).send('Internal server error');
    }
};

// [GET] Récupère les boîtes précédentes d'une partie
export const get_past_boxes_in_game_async = async (req: Request, res: Response) => {
    const { id_party } = req.params;
    let responseSent = false; // Flag to track if a response has been sent

    try {
        const todayDate = new Date().toISOString().split('T')[0];

        // Step 1: Query for boxes with dates earlier than today
        const boxesQuery = await pool.query(
            'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date < $2 ORDER BY date DESC',
            [id_party, todayDate]
        );

        const boxes = boxesQuery.rows;

        if (boxes.length === 0) {
            res.status(204).json({ message: 'No past boxes found' });
            responseSent = true; // Mark response as sent
        }

        // Step 2: Fetch associated profile images for each box
        const pastBoxesWithProfiles: IEnigmatoBoxRightResponse[] = [];

        for (const box of boxes) {
            if (responseSent) break; // Avoid further processing if a response has already been sent

            if (!box.id_enigma_user) {
                continue;
            }

            try {
                const profileQuery = await pool.query(
                    'SELECT * FROM enigmato_profiles WHERE id_user = $1 AND id_party = $2',
                    [box.id_enigma_user, id_party]
                );

                const userQuery = await pool.query(
                    'SELECT id_user, name, firstname FROM users WHERE id_user = $1',
                    [box.id_enigma_user]
                );

                const profile = profileQuery.rows[0];
                const user = userQuery.rows[0];

                pastBoxesWithProfiles.push({
                    id_box: box.id_box,
                    id_party: box.id_party,
                    firstname: user.firstname,
                    name: user.name,
                    date: box.date,
                    picture1: bufferToBase64(profile.picture1)!,
                    picture2: bufferToBase64(profile.picture2)!,
                    name_box: box.name,
                    id_user: user.id_user,
                    id_profil: profile.id_profil,
                });
            } catch (innerErr) {
                console.error(`Error processing box ${box.id_box}:`, innerErr);
                continue; // Log error and skip this iteration
            }
        }

        if (!responseSent) {
            // Step 3: Send the final response
            res.json(pastBoxesWithProfiles);
        }
    } catch (err) {
        if (!responseSent) {
            // Send error response only if no response has been sent
            console.error('Error fetching past boxes in game:', err);
            res.status(500).send('Internal server error');
        }
    }
};
