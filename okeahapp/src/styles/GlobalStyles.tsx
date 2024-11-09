// src/styles/GlobalStyles.tsx
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export default GlobalStyles;


// ################# TITRES #################
export const TitleH1Style = styled.h1`
    text-align: center;
    padding: 5px;
    font-size: 32px;
`;

export const TitleH2Style = styled.h2`
    text-align: center;
    padding: 5px;
    font-size: 28px;
`;

export const TitleH3Style = styled.h3`
    text-align: center;
    padding: 5px;
    font-size: 16px;
`;

// ################# COMPOSANTS DE BASE #################
// Composant Select
export const SelectStyle = styled.select`
  padding: 5px;
  font-size: 16px;
  border: none;
  text-align: center;
  border-radius: 16px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  margin-top: 20px;
  padding-left: 10px;
  padding-right: 10px;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary_dark};
  }
`;

// Composant Button
export const ButtonStyle = styled.button`
  padding: 5px;
  font-size: 16px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding-left: 10px;
  padding-right: 10px;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary_dark};
  }
`;



// ################# PARTIE VISUAL SETTINGS (THEME ET LANGUES) #################
export const VisualSettingsContainerStyle = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex; /* Utilisation de flexbox pour aligner les enfants côte à côte */
  align-items: center; /* Alignement vertical centré */
  gap: 10px; /* Espace entre les composants */
  padding: 10px;
`;