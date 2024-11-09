from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import User
from schemas import User as UserSchema, UserCreate
from database import get_db_async
import bcrypt
from routers.authRouter import get_current_user_async  # Importez les fonctions d'authentification

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.post("/", response_model=UserSchema)
async def create_user_async(user: UserCreate, db: AsyncSession = Depends(get_db_async)):
    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Create a new user with the hashed password
    db_user = User(  # Here we use the SQLAlchemy User model
        name=user.name,
        firstname=user.firstname,
        mail=user.mail,
        password=hashed_password.decode('utf-8'),  # Convert bytes to string
        gender=user.gender
    )

    db.add(db_user)  # Add the SQLAlchemy User instance to the session
    await db.commit()
    await db.refresh(db_user)  # Refresh the instance to get the updated state
    return db_user  # Return the SQLAlchemy User instance

@router.get("/", response_model=List[UserSchema])
async def read_users_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users

@router.get("/{user_id}", response_model=UserSchema)
async def read_user_async(user_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(User).filter(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user_async(user_id: int, user: UserCreate, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Récupère l'utilisateur de la base de données
    result = await db.execute(select(User).filter(User.id_user == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict().items():
        if key == 'password':  # Si le mot de passe est modifié, le hacher
            value = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        setattr(db_user, key, value)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", response_model=UserSchema)
async def delete_user_async(user_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(UserSchema).filter(User.id_user == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(db_user)
    await db.commit()
    return db_user