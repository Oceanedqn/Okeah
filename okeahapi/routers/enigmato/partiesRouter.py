from datetime import date
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoParty, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoParty as EnigmatoPartySchema
from database import get_db_async
from utils.authUtils import hash_password

router = APIRouter(
    prefix="/enigmato/parties",
    tags=['Enigmato parties']
)



@router.post("/", response_model=EnigmatoPartySchema)
async def create_party_async(party: EnigmatoPartySchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Hacher le mot de passe avant de l'enregistrer
    hashed_password = hash_password(party.password)
    
    # Créer l'objet de la partie avec le mot de passe haché
    db_party = EnigmatoParty(
        name=party.name,
        date_creation=date.today(),
        password=hashed_password,  # Stocker le mot de passe haché
        id_user=current_user.id_user
    )
    db.add(db_party)
    await db.commit()
    await db.refresh(db_party)
    return db_party


@router.get("/", response_model=List[EnigmatoPartySchema])
async def read_parties_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoParty).offset(skip).limit(limit))
    parties = result.scalars().all()

    # Si aucune partie n'est trouvée, en créer une
    if not parties:
        new_party = EnigmatoParty(
            date_creation=date.today(),
            name="Partie 1",  # Vous pouvez remplacer par un nom par défaut de votre choix
            password=hash_password("123"), # Utilisez un mot de passe par défaut ou générez-en un
            id_user=current_user.id_user
        )
        db.add(new_party)
        await db.commit()  # Sauvegarder la nouvelle partie dans la base de données
        await db.refresh(new_party)  # Rafraîchir pour obtenir l'ID et autres valeurs mises à jour
        parties = [new_party]  # Retourner la liste avec la nouvelle partie

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