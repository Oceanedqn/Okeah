// Définition des types pour les utilisateurs

export interface User {
    id_user: number;
    name: string;
    firstname: string;
    mail: string;
    gender: boolean;
  }
  
  export interface UserCreate {
    name: string;
    firstname: string;
    mail: string;
    password: string;
    gender: boolean;
  }
