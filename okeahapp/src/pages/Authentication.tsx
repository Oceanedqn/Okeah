import React, { useState } from 'react';
import LoginComponent from '../components/authentication/LoginComponent';
import RegisterComponent from '../components/authentication/RegisterComponent';
import { ContainerStyle } from '../styles/AuthenticationStyles';

const Authentication: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register


  const handleToggle = () => {
    setIsLogin(prev => !prev); // Toggle between login and register
  };

  // Fonction pour gérer l'inscription réussie
  const handleRegisterSuccess = () => {
    setIsLogin(true); // Basculer vers l'interface de connexion après inscription
  };

  return (
    <ContainerStyle>
      <LoginComponent onLogin={onLogin} handleToggle={handleToggle} isLogin={isLogin} />
      <RegisterComponent onRegister={handleRegisterSuccess} handleToggle={handleToggle} isLogin={isLogin} />
    </ContainerStyle>
  );
};

export default Authentication;