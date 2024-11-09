import Cookies from "js-cookie";
import { EnigmatoParty } from "../interfaces/IEnigmato";

export const checkCookie = (): string => {
    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }
    return accessToken;
};


export const calculateGameStage = (party: EnigmatoParty, t: Function) => {
    const today = new Date();
    const dateStart = new Date(party.date_start);
    const formattedDateStart = dateStart.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    if (today < dateStart) {
        return t('startOn') + ` ${formattedDateStart}`;
    }

    const diffDays = Math.floor((today.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24));
    const step = Math.min(Math.floor(diffDays / (party.include_weekends ? 1 : 7)) + 1, party.number_of_box);

    return `${t('step')} ${step}/${party.number_of_box}`;
};