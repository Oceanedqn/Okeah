import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { ButtonStyle, TextDarkStyle } from '../../styles/GlobalStyles';
import { IEnigmatoPartyParticipants } from '../../interfaces/IEnigmato';
import { calculateGameStage } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import { EnigmatoItemGridStyle } from '../../styles/EnigmatoStyles';
import { FaCirclePlay } from "react-icons/fa6";
import { FaMedal } from "react-icons/fa";

interface EnigmatoItemComponentProps {
    game: IEnigmatoPartyParticipants;
    handleViewGame: (id: number, isFinished: boolean) => void;
}

// Fonction pour vérifier si la partie est terminée (en fonction de date_end)
export const checkIfFinishedParty = async (date_end: string): Promise<boolean> => {
    const today = new Date(); // Date actuelle
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Normalisation à minuit
    const dateEnd = new Date(date_end);
    const normalizedDateEnd = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()); // Normalisation à minuit
    return now > normalizedDateEnd;  // Comparaison sur les dates sans heures
};

const EnigmatoItemComponent: React.FC<EnigmatoItemComponentProps> = ({ game, handleViewGame }) => {
    const { t } = useTranslation();

    const [isFinished, setIsFinished] = useState<boolean>(false);  // Ajouter un état pour le statut de la partie

    useEffect(() => {
        const checkFinished = async () => {
            const finished = await checkIfFinishedParty(game.date_end);  // Vérification async de la partie terminée
            setIsFinished(finished);  // Mettre à jour l'état
        };

        checkFinished();  // Appel de la fonction lors du montage du composant
    }, [game.date_end]);  // Dépend de `game.date_end` pour mettre à jour quand la date change

    // Texte du bouton et action en fonction de l'état "isFinished"
    const buttonText = isFinished ? t('viewScores') : t('view');
    const handleClick = () => handleViewGame(game.id_party, isFinished);  // Passer `isFinished` au lieu de `game.is_finished`

    return (
        <EnigmatoItemGridStyle>
            <TextDarkStyle>{game.name}</TextDarkStyle>
            <TextDarkStyle>{calculateGameStage(game, t)}</TextDarkStyle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaUser size={16} color="#555" />
                <TextDarkStyle>{game.participants_number}</TextDarkStyle>
            </div>

            <ButtonStyle className='flex items-center justify-center' onClick={handleClick} disabled={isFinished}>
                {buttonText}
                {!isFinished ? (<FaCirclePlay className='ml-2' />) : (<FaMedal className='ml-2' />
                )}

            </ButtonStyle>
        </EnigmatoItemGridStyle>
    );
};

export default EnigmatoItemComponent;