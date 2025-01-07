import { IEnigmatoPartyParticipants } from "../interfaces/IEnigmato";


/**
 * Renvoie une date normalisée représentant uniquement le jour actuel (sans l'heure).
 * @returns {Date} - Date normalisée.
 */
export const getNormalizedDate = (date: Date): Date => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};


export function formatDate(dateString: string) {
    if (!dateString) {
        console.error("La chaîne de date est invalide :", dateString);
        return "Invalid Date";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error("Impossible de parser la date :", dateString);
        return "Invalid Date";
    }

    // Récupère la langue (par exemple "fr" ou "en") depuis le localStorage
    const language = localStorage.getItem("i18nextLng") || "fr";
    const locale = language === "fr" ? "fr-FR" : "en-US";

    console.log("Date originale :", dateString);
    console.log("Langue détectée :", language);

    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export const calculateGameStage = (party: IEnigmatoPartyParticipants, t: Function) => {
    const today = getNormalizedDate(new Date()).getTime();  // La date d'aujourd'hui sans heure en UTC
    const dateStart = getNormalizedDate(new Date(party.date_start)).getTime();  // La date de début sans heure en UTC
    const dateEnd = getNormalizedDate(new Date(party.date_end)).getTime();  // La date de fin sans heure en UTC

    // Si la date actuelle est avant la date de début
    if (today < dateStart) {
        const locale = navigator.language || 'en-US'; // Détecte la langue du navigateur ou utilise 'en-US' par défaut
        const formattedDate = new Date(dateStart).toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        return `${t('startOn')} ${formattedDate}`;
    }

    // Si la partie est déjà terminée
    if (today > dateEnd) {
        return t('gameFinished'); // La partie est terminée
    }


    // Calcul du nombre total de jours ou de jours écoulés, en excluant les week-ends si nécessaire
    let daysCount = 0;
    let currentDay = new Date(dateStart);

    while (currentDay.getTime() <= Math.min(today, dateEnd)) {
        const dayOfWeek = currentDay.getDay();
        if (party.include_weekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
            daysCount++;
        }
        currentDay.setUTCDate(currentDay.getUTCDate() + 1); // Passer au jour suivant
    }

    // Calcul de l'étape actuelle : 
    const step = Math.min(daysCount, party.number_of_box);

    // Retourne l'étape actuelle avec le nombre total de boîtes
    return `${t('step')} ${step}/${party.number_of_box}`;
};