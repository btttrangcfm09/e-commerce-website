@echo off
REM ====================================
REM Clear and Reseed Database
REM ====================================

echo ========================================
echo CLEAR AND RESEED DATABASE
echo ========================================
echo.
echo WARNING: This will DELETE ALL existing data!
echo.
set /p confirm="Are you sure? Type YES to continue: "

if /i not "%confirm%"=="YES" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo STEP 1: Loading configuration...
echo ========================================

REM Load environment variables from .env
if not exist "..\\.env" (
    echo ERROR: .env file not found
    pause
    exit /b 1
)

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
    echo ERROR: Docker is not running
    pause
    exit /b 1
)

REM Check if container is running
docker ps --filter "name=ecommerce-db" --format "{{.Names}}" | findstr ecommerce-db >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL container 'ecommerce-db' is not running
    echo Starting container...
    cd ..\..
    docker-compose up -d postgres
    timeout /t 5 /nobreak >nul
    cd database\seed
)

echo.
echo ========================================
echo STEP 2: Clearing old data...
echo ========================================

REM Copy clear script to container
docker cp 00-clear-data.sql ecommerce-db:/tmp/

REM Run clear script
docker exec -i ecommerce-db psql -U %DB_USER% -d %DB_NAME% -f /tmp/00-clear-data.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to clear data
    pause
    exit /b 1
)

echo.
echo ========================================
echo STEP 3: Seeding new data...
echo ========================================

REM Copy SQL files to container
echo Copying SQL files to container...
docker cp 01-categories.sql ecommerce-db:/tmp/
docker cp 02-users.sql ecommerce-db:/tmp/
docker cp 03-products-part1.sql ecommerce-db:/tmp/
docker cp 03-products-part2.sql ecommerce-db:/tmp/
docker cp seed-all.sql ecommerce-db:/tmp/

REM Run seed script
echo Running seed script...
docker exec -i ecommerce-db psql -U %DB_USER% -d %DB_NAME% -f /tmp/seed-all.sql

REM Ensure all products have is_active = true
echo Ensuring all products are active...
docker exec -i ecommerce-db psql -U %DB_USER% -d %DB_NAME% -c "UPDATE products SET is_active = true WHERE is_active IS NULL OR is_active = false;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo RESEED COMPLETED SUCCESSFULLY!
    echo ========================================
    echo.
    echo Data Summary:
    docker exec -i ecommerce-db psql -U %DB_USER% -d %DB_NAME% -c "SELECT 'Categories: ' || COUNT(*) FROM categories UNION ALL SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Products: ' || COUNT(*) FROM products;"
    echo.
    echo ========================================
    echo IMPORTANT: Please restart your backend!
    echo ========================================
    echo Press Ctrl+C in backend terminal and run: npm run dev
) else (
    echo.
    echo ========================================
    echo RESEED FAILED!
    echo ========================================
    echo Please check the error messages above
)

echo.
pause
