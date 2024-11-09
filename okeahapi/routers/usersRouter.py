from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import User
from schemas import User as UserSchema, UserCreate
from database import get_db_async
import bcrypt
from routers.authRouter import get_current_user_async  # Importez les fonctions d'authentification
from passlib.context import CryptContext

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

# Créez un contexte pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



@router.post("/", response_model=UserSchema)
async def create_user_async(user: UserCreate, db: AsyncSession = Depends(get_db_async)):
    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Create a new user with the hashed password
    db_user = User(
        name=user.name,
        firstname=user.firstname,
        mail=user.mail,
        password=hashed_password,
        gender=user.gender
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[UserSchema])
async def read_users_async(
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # This should work without needing to specify the access_token manually
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

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

@router.get("/{user_id}", response_model=UserSchema)
async def read_user_async(
    user_id: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user_async(
    user_id: int,
    user: UserCreate,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user.dict().items():
        if key == 'password':
            # Hash the new password if it is being updated
            value = pwd_context.hash(value)
        setattr(db_user, key, value)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", response_model=UserSchema)
async def delete_user_async(
    user_id: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)  # Dépendance pour l'utilisateur actuel
):
    result = await db.execute(select(User).filter(User.id_user == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(db_user)
    await db.commit()
    return db_user