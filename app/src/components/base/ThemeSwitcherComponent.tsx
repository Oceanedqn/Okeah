// src/components/ThemeToggle.tsx
import React from "react";
import { SelectStyle } from "../../styles/GlobalStyles";
import { ThemeSwitcherProps } from "../../types";
import { vintageTheme, plexiglasOrangeTheme, futuristTheme, christmasTheme, animalCrossingTheme, candyTheme, sixtiesTheme } from "../../theme/theme";


const ThemeSwitcherComponent: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <SelectStyle value={currentTheme} onChange={(e) => setTheme(e.target.value)}>
      <option value="vintage">Vintage</option>
      <option value="plexiglas">Plexiglass</option>
      <option value="synthwave">Futuriste</option>
      <option value="noel">Noel</option>
      <option value="ac">AC</option>
      <option value="candy">Bonbon</option>
      <option value="sixties">Année 60</option>
    </SelectStyle>
  );
};

export const themeMap: { [key: string]: any } = {
  vintage: vintageTheme,
  plexiglas: plexiglasOrangeTheme,
  synthwave: futuristTheme,
  noel: christmasTheme,
  ac: animalCrossingTheme,
  candy: candyTheme,
  sixties: sixtiesTheme
};

export default ThemeSwitcherComponent;



