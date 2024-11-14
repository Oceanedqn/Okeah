from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

# [OK] Modèle pour le login
class LoginRequestSchema(BaseModel):
    email: str
    password: str

# [OK] Schéma pour l'utilisateur
class UserSchema(BaseModel):
    id_user: int
    name: str
    firstname: str
    mail: str

class UserCreateSchema(BaseModel):
    name: str
    firstname: str
    mail: str
    password: str

# [OK] Modèle pour une partie de jeu Enigmato
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


class EnigmatoPartyCreateRequestSchema(BaseModel):
    name: str
    password: Optional[str]
    date_start: date
    game_mode: int
    number_of_box: int
    include_weekends: bool
    set_password: bool

# # Schéma pour les participants d'une partie avec vérification de profil
class EnigmatoParticipantsSchema(BaseModel):
    id_user: int
    id_party: int
    id_profil: int
    name: str
    firstname: str
    gender: bool = False
    picture2: Optional[str] = None
    is_complete: bool = False


# Modèle pour les données de jeu d'un utilisateur sur Enigmato (Profil)
class EnigmatoProfilSchema(BaseModel):
    id_profil: int
    id_user: int  # ID de l'utilisateur associé
    id_party: int  # ID de la partie associée
    picture1: Optional[str] = None
    picture2: Optional[str] = None
    gender: bool = False
    is_complete: bool = False



# [OK] Schema pour rejoindre une partie avec ou sans mot de passe
class EnigmatoJoinPartySchema(BaseModel):
    id_party: int
    password: Optional[str] = Field(None, description="Mot de passe de la partie, requis si la partie en a un.")



# Modèle pour une case du calendrier
class EnigmatoBoxSchema(BaseModel):
    id_box: int
    id_party: int
    name: str
    date: datetime

class EnigmatoBoxWithResponseSchema(BaseModel):
    id_box: int
    id_party: int
    name: str
    date: datetime
    id_enigma_user: int


class EnigmatoBoxGameSchema(BaseModel):
    id_box: int
    id_party: int
    name: str
    date: datetime
    picture1: str

class EnigmatoBoxRightResponseSchema(BaseModel):
    id_box: int
    id_party: int
    name_box: str
    date: datetime
    id_user: int
    id_profil: int
    name: str
    firstname: str
    picture1: str
    picture2: str

class EnigmatoPartyBoxesSchema(BaseModel):
  id_party: int
  date_creation: str
  name: str
  id_user: int
  date_start: str
  number_of_box: int
  today_box: EnigmatoBoxSchema
  previous_box: List[EnigmatoBoxSchema]



# Modèle la réponse d'une personne par rapport à une case du calendrier
class EnigmatoBoxResponseSchema(BaseModel):
    id_box: int
    id_user: Optional[int] = None
    id_user_response: Optional[int] = None
    date: Optional[datetime] = Field(None, description="Automatically set to current datetime if not provided")
    cluse_used: bool


class UpdateBoxResponseSchema(BaseModel):
    id_user_response: int
    date: Optional[datetime] = None 