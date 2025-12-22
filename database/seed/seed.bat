@echo off
REM ====================================
REM Windows Batch Script to Seed Database
REM ====================================

echo ========================================
echo DATABASE SEEDING SCRIPT (Windows)
echo ========================================
echo.

REM Check if .env exists
if not exist "..\\.env" (
    echo ERROR: .env file not found in database folder
    echo Please create database/.env with your database credentials
    echo Example:
    echo   DB_HOST=localhost
    echo   DB_PORT=5432
    echo   DB_NAME=ecommerce
    echo   DB_USER=postgres
    echo   DB_PASSWORD=your_password
    pause
    exit /b 1
)

REM Load environment variables from .env
for /f "tokens=1,2 delims==" %%a in ('type ..\\.env ^| findstr /v "^#"') do (
    set %%a=%%b
)

echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Check if Docker is running
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running or not installed
    echo Please start Docker Desktop
    pause
    exit /b 1
)

REM Check if PostgreSQL container is running
docker ps --filter "name=ecommerce-db" --format "{{.Names}}" | findstr ecommerce-db >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL container 'ecommerce-db' is not running
    echo Please start it with: docker-compose up -d postgres
    pause
    exit /b 1
)

echo Starting seed process...
echo.

REM Copy SQL files to container temp directory
echo Copying SQL files to container...
docker cp 01-categories.sql ecommerce-db:/tmp/
docker cp 02-users.sql ecommerce-db:/tmp/
docker cp 03-products-part1.sql ecommerce-db:/tmp/
docker cp 03-products-part2.sql ecommerce-db:/tmp/
docker cp seed-all.sql ecommerce-db:/tmp/

REM Run seed script inside container
echo Running seed script...
docker exec -i ecommerce-db psql -U %DB_USER% -d %DB_NAME% -f /tmp/seed-all.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SEED COMPLETED SUCCESSFULLY!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo SEED FAILED!
    echo ========================================
    echo Please check the error messages above
)

echo.
pause
