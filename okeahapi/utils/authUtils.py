import select
from passlib.context import CryptContext
import jwt
import os
import datetime
from fastapi import HTTPException
from dotenv import load_dotenv

from models import User

# Chargement des variables d'environnement
load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")  # Valeur par défaut si non définie
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")

# Vérification si la clé secrète est définie
if not SECRET_KEY:
    raise HTTPException(status_code=500, detail="SECRET_KEY is not set in .env file.")

# Créez un contexte pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Créez un JWT Access Token
def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    now = datetime.datetime.now()
    expire = now + (expires_delta if expires_delta else datetime.timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Méthode pour vérifier le mot de passe
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Décodez le token JWT et récupérez l'utilisateur
async def get_user_from_token_async(access_token: str, db) -> 'User':
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired, please log in again")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    result = db.execute(select(User).where(User.id_user == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user