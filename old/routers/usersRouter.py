from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import User
from schemas import UserSchema, UserCreateSchema
from database import get_db_async
from routers.authRouter import get_current_user_async  # Importez les fonctions d'authentification
from utils.authUtils import hash_password, verify_password


router = APIRouter(
    prefix="/users",
    tags=['Users']
)


# [OK] Creation d'un utilisateur
@router.post("/", response_model=UserSchema)
async def create_user_async(user: UserCreateSchema, db: AsyncSession = Depends(get_db_async)):
    hashed_password = hash_password(user.password)

    db_user = User(
        name=user.name,
        firstname=user.firstname,
        mail=user.mail,
        password=hashed_password
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user



# ##########################################################

# Recupere tous les utilisateurs
@router.get("/", response_model=List[UserSchema])
async def read_users_async(
    db: AsyncSession = Depends(get_db_async),
    access_token: str = Depends(get_current_user_async)  # Cette fonction va extraire l'utilisateur du token
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users





@router.get("/me", response_model=UserSchema)
async def get_me(current_user: User = Depends(get_current_user_async)):
    # Récupérer l'utilisateur actuellement authentifié
    return current_user  # Retourne l'utilisateur actuel



@router.get("/paginated", response_model=List[UserSchema])
async def read_users_paginated_async(
    skip: int = 0, 
    limit: int = 10, 
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users

@router.get("/{id_user}", response_model=UserSchema)
async def read_user_async(
    id_user: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == id_user))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{id_user}", response_model=UserSchema)
async def update_user_async(
    id_user: int,
    user: UserCreateSchema,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == id_user))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user.dict().items():
        if key == 'password':
            # Hash the new password if it is being updated
            value = verify_password(value)
        setattr(db_user, key, value)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.delete("/{id_user}", response_model=UserSchema)
async def delete_user_async(
    id_user: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == id_user))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(db_user)
    await db.commit()
    return db_user