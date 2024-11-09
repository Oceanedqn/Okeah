// src/types/index.d.ts

// Interface pour les props de UserCard
export interface UserCardProps {
    name: string;
    age?: number;
  }

export interface ThemeToggleProps {
    currentTheme: string;
    setTheme: (theme: string) => void;
  }