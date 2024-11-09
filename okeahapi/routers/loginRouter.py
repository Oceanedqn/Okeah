from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from schemas import LoginRequest
from routers.authRouter import create_access_token, verify_password
from database import get_db_async
from sqlalchemy.future import select
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/login",
    tags=['Login']
)

@router.post("/")
async def login_async(request: LoginRequest, response: Response, db: AsyncSession = Depends(get_db_async)):
    result = await db.execute(select(User).where(User.mail == request.email))
    user = result.scalar_one_or_none()
    
    if user is None or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.id_user})

    # Set the access token as a cookie
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite='Lax')

    return JSONResponse(content={"detail": "Login successful"})



# Cookie Parameters Explained
# key: The name of the cookie.
# value: The JWT token.
# httponly=True: This helps mitigate the risk of client-side script accessing the cookie (prevents XSS attacks).
# secure=True: Ensures that the cookie is sent over HTTPS only. Make sure your server is running over HTTPS in production.
# samesite='Lax': Helps protect against CSRF attacks by not sending cookies on cross-origin requests.