from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoProfil, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoProfil as EnigmatoProfilSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/profiles",
    tags=['Enigmato profiles']
)

@router.post("/", response_model=EnigmatoProfilSchema)
async def create_profile_async(profile: EnigmatoProfilSchema, db: AsyncSession = Depends(get_db_async)):
    db_profile = EnigmatoProfil(**profile.model_dump())
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

@router.get("/", response_model=List[EnigmatoProfilSchema])
async def read_profiles_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoProfil).offset(skip).limit(limit))
    profiles = result.scalars().all()
    return profiles

@router.get("/{profile_id}", response_model=EnigmatoProfilSchema)
async def read_profile_async(profile_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id))
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=EnigmatoProfilSchema)
async def update_profile_async(profile_id: int, profile: EnigmatoProfilSchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id))
    db_profile = result.scalar_one_or_none()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    for key, value in profile.dict().items():
        setattr(db_profile, key, value)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

@router.delete("/{profile_id}", response_model=EnigmatoProfilSchema)
async def delete_profile_async(profile_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id))
    db_profile = result.scalar_one_or_none()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    await db.delete(db_profile)
    await db.commit()
    return db_profile