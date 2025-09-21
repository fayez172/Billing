@echo off
REM Script to check if the application is running

echo Checking if containers are running...
docker-compose ps

echo Checking if services are accessible...
echo Frontend (should return HTML):
curl -s http://localhost | more

echo Backend API (should return JSON):
curl -s http://localhost:3001/api/health

echo Database (PostgreSQL):
docker-compose exec db pg_isready -U postgres