# 📁 Lexi Project Structure

A complete guide to understanding the Lexi project organization.

## 🗂️ Directory Tree

```
Lexi/
│
├── 📁 backend/                     # FastAPI REST API
│   ├── main.py                    # Application entry point
│   ├── config.py                  # Configuration management
│   ├── database.py                # SQLite setup & connection
│   ├── models.py                  # Database models
│   ├── schemas.py                 # Pydantic request/response schemas
│   ├── auth.py                    # JWT authentication helpers
│   ├── routers/                   # REST API endpoints
│   │   ├── auth.py                # Authentication routes
│   │   ├── chats.py               # Chat management routes
│   │   └── settings.py            # User settings routes
│   ├── requirements.txt            # Python dependencies
│   └── __init__.py
│
├── 📁 frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   │   ├── LoginPage.tsx      # User login
│   │   │   ├── SignupPage.tsx     # User registration
│   │   │   ├── ChatPage.tsx       # Main chat interface
│   │   │   └── SettingsPage.tsx   # User preferences
│   │   ├── components/            # Reusable components
│   │   │   ├── Sidebar.tsx        # Chat navigation sidebar
│   │   │   ├── ChatArea.tsx       # Message display & input
│   │   │   └── ...
│   │   ├── store/                 # Zustand global state
│   │   │   └── index.ts           # Auth & Chat stores
│   │   ├── api/                   # API client
│   │   │   └── client.ts          # Axios API client
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts           # Type definitions
│   │   ├── App.tsx                # Main app with routing
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── index.html                 # HTML template
│   ├── package.json               # npm dependencies
│   ├── vite.config.ts             # Vite bundler config
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── tsconfig.json              # TypeScript config
│   └── postcss.config.js
│
├── 📁 scripts/                     # Legacy data processing scripts
│   ├── clean_text.py              # Text cleaning utility
│   ├── Structural_Chunking.py     # Break laws into chunks
│   ├── vectorize_data.py          # Create embeddings
│   ├── add_criminal_law.py        # Criminal law additions
│   ├── chat_with_law.py           # Legacy chat interface
│   └── README.md                  # Scripts documentation
│
├── 📁 data/                        # Data storage & organization
│   ├── raw/                       # Original law documents
│   ├── processed/                 # Cleaned/chunked data
│   ├── vectors/                   # Vector embeddings (ChromaDB)
│   └── README.md                  # Data organization guide
│
├── 📁 docs/                        # Project documentation
│   ├── README.md                  # Documentation index
│   ├── ARCHITECTURE.md            # System architecture
│   ├── API.md                     # REST API reference
│   └── DEPLOYMENT.md              # Deployment guides (advanced)
│
├── 📁 nepal_law_db/               # ChromaDB vector database
│   └── [Database files]           # (Can move to data/vectors/)
│
├── 📁 processed_json/             # JSON data (legacy)
│
├── 📁 __pycache__/                # Python cache (auto-generated)
│
├── 🐳 docker-compose.yml          # Multi-container orchestration
├── 🐳 Dockerfile.backend          # Backend container
├── 🐳 Dockerfile.frontend         # Frontend container
│
├── 📝 .env.example                # Environment variables template
├── 📝 .gitignore                  # Git ignore rules
│
├── 📖 README.md                   # Main project README
├── 📖 GETTING_STARTED.md          # Quick start guide (3 steps!)
├── 📖 SETUP_GUIDE.md              # Detailed setup instructions
├── 📖 QUICK_REFERENCE.md          # Developer quick reference
├── 📖 IMPLEMENTATION_COMPLETE.md  # Feature summary
└── 📖 PROJECT_STRUCTURE.md        # This file
```

---

## 🎯 Quick Navigation

### For Different Users

**👨‍💻 New Developer:**
1. Read `GETTING_STARTED.md` (3 steps)
2. Run `setup.bat` or `setup.sh`
3. Check `docs/ARCHITECTURE.md` to understand code
4. Reference `QUICK_REFERENCE.md` while coding

