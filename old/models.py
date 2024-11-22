from annotated_types import Timezone
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional

Base = declarative_base()

# Modèle pour l'utilisateur
class User(Base):
    __tablename__ = 'users'
    
    id_user = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    firstname = Column(String, nullable=False)
    mail = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    # Relation avec EnigmatoProfil et EnigmatoParty et EnigmatoPartyUser
    profiles = relationship("EnigmatoProfil", back_populates="user")
    parties = relationship("EnigmatoParty", back_populates="user")
    box_responses = relationship("EnigmatoBoxResponse", back_populates="user")

# Modèle pour une partie de jeu Enigmato
class EnigmatoParty(Base):
    __tablename__ = 'enigmato_parties'
    
    id_party = Column(Integer, primary_key=True, index=True)
    date_creation = Column(Date, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=True)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=True)
    is_finished = Column(Boolean, default=False)
    game_mode = Column(Integer, nullable=False)
    number_of_box = Column(Integer, nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)
    include_weekends = Column(Boolean, nullable=False, default=True)
    set_password = Column(Boolean, default=False)

    # Relation avec User et EnigmatoBox et EnigmatoPartyUser
    user = relationship("User", back_populates="parties")
    boxes = relationship("EnigmatoBox", back_populates="party")
    participants = relationship("EnigmatoProfil", back_populates="party")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Si set_password est True, alors password doit être présent
        if self.set_password and not self.password:
            raise ValueError("Password must be set if 'set_password' is True.")



# Modèle pour les données de jeu d'un utilisateur sur Enigmato (Profil)
class EnigmatoProfil(Base):
    __tablename__ = 'enigmato_profiles'
    
    id_profil = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)
    id_party = Column(Integer, ForeignKey('enigmato_parties.id_party'), nullable=False)
    gender = Column(Boolean, default=False)
    picture1 = Column(String, nullable=True)
    picture2 = Column(String, nullable=True)
    date_joined_at = Column(Date, nullable=False)
    is_complete = Column(Boolean, nullable=False, default=False)

    # Relation avec User
    user = relationship("User", back_populates="profiles")
    party = relationship("EnigmatoParty", back_populates="participants")

# Modèle pour une case du calendrier
class EnigmatoBox(Base):
    __tablename__ = 'enigmato_boxes'
    
    id_box = Column(Integer, primary_key=True, index=True)
    id_party = Column(Integer, ForeignKey('enigmato_parties.id_party'), nullable=False)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=True)
    id_enigma_user = Column(Integer, nullable=False)

    # Relation avec EnigmatoParty et EnigmatoBoxResponse
    party = relationship("EnigmatoParty", back_populates="boxes")
    responses = relationship("EnigmatoBoxResponse", back_populates="box")

# Modèle la réponse d'une personne par rapport à une case du calendrier
class EnigmatoBoxResponse(Base):
    __tablename__ = 'enigmato_box_responses'
    
    id_box_response = Column(Integer, primary_key=True, index=True)
    id_box = Column(Integer, ForeignKey('enigmato_boxes.id_box'), nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)
    id_user_response = Column(Integer, nullable=True)
    date = Column(DateTime(timezone=True), default=func.now())
    cluse_used = Column(Boolean, default=False)

    # Relation avec EnigmatoBox et User
    box = relationship("EnigmatoBox", back_populates="responses")
    user = relationship("User", back_populates="box_responses")