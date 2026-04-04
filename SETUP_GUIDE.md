# Lexi - Nepal's Legal AI Assistant (Full Stack)

A modern full-stack application providing intelligent legal assistance for Nepal's laws with user authentication, chat history, and a beautiful OpenWebUI-inspired interface.

## 🎯 Features

### Backend Features
- ✅ **FastAPI Backend** - Modern, fast REST API
- ✅ **User Authentication** - JWT-based auth with secure password hashing
- ✅ **Chat Management** - Create, update, delete chats
- ✅ **Message History** - Full message persistence and retrieval
- ✅ **RAG Integration** - Retrieval-Augmented Generation with ChromaDB
- ✅ **Vector Search** - Semantic search over Nepali laws
- ✅ **SQLite Database** - Local database for easy setup

### Frontend Features
- ✨ **Modern React UI** - Built with React 18 + TypeScript
- 🎨 **Tailwind CSS** - Beautiful, responsive design
- 🔐 **Authentication Pages** - Signup and Login
- 💬 **Chat Interface** - Real-time conversation with AI
- 📱 **Responsive Sidebar** - Chat history with search
- 👤 **User Profile** - Settings and preferences
- 🎭 **Theme Support** - Light and dark mode
- 💾 **State Management** - Zustand for global state

## 📦 Project Structure

```
Lexi/
├── backend/                          # FastAPI backend
│   ├── main.py                      # Main application
│   ├── config.py                    # Configuration
│   ├── database.py                  # Database setup
│   ├── models.py                    # SQLAlchemy models
│   ├── auth.py                      # Authentication helpers
│   ├── schemas.py                   # Pydantic schemas
│   ├── routers/                     # API endpoints
│   │   ├── auth.py                 # Auth routes
│   │   ├── chats.py                # Chat routes
│   │   └── settings.py             # Settings routes
│   └── requirements.txt
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── components/             # Reusable components
│   │   │   ├── Sidebar.tsx
│   │   │   └── ChatArea.tsx
│   │   ├── store/                  # Zustand stores
│   │   ├── api/                    # API client
│   │   ├── types/                  # TypeScript types
│   │   ├── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── nepal_law_db/                    # ChromaDB vector database
├── docker-compose.yml               # Multi-container setup
├── Dockerfile.backend
├── Dockerfile.frontend
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- OpenAI API Key

### Option 1: Local Development (Recommended)

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Lexi
```

#### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows
# or
source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API Key
# OPENAI_API_KEY=your_key_here

# Initialize database
cd backend
python -c "from database import init_db; init_db()"

# Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Option 2: Docker Compose (Production-like)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API Key
# OPENAI_API_KEY=your_key_here

# Start both services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Signup**: Create new account with username, email, and password
2. **Login**: Get JWT access token
3. **Protected Routes**: All API endpoints (except signin/signup) require valid token
4. **Auto-logout**: Invalid tokens automatically redirect to login

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup              # Register new user
POST   /api/auth/login               # Login and get token
GET    /api/auth/me                  # Get current user
POST   /api/auth/logout              # Logout
```

### Chats
```
POST   /api/chats                    # Create new chat
GET    /api/chats                    # List all chats
GET    /api/chats/{chat_id}          # Get specific chat
PUT    /api/chats/{chat_id}          # Update chat
DELETE /api/chats/{chat_id}          # Delete chat
```

### Messages
```
POST   /api/chats/{chat_id}/messages    # Send message
GET    /api/chats/{chat_id}/messages    # Get all messages
```

### Settings
```
GET    /api/users/{user_id}/settings    # Get user settings
PUT    /api/users/{user_id}/settings    # Update settings
```

### Health Check
```
GET    /                              # Welcome message
GET    /health                        # Health check
GET    /docs                          # Swagger UI
```

## 🔧 Configuration

### Backend Configuration (.env)
```env
# API
OPENAI_API_KEY=your_openai_api_key

# Security
SECRET_KEY=your-secret-key-change-in-production

# Database
DATABASE_URL=sqlite:///./lexi.db

# Vector Database
VECTOR_DB_PATH=./nepal_law_db
```

### Frontend Configuration
The frontend automatically connects to the backend using proxy configured in `vite.config.ts`.

## 📊 Database Schema

### Users Table
```sql
users (
  id: Integer (PK),
  username: String (Unique),
  email: String (Unique),
  password_hash: String,
  full_name: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
)
```

### Chats Table
```sql
chats (
  id: Integer (PK),
  user_id: Integer (FK),
  title: String,
  description: Text,
  is_archived: Boolean,
  created_at: DateTime,
  updated_at: DateTime
)
```

### Messages Table
```sql
messages (
  id: Integer (PK),
  chat_id: Integer (FK),
  user_id: Integer (FK),
  content: Text,
  role: String (user/assistant/system),
  created_at: DateTime
)
```

### User Settings Table
```sql
user_settings (
  id: Integer (PK),
  user_id: Integer (FK, Unique),
  theme: String (light/dark),
  language: String,
  notifications_enabled: Boolean,
  updated_at: DateTime
)
```

## 🎨 Frontend Architecture

### State Management
- **useAuthStore**: User authentication and session
- **useChatStore**: Chat and message state

### Components
- **Sidebar**: Navigation and chat history
- **ChatArea**: Message display and input
- **Pages**: Login, Signup, Chat, Settings

### Styling
- Tailwind CSS for utility-first styling
- Responsive design for all screen sizes
- Dark mode support

## 🛠️ Development Guide

### Adding New Features

#### Backend (FastAPI)
1. Create models in `backend/models.py`
2. Add schemas in `backend/schemas.py`
3. Create router in `backend/routers/`
4. Include router in `backend/main.py`

#### Frontend (React)
1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Update types in `src/types/index.ts`
4. Update API client in `src/api/client.ts`
5. Add routes in `src/App.tsx`

## 📝 Deployment Guide

### Deploying to Production

1. **Set strong SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Configure environment variables**
   - OPENAI_API_KEY
   - SECRET_KEY
   - DATABASE_URL (change to PostgreSQL for production)

3. **Using Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

4. **Using Traditional Deployment**
   - Deploy backend on Heroku, Railway, or VM
   - Deploy frontend on Vercel, Netlify, or static hosting
   - Update API URL in frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
# Linux/Mac
sudo lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database errors**
```bash
# Reset database
rm lexi.db
python -c "from database import init_db; init_db()"
```

### Frontend Issues

**Port 5173 already in use**
```bash
npm run dev -- --port 3000
```

**Dependencies not installing**
```bash
rm package-lock.json node_modules -r
npm install
```

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and environment info

## 🙏 Acknowledgments

- Built with FastAPI, React, and Tailwind CSS
- Legal data from Nepal's official law repositories
- UI inspired by OpenWebUI
