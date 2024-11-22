from fastapi import FastAPI
from routers import router as api_router
from init_db import init_db_async
from fastapi.middleware.cors import CORSMiddleware

# Créer l'application FastAPI
app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db_async()


@app.get("/")
def read_root():
    return {"message": "It works!"}

# Inclure le routeur principal
app.include_router(api_router)

# Configurer les origines autorisées
origins = [
    "http://localhost:3000",
    "http://okeah.fr"
]

# Appliquer le middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Utilisez la liste d'origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exposer l'application FastAPI en tant que variable `application`
application = app
