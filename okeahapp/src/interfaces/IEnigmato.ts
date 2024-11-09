// Exemple d'un profil d'utilisateur
export interface EnigmatoProfil {
    id_profil: number;
    id_user: number;
    picture_young?: string;
    picture_old?: string;
    is_referral: boolean;
  }
  
  // Exemple d'une partie de jeu
  export interface EnigmatoParty {
    id_party: number;
    date_creation: string; // format ISO 8601
    name: string;
    password: string;
    id_user: number;
  }

  export interface EnigmatoJoinParty {
    id_party: number;
    password?: string;
  }
  
  // Exemple d'une case du calendrier
  export interface EnigmatoBox {
    id_box: number;
    id_party: number;
    name: string;
    date?: string; // format ISO 8601 si une date existe
    id_enigma: number;
  }
  
  // Exemple d'une réponse à une case
  export interface EnigmatoBoxResponse {
    id_box: number;
    id_user: number;
    id_user_response: number;
    date?: string; // format ISO 8601 si une date existe
    cluse_used: boolean;
  }