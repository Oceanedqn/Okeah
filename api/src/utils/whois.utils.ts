import { IEnigmatoParticipants, IEnigmatoPartyParticipants } from "../interfaces/IEnigmato";
import pool from "../config/database";
import { IEnigmatoParty } from "../interfaces/IEnigmato";
import { get_random_participant_completed_async } from "../controllers/whois/participants.controller";



// Fonction utilitaire pour ajouter des jours à une date tout en tenant compte des week-ends
export const addDays = (startDate: Date, numberOfDays: number, includeWeekends: boolean): Date => {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < numberOfDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (includeWeekends || (currentDate.getDay() !== 0 && currentDate.getDay() !== 6)) {
            addedDays++;
        }
    }

    return currentDate;
};



export const checkAndUpdatePartyStatus = async (party: any): Promise<any> => {
    const now = new Date();

    if (!party.is_finished) {
        // Calculer la date théorique de fin
        const dateStart = new Date(party.date_start);
        const theoreticalEndDate = addDays(dateStart, party.number_of_box, party.include_weekends);

        // Vérifier si la date actuelle dépasse la date théorique de fin
        if (now > theoreticalEndDate) {
            // Mettre à jour la base de données pour marquer la partie comme terminée
            await pool.query(
                `
                UPDATE enigmato_parties
                SET is_finished = true
                WHERE id_party = $1
                `,
                [party.id_party]
            );
            party.is_finished = true; // Mettre à jour l'état localement
        }
    }

    return party;
};


