from datetime import datetime
from itertools import count
from time import time
from flask.helpers import total_seconds
from sqlalchemy import (Table, Column, Integer, Float, Numeric, Boolean, \
String, Text, LargeBinary, DateTime, ForeignKey)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import current_date
from sqlalchemy.sql.operators import ColumnOperators
from sqlalchemy.sql.schema import Index
from sqlalchemy.sql.sqltypes import FLOAT, VARCHAR

from . import engine


Base = declarative_base()


class User(Base):
    '''
        用户表
    '''
    __tablename__ = 'user'

    username = Column(String(), primary_key=True)
    password = Column(String())


class Essay(Base):
    '''
        文章表
    '''
    __tablename__ = 'essay'

    essay = Column(String())
    content = Column(String())
    sort = Column(String)
    time = Column(String())
    path = Column(String(), primary_key=True)


# Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)