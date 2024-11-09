import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, synthwaveTheme } from "./theme";
import GlobalStyles from "./styles/GlobalStyles";

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
        <Header />
        <main style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <ThemeToggle currentTheme={currentTheme} setTheme={setCurrentTheme} />
      </Router>
    </ThemeProvider>
  );
};

export default App;