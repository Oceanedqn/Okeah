from datetime import date
import random
from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import EnigmatoBox, User
from routers.enigmato.partiesRouter import get_participants_completed_async
from routers.enigmato.profilesRouter import read_profile_by_id_async
from schemas import EnigmatoBoxWithResponseSchema
from routers.authRouter import get_current_user_async
from database import get_db_async



# [BOX] Methode pour créer une nouvelle box en ne prenant que les participants non utilisés
async def get_random_participant_completed_to_create_box_async(
    id_party: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    completed_participants = await get_participants_completed_async(id_party, db, current_user)

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


import random
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

async def get_random_participants_completed_async(
    id_party: int,
    db: AsyncSession = Depends(get_db_async),
    current_user: User = Depends(get_current_user_async)
):
    # Étape 1 : Récupérer tous les participants complets pour la partie
    completed_participants = await get_participants_completed_async(id_party, db, current_user)

    if not completed_participants:
        raise HTTPException(status_code=404, detail="Aucun participant avec un profil complet trouvé pour cette partie.")

    today_box = await read_today_box_in_game_with_response_async(id_party, db, current_user)
    correct_profil = await read_profile_by_id_async(id_party, today_box.id_enigma_user, db, current_user)
    
    # Étape 3 : Sélectionner 6 participants
    # Diviser les participants par genre
    same_gender_participants = [p for p in completed_participants if p.gender == correct_profil.gender]
    other_gender_participants = [p for p in completed_participants if p.gender != correct_profil.gender]

    # Retirer le participant correct des listes
    same_gender_participants = [p for p in same_gender_participants if p != correct_profil]
    other_gender_participants = [p for p in other_gender_participants if p != correct_profil]

    # Sélectionner aléatoirement les participants, en privilégiant le même genre
    chosen_participants = [correct_profil]
    
    # Sélectionner du même genre si suffisamment de participants
    if len(same_gender_participants) >= 3:
        chosen_participants += random.sample(same_gender_participants, 3)
    else:
        chosen_participants += same_gender_participants
        remaining_needed = 6 - len(chosen_participants)

        # Vérifier que remaining_needed ne dépasse pas la taille de other_gender_participants
        remaining_needed = min(remaining_needed, len(other_gender_participants))

        # Sélectionner les participants restants du genre opposé
        if remaining_needed > 0:
            chosen_participants += random.sample(other_gender_participants, remaining_needed)

    # Si il n'y a pas assez de participants, afficher simplement tous ceux disponibles
    if len(chosen_participants) < 6:
        return chosen_participants

    # Retourner la liste finale de participants choisis (6 en tout)
    return chosen_participants


# Retourne la box complete avec la reponse du participant
async def read_today_box_in_game_with_response_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Récupération de l'énigme d'aujourd'hui
    result = await db.execute(
        select(EnigmatoBox)
        .where(EnigmatoBox.id_party == id_party, EnigmatoBox.date == date.today())
    )

    today_box = result.scalars().one()
    
    if today_box is None:
        raise HTTPException(status_code=404, detail="Box not found")

    return EnigmatoBoxWithResponseSchema(
        id_box=today_box.id_box,
        id_party=today_box.id_party,
        name=today_box.name,
        date=today_box.date,
        id_enigma_user=today_box.id_enigma_user
    )