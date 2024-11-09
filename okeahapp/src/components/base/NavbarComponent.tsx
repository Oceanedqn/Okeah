// components/Navbar.tsx
import React, { useState } from 'react';
import { NavbarContainerStyle, NavLinkStyle, SubMenuContainerStyle, SubMenuLinkStyle } from '../../styles/NavbarStyles';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { logout_async } from '../../services/authentication/loginService'; // Import the logout function
import { useNavigate } from 'react-router-dom';


const NavbarComponent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout_async(); // Call the logout function from the service
            console.log('Logout successful, checking cookies...');
            console.log(document.cookie); // Check the current cookies after logout
            
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

    return (
        <NavbarContainerStyle>
            <div className="navbar-brand">OKEAH</div>
            <div>
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

// ☰