export function base64ToBuffer(base64: string): Buffer {
    // Retirer le préfixe Base64 si présent (ex. "data:image/png;base64,")
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

export const bufferToBase64 = (buffer: Buffer | null | undefined, mimeType: string = 'image/png' // MIME Type par défaut
): string | null => {
    if (!buffer) {
        return null; // Retourner null si le buffer est invalide
    }
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
};


export const fetchParty = async (id_party: number): Promise<IEnigmatoParty> => {
    const partyQuery = await pool.query(
        'SELECT * FROM enigmato_parties WHERE id_party = $1',
        [id_party]
    );

    if (partyQuery.rows.length === 0) {
        throw new Error('Party not found');
    }

    return partyQuery.rows[0];
};


export const fetch_participants_completed_async = async (id_party: number): Promise<IEnigmatoParticipants[] | { message: string }> => {
    try {
        // Vérification si la partie existe
        const partyQuery = await pool.query(
            'SELECT * FROM enigmato_parties WHERE id_party = $1',
            [id_party]
        );

        if (partyQuery.rows.length === 0) {
            return { message: 'No such party found' };
        }

        // Récupérer uniquement les participants avec un profil complet
        const participantsQuery = await pool.query(
            `SELECT u.id_user, u.gender, u.name, u.firstname, p.id_profil, p.picture1, p.picture2
            FROM users u
            JOIN enigmato_profiles p ON p.id_user = u.id_user
            WHERE p.id_party = $1 AND p.picture1 IS NOT NULL AND p.picture2 IS NOT NULL`,
            [id_party]
        );

        const participants = participantsQuery.rows;

        if (participants.length === 0) {
            return [];
        }

        // Préparer la liste des participants
        const participantsWithStatus: IEnigmatoParticipants[] = participants.map((participant) => {
            return {
                id_user: participant.id_user,
                id_party: Number(id_party),
                id_profil: participant.id_profil,
                name: participant.name,
                firstname: participant.firstname,
                gender: participant.gender,
                picture2: participant.picture2 ? bufferToBase64(participant.picture2) : null,
                is_complete: true, // Toujours vrai ici car filtré dans la requête SQL
            };
        });

        return participantsWithStatus;

    } catch (err) {
        console.error(err);
        return { message: 'Internal Server Error' };
    }
};


export const get_today_box_in_game_with_response_async = async (id_party: number) => {
    const todayDate = new Date().toISOString().split('T')[0];

    try {
        const boxQuery = await pool.query(
            'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
            [id_party, todayDate]
        );

        const box = boxQuery.rows[0];

        // Return null if no box is found for today
        if (!box) {
            return null;
        }

        return box;
    } catch (error) {
        console.error('Error fetching today’s box:', error);
        return null;  // Return null if an error occurs while fetching the box
    }
};


export const get_profile_by_id_from_db = async (id_party: number, id_user: number): Promise<IEnigmatoParticipants | null> => {
    try {
        // Query to get the profile data
        const result = await pool.query(
            'SELECT * FROM enigmato_profiles WHERE id_party = $1 AND id_user = $2',
            [id_party, id_user]
        );

        if (result.rows.length === 0) {
            return null; // Return null if no profile found
        }

        const profile = result.rows[0];

        // Query to get the user data
        const userResult = await pool.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        const user = userResult.rows[0];

        // Create the participant object
        const participant: IEnigmatoParticipants = {
            id_user: user.id_user,
            id_party: id_party,
            id_profil: profile.id_profil,
            name: user.name,
            gender: user.gender,
            firstname: user.firstname,
            picture2: profile.picture2
                ? `data:image/png;base64,${profile.picture2.toString('base64')}`
                : '', // Convert null to an empty string
            is_complete: profile.is_complete,
        };

        return participant; // Return the participant object
    } catch (err) {
        console.error('Error fetching profile by ID:', err);
        throw new Error('Internal server error');
    }
};




// [POST] Crée une boîte pour aujourd'hui
export const create_box_async = async (id_party: number): Promise<any> => {
    const todayDate = new Date().toISOString().split('T')[0];

    try {
        // Step 1: Check if today's box already exists
        const boxQuery = await pool.query(
            'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
            [id_party, todayDate]
        );

        const existingBox = boxQuery.rows[0];
        if (existingBox) {
            return existingBox;
        }

        // Step 2: Attempt to fetch a random participant
        const participant = await get_random_participant_completed_async(id_party);

        if (!participant || !participant?.id_user) {
            throw new Error(`No valid participant could be found to create a box.`);
        }

        // Step 3: Create the box
        const newBoxQuery = await pool.query(
            `INSERT INTO enigmato_boxes (id_party, name, date, id_enigma_user)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [id_party, `Box du ${todayDate}`, todayDate, participant.id_user]
        );

        return newBoxQuery.rows[0];
    } catch (err: any) {
        console.error(`Error in create_box_async:`, err);
        throw new Error(`Failed to create a box: ${err.message}`);
    }
};



export const checkPartyFinished = (party: IEnigmatoPartyParticipants): boolean => {
    // Obtenir la date actuelle en UTC, sans l'heure
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Obtenir la date de début en UTC, sans l'heure
    const dateStart = new Date(party.date_start);
    const dateStartUTC = new Date(Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate()));

    // Calculer la différence en jours
    const diffDays = Math.floor((todayUTC.getTime() - dateStartUTC.getTime()) / (1000 * 60 * 60 * 24));

    let effectiveDays = diffDays;

    // Si les week-ends doivent être exclus
    if (!party.include_weekends) {
        let workDays = 0;
        for (let i = 0; i <= diffDays; i++) {
            const currentDay = new Date(dateStartUTC);
            currentDay.setUTCDate(currentDay.getUTCDate() + i);
            const dayOfWeek = currentDay.getUTCDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclure samedi (6) et dimanche (0)
                workDays++;
            }
        }
        effectiveDays = workDays;
    }

    // Si le nombre de jours effectifs dépasse ou atteint le nombre de boîtes, la partie est terminée
    return effectiveDays >= party.number_of_box;
};


/**
 * Retourne la date du jour normalisée (sans l'heure, à minuit local).
 * @returns {Date} - La date normalisée au début de la journée locale.
 */
export const getNormalizedToday = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};


/**
 * Calcule le nombre de jours entre deux dates, incluant ou excluant les week-ends.
 * @param startDate - Date de début.
 * @param endDate - Date de fin.
 * @param includeWeekends - Si `false`, exclut les week-ends du calcul.
 * @returns {number} - Nombre de jours calculés.
 */
export const calculateNumberOfBoxes = (startDate: string, endDate: string, includeWeekends: boolean): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let numberOfDays = 0;

    for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        const dayOfWeek = current.getDay();
        if (includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
            numberOfDays++;
        }
    }

    return numberOfDays;
};
