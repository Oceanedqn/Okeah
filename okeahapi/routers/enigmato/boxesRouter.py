from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBox
from schemas import EnigmatoBoxSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/boxes",
    tags=['Enigmato boxes']
)

@router.post("/", response_model=EnigmatoBoxSchema)
async def create_box_async(box: EnigmatoBoxSchema, db: AsyncSession = Depends(get_db_async)):
    db_box = EnigmatoBox(**box.dict())
    db.add(db_box)
    await db.commit()
    await db.refresh(db_box)
    return db_box

@router.get("/", response_model=List[EnigmatoBoxSchema])
async def read_boxes_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(EnigmatoBox).offset(skip).limit(limit))
    boxes = result.scalars().all()
    return boxes

@router.get("/{box_id}", response_model=EnigmatoBoxSchema)
async def read_box_async(box_id: int, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
    box = result.scalar_one_or_none()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    return box

@router.put("/{box_id}", response_model=EnigmatoBoxSchema)
async def update_box_async(box_id: int, box: EnigmatoBoxSchema, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
    db_box = result.scalar_one_or_none()
    if db_box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    for key, value in box.dict().items():
        setattr(db_box, key, value)
    await db.commit()
    await db.refresh(db_box)
    return db_box

@router.delete("/{box_id}", response_model=EnigmatoBoxSchema)
async def delete_box_async(box_id: int, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
    db_box = result.scalar_one_or_none()
    if db_box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    await db.delete(db_box)
    await db.commit()
    return db_box