import select
from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from models import User
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Définir les variables de configuration
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))  # Valeur par défaut de 30 minutes si non définie
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Valeur par défaut "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")

# Assurez-vous que les variables essentielles sont définies
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in the .env file")


# Créez un contexte pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Créez un JWT Access Token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Fonction pour vérifier un mot de passe
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Fonction pour hacher le mot de passe
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Décodez le token JWT et récupérez l'utilisateur
async def get_user_from_token_async(access_token: str, db) -> 'User':
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        id_user = payload.get("sub")
        if id_user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired, please log in again")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    result = db.execute(select(User).where(User.id_user == id_user))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user