from datetime import date
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoParty, EnigmatoPartyUser, EnigmatoProfil, User
from routers.enigmato.partiesRouter import read_party_async
from routers.enigmato.profilesRouter import create_profile_async
from routers.authRouter import get_current_user_async
from schemas import EnigmatoPartySchema, EnigmatoProfilCreateSchema, EnigmatoProfilSchema, EnigmatoUserPartySchema, EnigmatoUserPartyCreateRequestSchema
from database import get_db_async
from utils.authUtils import verify_password

router = APIRouter(
    prefix="/enigmato/parties/user",
    tags=['Enigmato parties']
)


@router.get("/parties", response_model=List[EnigmatoPartySchema])
async def read_user_parties(
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    # Requête pour récupérer les parties de l'utilisateur via la table enigmato_party_users
    result = await db.execute(
        select(EnigmatoParty)
        .join(EnigmatoPartyUser, EnigmatoParty.id_party == EnigmatoPartyUser.id_party)
        .filter(EnigmatoPartyUser.id_user == current_user.id_user)
    )
    user_parties = result.scalars().all()
    return user_parties


@router.post("/join", response_model=EnigmatoUserPartySchema)
async def join_party(enigmatoUserParty: EnigmatoUserPartyCreateRequestSchema, db: AsyncSession = Depends(get_db_async), user: User = Depends(get_current_user_async)
):

    # Vérifier si la partie existe
    party = await read_party_async(enigmatoUserParty.id_party, db, user)


    # Vérifier si un mot de passe est requis et s'il est correct (si la partie en nécessite un)
    if party.set_password:
        if not enigmatoUserParty.password:
            raise HTTPException(status_code=400, detail="Mot de passe manquant")
        if not verify_password(enigmatoUserParty.password, party.password):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")
        
        
    existing_user_party = await db.execute(
        select(EnigmatoPartyUser).filter(
            EnigmatoPartyUser.id_user == user.id_user, 
            EnigmatoPartyUser.id_party == enigmatoUserParty.id_party
        )
    )
    if existing_user_party.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Utilisateur déjà membre de cette partie")


    profile = await create_profile_async(db, user)

    # Créer une nouvelle entrée dans la table EnigmatoPartyUser pour lier l'utilisateur à la partie
    new_user_party = EnigmatoPartyUser(
        id_user=user.id_user,  # Utilisation de l'ID de l'utilisateur actuel provenant du cookie
        id_party=enigmatoUserParty.id_party,
        id_profil=profile.id_profil,
        date_joined_at=date.today()  # Génération automatique de la date d'adhésion
    )


    # Ajouter et valider l'insertion dans la base de données
    db.add(new_user_party)
    await db.commit()

    return new_user_party