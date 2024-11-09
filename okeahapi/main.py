from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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


@app.get("/")
async def root():
    return {"message": "Hello World cc"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

@app.post("/api/data")
def create_data(item: dict):
    return {"message": f"Data received: {item}"}