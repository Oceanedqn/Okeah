import React, { useState } from 'react';
import { ButtonBackStyle, ContainerTitleStyle, FaInfoCircleStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { HeaderWithBackButtonProps } from '../../types';
import { EnigmatoContainerStyle } from '../../styles/EnigmatoStyles';

const HeaderTitleComponent: React.FC<HeaderWithBackButtonProps> = ({ title, onBackClick, info }) => {
    const { t } = useTranslation();
    const [showInfo, setShowInfo] = useState(false);

    const handleInfoClick = () => {
        setShowInfo(prev => !prev);
    };

    return (
        <ContainerTitleStyle>
            <ButtonBackStyle onClick={onBackClick}>{t('back')}</ButtonBackStyle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Title1Style>{t(title)}</Title1Style>
                {info && (<FaInfoCircleStyle onClick={handleInfoClick} />)}
            </div>
            {info && showInfo && (
                <EnigmatoContainerStyle>{info}</EnigmatoContainerStyle>
            )}
        </ContainerTitleStyle>
    );
};

export default HeaderTitleComponent;