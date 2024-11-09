// components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarContainerStyle, NavLinkStyle, SubMenuContainerStyle, SubMenuLinkStyle } from '../../styles/NavbarStyles';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const { t } = useTranslation();

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; Max-Age=0; path=/`;
    };

    const handleLogout = () => {
        deleteCookie('token');
        onLogout();
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
                            <SubMenuLinkStyle to="/enigmato">Enigmato</SubMenuLinkStyle>
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

export default Navbar;

// ☰