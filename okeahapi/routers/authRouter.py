import jwt
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import User
from database import get_db_async
from utils.authUtils import ALGORITHM, SECRET_KEY

# Dependency to get current user from token stored in the cookie
async def get_current_user_async(access_token: str = Cookie(...), db: AsyncSession = Depends(get_db_async)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired, please log in again")
    except jwt.InvalidTokenError as e:
        raise credentials_exception
    
    # Chercher l'utilisateur dans la base de données
    result = await db.execute(select(User).where(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user