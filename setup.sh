#!/bin/bash
set -e

echo "================================="
echo "Lexi - Setup Script"
echo "================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your OpenAI API Key"
    read -p "Press enter to continue..."
fi

# Create backend virtual environment
echo ""
echo "Setting up backend..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing backend dependencies..."
pip install -q -r backend/requirements.txt

# Initialize database
echo "Initializing database..."
cd backend
python3 -c "from database import init_db; init_db(); print('Database initialized successfully!')"
cd ..

echo ""
echo "================================="
echo "Setup Complete!"
echo "================================="
echo ""
echo "To start development:"
echo ""
echo "Terminal 1 (Backend):"
echo "  source venv/bin/activate"
echo "  cd backend"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm install (if needed)"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
