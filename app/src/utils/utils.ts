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

    // Calcul du nombre de jours total inclus entre dateStart et dateEnd
    let totalDays = 0;

    if (!party.include_weekends) {
        let currentDay = new Date(dateStart);

        // On inclut la date de fin
        while (currentDay.getTime() <= dateEnd) {
            const dayOfWeek = currentDay.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Si ce n'est ni dimanche (0) ni samedi (6)
                totalDays++;
            }
            currentDay.setUTCDate(currentDay.getUTCDate() + 1); // Utilisation de setUTCDate pour éviter les problèmes de fuseaux horaires
        }
    } else {
        // Si les week-ends doivent être inclus, calculer simplement la différence en jours
        const diffTime = dateEnd - dateStart; // Différence en millisecondes
        totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Convertir en jours, +1 pour inclure la date de fin
    }

    // Calcul des jours écoulés depuis la date de début jusqu'à aujourd'hui
    let daysElapsed = Math.floor((today - dateStart) / (1000 * 60 * 60 * 24)) + 1; // Inclure la date de début

    // Calcul de l'étape actuelle : 
    // Si daysElapsed > totalDays, on est à la fin
    const step = Math.min(daysElapsed, totalDays, party.number_of_box);

    // Retourne l'étape actuelle avec le nombre total de boîtes
    return `${t('step')} ${step}/${party.number_of_box}`;
};