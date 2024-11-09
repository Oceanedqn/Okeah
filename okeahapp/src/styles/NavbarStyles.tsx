import { Link } from "react-router-dom";
import { styled } from "styled-components";

export const NavbarContainerStyle = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background_alternatif};
    padding: 1rem;
`;

export const NavLinkStyle = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    margin-left: 20px;

    &:hover {
        text-decoration: underline;
    }
`;

export const MobileMenuButtonStyle = styled.button`
    background: none;
    color: #fff;
    border: none;
    font-size: 24px;
    cursor: pointer;
    
    /* Affiche uniquement le bouton sur mobile */
    @media (min-width: 769px) {
        display: none;
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