// src/components/ThemeToggle.tsx
import React from "react";
import { Button } from "../styles/GlobalStyles";
import { ThemeToggleProps } from "../types";
import styled from "styled-components";




const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, setTheme }) => {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Thème Actuel : {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</h1>
        <Select value={currentTheme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
          <option value="synthwave">Synthwave</option>
        </Select>
      </div>
    );
  };
  
  export default ThemeToggle;



// Styled select component
const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  margin-top: 20px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;