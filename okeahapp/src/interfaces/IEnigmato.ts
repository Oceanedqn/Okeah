// Exemple d'une partie de jeu
export interface IEnigmatoParty {
  id_party: number;
  date_creation: string; // format ISO 8601
  name: string;
  password: string;
  id_user: number;
  date_start: string;
  game_mode: number;
  number_of_box: number;
  include_weekends: boolean;
  set_password: boolean;
}

export interface IEnigmatoPartyBoxes {
  id_party: number;
  date_creation: string; // format ISO 8601
  name: string;
  id_user: number;
  date_start: string;
  number_of_box: number;
  today_box: IEnigmatoBox;
  previous_box: IEnigmatoBox[];
}

// Exemple d'un profil d'utilisateur
export interface IEnigmatoProfil {
  id_profil: number;
  id_user: number;
  id_party: number;
  picture1?: string;
  picture2?: string;
  is_complete: boolean;
  gender: boolean;
}

export interface IEnigmatoParticipants {
  id_user: number
  id_party: number
  id_profil: number
  name: string
  firstname: string
  gender: boolean
  is_complete: boolean
  picture2: string
}

export interface IEnigmatoPartyCreateRequest {
  name: string;
  password: string;
  date_start: string;
  game_mode: number;
  number_of_box: number;
  include_weekends: boolean;
  set_password: boolean;
}

export interface IEnigmatoJoinParty {
  id_party: number;
  password?: string;
}

// Exemple d'une case du calendrier
export interface IEnigmatoBox {
  id_box: number;
  id_party: number;
  name: string;
  date?: string;
}

export interface IEnigmatoBoxGame {
  id_box: number;
  id_party: number;
  name: string;
  date?: string;
  picture1: string;
}


export interface IEnigmatoBoxRightResponse {
  id_box: number
  id_party: number
  name_box: string
  date: string
  id_user: number
  id_profil: number
  name: string
  firstname: string
  picture1: string
  picture2: string
}


// Exemple d'une réponse à une case
export interface IEnigmatoBoxResponse {
  id_box: number;
  id_user: number | null;
  id_user_response: number | null;
  date?: string; // format ISO 8601 si une date existe
  cluse_used: boolean;
}