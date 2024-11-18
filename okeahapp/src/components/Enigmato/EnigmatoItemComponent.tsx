import React from 'react';
import { FaUser } from 'react-icons/fa';
import { ButtonStyle, TextStyle } from '../../styles/GlobalStyles';
import { IEnigmatoParty } from '../../interfaces/IEnigmato';
import { calculateGameStage } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import { EnigmatoItemStyle } from '../../styles/EnigmatoStyles';

interface EnigmatoItemComponentProps {
    game: IEnigmatoParty;
    handleViewGame: (id: number) => void;
}

const EnigmatoItemComponent: React.FC<EnigmatoItemComponentProps> = ({ game, handleViewGame }) => {
    const { t } = useTranslation();

    return (
        <EnigmatoItemStyle key={game.id_party}>
            <TextStyle>{game.name}</TextStyle>
            <TextStyle>{calculateGameStage(game, t)}</TextStyle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaUser size={16} color="#555" />
                <TextStyle>{game.participants_number}</TextStyle>
            </div>
            <ButtonStyle onClick={() => handleViewGame(game.id_party)}>
                {t('view')}
            </ButtonStyle>
        </EnigmatoItemStyle>
    );
};

export default EnigmatoItemComponent;