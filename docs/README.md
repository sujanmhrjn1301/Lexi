# Project Documentation

## Quick Links

- **[GETTING_STARTED.md](../GETTING_STARTED.md)** - 👈 Quick start guide (read this first!)
- **[SETUP_GUIDE.md](../SETUP_GUIDE.md)** - Complete setup instructions
- **[QUICK_REFERENCE.md](../QUICK_REFERENCE.md)** - Developer quick reference
- **[API.md](./API.md)** - REST API documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project architecture

## Structure

```
docs/
├── README.md                 # This file
├── API.md                    # API endpoint documentation
├── ARCHITECTURE.md           # Technical architecture
└── DEPLOYMENT.md             # Deployment guides
```

## Getting Started

### For New Developers
1. Read `../GETTING_STARTED.md` (3 steps to start!)
2. Check `ARCHITECTURE.md` to understand the codebase
3. Reference `QUICK_REFERENCE.md` during development

### For Deployment
1. Follow `../SETUP_GUIDE.md`
2. Reference `DEPLOYMENT.md` for your target platform
3. Use `API.md` to verify endpoints are working

## File Organization

```
Lexi/
├── backend/                 # FastAPI backend
├── frontend/                # React frontend
├── scripts/                 # Legacy data processing
├── data/                    # Data storage
│   ├── raw/                # Raw law data
│   ├── processed/          # Cleaned/chunked data
│   └── vectors/            # Vector database
├── docs/                    # Documentation (this folder)
└── ...
```

## Key Technologies

- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript
- **Database**: SQLite (users/chats) + ChromaDB (vectors)
- **Deployment**: Docker + Docker Compose

## Support

Issues or questions? Check:
1. Relevant documentation file
2. Backend `/docs` endpoint (Swagger UI)
3. Code comments in respective files
