import React from 'react';
import { ButtonBackStyle, ContainerTitleStyle, Title1Style } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { HeaderWithBackButtonProps } from '../../types';

const HeaderTitleComponent: React.FC<HeaderWithBackButtonProps> = ({ title, onBackClick }) => {
    const { t } = useTranslation();

    return (
        <ContainerTitleStyle>
            <ButtonBackStyle onClick={onBackClick}>{t('back')}</ButtonBackStyle>
            <Title1Style>{t(title)}</Title1Style>
        </ContainerTitleStyle>
    );
};

export default HeaderTitleComponent;