import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { vintageTheme } from "../theme/theme";

// Créer un objet de correspondance entre les couleurs primaires et secondaires
const colorMapping = {
    primary: 'secondary', // primary -> secondary
    primary_light: 'secondary_light', // primary_light -> secondary_light
    primary_dark: 'secondary_dark',   // primary_dark -> secondary_dark
    // Ajouter d'autres couleurs si nécessaire
  };
  
  // Définir un type pour les couleurs possibles dans le thème
  type ThemeColor = keyof typeof vintageTheme.colors;
  
  export const StyledLink = styled(Link)<{ color: ThemeColor }>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    width: 100%;
    background-color: ${({ theme, color }) => theme.colors[color]}; /* Couleur primaire */
    color: white;
    text-decoration: none;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
  
    h3 {
      font-size: 1.5rem;
      font-weight: bold;
    }
  
    &:hover {
      /* Récupérer la couleur secondaire correspondante pour l'effet hover */
      background-color: ${({ theme, color }) => {
        // Vérifier si la couleur correspondante existe dans le thème
        const correspondingColor = colorMapping[color as keyof typeof colorMapping] || color;
        // Retourner la couleur du thème
        return theme.colors[correspondingColor as keyof typeof theme.colors];
      }};
      transform: translateY(-5px); /* Effet de levée au survol */
    }
  `;




export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  gap: 20px;
`;

export const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text || '#333'};
  margin-bottom: 40px;
`;

export const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
`;

