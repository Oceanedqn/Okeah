import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { createGlobalStyle, keyframes } from "styled-components";
import styled from "styled-components";

// Définition des breakpoints pour une meilleure gestion de la responsivité
const breakpoints = {
  sm: '576px',  // Taille pour les petits appareils (mobiles)
  md: '768px',  // Taille pour les tablettes
  lg: '992px',  // Taille pour les écrans moyens
  xl: '1200px', // Taille pour les grands écrans
};

// Global Styles
const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }


  /* Généralement, ces styles affectent la barre de défilement de toute l'application */

  /* Style pour la barre de défilement (background) */
  ::-webkit-scrollbar {
    width: 8px; /* Largeur de la barre de défilement */
    height: 8px; /* Hauteur de la barre de défilement horizontale */
  }

  /* Style pour la partie "thumb" de la barre de défilement (la partie que l'on glisse) */
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary}; /* Couleur du "thumb" */
    border-radius: 10px; /* Coins arrondis */
  }

  /* Style pour la partie "track" de la barre de défilement (la partie sous le "thumb") */
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background_light}; /* Couleur de la piste */
    border-radius: 10px; /* Coins arrondis */
  }

  /* Style pour la barre de défilement horizontale */
  ::-webkit-scrollbar-horizontal {
    height: 8px; /* Hauteur de la barre horizontale */
  }

  /* Optionnel : Ajout d'un effet de hover sur le "thumb" de la barre de défilement */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.secondary}; /* Couleur du "thumb" quand on survole */
  }

`;

export default GlobalStyles;


const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled Components pour le spinner
export const LoadingSpinnerStyle = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.background_light};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

export const LoadingTextStyle = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

// Conteneur centré pour le loader
export const CenteredContainerLoadingStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Prend toute la hauteur de la fenêtre */
  flex-direction: column; /* Empile le spinner et le texte verticalement */
`;


// ---------------- Container pour la page ----------------
export const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 68px); /* 100vh moins la hauteur de la navbar */
  padding: 20px;

  @media (max-width: ${breakpoints.sm}) {
    padding: 10px; /* Réduire le padding sur les petits écrans */
  }
`;

// ---------------- Conteneur pour le titre et le bouton retour ----------------
export const ContainerTitleStyle = styled.div`
  display: flex;
  flex-direction: column; /* Aligne horizontalement les éléments */
  align-items: center; /* Centre verticalement les éléments */
  justify-content: center; /* Centre les éléments horizontalement */
  width: 100%; /* Prend toute la largeur */
  padding: 10px;
  position: relative;
  height: auto;

  @media (max-width: ${breakpoints.sm}) {
    padding: 5px; /* Réduire le padding sur mobile */
  }
`;


export const FaInfoCircleStyle = styled(FaInfoCircle)`
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary_dark};
  }
`


// Composant Select
export const SelectStyle = styled.select`
  padding: 5px 10px;
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

  @media (max-width: ${breakpoints.sm}) {
    font-size: 14px; /* Réduire la taille du texte sur mobile */
  }
`;

// Composant Button
export const ButtonStyle = styled.button`
  padding: 5px 10px;
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

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background_alternatif}; // Couleur de fond pour état désactivé
    color: ${({ theme }) => theme.colors.title_text};          // Couleur de texte pour état désactivé
    opacity: 0.6;
    cursor: default;                                              
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 14px; /* Réduire la taille du texte sur mobile */
    padding: 4px 8px; /* Réduire le padding sur mobile */
  }
`;

export const ButtonSecondaryStyle = styled.button`
  padding: 5px 10px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.secondary_dark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background_alternatif}; // Couleur de fond pour état désactivé
    color: ${({ theme }) => theme.colors.title_text};          // Couleur de texte pour état désactivé
    opacity: 0.6;
    cursor: default;                                              
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 14px; /* Réduire la taille du texte sur mobile */
    padding: 4px 8px; /* Réduire le padding sur mobile */
  }