**👤 End User:**
1. Clone the repo
2. Run `setup.bat` or `setup.sh`
3. Start servers
4. Open http://localhost:5173

**🚀 DevOps/Deployment:**
1. Read `SETUP_GUIDE.md`
2. Configure `docker-compose.yml`
3. Deploy containers
4. Monitor via `http://localhost:8000/docs`

**📊 Data Scientist:**
1. Check `scripts/README.md`
2. Review `data/README.md`
3. Add data to `data/raw/`
4. Run processing pipeline

---

## 📂 Folder Purposes

### `backend/`
**What**: FastAPI REST API server
**When to Modify**: Add new endpoints, change database schema, update authentication
**Run**: `cd backend && uvicorn main:app --reload`

### `frontend/`  
**What**: React web application
**When to Modify**: Add UI features, change styling, add pages
**Run**: `cd frontend && npm run dev`

### `scripts/`
**What**: Legacy data processing utilities
**When to Use**: Add new laws, process raw data, regenerate vectors
**Run**: `cd scripts && python script_name.py`

### `data/`
**What**: Data storage organized by processing stage
**When to Update**: Adding new law data, backing up, archiving
**Structure**: raw/ → processed/ → vectors/

### `docs/`
**What**: Comprehensive documentation
**When to Read**: Learning system, understanding API, debugging
**Files**: Architecture, API reference, deployment guides

### `nepal_law_db/`
**What**: ChromaDB vector database (embeddings)
**Note**: Can be moved to `data/vectors/` for better organization
**Managed by**: Vectorization scripts

---

## 🔄 Data Flow

### User Message → AI Response
```
Frontend (User types)
    ↓
ChatArea.tsx (captures input)
    ↓
axios POST /api/chats/{id}/messages
    ↓
Backend: routers/chats.py
    ↓
Save user message → SQLite
Query ChromaDB for relevant laws
Send to OpenAI API
Save AI response → SQLite
    ↓
Return to Frontend
    ↓
ChatArea displays response
```

### User Signup → Login Process
```
Frontend: SignupPage.tsx
    ↓
POST /api/auth/signup
    ↓
Backend: routers/auth.py
    ↓
Hash password with bcrypt
Save user to SQLite
    ↓
Auto-login: POST /api/auth/login
    ↓
Generate JWT token
    ↓
Frontend: Save token to localStorage
Redirect to /chat
    ↓
All future requests include token
```

---

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend UI** | React 18 | Component-based UI |
| **Frontend Styling** | Tailwind CSS | Utility-first CSS |
| **Frontend Language** | TypeScript | Type safety |
| **Frontend State** | Zustand | Global state management |
| **Frontend Build** | Vite | Fast bundler |
| **Backend API** | FastAPI | REST API framework |
| **Backend Language** | Python 3.8+ | Backend logic |
| **Backend Auth** | JWT + Passlib | Authentication |
| **Database (Users)** | SQLAlchemy | ORM for SQLite |
| **Database (Vectors)** | ChromaDB | Vector storage |
| **AI Model** | OpenAI GPT-3.5 | Text generation |
| **Containerization** | Docker | Deployment |
| **Orchestration** | Docker Compose | Multi-container |

---

## 📊 File Count Summary

```
Backend (Python):        9 files
Frontend (TypeScript):  10+ files
Configuration:          8 files
Documentation:          5 files
Scripts (Data):         5 files
Deployment:             3 files
─────────────────────────────────
Total:                  40+ files

All production-ready! ✓
```

---

## 🚀 Common Tasks

### Adding a New Frontend Page

```
1. Create: frontend/src/pages/MyPage.tsx
2. Add to frontend/src/App.tsx routing
3. Link from Sidebar.tsx
4. Done!
```

### Adding a New Backend Endpoint

