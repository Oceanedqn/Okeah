from datetime import date
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoParty, EnigmatoPartyUser, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoParty as EnigmatoPartySchema, EnigmatoUserParty, EnigmatoUserPartyCreate
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


@router.post("/join", response_model=EnigmatoUserParty)
async def join_party(enigmatoUserParty: EnigmatoUserPartyCreate, db: AsyncSession = Depends(get_db_async), user: User = Depends(get_current_user_async)
):
    print("Mot de passe reçu:", enigmatoUserParty.password)  # Affiche le mot de passe envoyé

    # Vérifier si la partie existe
    result = await db.execute(select(EnigmatoParty).filter(EnigmatoParty.id_party == enigmatoUserParty.id_party))
    party = result.scalar_one_or_none()
    if not party:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    print("Mot de passe dans la partie récupéré (haché):", party.password)  # Affiche le mot de passe haché stocké

    # Vérifier si un mot de passe est requis et s'il est correct (si la partie en nécessite un)
    if party.password:
        print(f"Vérification du mot de passe: {enigmatoUserParty.password} avec {party.password}")
        # Ajouter une vérification pour éviter de passer un mot de passe None
        if not enigmatoUserParty.password:
            raise HTTPException(status_code=400, detail="Mot de passe manquant")
        # Comparer le mot de passe fourni avec le mot de passe haché
        if not verify_password(enigmatoUserParty.password, party.password):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    # Vérifier si l'utilisateur est déjà membre de cette partie
    existing_user_party = await db.execute(
        select(EnigmatoPartyUser).filter(EnigmatoPartyUser.id_user == user.id_user, 
                                         EnigmatoPartyUser.id_party == enigmatoUserParty.id_party)
    )
    if existing_user_party.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Utilisateur déjà membre de cette partie")

    # Créer une nouvelle entrée dans la table EnigmatoPartyUser pour lier l'utilisateur à la partie
    new_user_party = EnigmatoPartyUser(
        id_user=user.id_user,  # Utilisation de l'ID de l'utilisateur actuel provenant du cookie
        id_party=enigmatoUserParty.id_party,
        date_joined_at=date.today()  # Génération automatique de la date d'adhésion
    )

    # Ajouter et valider l'insertion dans la base de données
    db.add(new_user_party)
    await db.commit()

    return new_user_party