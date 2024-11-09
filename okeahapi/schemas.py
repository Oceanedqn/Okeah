from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


# Modèle pour le login
class LoginRequestSchema(BaseModel):
    email: str
    password: str


# Modèle pour l'utilisateur
class UserSchema(BaseModel):
    id_user: int
    name: str
    firstname: str
    mail: str
    gender: bool = False

class UserCreateSchema(BaseModel):
    name: str
    firstname: str
    mail: str
    password: str
    gender: bool = False

# Modèle pour une partie de jeu Enigmato
#Utile
class EnigmatoPartySchema(BaseModel):
    id_party: int
    name: str
    password: Optional[str]
    date_start: date
    date_creation: date
    game_mode: int
    number_of_box: int
    include_weekends: bool
    id_user: int
    set_password: bool

#Utile
class EnigmatoPartyCreateRequestSchema(BaseModel):
    name: str
    password: Optional[str]
    date_start: date
    game_mode: int
    number_of_box: int
    include_weekends: bool
    set_password: bool


# Schéma pour l'association entre un utilisateur et une partie
class EnigmatoUserPartySchema(BaseModel):
    id_user: int
    id_party: int
    id_profil: int
    date_joined_at: date

class EnigmatoUserPartyCreateRequestSchema(BaseModel):
    id_party: int
    password: Optional[str] = Field(None, description="Mot de passe de la partie, requis si la partie en a un.")

# Modèle pour les données de jeu d'un utilisateur sur Enigmato (Profil)
class EnigmatoProfilSchema(BaseModel):
    id_profil: int
    id_user: int  # ID de l'utilisateur associé
    picture1: Optional[str] = None
    picture2: Optional[str] = None

class EnigmatoProfilCreateSchema(BaseModel):
    id_user: int

# Modèle pour une case du calendrier
class EnigmatoBoxSchema(BaseModel):
    id_box: int
    id_party: int
    name: str
    date: Optional[datetime] = None
    id_enigma: int

# Modèle la réponse d'une personne par rapport à une case du calendrier
class EnigmatoBoxResponseSchema(BaseModel):
    id_box: int
    id_user: int
    id_user_response: int
    date: Optional[datetime] = None
    cluse_used: bool = False