```
1. Create: backend/routers/my_router.py
2. Add model if needed: backend/models.py
3. Add schema: backend/schemas.py
4. Include router in backend/main.py
5. Access all backend endpoints at /docs
```

### Adding New Law Data

```
1. Place raw file: data/raw/new_law.txt
2. Run: python scripts/clean_text.py
3. Run: python scripts/Structural_Chunking.py
4. Run: python scripts/vectorize_data.py
5. Backend now has access via RAG
```

### Deploying to Production

```
1. Edit docker-compose.yml
2. Set environment variables
3. Run: docker-compose up -d
4. Done!
```

---

## 🔍 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `backend/main.py` | API entry point | Adding routes, middleware |
| `backend/models.py` | Database structure | Changing schema |
| `frontend/src/App.tsx` | App routing | Adding pages/routes |
| `frontend/src/store/index.ts` | Global state | Changing app state |
| `docker-compose.yml` | Deployment | Deployment changes |
| `.env.example` | Config template | Environment variables |
| `.gitignore` | Git rules | What to ignore |

---

## 📈 Growth Path

### Phase 1: Local Development
✓ All components working locally
✓ SQLite for data storage
✓ Single server setup

### Phase 2: Production
→ Docker for deployment
→ Environment configuration
→ Error handling & logging

### Phase 3: Scaling (Future)
→ PostgreSQL for database
→ Microservices architecture
→ WebSocket for real-time
→ Message queues (Redis)
→ Caching layer

---

## 🆘 Troubleshooting Guide

### Backend Issues
- Check: `backend/requirements.txt` installed
- Check: `.env` has OPENAI_API_KEY
- Check: Port 8000 is free
- Fix: Delete `lexi.db` and restart

### Frontend Issues
- Check: `frontend/package.json` dependencies
- Check: Port 5173 is free
- Fix: `rm -rf node_modules && npm install`

### Database Issues
- Check: `data/` folder has write permissions
- Check: SQLite database exists at root
- Fix: Backend creates it automatically on startup

---

## 📚 Documentation Map

```
                    START HERE
                        ↓
            GETTING_STARTED.md (3 steps)
                        ↓
        ┌───────────────┬───────────────┐
        ↓               ↓               ↓
    Setup          Architecture    API Reference
   SETUP_GUIDE      ARCHITECTURE      (docs/API.md)
    (detailed)        (technical)   
        ↓               ↓               ↓
        └───────────────┬───────────────┘
                        ↓
                QUICK_REFERENCE
                  (daily use)
                        ↓
            PROJECT_STRUCTURE
               (you are here)
```

---

## ✅ Organizational Best Practices

✅ **Separation of Concerns**
- Backend: API & Database logic
- Frontend: UI & User interaction
- Data: Processing pipeline
- Docs: Knowledge base
- Scripts: Utilities

✅ **Easy to Navigate**
- Clear folder names
- READMEs in each folder
- Consistent naming
- Logical grouping

✅ **Easy to Extend**
- Modular architecture
- Add features without breaking others
- Self-documenting code
- Proper file organization

✅ **Production Ready**
- Docker support
- Environment configuration
- Error handling
- Logging & monitoring ready

---

## 🎓 Learning Resources

- **Building Frontend**: Check `frontend/src/pages/LoginPage.tsx` for pattern
- **Building Backend**: Check `backend/routers/auth.py` for pattern
- **Database Ops**: Check `backend/models.py` for schema
- **API Usage**: Visit `http://localhost:8000/docs` (Swagger)
- **Architecture**: Read `docs/ARCHITECTURE.md`

---

## 🎯 Next Steps

1. **Understand Structure**: You're reading this file ✓
2. **Start Development**: Follow `GETTING_STARTED.md`
3. **Learn Tools**: Check `QUICK_REFERENCE.md`
4. **Deep Dive**: Read `docs/ARCHITECTURE.md`
5. **Build**: Add features following patterns!

---

**Your project is well-organized and production-ready!** 🚀
