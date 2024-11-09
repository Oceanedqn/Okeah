from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBoxResponse, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoBoxResponse as EnigmatoBoxResponseSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/box/responses",
    tags=['Enigmato box responses']
)

@router.post("/", response_model=EnigmatoBoxResponseSchema)
async def create_box_response_async(box_response: EnigmatoBoxResponseSchema, db: AsyncSession = Depends(get_db_async)):
    db_box_response = EnigmatoBoxResponse(**box_response.dict())
    db.add(db_box_response)
    await db.commit()
    await db.refresh(db_box_response)
    return db_box_response

@router.get("/", response_model=List[EnigmatoBoxResponseSchema])
async def read_box_responses_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoBoxResponse).offset(skip).limit(limit))
    box_responses = result.scalars().all()
    return box_responses

@router.get("/{response_id}", response_model=EnigmatoBoxResponseSchema)
async def read_box_response_async(response_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id))
    box_response = result.scalar_one_or_none()
    if box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    return box_response

@router.put("/{response_id}", response_model=EnigmatoBoxResponseSchema)
async def update_box_response_async(response_id: int, box_response: EnigmatoBoxResponseSchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id))
    db_box_response = result.scalar_one_or_none()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    for key, value in box_response.dict().items():
        setattr(db_box_response, key, value)
    await db.commit()
    await db.refresh(db_box_response)
    return db_box_response

@router.delete("/{response_id}", response_model=EnigmatoBoxResponseSchema)
async def delete_box_response_async(response_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id))
    db_box_response = result.scalar_one_or_none()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    await db.delete(db_box_response)
    await db.commit()
    return db_box_response