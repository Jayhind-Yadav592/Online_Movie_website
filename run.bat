@echo off
echo Starting CineVerse...

REM Start Django Backend in a new terminal window
start "Django Backend" cmd /c "cd backend && ..\venv\Scripts\activate && python manage.py runserver 8000"

REM Start Next.js Frontend in a new terminal window
start "Next.js Frontend" cmd /c "cd frontend && npm run dev"

echo Both servers are starting!
echo Frontend will be available at http://localhost:3000
echo Backend API will be available at http://localhost:8000
