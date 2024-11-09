import React, { useState } from 'react';
import { MobileMenuButtonStyle, NavbarContainerStyle, NavLinkStyle, SubMenuContainerStyle, SubMenuLinkStyle } from '../../styles/NavbarStyles';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { logout_async } from '../../services/authentication/loginService'; // Import the logout function
import { useNavigate } from 'react-router-dom';

const NavbarComponent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Etat pour gérer l'ouverture du menu mobile

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout_async(); // Call the logout function from the service

            // Call the onLogout callback to handle any additional state changes
            onLogout();

            // Navigate to the login page after logging out
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const toggleSubMenu = () => {
        setIsSubMenuOpen(prev => !prev);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev); // Toggle menu on mobile
    };

    return (
        <NavbarContainerStyle>
            <div className="navbar-brand" style={{ flexGrow: 1 }}>
                OKEAH
            </div>

            {/* Affichage de l'icône ☰ uniquement sur mobile/tablette */}
            <MobileMenuButtonStyle onClick={toggleMobileMenu}>
                ☰
            </MobileMenuButtonStyle>

            {/* Menu de navigation principal */}
            <div style={{
                display: isMobileMenuOpen ? 'block' : 'none',  // Affiche les liens uniquement si le menu est ouvert
                flexDirection: 'column', // Les éléments sont disposés les uns en dessous des autres
                alignItems: 'stretch',  // Fait en sorte que les liens prennent toute la largeur
                width: '100%'  // Assure que le menu occupe toute la largeur
            }}>
                <NavLinkStyle to="/home">{t('home')}</NavLinkStyle>
                <NavLinkStyle to="/about">{t('about')}</NavLinkStyle>
                <NavLinkStyle to="/contact">{t('contact')}</NavLinkStyle>

                <div onMouseEnter={toggleSubMenu} onMouseLeave={toggleSubMenu} style={{ position: 'relative', display: 'inline-block' }}>
                    <NavLinkStyle to="#">{t('hub')}</NavLinkStyle>
                    {isSubMenuOpen && (
                        <SubMenuContainerStyle>
                            <SubMenuLinkStyle to="/enigmato/home">Enigmato</SubMenuLinkStyle>
                        </SubMenuContainerStyle>
                    )}
                </div>

                <ButtonStyle style={{ paddingTop: '5px', paddingBottom: '5px', marginLeft: '20px' }} onClick={handleLogout}>
                    Déconnexion
                </ButtonStyle>
            </div>
        </NavbarContainerStyle>
    );
};

export default NavbarComponent;