# database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql+asyncpg://postgres:admin@localhost:5432/okeahdb"

# Création de l'engine async pour SQLAlchemy
async_engine = create_async_engine(DATABASE_URL, echo=False)

# Création de la session asynchrone
async_session = sessionmaker(
    bind=async_engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Déclare la base pour les modèles
Base = declarative_base()

# Dépendance de la base de données pour FastAPI
async def get_db_async():
    async with async_session() as session:
        yield session