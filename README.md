# Todo App — Full-Stack Task Manager

A full-stack to-do list application with JWT authentication, built to practice production-grade patterns: secure auth, ownership-based data access, and a clean separation between API and frontend.

**Live demo:** _add link here once deployed_

## Tech Stack

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- Supabase (PostgreSQL)
- JWT authentication (`python-jose`)
- Password hashing (`passlib` + bcrypt)

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

## Features

- User registration and login (supports login via username **or** email)
- JWT-based authentication with protected API routes
- Full task CRUD — create, read, update, delete
- Toggle task completion status
- Tasks are scoped per user — users can only access their own data, enforced at the database query level
- Protected frontend routes — unauthenticated users are redirected to login
- Persistent sessions via token storage

## Screenshots

_Add a screenshot of the Tasks page and Login page here_

## Project Structure

```
todo-app/
├── backend/
│   ├── main.py          # API routes
│   ├── models.py        # SQLAlchemy models (User, Task)
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── auth.py           # Password hashing, JWT creation/verification
│   ├── database.py       # DB connection and session management
│   └── .env               # Environment variables (not committed)
└── frontend/
    └── src/
        ├── api/client.js         # Axios instance with auto-attached auth header
        ├── components/
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Tasks.jsx
```

## Getting Started

### Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary "passlib[bcrypt]" python-jose pydantic python-dotenv
```

Create a `.env` file in `backend/`:
```
DATABASE_URL=postgresql://<your-supabase-connection-string>
SECRET_KEY=<a-random-secret-key>
```

Run the server:
```bash
python -m uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

## Architecture Notes

- **Auth**: passwords are hashed with bcrypt before storage; JWTs are signed with a secret key and expire after 30 minutes. A `get_current_user` dependency decodes the token on every protected request and resolves it to the authenticated user.
- **Ownership enforcement**: every task query filters by `owner_id == current_user.id`, and update/delete routes explicitly check ownership before allowing changes — preventing users from accessing or modifying each other's data even if they guess a task ID.
- **Frontend auth flow**: on login, the JWT is stored in `localStorage` and automatically attached to outgoing requests via an Axios interceptor. A `ProtectedRoute` wrapper component checks for a valid token before rendering protected pages, redirecting to `/login` otherwise.

## What I Learned

Built as a hands-on project to practice full-stack authentication patterns — JWT issuance/verification, password hashing, ownership-based authorization, and wiring a React frontend to a FastAPI backend with proper token handling and protected routing.
