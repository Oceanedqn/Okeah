// Définition des types pour les utilisateurs

export interface IUser {
  id_user: number;
  name: string;
  firstname: string;
  mail: string;
  gender: boolean;
}

export interface IUserCreate {
  name: string;
  firstname: string;
  mail: string;
  password: string;
  gender: boolean;
}
