import React, { useState } from 'react';
import LoginComponent from '../components/authentication/LoginComponent';
import RegisterComponent from '../components/authentication/RegisterComponent';
import { ContainerStyle } from '../styles/AuthenticationStyles';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Authentication: React.FC = () => {
  const [isStateLogin, setIsStateLogin] = useState(true);
  const { t } = useTranslation();


  const handleToggle = () => {
    setIsStateLogin(prev => !prev);
  };

  // Fonction pour gérer l'inscription réussie
  const handleRegisterSuccess = () => {
    toast.success(t('toast.registerSuccess')); // Affiche un message après l'inscription
    setIsStateLogin(true); // Basculer vers l'interface de connexion après inscription
  };

  return (
    <ContainerStyle>
      <LoginComponent handleToggle={handleToggle} isLogin={isStateLogin} />
      <RegisterComponent onRegister={handleRegisterSuccess} handleToggle={handleToggle} isLogin={isStateLogin} />
    </ContainerStyle>
  );
};

export default Authentication;