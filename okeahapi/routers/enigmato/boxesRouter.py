from datetime import date, datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBox, EnigmatoParty, User
from routers.authRouter import get_current_user_async
from routers.enigmato.partiesRouter import read_party_async
from schemas import EnigmatoBoxSchema, EnigmatoPartyBoxesSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/parties/{id_party}/boxes",
    tags=['Enigmato boxes']
)

# @router.post("/", response_model=EnigmatoBoxSchema)
# async def create_box_async(box: EnigmatoBoxSchema, db: AsyncSession = Depends(get_db_async)):
#     db_box = EnigmatoBox(**box.dict())
#     db.add(db_box)
#     await db.commit()
#     await db.refresh(db_box)
#     return db_box




# @router.get("/before-today", response_model=List[EnigmatoBoxSchema])
# async def read_boxes_before_today_async(date: str, db: AsyncSession = Depends(get_db_async)):
#     # Convertir la chaîne de caractères en type date
#     today_date = date.fromisoformat(date)
    
#     # Sélectionner les boxes avec une date avant aujourd'hui
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.date < today_date))
#     boxes = result.scalars().all()

#     if not boxes:
#         raise HTTPException(status_code=404, detail="No boxes found before today")
    
#     return boxes



@router.get("/{box_id}", response_model=EnigmatoBoxSchema)
async def read_box_async(box_id: int, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
    box = result.scalar_one_or_none()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    return box


# @router.get("/date", response_model=EnigmatoBoxSchema)  # Renvoie un seul objet, pas une liste
# async def read_box_by_date_async(date: date, db: AsyncSession = Depends(get_db_async)):
#     # Filtrer les boxes en fonction de la date
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.date == date))
#     box = result.scalar_one_or_none()  # On s'assure d'obtenir une seule box, ou None si aucune box trouvée
    
#     if not box:
#         raise HTTPException(status_code=404, detail="No box found for this date")
    
#     return box






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