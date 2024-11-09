// src/types/index.d.ts

// Interface pour les props de UserCard
export interface UserCardProps {
    name: string;
    age?: number;
  }

export interface ThemeSwitcherProps {
    currentTheme: string;
    setTheme: (theme: string) => void;
  }

  export interface LanguageSwitcherProps {
    currentLanguage: string; // Langue actuelle, attendue comme chaîne
    setLanguage: (language: string) => void; // Fonction pour changer la langue
  }

  export interface VisualSettingsProps extends ThemeSwitcherProps, LanguageSwitcherProps {}

  export interface PrivateRouteProps {
    children: React.ReactNode; // Use children prop to receive the component to render
  }

  export interface HeaderWithBackButtonProps {
    title: string;
    onBackClick: () => void;
}