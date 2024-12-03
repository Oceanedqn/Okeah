import styled from 'styled-components';

// Définition des breakpoints pour une meilleure gestion de la responsivité
const breakpoints = {
    sm: '576px',  // Taille pour les petits appareils (mobiles)
    md: '768px',  // Taille pour les tablettes
    lg: '992px',  // Taille pour les écrans moyens
    xl: '1200px', // Taille pour les grands écrans
};

export const EnigmatoContainerStyle = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    max-width: 90%; /* Utilisation d'une largeur maximum de 90% */
    width: 100%;
    margin: 0 auto;

    @media (min-width: ${breakpoints.sm}) {
      max-width: 50%; /* Sur les écrans plus larges, réduire la largeur à 50% */
    }

    @media (min-width: ${breakpoints.lg}) {
      max-width: 30vw; /* Sur les grands écrans, garder la largeur à 30vw */
    }
`;

export const EnigmatoSectionStyle = styled.div`
  width: 100%;
`;

export const EnigmatoItemStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.background_light};
    border-radius: 10px;
    margin-bottom: 10px;
    
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column; /* Sur les petits écrans, empiler les éléments verticalement */
      align-items: flex-start; /* Alignement à gauche sur mobile */
    }

    @media (min-width: ${breakpoints.md}) {
      flex-direction: row; /* Sur les tablettes et plus, maintenir la disposition horizontale */
    }
`;

export const ContainerBackgroundStyle = styled.div`
    background-color: ${({ theme }) => theme.colors.background_light};
    padding: 20px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const OngoingGamesContainer = styled.div`
    margin-top: 20px;
    text-align: left;

    @media (max-width: ${breakpoints.sm}) {
      text-align: center; /* Centrer le texte sur les petits écrans */
    }
`;

export const OngoingTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;

    @media (min-width: ${breakpoints.sm}) {
        font-size: 22px; /* Augmenter la taille du titre sur les petits écrans et plus larges */
    }
`;

export const OngoingGameItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column; /* Sur les petits écrans, empiler les éléments verticalement */
      align-items: flex-start; /* Alignement à gauche sur mobile */
    }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
`;

export const Container2 = styled.div`
    padding: 80px 20px 20px;
    text-align: center;
    position: relative;
`;

export const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
`;

export const Title2 = styled.h1`
    font-size: 2rem;
    color: #333;
`;

export const PreviewContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 15px;
`;

export const EditButton = styled.button`
    background: none;
    color: blue;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
`;

export const ParticipantsContainer = styled.div`
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
`;

export const ParticipantsTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

export const ParticipantItem = styled.li`
    list-style: none;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
`;

export const DateContainer = styled.div`
    margin: 20px 0;
    font-size: 16px;
`;

export const PreviousDaysContainer = styled.div`
    margin-top: 20px;
    text-align: left;
`;

export const PreviousDayItem = styled.div`
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const AutoCompleteContainer = styled.div`
    position: relative;
    margin: 10px 0;

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
`;


// [OK] Style du conteneur pour les boutons radio
export const RadioContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 50px; // Espacement entre les options
`;

// [OK] Style du label pour les boutons radio
export const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
`;

// [OK] 
export const RadioInput = styled.input`
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.background_light};
    border: 2px solid transparent;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s, border 0.3s;

    &:checked {
        background-color: ${({ theme }) => theme.colors.background_light};
    }

    &:checked::after {
        content: "";
        position: absolute;
        top: 2px; /* Ajuster pour centrer le rond blanc à l'intérieur */
        left: 2px; /* Ajuster pour centrer le rond blanc à l'intérieur */
        width: 12px;
        height: 12px;
        background-color: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
    }

    &:hover {
        border: 2px solid ${({ theme }) => theme.colors.primary};
    }
`;

export const ButtonHintStyle = styled.button`
    border-radius: 50%; /* Bouton circulaire */
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.secondary}; /* Utilisation de la couleur principale du thème */
    color: white;
    font-size: 20px; /* Taille de la police pour le "?" */
    border: none; /* Aucun bord */
    cursor: pointer; /* Curseur pointeur */
    
    /* Effet au survol */
    &:hover {
        background-color: ${({ theme }) => theme.colors.secondary_dark}; /* Couleur au survol depuis le thème */
    }

    /* Effet actif */
    &:active {
        transform: scale(0.95); /* Réduction légère du bouton lorsqu'il est cliqué */
    }
`;


export const StyledButton = styled.button<{ selected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px; /* Espace entre l'image et le texte */
    margin: 5px 0;
    padding: 10px 15px;
    border: 2px solid ${({ selected, theme }) => (selected ? theme.colors.primary : 'transparent')};
    border-radius: 20px; /* Arrondi du bouton */
    background-color: ${({ selected, theme }) =>
        selected ? 'darkblue' : theme.colors.primary};
    color: ${({ selected }) => (selected ? 'white' : 'black')};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ selected, theme }) =>
        selected ? 'darkblue' : theme.colors.secondary};
    }

    img {
        width: 40px; /* Taille de l'image */
        height: 40px;
        border-radius: 50%; /* Image circulaire */
        object-fit: cover; /* Adapter l'image au conteneur */
    }
`;

// Conteneur principal pour organiser les éléments en grille
export const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* Permet aux éléments de passer à la ligne suivante */
    justify-content: center; /* Centre le contenu horizontalement */
    align-items: center; /* Centre le contenu verticalement */
    gap: 30px; /* Espace de 5px entre les éléments */
    margin-top: 20px;
`;

// Style pour chaque carré
export const StyledCard = styled.div<{ selected?: boolean }>`
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 10px;
    background-color: ${({ selected, theme }) => (selected ? theme.colors.primary_dark : 'white')};
    box-shadow: ${({ selected }) => (selected ? '0 4px 8px rgba(0, 0, 255, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)')};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    img {
        width: 100px;
        height: 100px;
        object-fit: cover; /* Adapter l'image */
        border-radius: 10px;
    }

    span {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: ${({ selected, theme }) => (selected ? theme.colors.background_light : 'black')};
    }
`;


export const TextStyleProfil = styled.p`
  font-size: 14px;
  line-height: 16px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary_dark};
  color: ${({ theme }) => theme.colors.secondary_light};
  padding: 10px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 8px; // Espacement entre le texte et l'icône
`;
