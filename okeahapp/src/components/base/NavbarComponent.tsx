import React, { useState } from 'react';
import { Hamburger, Logo, Menu, MenuItem, NavbarContainerStyle } from '../../styles/NavbarStyles';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { logout_async } from '../../services/authentication/loginService';

const NavbarComponent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await logout_async();
            onLogout();
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