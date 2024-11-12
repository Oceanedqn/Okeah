from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoParty, EnigmatoProfil, User
from routers.enigmato.partiesRouter import read_party_async
from routers.authRouter import get_current_user_async
from schemas import EnigmatoProfilSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/parties/profiles",
    tags=['Enigmato profiles']
)

# @router.get("/", response_model=List[EnigmatoProfilSchema])
# async def read_profiles_async(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
#     result = await db.execute(select(EnigmatoProfil).offset(skip).limit(limit))
#     profiles = result.scalars().all()
#     return profiles


# [OK] Retourne un profil en fonction de l'id de la party et de l'id de l'user trouvé dans le token
@router.get("/{id_party}", response_model=EnigmatoProfilSchema)
async def read_profile_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Rechercher un profil en fonction de l'id_party et de l'id_user
    result = await db.execute(
        select(EnigmatoProfil)
        .filter(EnigmatoProfil.id_party == id_party, EnigmatoProfil.id_user == current_user.id_user)
    )
    
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile

# [OK] Met à jour le profil de l'utilisateur.
@router.put("/", response_model=EnigmatoProfilSchema)
async def update_profile_async(
    enigmatoProfil: EnigmatoProfilSchema, 
    db: AsyncSession = Depends(get_db_async), 
    current_user: User = Depends(get_current_user_async)
):
    # Recherche du profil dans la base de données en utilisant l'ID provenant de l'objet
    profile = await read_profile_async(enigmatoProfil.id_party, db, current_user)
    party = await read_party_async(enigmatoProfil.id_party, db, current_user)

    # Vérifie si on est avant la start_date de la partie ou si le profil n'est pas complet
    current_date = datetime.now(timezone.utc)

    # Si la date actuelle est avant la date de début de la partie ou si le profil est incomplet, permettre l'update
    if current_date < datetime.combine(party.date_start, datetime.min.time()) or not profile.is_complete:
        # Dictionnaire pour contenir les modifications
        updates = {}

        # Mise à jour des champs uniquement si la valeur est présente
        if enigmatoProfil.gender is not None:
            updates['gender'] = enigmatoProfil.gender

        if enigmatoProfil.picture1:
            updates['picture1'] = enigmatoProfil.picture1  # Enregistre directement la chaîne Base64

        if enigmatoProfil.picture2:
            updates['picture2'] = enigmatoProfil.picture2  # Enregistre directement la chaîne Base64

        # Calcul de l'état "is_complete" basé sur la présence des deux images
        if enigmatoProfil.picture1 and enigmatoProfil.picture2:
            updates['is_complete'] = True
        elif enigmatoProfil.picture1 or enigmatoProfil.picture2:
            updates['is_complete'] = False

        # Mise à jour de l'objet en utilisant le dictionnaire `updates`
        for key, value in updates.items():
            setattr(profile, key, value)

        # Commit des modifications dans la base de données
        await db.commit()
        await db.refresh(profile)

        return profile  # Retourne le profil mis à jour

    else:
        raise HTTPException(
            status_code=403, 
            detail="You cannot update your profile after the start date or if your profile is complete"
        )




# @router.delete("/{profile_id}", response_model=EnigmatoProfilSchema)
# async def delete_profile_async(profile_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
#     result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id))
#     db_profile = result.scalar_one_or_none()
#     if db_profile is None:
#         raise HTTPException(status_code=404, detail="Profile not found")
#     await db.delete(db_profile)
#     await db.commit()
#     return db_profile




