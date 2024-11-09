// src/components/ThemeToggle.tsx
import React from "react";
import { SelectStyle } from "../../styles/GlobalStyles";
import { ThemeSwitcherProps } from "../../types";


const ThemeSwitcherComponent: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <SelectStyle value={currentTheme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Vintage</option>
      <option value="dark">Plexiglass</option>
      <option value="synthwave">Futuriste</option>
    </SelectStyle>
  );
};

export default ThemeSwitcherComponent;



