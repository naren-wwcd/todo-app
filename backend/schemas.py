from pydantic import BaseModel 
from datetime import datetime

class UserCreate(BaseModel):
    username:str
    email:str
    password:str

class UserResponse(BaseModel):
    id:int
    username: str
    email: str
    created_at: datetime
    class Config:
       from_attributes = True

class TaskCreate(BaseModel):
    title:str
    description: str | None = None
    priority: str = "medium" 
    due_date: datetime | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    is_completed: bool
    priority: str
    due_date: datetime | None
    owner_id: int
    created_at: datetime
    class Config:
       from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
class LoginRequest(BaseModel):
    username_or_email: str
    password: str