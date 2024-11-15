import React, { useState } from 'react';
import { Hamburger, Logo, Menu, MenuItem, NavbarContainerStyle } from '../../styles/NavbarStyles'; // MobileMenuButtonStyle, , NavbarContainerStyle, NavLinkStyle, SubMenuContainerStyle, SubMenuLinkStyle 
import { ButtonStyle } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { logout_async } from '../../services/authentication/loginService'; // Import the logout function
import { useNavigate } from 'react-router-dom';

const NavbarComponent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout_async();
            onLogout();
            // navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <NavbarContainerStyle>
            <Logo href="/home">Okeah</Logo>
            <Hamburger onClick={() => setIsOpen(!isOpen)}>
                <span />
                <span />
                <span />
            </Hamburger>
            <Menu isOpen={isOpen}>
                <MenuItem to="/home">{t('home')}</MenuItem>
                <MenuItem to="/about">{t('about')}</MenuItem>
                <MenuItem to="/enigmato/home">Enigmato</MenuItem>
                <MenuItem to="/contact">{t('contact')}</MenuItem>
                <MenuItem to="/login">
                    <ButtonStyle onClick={handleLogout}>Déconnexion</ButtonStyle>
                </MenuItem>
            </Menu>
        </NavbarContainerStyle>
    );
};


export default NavbarComponent;