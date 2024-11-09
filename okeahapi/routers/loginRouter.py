from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from models import User
from schemas import User as UserSchema
from database import get_db
import bcrypt

router = APIRouter(
    prefix="/login",
    tags=['Login']
)

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.mail == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Vérifiez le mot de passe
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {"message": "Login successful"}