import asyncio
from datetime import date, datetime
import random
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBox, EnigmatoParty, EnigmatoProfil, User
from routers.authRouter import get_current_user_async
from utils.utils import get_random_participant_completed_to_create_box_async
from schemas import EnigmatoBoxGameSchema, EnigmatoBoxRightResponseSchema, EnigmatoBoxSchema, EnigmatoPartyBoxesSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/boxes",
    tags=['Enigmato boxes']
)


# Dictionnaire de verrous par identifiant de partie
party_locks = {}

@router.get("/{id_party}/today", response_model=EnigmatoBoxSchema)
async def read_today_box_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    from routers.enigmato.partiesRouter import read_party_async

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


@router.get("/{id_party}/today/game", response_model=EnigmatoBoxGameSchema)
async def read_today_box_in_game_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    from routers.enigmato.partiesRouter import read_party_async

    # Vérifiez la date de début de la partie
    party = await read_party_async(id_party, db, current_user)
    
    # Récupération de l'énigme d'aujourd'hui avec l'image de l'utilisateur
    result = await db.execute(
        select(EnigmatoBox, EnigmatoProfil.picture1)
        .join(EnigmatoProfil, EnigmatoBox.id_enigma_user == EnigmatoProfil.id_user)
        .where(EnigmatoBox.id_party == id_party, EnigmatoBox.date == date.today())
    )
    
    box_with_picture = result.first()

    if box_with_picture is None:
        raise HTTPException(status_code=404, detail="Box not found")

    box, picture1 = box_with_picture

    
    return EnigmatoBoxGameSchema(
        id_box=box.id_box,
        id_party=box.id_party,
        name=box.name,
        date=box.date,
        picture1=picture1
    )


@router.get("/{id_party}/before", response_model=List[EnigmatoBoxRightResponseSchema])
async def read_before_box_async(
    id_party: int, 
    db: AsyncSession = Depends(get_db_async), 
    current_user: User = Depends(get_current_user_async)
):
    
    # Récupérer les boîtes précédentes (avant aujourd'hui) liées à la partie spécifiée
    today_date = datetime.today().date()
    # Étape 1 : Récupérer les boîtes liées à la partie avant aujourd'hui
    result = await db.execute(
        select(EnigmatoBox)
        .where(EnigmatoBox.id_party == id_party)  # Filtrer par id_party
        .where(EnigmatoBox.date < today_date)  # Filtrer les boîtes avant aujourd'hui
        .order_by(EnigmatoBox.date.desc())  # Trier par date descendante
    )

    previous_boxes = result.scalars().all()  # Utilisez scalars() pour récupérer uniquement les objets

    if not previous_boxes:
        raise HTTPException(status_code=404, detail="No previous boxes found")

    # Étape 2 : Pour chaque boîte, récupérer les informations de profil et d'utilisateur
    previous_boxes_data = []

    for box in previous_boxes:
        # Assurez-vous que `box` a bien l'attribut `id_enigma_user`
        if hasattr(box, 'id_enigma_user'):
            id_enigma_user = box.id_enigma_user  # Accès correct à l'attribut
        else:
            raise HTTPException(status_code=404, detail=f"Missing 'id_enigma_user' in box {box.id_box}")
        
        # Récupérer le profil de l'utilisateur
        profil_result = await db.execute(
            select(EnigmatoProfil)
            .where(EnigmatoProfil.id_user == id_enigma_user)
            .where(EnigmatoProfil.id_party == id_party)
        )

        profil = profil_result.scalar_one_or_none()

        if profil:
            # Récupérer l'utilisateur associé au profil
            user_result = await db.execute(
                select(User).where(User.id_user == profil.id_user)
            )
            user = user_result.scalar_one_or_none()

            if user:
                previous_boxes_data.append(EnigmatoBoxRightResponseSchema(
                    id_box=box.id_box,
                    id_party=box.id_party,
                    name_box=box.name,
                    date=box.date,
                    id_user=box.id_enigma_user,
                    id_profil=profil.id_user,
                    name=user.name,
                    firstname=user.firstname,
                    picture1=profil.picture1,
                    picture2=profil.picture2,
                ))
            else:
                raise HTTPException(status_code=404, detail=f"User for profile {profil.id_user} not found")
        else:
            raise HTTPException(status_code=404, detail=f"Profile for user {box.id_enigma_user} not found")

    return previous_boxes_data


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
    selected_participant  = await get_random_participant_completed_to_create_box_async(id_party, db, current_user)

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

