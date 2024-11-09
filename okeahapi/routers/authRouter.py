import os
from dotenv import load_dotenv
import jwt
import datetime
from fastapi import Cookie, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import User
from database import get_db_async
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

# Vérifiez si SECRET_KEY est bien chargé
if not SECRET_KEY:
    raise HTTPException(status_code=500, detail="SECRET_KEY is not set in .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Créez un contexte pour le hachage de mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Create JWT Access Token
def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now() + expires_delta
    else:
        expire = datetime.datetime.now() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return access_token



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



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
    except jwt.PyJWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user