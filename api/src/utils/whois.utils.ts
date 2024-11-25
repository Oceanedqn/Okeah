import pool from "../config/database";



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

export const bufferToBase64 = (buffer: Buffer | null | undefined, mimeType: string = 'image/png'): string | null => {
    if (!buffer) {
        return null;  // Retourner null si le buffer est invalide
    }

    // Ajouter le préfixe de type MIME (par défaut 'image/png', tu peux aussi le passer en paramètre)
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
};
