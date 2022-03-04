from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    'sqlite:///extensions/database/blog.db',
    pool_pre_ping = True
)

DBSession = sessionmaker(bind=engine)