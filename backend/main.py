from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from models import User, Task
from schemas import UserCreate, UserResponse, Token, LoginRequest, TaskCreate, TaskResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from sqlalchemy import or_
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register",response_model=UserResponse)
def register(user:UserCreate,db: Session = Depends(get_db)):
    ex_user=db.query(User).filter(User.username==user.username).first()
    if ex_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hpass=hash_password(user.password)
    new_user=User(username=user.username,email=user.email,hashed_password=hpass)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=Token)
def login(user: LoginRequest, db: Session = Depends(get_db)):
    ex_user = db.query(User).filter(
        or_(User.username == user.username_or_email, User.email == user.username_or_email)
    ).first()
    if not ex_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(user.password, ex_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": ex_user.username})
    return {"access_token": token, "token_type": "bearer"}
@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_task=Task(title=task.title,description=task.description,priority=task.priority,due_date=task.due_date,owner_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ex_task=db.query(Task).filter(Task.owner_id==current_user.id).all()
    return ex_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ex_task=db.query(Task).filter(Task.id==task_id).first()
    if not ex_task:
        raise HTTPException(404, "Task not found")
    if ex_task.owner_id!=current_user.id:
        raise HTTPException(403, "Not authorized to update this task")
    ex_task.title = task_update.title
    ex_task.description = task_update.description
    ex_task.priority = task_update.priority
    ex_task.due_date = task_update.due_date
    db.commit()
    db.refresh(ex_task)
    return ex_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ex_task=db.query(Task).filter(Task.id==task_id).first()
    if not ex_task:
        raise HTTPException(404, "Task not found")
    if ex_task.owner_id!=current_user.id:
        raise HTTPException(403, "Not authorized to update this task")
    db.delete(ex_task)
    db.commit()
    return {"detail": "Task deleted successfully"}

@app.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ex_task=db.query(Task).filter(Task.id==task_id).first()
    if not ex_task:
        raise HTTPException(404, "Task not found")
    if ex_task.owner_id!=current_user.id:
        raise HTTPException(403, "Not authorized to update this task")
    ex_task.is_completed = not ex_task.is_completed
    db.commit()
    db.refresh(ex_task)
    return ex_task