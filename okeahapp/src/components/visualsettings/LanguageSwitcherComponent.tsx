// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectStyle } from '../../styles/GlobalStyles';
import { LanguageSwitcherProps } from '../../types';

const LanguageSwitcherComponent: React.FC<LanguageSwitcherProps> = ({ currentLanguage, setLanguage }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
  };

  return (
    
      <SelectStyle value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="fr">{t('french')}</option>
        <option value="en">{t('english')}</option>
      </SelectStyle>
  );
};

export default LanguageSwitcherComponent;