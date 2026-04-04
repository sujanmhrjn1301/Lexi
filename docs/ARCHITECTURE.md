# Lexi Project Architecture

## System Overview

```
User Browser
    ↓
Frontend (React + TypeScript)
    ↓ (HTTP/API)
Backend (FastAPI)
    ↓
├── SQLite Database (Users, Chats, Messages)
├── ChromaDB Vector Store (Law embeddings)
└── OpenAI API (GPT-3.5 responses)
```

## Project Structure

### Frontend (`/frontend`)
```
src/
├── pages/              # Page components
│   ├── LoginPage       # Authentication
│   ├── SignupPage      # Registration
│   ├── ChatPage        # Main interface
│   └── SettingsPage    # User settings
├── components/         # Reusable components
│   ├── Sidebar         # Chat navigation
│   └── ChatArea        # Message display
├── store/              # Global state (Zustand)
├── api/                # HTTP client (Axios)
├── types/              # TypeScript definitions
└── App.tsx             # Routing & main app
```

**Key Stack:**
- React 18 with Hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Zustand for state management
- Axios for HTTP

### Backend (`/backend`)
```
├── main.py             # FastAPI app
├── models.py           # Database models
├── schemas.py          # Request/response types
├── auth.py             # JWT authentication
├── config.py           # Configuration
├── database.py         # Database setup
└── routers/            # API endpoints
    ├── auth.py         # Auth routes
    ├── chats.py        # Chat routes
    └── settings.py     # Settings routes
```

**Key Stack:**
- FastAPI for REST API
- SQLAlchemy ORM
- JWT for authentication
- LangChain + ChromaDB for RAG
- OpenAI for LLM

### Data Layer (`/data`)
```
raw/                   # Original law data
processed/             # Cleaned/chunked data
vectors/               # Vector embeddings (ChromaDB)
```

### Scripts (`/scripts`)
```
Legacy data processing scripts:
- clean_text.py            # Text normalization
- Structural_Chunking.py   # Break into chunks
- vectorize_data.py        # Create embeddings
- add_criminal_law.py      # Add criminal laws
```

## Data Flow

### User Creating Chat
```
1. User types message in ChatArea
2. Frontend sends POST /api/chats/{id}/messages
3. Backend saves user message to SQLite
4. Backend retrieves context from ChromaDB
5. Backend sends query to OpenAI
6. Backend saves AI response to SQLite
7. Frontend displays conversation
```

### User Authentication
```
1. Frontend sends POST /api/auth/signup
2. Backend hashes password with bcrypt
3. Backend stores user in SQLite
4. Frontend receives JWT token
5. Frontend stores token in localStorage
6. All future requests include token
```

### Chat History Load
```
1. Frontend mounts ChatPage
2. Requests GET /api/chats/{id}/messages
3. Backend queries SQLite
4. Returns all messages for chat
5. Frontend displays in order
```

## Database Schema

### Users Table
```
id (PK)
username (unique)
email (unique)
password_hash
full_name
is_active
created_at
updated_at
```

### Chats Table
```
id (PK)
user_id (FK)
title
description
is_archived
created_at
updated_at
```

### Messages Table
```
id (PK)
chat_id (FK)
user_id (FK)
content
role (user/assistant/system)
created_at
```

### UserSettings Table
```
id (PK)
user_id (FK, unique)
theme (light/dark)
language
notifications_enabled
updated_at
```

## API Structure

### Authentication Endpoints
```
POST   /api/auth/signup              # Register
POST   /api/auth/login               # Login
GET    /api/auth/me                  # Get user
POST   /api/auth/logout              # Logout
```

### Chat Endpoints
```
POST   /api/chats                    # Create
GET    /api/chats                    # List
GET    /api/chats/{id}               # Get
PUT    /api/chats/{id}               # Update
DELETE /api/chats/{id}               # Delete
```

### Message Endpoints
```
POST   /api/chats/{id}/messages      # Send (with AI)
GET    /api/chats/{id}/messages      # Get all
```

### Settings Endpoints
```
GET    /api/users/{id}/settings      # Get
PUT    /api/users/{id}/settings      # Update
```

## State Management

### Frontend (Zustand)
```typescript
useAuthStore {
  user, token, isLoading
  setUser, setToken, logout
}

useChatStore {
  chats, currentChat, messages
  setChats, setCurrentChat, addMessage
}
```

All state is client-side. Backend is source of truth for persistence.

## Security Measures

✅ **Password**: Hashed with bcrypt (not stored plaintext)
✅ **Tokens**: JWT with expiration (30 min default)
✅ **CORS**: Enabled only for allowed origins
✅ **Auth**: All endpoints except signup/login require token
✅ **Isolation**: Users can only see their own chats
✅ **Environment**: Sensitive keys in .env (not in code)

## Performance Considerations

- **Vector Search**: ChromaDB indexes for fast semantic search
- **API Caching**: Token-based auth cached in localStorage
- **Database**: SQLite for single-server, can upgrade to PostgreSQL
- **Frontend**: Vite for fast bundling, React for efficient rendering
- **Message Streaming**: Can add WebSocket for real-time updates

## Deployment Architecture

### Local Development
```
Frontend (Vite Dev Server)  → Backend (Uvicorn) → SQLite + ChromaDB
```

### Docker/Production
```
Frontend Container (Node)  ←→  Backend Container (Python) ← ChromaDB Volume
    ↓                                ↓
  Port 5173                        Port 8000
```

### Cloud Deployment
```
Frontend (Vercel/Netlify)  → Backend (Railway/Heroku) → PostgreSQL + S3
```

## Technology Choices

| Choice | Alternative | Why |
|--------|-------------|-----|
| React | Vue/Angular | Large ecosystem, learning resources |
| TypeScript | JavaScript | Type safety, better DX |
| FastAPI | Django/Flask | Speed, async, automatic docs |
| SQLite | PostgreSQL | Easy local setup, no external DB |
| Tailwind | Bootstrap/MaterialUI | Utility-first, smaller bundle |
| Zustand | Redux/Context | Minimal, easy to learn |
| ChromaDB | Pinecone/Weaviate | Open source, local, no API key |

## Future Architecture Improvements

- [ ] WebSocket for real-time chat
- [ ] Message queue (Redis) for async tasks
- [ ] PostgreSQL for production
- [ ] S3/Cloud storage for backups
- [ ] Kafka for event streaming
- [ ] Microservices for search, NLP
- [ ] GraphQL for flexible queries
- [ ] Rate limiting & monitoring

## Development Workflow

1. **Feature Branch**: Create from `main`
2. **Local Dev**: Run setup script
3. **Changes**: Frontend + Backend
4. **Testing**: Manual + automated
5. **PR**: Code review
6. **Deploy**: Docker → Production

## Monitoring & Debugging

**Backend Debugging:**
- Check `/docs` endpoint (Swagger UI)
- Review logs in terminal
- Use SQLite CLI to inspect database

**Frontend Debugging:**
- Browser DevTools Console
- React DevTools extension
- Network tab to inspect API calls

**Production Monitoring:**
- Sentry for error tracking
- New Relic for performance
- CloudWatch for logs
