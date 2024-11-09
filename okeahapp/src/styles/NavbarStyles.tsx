import { Link } from "react-router-dom";
import { styled } from "styled-components";

export const NavbarContainerStyle = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background_alternatif};
    padding: 1rem;

    /* Pour que "OKEAH" soit à gauche et le hamburger à droite sur grands écrans */
    @media (max-width: 768px) {
        flex-direction: row; /* Disposition horizontale sur les grands écrans */
    }

    /* Pour mobile/tablette */
    @media (max-width: 768px) {
        flex-direction: column; /* Empile les éléments sur mobile/tablette */
        align-items: stretch; /* Les éléments prennent toute la largeur */
    }
`;

export const NavLinkStyle = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    margin-left: 20px;

    &:hover {
        text-decoration: underline;
    }

    /* Sur mobile/tablette, chaque lien prend toute la largeur */
    @media (max-width: 768px) {
        display: block; /* Affiche les liens en bloc pour les empiler */
        width: 100%; /* Fait en sorte que chaque lien prenne toute la largeur */
        padding: 10px 0; /* Espacement entre les liens */
        text-align: center; /* Centre le texte dans chaque lien */
    }
`;

// Bouton Menu Mobile (icône ☰)
export const MobileMenuButtonStyle = styled.button`
    background: none;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    font-size: 24px;
    cursor: pointer;
    display: none; /* Cache par défaut */

    /* Affiche uniquement sur mobile et tablette */
    @media (max-width: 768px) {
        display: block; /* Afficher l'icône ☰ */
        font-size: 30px; /* Taille plus grande pour l'icône */
    }
`;

// Conteneur du sous-menu
export const SubMenuContainerStyle = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #444;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
`;

// Style des liens dans le sous-menu
export const SubMenuLinkStyle = styled(Link)`
    color: #fff;
    padding: 5px 10px;
    text-decoration: none;

    &:hover {
        color: #ddd;
        background-color: #555;
    }
`;