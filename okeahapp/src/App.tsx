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
import VisualSettingsComponent from "./components/visualsettings/VisualSettingsComponent";

const App: React.FC = () => {
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

  const [currentLanguage, setCurrentLanguage] = useState('fr'); // État pour la langue actuelle

  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <GlobalStyles />
      <Router>
      <Routes>
          <Route path="/login" element={<Authentication />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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