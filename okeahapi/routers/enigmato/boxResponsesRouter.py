from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models import EnigmatoBoxResponse, User
from routers.authRouter import get_current_user_async
from schemas import EnigmatoBoxResponseSchema
from database import get_db_async

router = APIRouter(
    prefix="/enigmato/responses",
    tags=['Enigmato box responses']
)

@router.post("/", response_model=EnigmatoBoxResponseSchema)
async def create_box_response_async(box_response: EnigmatoBoxResponseSchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    data = box_response.model_dump()
    data.update({
        "date": data.get("date") or datetime.now(timezone.utc),
        "id_user": current_user.id_user
    })
    
    db_box_response = EnigmatoBoxResponse(**data)
    print(db_box_response)
    db.add(db_box_response)
    await db.commit()
    await db.refresh(db_box_response)
    return db_box_response

# @router.get("/", response_model=List[EnigmatoBoxResponseSchema])
# async def read_box_responses_by_party_async(id_party: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
#     result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id))
#     box_responses = result.scalars().all()
#     return box_responses

@router.get("/box/{id_box}", response_model=EnigmatoBoxResponseSchema)
async def read_box_response_async(id_box: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    try:
        # Exécution de la requête pour obtenir la réponse de la box par id_box et id_user
        result = await db.execute(
            select(EnigmatoBoxResponse)
            .filter(EnigmatoBoxResponse.id_box == id_box, EnigmatoBoxResponse.id_user == current_user.id_user)
        )
        
        # Obtenir une seule réponse de box, ou None si elle n'existe pas
        box_response = result.scalar_one_or_none()

        # Vérifier si la réponse de box est inexistante
        if box_response is None:
            raise HTTPException(status_code=404, detail="Box response not found")
        
        # Si la réponse est trouvée, la retourner
        return box_response
    except Exception as e:
        # Gérer les erreurs éventuelles et renvoyer une erreur générique ou spécifique
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.put("/{response_id}", response_model=EnigmatoBoxResponseSchema)
async def update_box_response_async(response_id: int, box_response: EnigmatoBoxResponseSchema, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id))
    db_box_response = result.scalar_one_or_none()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    
    # Mise à jour uniquement des champs fournis
    update_data = box_response.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_box_response, key, value)
    
    await db.commit()
    await db.refresh(db_box_response)
    return db_box_response

@router.delete("/{response_id}", response_model=EnigmatoBoxResponseSchema)
async def delete_box_response_async(response_id: int, db: AsyncSession = Depends(get_db_async), current_user: User = Depends(get_current_user_async)):
    # Suppression d'une réponse spécifique
    result = await db.execute(select(EnigmatoBoxResponse).filter(EnigmatoBoxResponse.id_box_response == response_id))
    db_box_response = result.scalar_one_or_none()
    if db_box_response is None:
        raise HTTPException(status_code=404, detail="Box response not found")
    
    await db.delete(db_box_response)
    await db.commit()
    return db_box_response