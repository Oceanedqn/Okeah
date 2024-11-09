from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import EnigmatoProfil
from schemas import EnigmatoProfil as EnigmatoProfilSchema
from database import get_db

router = APIRouter(
    prefix="/enigmato/profiles",
    tags=['Enigmato profiles']
)

@router.post("/", response_model=EnigmatoProfilSchema)
def create_profile(profile: EnigmatoProfilSchema, db: Session = Depends(get_db)):
    db_profile = EnigmatoProfil(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/", response_model=List[EnigmatoProfilSchema])
def read_profiles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    profiles = db.query(EnigmatoProfil).offset(skip).limit(limit).all()
    return profiles

@router.get("/{profile_id}", response_model=EnigmatoProfilSchema)
def read_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=EnigmatoProfilSchema)
def update_profile(profile_id: int, profile: EnigmatoProfilSchema, db: Session = Depends(get_db)):
    db_profile = db.query(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    for key, value in profile.dict().items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.delete("/{profile_id}", response_model=EnigmatoProfilSchema)
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(db_profile)
    db.commit()
    return db_profile