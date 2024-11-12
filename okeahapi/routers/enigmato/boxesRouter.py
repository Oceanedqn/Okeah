import asyncio
from datetime import date, datetime
import random
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBox, EnigmatoParty, EnigmatoProfil, User
from routers.authRouter import get_current_user_async
from routers.enigmato.partiesRouter import get_random_participant_completed_async, read_party_async
from schemas import EnigmatoBoxSchema, EnigmatoPartyBoxesSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/boxes",
    tags=['Enigmato boxes']
)


# Dictionnaire de verrous par identifiant de partie
party_locks = {}

@router.get("/{id_party}/today", response_model=EnigmatoBoxSchema)
async def read_today_box_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Assurez-vous que chaque partie a son propre verrou
    if id_party not in party_locks:
        party_locks[id_party] = asyncio.Lock()

    async with party_locks[id_party]:
        # Vérifiez la date de début de la partie
        party = await read_party_async(id_party, db, current_user)
        
        today_date = date.today()
        if today_date < party.date_start:
            raise HTTPException(status_code=400, detail="La partie n'a pas encore commencé.")

        # Vérifiez si la boîte du jour existe déjà pour cette partie
        result_box = await db.execute(
            select(EnigmatoBox).filter(EnigmatoBox.id_party == id_party, EnigmatoBox.date == today_date)
        )
        box = result_box.scalar_one_or_none()

        # Si la boîte n'existe pas, créez-la
        if box is None:
            box = await create_box_async(id_party, db, current_user)

        # Supprimer le verrou après utilisation pour éviter de garder un verrou inutile en mémoire
        party_locks.pop(id_party, None)

    return box



@router.post("/{id_party}/today", response_model=EnigmatoBoxSchema)
async def create_box_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    today_date = date.today()
    print(today_date)
    
    # 1. Vérifier que la box n'existe pas pour la date du jour et l'id_party
    result_box = await db.execute(
        select(EnigmatoBox).filter(EnigmatoBox.id_party == id_party, EnigmatoBox.date == today_date)
    )
    existing_box = result_box.scalar_one_or_none()
    if existing_box:
        # Si une boîte existe déjà, la retourner sans créer une nouvelle boîte
        return EnigmatoBoxSchema(
        id_box=new_box.id_box,
        id_party=new_box.id_party,
        name=new_box.name,
        date=new_box.date
    )

    # 2. Récupérer tous les participants de la partie qui ont complété leur profil
    selected_participant  = await get_random_participant_completed_async(id_party, db, current_user)

    # 4. Créer la nouvelle box avec le participant sélectionné comme `id_enigma_user`
    new_box = EnigmatoBox(
        id_party=id_party,
        name=f"Box du {today_date.strftime('%d-%m-%Y')}",
        date=today_date,
        id_enigma_user=selected_participant.id_user  # Utiliser l'utilisateur sélectionné
    )
    db.add(new_box)
    await db.commit()
    await db.refresh(new_box)

    # Convertir `new_box` en modèle Pydantic avant de le retourner
    return EnigmatoBoxSchema(
        id_box=new_box.id_box,
        id_party=new_box.id_party,
        name=new_box.name,
        date=new_box.date
    )




# @router.get("/before-today", response_model=List[EnigmatoBoxSchema])
# async def read_boxes_before_today_async(date: str, db: AsyncSession = Depends(get_db_async)):
#     # Convertir la chaîne de caractères en type date
#     today_date = date.fromisoformat(date)
    
#     # Sélectionner les boxes avec une date avant aujourd'hui
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.date < today_date))
#     boxes = result.scalars().all()

#     if not boxes:
#         raise HTTPException(status_code=404, detail="No boxes found before today")
    
#     return boxes


    



# @router.get("/{box_id}/id", response_model=EnigmatoBoxSchema)
# async def read_box_by_id_async(box_id: int, db: AsyncSession = Depends(get_db_async)):
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
#     box = result.scalar_one_or_none()
#     if box is None:
#         raise HTTPException(status_code=404, detail="Box not found")
#     return box


# @router.get("/date", response_model=EnigmatoBoxSchema)  # Renvoie un seul objet, pas une liste
# async def read_box_by_date_async(date: date, db: AsyncSession = Depends(get_db_async)):
#     # Filtrer les boxes en fonction de la date
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.date == date))
#     box = result.scalar_one_or_none()  # On s'assure d'obtenir une seule box, ou None si aucune box trouvée
    
#     if not box:
#         raise HTTPException(status_code=404, detail="No box found for this date")
    
#     return box






# @router.put("/{box_id}", response_model=EnigmatoBoxSchema)
# async def update_box_async(box_id: int, box: EnigmatoBoxSchema, db: AsyncSession = Depends(get_db_async)):
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
#     db_box = result.scalar_one_or_none()
#     if db_box is None:
#         raise HTTPException(status_code=404, detail="Box not found")
#     for key, value in box.dict().items():
#         setattr(db_box, key, value)
#     await db.commit()
#     await db.refresh(db_box)
#     return db_box

# @router.delete("/{box_id}", response_model=EnigmatoBoxSchema)
# async def delete_box_async(box_id: int, db: AsyncSession = Depends(get_db_async)):
#     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_box == box_id))
#     db_box = result.scalar_one_or_none()
#     if db_box is None:
#         raise HTTPException(status_code=404, detail="Box not found")
#     await db.delete(db_box)
#     await db.commit()
#     return db_box