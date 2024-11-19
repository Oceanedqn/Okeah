import React from 'react';
import { FaUser } from 'react-icons/fa';
import { ButtonStyle, TextStyle } from '../../styles/GlobalStyles';
import { IEnigmatoParty, IEnigmatoPartyParticipants } from '../../interfaces/IEnigmato';
import { calculateGameStage } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import { EnigmatoItemStyle } from '../../styles/EnigmatoStyles';

interface EnigmatoItemComponentProps {
    game: IEnigmatoPartyParticipants;
    handleViewGame: (id: number, isFinished: boolean) => void;
}

const EnigmatoItemComponent: React.FC<EnigmatoItemComponentProps> = ({ game, handleViewGame }) => {
    const { t } = useTranslation();

    // Texte du bouton et action en fonction de l'état 'is_finished'
    const buttonText = game.is_finished ? t('viewScores') : t('view');
    const handleClick = () => handleViewGame(game.id_party, game.is_finished);

    return (
        <EnigmatoItemStyle key={game.id_party}>
            <TextStyle>{game.name}</TextStyle>
            <TextStyle>{calculateGameStage(game, t)}</TextStyle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaUser size={16} color="#555" />
                <TextStyle>{game.participants_number}</TextStyle>
            </div>
            <ButtonStyle onClick={handleClick}>
                {buttonText}
            </ButtonStyle>
        </EnigmatoItemStyle>
    );
};

export default EnigmatoItemComponent;