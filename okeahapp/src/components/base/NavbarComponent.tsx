// components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 1rem;
`;

const NavLink = styled(Link)`
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    margin-left: 20px;

    &:hover {
        text-decoration: underline;
    }
`;

const Navbar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; Max-Age=0; path=/`;
    };

    const handleLogout = () => {
        deleteCookie('token');
        onLogout();
    };

    return (
        <NavbarContainer>
            <div className="navbar-brand">MonSite</div>
            <div>
                <NavLink to="/home">Accueil</NavLink>
                <NavLink to="/about">À propos</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <button onClick={handleLogout}>Déconnexion</button>
            </div>
        </NavbarContainer>
    );
};

export default Navbar;