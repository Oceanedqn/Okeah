from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import EnigmatoBox
from schemas import EnigmatoBox as EnigmatoBoxSchema
from database import get_db

router = APIRouter(
    prefix="/enigmato/boxes",
    tags=['Enigmato boxes']
)

@router.post("/", response_model=EnigmatoBoxSchema)
def create_box(box: EnigmatoBoxSchema, db: Session = Depends(get_db)):
    db_box = EnigmatoBox(**box.dict())
    db.add(db_box)
    db.commit()
    db.refresh(db_box)
    return db_box

@router.get("/", response_model=List[EnigmatoBoxSchema])
def read_boxes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    boxes = db.query(EnigmatoBox).offset(skip).limit(limit).all()
    return boxes

@router.get("/{box_id}", response_model=EnigmatoBoxSchema)
def read_box(box_id: int, db: Session = Depends(get_db)):
    box = db.query(EnigmatoBox).filter(EnigmatoBox.id_box == box_id).first()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    return box

@router.put("/{box_id}", response_model=EnigmatoBoxSchema)
def update_box(box_id: int, box: EnigmatoBoxSchema, db: Session = Depends(get_db)):
    db_box = db.query(EnigmatoBox).filter(EnigmatoBox.id_box == box_id).first()
    if db_box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    for key, value in box.dict().items():
        setattr(db_box, key, value)
    db.commit()
    db.refresh(db_box)
    return db_box

@router.delete("/{box_id}", response_model=EnigmatoBoxSchema)
def delete_box(box_id: int, db: Session = Depends(get_db)):
    db_box = db.query(EnigmatoBox).filter(EnigmatoBox.id_box == box_id).first()
    if db_box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    db.delete(db_box)
    db.commit()
    return db_box