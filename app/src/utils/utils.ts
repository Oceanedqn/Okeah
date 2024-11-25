import { IEnigmatoPartyParticipants } from "../interfaces/IEnigmato";


export const calculateGameStage = (party: IEnigmatoPartyParticipants, t: Function) => {
    const today = new Date();
    const dateStart = new Date(party.date_start);
    const formattedDateStart = dateStart.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    if (today < dateStart) {
        // Si la date actuelle est avant la date de début de la partie
        return `${t('startOn')} ${formattedDateStart}`;
    }

    // Calcul du nombre de jours écoulés depuis le début de la partie
    const diffDays = Math.floor((today.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24));

    // Calcul de l'étape actuelle : 
    // si 'include_weekends' est faux, nous devons compter les jours uniquement en semaine.
    const step = Math.floor(diffDays / (party.include_weekends ? 1 : 7)) + 1;

    // Vérification si l'étape dépasse le nombre de box (et donc, la partie est terminée)
    if (party.is_finished) {
        return t('gameFinished'); // La partie est terminée
    }

    // Retourne l'étape actuelle avec le nombre total de box
    return `${t('step')} ${step}/${party.number_of_box}`;
};


// Utilitaire pour convertir une Base64 en Blob
export const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};