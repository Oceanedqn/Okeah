from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from routers.authRouter import create_access_token, verify_password
from database import get_db_async
from sqlalchemy.future import select


router = APIRouter(
    prefix="/login",
    tags=['Login']
)

@router.post("/")
async def login_async(email: str, password: str, db: AsyncSession = Depends(get_db_async)):
    # Use .where instead of .filter for the SQLAlchemy query
    result = await db.execute(select(User).where(User.mail == email))
    user = result.scalar_one_or_none()
    
    if user is None or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.id_user})
    return {"access_token": access_token, "token_type": "bearer"}