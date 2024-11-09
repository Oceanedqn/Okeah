from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


# Modèle pour le login
class LoginRequest(BaseModel):
    email: str
    password: str


# Modèle pour l'utilisateur
class User(BaseModel):
    id_user: int
    name: str
    firstname: str
    mail: str
    gender: bool = False

class UserCreate(BaseModel):
    name: str
    firstname: str
    mail: str
    password: str
    gender: bool = False

# Modèle pour une partie de jeu Enigmato
class EnigmatoParty(BaseModel):
    id_party: int
    name: str
    password: str
    date_start: date
    date_creation: date
    game_mode: int
    number_of_box: int
    include_weekends: bool
    id_user: int

class EnigmatoPartyCreate(BaseModel):
    name: str
    password: str
    date_start: date
    game_mode: int
    number_of_box: int
    include_weekends: bool

class EnigmatoPartySchema(BaseModel):
    id_party: int
    date_creation: date
    name: str
    id_user: int

# Schéma pour l'association entre un utilisateur et une partie
class EnigmatoUserParty(BaseModel):
    id_user: int
    id_party: int
    date_joined_at: date

class EnigmatoUserPartyCreate(BaseModel):
    id_party: int
    password: str

# Modèle pour les données de jeu d'un utilisateur sur Enigmato (Profil)
class EnigmatoProfil(BaseModel):
    id_profil: int
    id_user: int  # ID de l'utilisateur associé
    picture_young: Optional[str] = None
    picture_old: Optional[str] = None
    is_referral: bool = False

# Modèle pour une case du calendrier
class EnigmatoBox(BaseModel):
    id_box: int
    id_party: int
    name: str
    date: Optional[datetime] = None
    id_enigma: int

# Modèle la réponse d'une personne par rapport à une case du calendrier
class EnigmatoBoxResponse(BaseModel):
    id_box: int
    id_user: int
    id_user_response: int
    date: Optional[datetime] = None
    cluse_used: bool = False

