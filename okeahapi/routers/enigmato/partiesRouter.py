from datetime import date, datetime, timedelta
import random
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import not_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBox, EnigmatoParty, EnigmatoProfil, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoJoinPartySchema, EnigmatoParticipantsSchema, EnigmatoPartySchema, EnigmatoPartyCreateRequestSchema, EnigmatoProfilSchema, UserSchema
from database import get_db_async
from utils.authUtils import hash_password, verify_password

router = APIRouter(
    prefix="/enigmato/parties",
    tags=['Enigmato parties']
)


# [OK] Crée une partie.
@router.post("/", response_model=EnigmatoPartySchema)
async def create_party_async(
    party: EnigmatoPartyCreateRequestSchema, 
    db: AsyncSession = Depends(get_db_async), 
    current_user: User = Depends(get_current_user_async)
):
    # Si set_password est True, on hash le mot de passe. Sinon, on le met à None.
    password_to_store = hash_password(party.password) if party.set_password and party.password else None
    
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


# [OK] Retourne les parties auxquelles l'utilisateur participe.
@router.get("/user/parties", response_model=List[EnigmatoPartySchema])
async def read_user_parties_async(
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    # Requête pour récupérer les parties de l'utilisateur via la table enigmato_profiles
    result = await db.execute(
        select(EnigmatoParty)
        .join(EnigmatoProfil, EnigmatoParty.id_party == EnigmatoProfil.id_party)
        .filter(EnigmatoProfil.id_user == current_user.id_user)
    )
    user_parties = result.scalars().all()
    return user_parties



# [OK] Liste des parties sans celles que l'utilisateur à déjà rejoint avec pagination.
@router.get("/", response_model=List[EnigmatoPartySchema])
async def read_parties_async(skip: int = 0, limit: int = 8, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Sous-requête pour obtenir les parties que l'utilisateur a rejoint
    subquery = select(EnigmatoProfil.id_party).filter(EnigmatoProfil.id_user == current_user.id_user)
    
    # Requête principale pour obtenir les parties que l'utilisateur n'a pas rejoint
    result = await db.execute(
        select(EnigmatoParty)
        .where(not_(EnigmatoParty.id_party.in_(subquery)))
        .offset(skip)
        .limit(limit)
    )
    parties = result.scalars().all()
    return parties


# [OK] Rejoindre une partie avec ou sans mot de passe.
@router.post("/join", response_model=EnigmatoProfilSchema)
async def join_party(join_party: EnigmatoJoinPartySchema, db: AsyncSession = Depends(get_db_async), user: User = Depends(get_current_user_async)
):
    # Vérifier si la partie existe
    party = await read_party_async(join_party.id_party, db, user)

    # Vérifier si un mot de passe est requis et s'il est correct (si la partie en nécessite un)
    if party.set_password:
        if not join_party.password:
            raise HTTPException(status_code=400, detail="Mot de passe manquant")
        if not verify_password(join_party.password, party.password):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")
        
      
    existing_user_party = await db.execute(
        select(EnigmatoProfil).filter(
            EnigmatoProfil.id_user == user.id_user, 
            EnigmatoProfil.id_party == join_party.id_party
        )
    )
    if existing_user_party.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Utilisateur déjà membre de cette partie")

    # Créer une nouvelle entrée dans la table EnigmatoProfil pour lier l'utilisateur à la partie
    new_user_party = EnigmatoProfil(
        id_user=user.id_user,  # Utilisation de l'ID de l'utilisateur actuel provenant du cookie
        id_party=join_party.id_party,
        date_joined_at=date.today()  # Génération automatique de la date d'adhésion
    )

    # Ajouter et valider l'insertion dans la base de données
    db.add(new_user_party)
    await db.commit()
    return new_user_party




# Récupére tous les participants d'une partie
@router.get("/{id_party}/participants", response_model=List[EnigmatoParticipantsSchema])
async def get_participants_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    party = await read_party_async(id_party, db, current_user)
    
    
    # Requête pour récupérer les utilisateurs associés à cette partie avec leur profil
    result = await db.execute(
        select(User, EnigmatoProfil)
        .join(EnigmatoProfil, EnigmatoProfil.id_user == User.id_user)
        .filter(EnigmatoProfil.id_party == id_party)
    )
    participants = result.all()
    
    if not participants:
        raise HTTPException(status_code=404, detail="No participants found for this party")
    
    # Préparer la liste des participants avec le statut `is_complete`
    participants_with_profile_status = [
        EnigmatoParticipantsSchema(
            id_user=user.id_user,
            id_party=id_party,
            id_profil=profile.id_profil,
            name=user.name,
            firstname=user.firstname,
            gender=profile.gender,
            picture2=profile.picture2,
            is_complete=bool(profile.picture1 and profile.picture2)
        )
        for user, profile in participants
    ]
    
    return participants_with_profile_status








# Liste des parties que l'utilisateur a cree
@router.get("/user", response_model=List[EnigmatoPartySchema])
async def read_parties_created_by_user_async(db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Filtrer les parties créée par l'utilisateur actuel
    result = await db.execute(
        select(EnigmatoParty)
        .filter(EnigmatoParty.id_user == current_user.id_user)
    )
    parties = result.scalars().all()
    return parties





# Retourne la partie en fonction de son id
@router.get("/{party_id}", response_model=EnigmatoPartySchema)
async def read_party_async(party_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoParty).filter(EnigmatoParty.id_party == party_id))
    party = result.scalar_one_or_none()
    if party is None:
        raise HTTPException(status_code=404, detail="Party not found")
    

    # if party.date_start == datetime.now().date():
    #     result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_party == party_id))
    #     profiles = result.scalars().all()

    #     for profil in profiles:
    #         if not profil.picture1 or not profil.picture2:  # Vérifie si les deux photos sont manquantes
    #             raise HTTPException(status_code=400, detail=f"Les profils ne sont pas completes")


    # # Vérifier si les boxes existent déjà
    #     result = await db.execute(select(EnigmatoBox).filter(EnigmatoBox.id_party == party_id))
    #     boxes = result.scalars().all()

    #     if not boxes:  # Si aucune box n'est trouvée, alors on doit créer les boxes
    #         # Créer les boxes avec la logique décrite

    #         for i in range(party.number_of_box):
    #             box_name = f"Box {i+1}"
    #             box_date = party.date_start + timedelta(days=i)  # On ajoute 1 jour à chaque itération
    #             new_box = EnigmatoBox(
    #                 name=box_name,
    #                 date=box_date,
    #                 id_enigma_user=1,  # ID utilisateur temporaire
    #                 id_party=party.id_party
    #             )
    #             db.add(new_box)

    #         await db.commit()  # Sauvegarder les changements
    #         await db.refresh(party)  # Rafraîchir les données de la partie pour retourner l'état mis à jour

    return party











# Route pour récupérer tous les participants d'une partie ayant complété leur profil

async def get_random_participant_completed_async(
    id_party: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    # Requête pour récupérer les utilisateurs associés à cette partie et dont le profil est complet
    result = await db.execute(
        select(User, EnigmatoProfil)
        .join(EnigmatoProfil, EnigmatoProfil.id_user == User.id_user)
        .filter(EnigmatoProfil.id_party == id_party)
    )
    participants = result.all()

    # Filtrer les participants ayant un profil complet
    completed_participants = [
        EnigmatoParticipantsSchema(
            id_user=user.id_user,
            id_party=id_party,
            id_profil=profile.id_profil,
            name=user.name,
            firstname=user.firstname,
            gender=profile.gender,
            picture2=profile.picture2,
            is_complete=bool(profile.picture1 and profile.picture2)
        )
        for user, profile in participants
        if profile.gender and profile.picture1 and profile.picture2
    ]

    if not completed_participants:
        raise HTTPException(status_code=404, detail="Aucun participant avec un profil complet trouvé pour cette partie.")

    # 3. Récupérer les participants déjà utilisés dans des boîtes pour cette `id_party`
    result_used_participants = await db.execute(
        select(EnigmatoBox.id_enigma_user).filter(EnigmatoBox.id_party == id_party)
    )
    used_participants = {row[0] for row in result_used_participants}  # Ensemble des IDs des utilisateurs déjà utilisés

    # 4. Filtrer les participants pour ne garder que ceux qui n'ont pas encore été utilisés
    available_participants = [p for p in completed_participants if p.id_user not in used_participants]

    if not available_participants:
        raise HTTPException(status_code=409, detail="Tous les participants ont déjà été utilisés pour cette partie.")

    # 5. Sélectionner un participant aléatoire parmi ceux qui n'ont pas encore été utilisés
    selected_participant = random.choice(available_participants)

    return selected_participant



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