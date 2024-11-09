from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router as api_router
import asyncio
from init_db import init_db_async
from fastapi.security import OAuth2PasswordBearer


app = FastAPI()

# Creation de la base de données au démarrage de l'application
@app.on_event("startup")
async def startup_event():
    await init_db_async()


# Inclure le routeur principal
app.include_router(api_router)


# Configurer les origines autorisées (par exemple, localhost:3000 pour le développement)
origins = [
    "http://localhost:3000",  # frontend React en développement
    # ajoutez d'autres origines autorisées si nécessaire
]

# Appliquer le middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permet uniquement aux origines spécifiées d'accéder
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les en-têtes
)




# Schéma de sécurité OAuth2 avec le token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# Appliquez le schéma de sécurité global à Swagger
app.openapi_schema = app.openapi()
app.openapi_schema["components"]["securitySchemes"] = {
    "BearerAuth": {"type": "http", "scheme": "bearer"}
}

app.openapi_schema["security"] = [{"BearerAuth": []}]