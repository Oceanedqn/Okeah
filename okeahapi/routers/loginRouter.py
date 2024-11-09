from fastapi import APIRouter, Cookie, HTTPException, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from schemas import LoginRequestSchema
from utils.authUtils import create_access_token, verify_password
from database import get_db_async
from sqlalchemy.future import select
from fastapi.responses import JSONResponse


router = APIRouter(
    tags=['Login']
)

# Login Endpoint
@router.post("/login/")
async def login_async(request: LoginRequestSchema, response: Response, db: AsyncSession = Depends(get_db_async)):
    # Fetch user by email
    result = await db.execute(select(User).where(User.mail == request.email))
    user = result.scalar_one_or_none()

    # Validate user and password
    if user is None or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

     # Create the access token
    access_token = create_access_token(data={"sub": user.id_user})

    # Set the access token as a cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production
        samesite='Lax',
        path="/"  # Ensures cookie is accessible across the entire domain
    )
    
    return JSONResponse(content={"detail": "Login successful", "access_token": access_token})

@router.post("/logout/")
async def logout(response: Response, access_token: str = Cookie(None)):

    # Check if access_token is None or invalid
    if access_token is None:
        raise HTTPException(status_code=400, detail="No access token provided")

    # Delete the cookie by setting it with an empty value and an expiration time in the past
    response.set_cookie(
        key="access_token",
        value="",  # Clear the value
        expires=0,  # Expire the cookie immediately
        httponly=True,  # Make sure the cookie cannot be accessed via JavaScript
        secure=False,  # Set to True if using HTTPS
        samesite='Lax',  # SameSite attribute
        path="/"  # Path where the cookie is valid
    )
    
    return JSONResponse(content={"detail": "Logout successful"})


# Cookie Parameters Explained
# key: The name of the cookie.
# value: The JWT access_token.
# httponly=True: This helps mitigate the risk of client-side script accessing the cookie (prevents XSS attacks).
# secure=True: Ensures that the cookie is sent over HTTPS only. Make sure your server is running over HTTPS in production.
# samesite='Lax': Helps protect against CSRF attacks by not sending cookies on cross-origin requests.