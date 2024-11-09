from datetime import date
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import not_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoParty, EnigmatoPartyUser, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoPartySchema, EnigmatoPartyCreateRequestSchema, UserSchema
from database import get_db_async
from utils.authUtils import hash_password

router = APIRouter(
    prefix="/enigmato/parties",
    tags=['Enigmato parties']
)



@router.post("/", response_model=EnigmatoPartySchema)
async def create_party_async(
    party: EnigmatoPartyCreateRequestSchema, 
    db: AsyncSession = Depends(get_db_async), 
    current_user: User = Depends(get_current_user_async)
):
    print(party.set_password, party.password)
    # Si set_password est True, on hash le mot de passe. Sinon, on le met à None.
    password_to_store = hash_password(party.password) if party.set_password and party.password else None
    
    print("password to store : ", password_to_store)
    # Créer la nouvelle partie dans la base de données
    db_party = EnigmatoParty(
        name=party.name,
        date_creation=date.today(),
        password=password_to_store,  # Si set_password est False, password sera None
        id_user=current_user.id_user,
        date_start=party.date_start,
        game_mode=party.game_mode,
        number_of_box=party.number_of_box,
        include_weekends=party.include_weekends,
        set_password=party.set_password
    )

    # Ajouter la partie à la base de données
    db.add(db_party)
    await db.commit()
    await db.refresh(db_party)
    
    # Retourner la partie créée
    return db_party


# Retourne les parties sans celles que l'utilisateur à déjà rejoint
@router.get("/", response_model=List[EnigmatoPartySchema])
async def read_parties_async(skip: int = 0, limit: int = 8, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Sous-requête pour obtenir les parties que l'utilisateur a rejoint
    subquery = select(EnigmatoPartyUser.id_party).filter(EnigmatoPartyUser.id_user == current_user.id_user)
    
    # Requête principale pour obtenir les parties que l'utilisateur n'a pas rejoint
    result = await db.execute(
        select(EnigmatoParty)
        .where(not_(EnigmatoParty.id_party.in_(subquery)))
        .offset(skip)
        .limit(limit)
    )
    parties = result.scalars().all()
    return parties


@router.get("/user", response_model=List[EnigmatoPartySchema])
async def read_parties_created_by_user_async(db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Filtrer les parties créée par l'utilisateur actuel
    result = await db.execute(
        select(EnigmatoParty)
        .filter(EnigmatoParty.id_user == current_user.id_user)
    )
    parties = result.scalars().all()
    return parties

@router.get("/{party_id}", response_model=EnigmatoPartySchema)
async def read_party_async(party_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoParty).filter(EnigmatoParty.id_party == party_id))
    party = result.scalar_one_or_none()
    if party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    return party



@router.get("/{id_party}/participants", response_model=List[UserSchema])
async def get_participants(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Requête pour récupérer les utilisateurs associés à cette partie
    result = await db.execute(
        select(User).join(EnigmatoPartyUser).filter(EnigmatoPartyUser.id_party == id_party)
    )
    participants = result.scalars().all()
    
    # Vérifie si des participants ont été trouvés
    if not participants:
        raise HTTPException(status_code=404, detail="No participants found for this party")
    
    print(participants)
    return participants




@router.put("/{party_id}", response_model=EnigmatoPartySchema)
async def update_party_async(party_id: int, party: EnigmatoPartySchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoParty).filter(EnigmatoParty.id_party == party_id))
    db_party = result.scalar_one_or_none()
    if db_party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    for key, value in party.dict().items():
        setattr(db_party, key, value)
    await db.commit()
    await db.refresh(db_party)
    return db_party


@router.delete("/{party_id}", response_model=EnigmatoPartySchema)
async def delete_party_async(party_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoParty).filter(EnigmatoParty.id_party == party_id))
    db_party = result.scalar_one_or_none()
    if db_party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    await db.delete(db_party)
    await db.commit()
    return db_party





# @router.get("/", response_model=List[EnigmatoPartySchema])
# async def read_parties_async(skip: int = 0, limit: int = 8, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
#     result = await db.execute(select(EnigmatoParty).offset(skip).limit(limit))
#     parties = result.scalars().all()

#     return parties