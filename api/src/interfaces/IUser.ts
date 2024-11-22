// Définition des types pour les utilisateurs

export interface IUser {
  id_user: number;
  name: string;
  firstname: string;
  email: string;
}

export interface IUserCreate {
  name: string;
  firstname: string;
  email: string;
  password: string;
  gender: boolean;
}

// OK
export interface IUserLogin {
  id_user: number;
  email: string;
  password: string;
}


