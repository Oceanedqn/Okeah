from fastapi import APIRouter, HTTPException, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoProfil, User
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



@router.get("/{id_party}", response_model=EnigmatoProfilSchema)
async def read_profile_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Rechercher un profil en fonction de l'id_party et de l'id_user (profile_id dans ce cas)
    result = await db.execute(
        select(EnigmatoProfil)
        .filter(EnigmatoProfil.id_party == id_party, EnigmatoProfil.id_user == current_user.id_user)
    )
    
    profile = result.scalar_one_or_none()

    # Vérifier si le profil existe
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Retourner le profil trouvé
    return profile




@router.put("/", response_model=EnigmatoProfilSchema)
async def update_profile_async(
    enigmatoProfil: EnigmatoProfilSchema,  # Reçoit l'objet complet du profil dans le corps
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    # Recherche du profil dans la base de données en utilisant l'ID provenant de l'objet
    result = await db.execute(
        select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == enigmatoProfil.id_profil)
    )
    db_profile = result.scalar_one_or_none()

    # Vérifie si le profil existe
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Vérifie si l'utilisateur est autorisé à modifier ce profil
    if db_profile.id_user != current_user.id_user:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    # Met à jour les champs du profil avec les données reçues
    if enigmatoProfil.picture1:
        db_profile.picture1 = enigmatoProfil.picture1  # Enregistre directement la chaîne Base64

    if enigmatoProfil.picture2:
        db_profile.picture2 = enigmatoProfil.picture2  # Enregistre directement la chaîne Base64

    # Mise à jour du champ is_complete : il est à True si picture1 et picture2 sont tous deux présents
    if enigmatoProfil.picture1 and enigmatoProfil.picture2:
        db_profile.is_complete = True
    else:
        db_profile.is_complete = False

    # Commit des modifications dans la base de données
    await db.commit()
    await db.refresh(db_profile)

    return db_profile  # Retourne le profil mis à jour


@router.delete("/{profile_id}", response_model=EnigmatoProfilSchema)
async def delete_profile_async(profile_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoProfil).filter(EnigmatoProfil.id_profil == profile_id))
    db_profile = result.scalar_one_or_none()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    await db.delete(db_profile)
    await db.commit()
    return db_profile




