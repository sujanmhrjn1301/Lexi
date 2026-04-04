# Lexi Development Quick Reference

## 🏃 Quick Start (Copy & Paste)

### Windows
```batch
# Terminal 1 - Backend
cd d:\Python\ 2.0\Lexi
venv\Scripts\activate.bat
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend  
cd d:\Python\ 2.0\Lexi\frontend
npm install
npm run dev
```

### Mac/Linux
```bash
# Terminal 1 - Backend
cd ~/Lexi
source venv/bin/activate
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd ~/Lexi/frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## 🔗 URLs
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React app |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| API Redoc | http://localhost:8000/redoc | ReDoc UI |

## 📦 Adding Dependencies

### Backend
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### Frontend
```bash
cd frontend
npm install package-name
```

## 🗄️ Database

**Location**: `lexi.db` in backend directory

### Reset Database
```bash
# Delete the database file
rm lexi.db  # or del lexi.db on Windows

# Restart backend - it creates new database automatically
```

### View Database
```bash
# Using SQLite CLI
sqlite3 lexi.db

# Common queries:
SELECT * FROM users;
SELECT * FROM chats;
SELECT * FROM messages;
```

## 🔐 Environment Setup

Create `.env` in project root:
```env
OPENAI_API_KEY=your_key_here
SECRET_KEY=your-secret-key-or-use-default
DATABASE_URL=sqlite:///./lexi.db
VECTOR_DB_PATH=./nepal_law_db
```

## 🎨 Frontend Structure

### Adding a New Page
1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
```tsx
<Route path="/mypage" element={<MyPage />} />
```

### Adding a New Component
1. Create `src/components/MyComponent.tsx`
2. Import and use in pages

### Using Global State
```tsx
import { useAuthStore, useChatStore } from '../store';

const { user, token } = useAuthStore();
const { chats, currentChat } = useChatStore();
```

### API Calls
```tsx
import apiClient from '../api/client';

const user = await apiClient.getCurrentUser();
const chats = await apiClient.getChats();
const message = await apiClient.sendMessage(chatId, { content: 'Hi' });
```

## 🔙 Backend Structure

### Adding New Endpoint
1. Create route in `backend/routers/myrouter.py`
```python
@router.get("/items")
async def get_items(current_user: User = Depends(get_current_active_user)):
    return {"items": []}
```

2. Include in `backend/main.py`
```python
app.include_router(myrouter.router, prefix=settings.API_PREFIX)
```

### Using Database
```python
from models import Chat, Message
from database import get_db

def get_chats(user_id: int, db: Session = Depends(get_db)):
    return db.query(Chat).filter(Chat.user_id == user_id).all()
```

### Protected Routes
All routes that query database should check user:
```python
async def my_endpoint(current_user: User = Depends(get_current_active_user)):
    # Only authenticated users can access
    pass
```

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `netstat -ano \| findstr :8000` then kill process |
| Port 5173 in use | `npm run dev -- --port 3000` |
| Token fails | Delete browser localStorage, login again |
| API errors | Check backend logs and `/docs` |
| DB locked | Ensure only one backend instance running |
| Module not found | `npm install` or `pip install` |

## 🧪 Testing API

### Using curl
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Get chats (with token)
curl http://localhost:8000/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Swagger UI
Visit: http://localhost:8000/docs
- Authorize with your token
- Try endpoints directly

## 📊 Database Queries

### Count entries
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM chats WHERE user_id=1;
SELECT COUNT(*) FROM messages WHERE chat_id=1;
```

### Recent chats
```sql
SELECT * FROM chats WHERE user_id=1 ORDER BY updated_at DESC LIMIT 10;
```

### User stats
```sql
SELECT u.username, COUNT(c.id) as chat_count 
FROM users u 
LEFT JOIN chats c ON u.id = c.user_id 
GROUP BY u.id;
```

## 🚀 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
npm run preview  # Test built version
```

Output in `frontend/dist/` ready to deploy.

### Backend Production
```bash
# Set environment
set DJANGO_ENV=production
set SECRET_KEY=your-strong-secret-key

# Run with gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend
```

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Docstrings for functions

### TypeScript (Frontend)
- Use interfaces/types
- Props should be typed
- Components in PascalCase
- Functions in camelCase

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/my-feature`
5. Create PR

## 📚 File Examples

### Simple Backend Endpoint
```python
@router.get("/status")
async def get_status(current_user: User = Depends(get_current_active_user)):
    return {"status": "ok", "user": current_user.username}
```

### Simple React Component
```tsx
import { useAuthStore } from '../store';

export default function MyComponent() {
  const { user } = useAuthStore();
  
  return <div>Hello {user?.username}</div>;
}
```

## 💾 Backup Database

```bash
# Copy database file
cp lexi.db lexi.db.backup

# Or for Docker
docker cp lexi-backend:/app/lexi.db ./lexi.db.backup
```

## 🎯 Next Commands

**Need help?** Check these files:
- GETTING_STARTED.md - Full setup guide
- SETUP_GUIDE.md - Detailed documentation
- API docs at http://localhost:8000/docs

**Questions?** Create GitHub issue with:
- What you tried
- What error you got
- Steps to reproduce
