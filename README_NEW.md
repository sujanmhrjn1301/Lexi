# 🚀 Lexi - Nepal's Legal AI Assistant

A complete, production-ready full-stack application providing intelligent legal assistance powered by AI. Built with modern technologies and designed for easy local setup and deployment.

> **Similar to OpenWebUI** but specifically designed for Nepal's legal system with user authentication, chat history, and beautiful interface.

---

## ✨ Features

### 🎨 User Interface
- ✅ Beautiful, responsive design
- ✅ Sign up & login system
- ✅ Chat history sidebar with search
- ✅ Real-time AI responses
- ✅ User settings (theme, language, notifications)
- ✅ Profile management

### 🤖 AI & Backend
- ✅ RAG (Retrieval-Augmented Generation) with chromaDB
- ✅ OpenAI GPT-3.5 integration
- ✅ Semantic search over law database
- ✅ JWT authentication with secure passwords
- ✅ Full message history persistence
- ✅ FastAPI REST API with auto-documentation

### 📦 Deployment
- ✅ Docker containerization
- ✅ Docker Compose setup (one command start!)
- ✅ Environment configuration
- ✅ Automatic setup scripts
- ✅ Production-ready code

---

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Clone & Setup Environment
```bash
git clone <your-repo-url>
cd Lexi
cp .env.example .env

# Add your OpenAI API Key to .env
# OPENAI_API_KEY=sk-...
```

### Step 2: Run Setup Script
**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
bash setup.sh
```

### Step 3: Start Servers
**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 and start using Lexi! 🎉

---

## 📁 Project Organization

```
Lexi/
├── backend/              # FastAPI REST API
├── frontend/             # React + TypeScript UI
├── scripts/              # Legacy data processing
├── data/                 # Data organization (raw, processed, vectors)
├── docs/                 # Comprehensive documentation
├── docker-compose.yml    # One-command Docker setup
└── [Setup files & documentation]
```

📍 **First time?** Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for complete folder guide.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | 👈 Quick start guide |
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Folder organization |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Detailed instructions |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Developer reference |
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Technical architecture |
| **[docs/API.md](./docs/API.md)** | REST API documentation |

---

## 🐳 Docker (Easiest)

Want everything running with one command? Use Docker!

```bash
# Ensure .env is configured with OPENAI_API_KEY

# Build and start everything
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────┐
│     React Frontend (Localhost:5173)     │
│  ├─ Login/Signup Pages                  │
│  ├─ Chat Interface with Sidebar         │
│  ├─ Settings & Profile                  │
│  └─ Zustand Global State Management     │
└──────────────────┬──────────────────────┘
                   │ HTTP/API
                   ↓
┌─────────────────────────────────────────┐
│    FastAPI Backend (Localhost:8000)     │
│  ├─ User Authentication (JWT)           │
│  ├─ Chat Management                     │
│  ├─ Message Handling                    │
│  └─ RAG Integration                     │
├─ SQLite Database (Users, Chats, Msgs)   │
├─ ChromaDB Vector Store (Law Embeddings) │
└─ OpenAI API Connection                  │
```

---

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Zustand (state management)
- Vite (bundler)

**Backend:**
- FastAPI
- SQLAlchemy (ORM)
- ChromaDB (vectors)
- OpenAI API

**DevOps:**
- Docker & Compose
- Environment-based config

---

## 📱 Browser Support

✅ Chrome, Edge, Firefox, Safari
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔑 API Endpoints

```
Authentication:
  POST   /api/auth/signup           Register
  POST   /api/auth/login            Login & get token
  GET    /api/auth/me               Current user
  POST   /api/auth/logout           Logout

Chats:
  POST   /api/chats                 Create chat
  GET    /api/chats                 List chats
  GET    /api/chats/{id}            Get chat
  PUT    /api/chats/{id}            Update chat
  DELETE /api/chats/{id}            Delete chat

Messages:
  POST   /api/chats/{id}/messages   Send message
  GET    /api/chats/{id}/messages   Get messages

Settings:
  GET    /api/users/{id}/settings   Get settings
  PUT    /api/users/{id}/settings   Update settings
```

📖 **Full API docs available at:** `http://localhost:8000/docs` (Swagger UI)

---

## 🗄️ Database Schema

### Users
```
id, username, email, password_hash, full_name, is_active, created_at, updated_at
```

### Chats
```
id, user_id, title, description, is_archived, created_at, updated_at
```

### Messages
```
id, chat_id, user_id, content, role (user/assistant), created_at
```

### UserSettings
```
id, user_id, theme, language, notifications_enabled, updated_at
```

---

## 🛠️ Development

### Adding a Feature

**Frontend:**
1. Create component in `frontend/src/components/`
2. Add page in `frontend/src/pages/`
3. Update `frontend/src/App.tsx` routing
4. Update `frontend/src/store/` if needed

**Backend:**
1. Add model in `backend/models.py`
2. Add schema in `backend/schemas.py`
3. Create router in `backend/routers/`
4. Include router in `backend/main.py`

### Running Tests

```bash
# API docs test
http://localhost:8000/docs

# Frontend component testing
npm run test  # (to be added)
```

---

## 📝 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Optional
SECRET_KEY=random-key-here
DATABASE_URL=sqlite:///./lexi.db
VECTOR_DB_PATH=./nepal_law_db
```

---

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Cloud Platforms
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Backend:** Railway, Heroku, AWS EC2, DigitalOcean
- **Database:** AWS RDS, Cloud SQL, Railway

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Delete database and restart
rm lexi.db
```

### Frontend won't connect to backend
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS settings in backend/main.py
```

### OpenAI API errors
```bash
# Verify API key in .env
echo $OPENAI_API_KEY

# Test in backend logs
```

---

## 📖 Learning Resources

- **Frontend Architecture:** Check `frontend/src/App.tsx`
- **Backend Architecture:** Check `backend/main.py`
- **Database Models:** Check `backend/models.py`
- **API Examples:** Visit `http://localhost:8000/docs`

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push: `git push origin feature/my-feature`
4. Create Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for Nepal's legal system
- UI inspired by OpenWebUI
- Powered by OpenAI, LangChain, and ChromaDB

---

## 📞 Support

- 📖 Check documentation files
- 🔍 View API docs at `/docs`
- 💬 Check GitHub issues
- 🐛 Report bugs with detailed steps

---

## ✅ Status

- ✅ Backend: Complete & Production-Ready
- ✅ Frontend: Complete & Production-Ready
- ✅ Documentation: Comprehensive
- ✅ Docker: Fully Configured
- ✅ Ready to Deploy: YES!

---

**Made with ❤️ in Nepal** 🇳🇵

**Start chatting with your AI legal assistant now!** 🚀

For detailed instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)
