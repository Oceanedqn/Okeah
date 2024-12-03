import { IEnigmatoPartyParticipants } from "../interfaces/IEnigmato";


/**
 * Renvoie une date normalisée représentant uniquement le jour actuel (sans l'heure).
 * @returns {Date} - Date normalisée.
 */
export const getNormalizedDate = (date: Date): Date => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

export const calculateGameStage = (party: IEnigmatoPartyParticipants, t: Function) => {
    const today = getNormalizedDate(new Date());  // La date d'aujourd'hui sans heure
    const dateStart = getNormalizedDate(new Date(party.date_start));  // La date de début sans heure
    const dateEnd = getNormalizedDate(new Date(party.date_end));  // La date de fin sans heure

    // Si la date actuelle est avant la date de début
    if (today < dateStart) {
        const locale = navigator.language || 'en-US'; // Détecte la langue du navigateur ou utilise 'en-US' par défaut
        const formattedDate = dateStart.toLocaleDateString(locale, {
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

    // Calcul du nombre de jours écoulés depuis le début
    let effectiveDays = 0;

    // Si les week-ends doivent être exclus
    if (!party.include_weekends) {
        let currentDay = new Date(dateStart);

        // Si la date de début est le même jour qu'aujourd'hui, on compte ce jour comme 1
        if (today.getTime() === dateStart.getTime()) {
            effectiveDays = 1; // Premier jour de la partie
        } else {
            // On boucle de la date de départ à la date actuelle
            while (currentDay < today) {
                currentDay.setDate(currentDay.getDate() + 1); // Passer au jour suivant
                const dayOfWeek = currentDay.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Si ce n'est ni dimanche (0) ni samedi (6)
                    effectiveDays++; // On incrémente le nombre de jours ouvrés
                }
            }
        }
    } else {
        // Si les week-ends doivent être inclus, calculer simplement la différence en jours
        const diffTime = today.getTime() - dateStart.getTime(); // Différence en millisecondes
        effectiveDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Convertir en jours, +1 pour inclure aujourd'hui
    }

    // Si le premier jour est aujourd'hui, nous devons le comptabiliser comme jour 1
    if (today.getTime() === dateStart.getTime()) {
        effectiveDays = 1;
    }

    // Calcul de l'étape actuelle : 
    // On ajoute 1 pour inclure le premier jour de la partie, 
    // mais l'étape ne doit jamais dépasser le nombre de boîtes disponibles
    const step = Math.min(effectiveDays, party.number_of_box);

    // Retourne l'étape actuelle avec le nombre total de boîtes
    return `${t('step')} ${step}/${party.number_of_box}`;
};