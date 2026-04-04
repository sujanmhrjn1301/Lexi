@echo off
echo =================================
echo Lexi - Setup Script
echo =================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your OpenAI API Key
    pause
)

REM Create backend virtual environment
echo.
echo Setting up backend...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -q -r backend\requirements.txt

REM Initialize database
echo Initializing database...
cd backend
python -c "from database import init_db; init_db(); print('Database initialized successfully!')"
cd ..

echo.
echo =================================
echo Setup Complete!
echo =================================
echo.
echo To start development:
echo.
echo Terminal 1 (Backend):
echo   venv\Scripts\activate.bat
echo   cd backend
echo   uvicorn main:app --reload
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm install (if needed)
echo   npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.
pause
