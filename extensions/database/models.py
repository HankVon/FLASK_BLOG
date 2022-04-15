from datetime import datetime
from email import message
import email
from itertools import count
from time import time
from click import IntRange
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


class Review(Base):
    '''
        评论表
    '''
    __tablename__ = 'review'

    index = Column(Integer(),autoincrement=True, primary_key=True)
    review=Column(String())
    path = Column(String())
    nickname = Column(String())
    time = Column(String())

class Message(Base):
    '''
        留言表
    '''
    __tablename__ = 'message'

    index = Column(Integer(),autoincrement=True, primary_key=True)
    message=Column(String())
    email = Column(String())
    name = Column(String())
    time = Column(String())

class Note(Base):
    '''
        笔记表
    '''
    __tablename__ = 'note'

    note = Column(String(),primary_key=True)
    content = Column(String())
    sort = Column(String)
    time = Column(String())
    


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