`;

export const ButtonJoinStyle = styled.button`
  padding: 5px 10px;
  font-size: 24px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.primary_dark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background_alternatif}; // Couleur de fond pour état désactivé
    color: ${({ theme }) => theme.colors.title_text};          // Couleur de texte pour état désactivé
    opacity: 0.6;
    cursor: default;                                              
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 14px; /* Réduire la taille du texte sur mobile */
    padding: 4px 8px; /* Réduire le padding sur mobile */
  }
`;

// Style du titre
export const Title1Style = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.title_text};
  margin: 0; /* Supprimer les marges par défaut */
  text-align: center; /* Centre le texte horizontalement */

  @media (max-width: ${breakpoints.sm}) {
    font-size: 24px; /* Réduire la taille du titre sur mobile */
  }
`;

export const Title2Style = styled.h2`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.title_text};
  margin: 0; /* Supprimer les marges par défaut */
  text-align: center; /* Centre le texte horizontalement */

  @media (max-width: ${breakpoints.sm}) {
    font-size: 22px; /* Réduire la taille du titre sur mobile */
  }
`;

export const TextCenterStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center; /* Centre le texte horizontalement */

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px; /* Réduire la taille du texte sur mobile */
  }
`;

export const TextStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px; /* Réduire la taille du texte sur mobile */
  }
`;

export const TextDarkStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.dark_text};

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px; /* Réduire la taille du texte sur mobile */
  }
`;

export const TextAlertStyle = styled.p`
  font-size: 19px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.secondary_dark};

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px; /* Réduire la taille du texte sur mobile */
  }
`;

// Style pour le bouton "Retour"
export const ButtonBackStyle = styled.button`
  padding: 5px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background_light};
  align-self: flex-start; /* Place le bouton à gauche */

  &:hover {
    border: none;
    background-color: ${({ theme }) => theme.colors.secondary_dark};
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 14px; /* Réduire la taille du texte sur mobile */
    padding: 5px;
  }
`;

// ---------------- Conteneur pour la page en général ----------------
export const ContainerUnderTitleStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px); /* 100vh moins la hauteur de la navbar */
  padding: 20px;
  overflow-y: auto; /* Pour rendre le contenu défilable si nécessaire */

  @media (max-width: ${breakpoints.sm}) {
    padding: 10px; /* Réduire le padding sur les petits écrans */
  }
`;

export const SpaceStyle = styled.div`
  height: 30px;

  @media (max-width: ${breakpoints.sm}) {
    height: 20px; /* Réduire l'espace sur mobile */
  }
`;

export const SpanAuthentStyle = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary_dark};
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

  @media (max-width: ${breakpoints.sm}) {
    bottom: 10px; /* Réduire la marge inférieure sur mobile */
    right: 10px; /* Réduire la marge droite sur mobile */
    padding: 8px; /* Réduire le padding sur mobile */
  }
`;


// Styled ToastContainer
export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background-color: ${({ theme }) => theme.colors.background_light}; /* Couleur principale de votre thème */
    color: ${({ theme }) => theme.colors.dark_text}; /* Couleur du texte */
    font-size: 14px;
    font-weight: bold;
    font-family: 'Arial', sans-serif;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Masquer la barre de progression */
  .Toastify__progress-bar, .Toastify__progress-bar--error {
    display: none;
  }

    /* Masquer l'icône par défaut */
  .Toastify__toast-icon {
    display: none;
  }

/* Toast de succès */
  .Toastify__toast--success {
    background-color: ${({ theme }) => theme.colors.background_light}; /* Couleur du texte pour succès */
    color: ${({ theme }) => theme.colors.primary};
  }

  /* Toast d'erreur */
  .Toastify__toast--error {
    background-color: ${({ theme }) => theme.colors.background_light}; /* Couleur du texte pour erreur */
    color: ${({ theme }) => theme.colors.secondary};
    }

`;