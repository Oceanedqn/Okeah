# init_db.py
from database import async_engine
from models import Base

async def init_db_async():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)