import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "styled-components";
import { vintageTheme, futuristTheme, plexiglasOrangeTheme } from "./theme/theme";
import GlobalStyles, { ContainerStyle } from "./styles/GlobalStyles";
import Authentication from "./pages/Authentication";
import PrivateRoute from "./components/PrivateRouteComponent";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import VisualSettingsComponent from "./components/base/VisualSettingsComponent";
import NavbarComponent from "./components/base/NavbarComponent";
import EnigmatoHome from "./pages/enigmato/EnigmatoHome";
import EnigmatoParties from "./pages/enigmato/EnigmatoParties";
import EnigmatoProfil from "./pages/enigmato/EnigmatoProfil";
import EnigmatoGameInfo from "./pages/enigmato/EnigmatoGameInfo";
import EnigmatoGame from "./pages/enigmato/EnigmatoGame";
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('access_token'));
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("currentTheme");
    return savedTheme ? JSON.parse(savedTheme) : "light";
  });

  // Utilisation de l'intervalle pour vérifier le cookie toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAuthenticated(!!Cookies.get('access_token'));
    }, 1000); // Vérifie toutes les secondes

    return () => clearInterval(interval);
  }, []);

  // Sauvegarder le thème actuel dans le localStorage
  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const themeMap: { [key: string]: any } = {
    light: vintageTheme,
    dark: plexiglasOrangeTheme,
    synthwave: futuristTheme,
  };

  const [currentLanguage, setCurrentLanguage] = useState('fr');

  // Fonction de déconnexion
  const handleLogout = () => {
    Cookies.remove('access_token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <GlobalStyles />
      <Router>
        {isAuthenticated && <NavbarComponent onLogout={handleLogout} />}
        <ContainerStyle>
          <Routes>
            <Route path="/login" element={<Authentication onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enigmato/home" element={<PrivateRoute><EnigmatoHome /></PrivateRoute>} />
            <Route path="/enigmato/parties" element={<PrivateRoute><EnigmatoParties /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/profil" element={<PrivateRoute><EnigmatoProfil /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/game/info" element={<PrivateRoute><EnigmatoGameInfo /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/game" element={<PrivateRoute><EnigmatoGame /></PrivateRoute>} />
            <Route path="/*" element={<div>404</div>} />
          </Routes>
          <VisualSettingsComponent
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            currentLanguage={currentLanguage}
            setLanguage={setCurrentLanguage}
          />
        </ContainerStyle>
      </Router>
    </ThemeProvider>
  );
};

export default App;