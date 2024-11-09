from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router as api_router
import asyncio
from init_db import init_db_async
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

# Création de la base de données au démarrage de l'application
@app.on_event("startup")
async def startup_event():
    await init_db_async()

# Inclure le routeur principal
app.include_router(api_router)

# Configurer les origines autorisées (par exemple, localhost:3000 pour le développement)
origins = [
    "http://localhost:3000",  # frontend React en développement
    "http://localhost:3001",
    # ajoutez d'autres origines autorisées si nécessaire
]

# Appliquer le middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Utilisez la liste d'origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)