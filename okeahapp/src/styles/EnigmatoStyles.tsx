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
    gap: 10px;
    margin: 15px 0;

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #ccc;
    }
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
        border-radius: 12px;
    }

    ul {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 12px;
        z-index: 1;
        max-height: 150px;
        overflow-y: auto;
    }

    li {
        padding: 8px;
        cursor: pointer;

        &:hover {
            background: ${({ theme }) => theme.colors.background_alternatif};
        }
    }
`;