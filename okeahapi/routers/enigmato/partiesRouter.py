from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import EnigmatoParty
from schemas import EnigmatoParty as EnigmatoPartySchema
from database import get_db

router = APIRouter(
    prefix="/enigmato/parties",
    tags=['Enigmato parties']
)

@router.post("/", response_model=EnigmatoPartySchema)
def create_party(party: EnigmatoPartySchema, db: Session = Depends(get_db)):
    db_party = EnigmatoParty(**party.dict())
    db.add(db_party)
    db.commit()
    db.refresh(db_party)
    return db_party

@router.get("/", response_model=List[EnigmatoPartySchema])
def read_parties(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    parties = db.query(EnigmatoParty).offset(skip).limit(limit).all()
    return parties

@router.get("/{party_id}", response_model=EnigmatoPartySchema)
def read_party(party_id: int, db: Session = Depends(get_db)):
    party = db.query(EnigmatoParty).filter(EnigmatoParty.id_party == party_id).first()
    if party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    return party

@router.put("/{party_id}", response_model=EnigmatoPartySchema)
def update_party(party_id: int, party: EnigmatoPartySchema, db: Session = Depends(get_db)):
    db_party = db.query(EnigmatoParty).filter(EnigmatoParty.id_party == party_id).first()
    if db_party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    for key, value in party.dict().items():
        setattr(db_party, key, value)
    db.commit()
    db.refresh(db_party)
    return db_party

@router.delete("/{party_id}", response_model=EnigmatoPartySchema)
def delete_party(party_id: int, db: Session = Depends(get_db)):
    db_party = db.query(EnigmatoParty).filter(EnigmatoParty.id_party == party_id).first()
    if db_party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    db.delete(db_party)
    db.commit()
    return db_party