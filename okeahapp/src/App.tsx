import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "styled-components";
import { vintageTheme, futuristTheme, plexiglasOrangeTheme } from "./theme/theme";
import GlobalStyles from "./styles/GlobalStyles";
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
import Cookies from 'js-cookie'; // Import Cookies to manage access_token

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('access_token')); // Track authentication state

  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("currentTheme");
    return savedTheme ? JSON.parse(savedTheme) : "light";
  });

  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const themeMap: { [key: string]: any } = {
    light: vintageTheme,
    dark: plexiglasOrangeTheme,
    synthwave: futuristTheme,
  };

  const [currentLanguage, setCurrentLanguage] = useState('fr');

  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  // Watch for changes in the access_token cookie
  useEffect(() => {
    const checkAuthentication = () => {
      setIsAuthenticated(!!Cookies.get('access_token'));
    };

    // Check authentication on mount
    checkAuthentication();

    // Re-run checkAuthentication whenever cookies change
    window.addEventListener("cookiechange", checkAuthentication); // Note: Not supported in all browsers; fallback approach shown below

    return () => {
      window.removeEventListener("cookiechange", checkAuthentication);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('access_token'); // Remove token on logout
    setIsAuthenticated(false);       // Update authentication state
  };

  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <GlobalStyles />
      <Router>
        {isAuthenticated && <NavbarComponent onLogout={handleLogout} />}
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
        </Routes>
        <VisualSettingsComponent
          currentTheme={currentTheme}
          setTheme={setCurrentTheme}
          currentLanguage={currentLanguage}
          setLanguage={setCurrentLanguage}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;