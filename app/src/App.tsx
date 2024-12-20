import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "styled-components";
import GlobalStyles, { ContainerStyle, StyledToastContainer } from "./styles/GlobalStyles";
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
import EnigmatoCreateParty from "./pages/enigmato/EnigmatoCreateParty";
import EnigmatoGameHint from "./pages/enigmato/EnigmatoGameHint";
import { themeMap } from "./components/base/ThemeSwitcherComponent";
import ResetPassword from "./pages/ResetPassword";

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("currentTheme");
    return savedTheme ? JSON.parse(savedTheme) : "vintage";
  });

  const handleLogout = () => {
    Cookies.remove('access_token');
    sessionStorage.removeItem("user");
  };


  // Sauvegarder le thème actuel dans le localStorage
  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);



  const [currentLanguage, setCurrentLanguage] = useState('fr');


  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <GlobalStyles />
      <Router>

        <Routes>
          <Route path="/home" element={<PrivateRoute><NavbarComponent onLogout={handleLogout} /></PrivateRoute>} />
          <Route path="/enigmato/*" element={<PrivateRoute><NavbarComponent onLogout={handleLogout} /></PrivateRoute>} />
        </Routes>

        <ContainerStyle>
          <StyledToastContainer hideProgressBar={true} autoClose={5000} closeOnClick pauseOnHover />
          <Routes>
            <Route path="/login" element={<Authentication />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/enigmato/home" element={<PrivateRoute><EnigmatoHome /></PrivateRoute>} />
            <Route path="/enigmato/create" element={<PrivateRoute><EnigmatoCreateParty /></PrivateRoute>} />
            <Route path="/enigmato/parties" element={<PrivateRoute><EnigmatoParties /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/profil" element={<PrivateRoute><EnigmatoProfil /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/game/info" element={<PrivateRoute><EnigmatoGameInfo /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/game" element={<PrivateRoute><EnigmatoGame /></PrivateRoute>} />
            <Route path="/enigmato/parties/:id_party/game/hint" element={<PrivateRoute><EnigmatoGameHint /></PrivateRoute>} />

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