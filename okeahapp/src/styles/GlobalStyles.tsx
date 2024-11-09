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


// Composant Select
export const SelectStyle = styled.select`
  padding: 5px 10px 5px 10px;
  font-size: 16px;
  border: none;
  text-align: center;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.secondary_dark};
  }
`;


// Composant Button
export const ButtonStyle = styled.button`
  padding: 5px 10px 5px 10px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary_dark};
  }
`;


// ---------------- Container pour la page ----------------
export const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px); /* 100vh moins la hauteur de la navbar */
  padding: 20px;
`;


// ---------------- Conteneur pour le titre et le bouton retour ----------------
export const ContainerTitleStyle = styled.div`
  display: flex;
  flex-direction: column; /* Aligne horizontalement les éléments */
  align-items: center; /* Centre verticalement les éléments */
  width: 100%; /* Prend toute la largeur */
  padding: 10px;
  position: relative;
  height: auto;
`;

// Style du titre
export const Title1Style = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.title_text};
  margin: 0; /* Supprimer les marges par défaut */
  text-align: center; /* Centre le texte horizontalement */
`;

export const Title2Style = styled.h2`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.title_text};
  margin: 0; /* Supprimer les marges par défaut */
  text-align: center; /* Centre le texte horizontalement */
`;

export const TextCenterStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center; /* Centre le texte horizontalement */
`;

export const TextStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.text};
`;

// Style pour le bouton "Retour"
export const ButtonBackStyle = styled.button`
  padding: 5px 10px 5px 10px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  align-self: flex-start; /* Place le bouton à gauche */
  
  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.secondary_dark};
  }
`;


// ---------------- Conteneur pour la page en general ----------------
export const ContainerUnderTitleStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px); /* 100vh moins la hauteur de la navbar */
  padding: 20px;
  overflow-y: auto; /* Pour rendre le contenu défilable si nécessaire */
`;


export const SpaceStyle = styled.div`
  height:30px;
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