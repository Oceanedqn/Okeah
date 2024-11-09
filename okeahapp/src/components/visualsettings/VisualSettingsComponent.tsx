// src/components/ThemeAndLanguageSwitcher.tsx
import React from 'react';
import ThemeSwitcherComponent from './ThemeSwitcherComponent';
import LanguageSwitcherComponent from '../visualsettings/LanguageSwitcherComponent';
import { VisualSettingsContainerStyle } from '../../styles/GlobalStyles';
import { VisualSettingsProps } from '../../types';



const VisualSettingsComponent: React.FC<VisualSettingsProps> = ({
  currentTheme,
  setTheme,
  currentLanguage,
  setLanguage,
}) => {
  return (
    <VisualSettingsContainerStyle>
      <LanguageSwitcherComponent currentLanguage={currentLanguage} setLanguage={setLanguage} />
      <ThemeSwitcherComponent currentTheme={currentTheme} setTheme={setTheme} />
    </VisualSettingsContainerStyle>
  );
};

export default VisualSettingsComponent;