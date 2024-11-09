from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import EnigmatoBoxResponse
from schemas import EnigmatoBoxResponse as EnigmatoBoxResponseSchema
from database import get_db

router = APIRouter(
    prefix="/enigmato/box/responses",
    tags=['Enigmato box responses']
)

@router.post("/", response_model=EnigmatoBoxResponseSchema)
def create_box_response(box_response: EnigmatoBoxResponseSchema, db: Session = Depends(get_db)):
    db_box_response = EnigmatoBoxResponse(**box_response.dict())
    db.add(db_box_response)
    db.commit()
    db.refresh(db_box_response)
    return db_box_response

@router.get("/", response_model=List[EnigmatoBoxResponseSchema])
def read_box_responses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    box_responses = db.query(EnigmatoBoxResponse).offset(skip).limit(limit).all()
    return box_responses

@router.get("/{response_id}", response_model=EnigmatoBoxResponseSchema)
def read_box_response(response_id: int, db: Session = Depends(get_db)):
    box_response = db.query(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id).first()
    if box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    return box_response

@router.put("/{response_id}", response_model=EnigmatoBoxResponseSchema)
def update_box_response(response_id: int, box_response: EnigmatoBoxResponseSchema, db: Session = Depends(get_db)):
    db_box_response = db.query(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id).first()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    for key, value in box_response.dict().items():
        setattr(db_box_response, key, value)
    db.commit()
    db.refresh(db_box_response)
    return db_box_response

@router.delete("/{response_id}", response_model=EnigmatoBoxResponseSchema)
def delete_box_response(response_id: int, db: Session = Depends(get_db)):
    db_box_response = db.query(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id).first()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    db.delete(db_box_response)
    db.commit()
    return db_box_response