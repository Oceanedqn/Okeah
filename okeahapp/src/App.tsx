import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, synthwaveTheme } from "./theme";
import GlobalStyles from "./styles/GlobalStyles";
import Authentication from "./pages/Authentication";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("currentTheme");
    return savedTheme ? JSON.parse(savedTheme) : "light";
  });

  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const themeMap: { [key: string]: any } = {
    light: lightTheme,
    dark: darkTheme,
    synthwave: synthwaveTheme,
  };

  return (
    <ThemeProvider theme={themeMap[currentTheme]}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Authentication />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <ThemeToggle currentTheme={currentTheme} setTheme={setCurrentTheme} />
      </Router>
    </ThemeProvider>
  );
};

export default App;