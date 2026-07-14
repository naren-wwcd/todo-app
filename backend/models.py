from sqlalchemy import Column,Integer,String,DateTime,ForeignKey,Boolean
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    username=Column(String,unique=True,index=True,nullable=False)
    email=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    tasks = relationship("Task", back_populates="owner")
class Task(Base):
    __tablename__ = "tasks"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String,nullable=False)
    description=Column(String,nullable=True)
    is_completed=Column(Boolean,default=False)
    priority=Column(String,default="medium")
    due_date=Column(DateTime,nullable=True)
    owner_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    created_at=Column(DateTime, server_default=func.now())
    owner = relationship("User", back_populates="tasks")