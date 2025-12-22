@echo off
REM ====================================
REM Simple Seed Script - Step by Step
REM ====================================

echo ========================================
echo SEEDING DATABASE (Step by Step)
echo ========================================
echo.

REM Check Docker
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running
    pause
    exit /b 1
)

echo Step 1/4: Seeding Categories...
docker cp 01-categories.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/01-categories.sql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Categories seeded
) else (
    echo [FAIL] Categories failed
    pause
    exit /b 1
)

echo Step 2/4: Seeding Users...
docker cp 02-users.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/02-users.sql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Users seeded
) else (
    echo [FAIL] Users failed
    pause
    exit /b 1
)

echo Step 3/4: Seeding Products (Part 1)...
docker cp 03-products-part1.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/03-products-part1.sql
if %ERRORLEVEL% EQU 0 (
    echo [OK] Products Part 1 seeded
) else (
    echo [FAIL] Products Part 1 failed - Check errors above
    pause
    exit /b 1
)

echo Step 4/4: Seeding Products (Part 2)...
docker cp 03-products-part2.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/03-products-part2.sql
if %ERRORLEVEL% EQU 0 (
    echo [OK] Products Part 2 seeded
) else (
    echo [FAIL] Products Part 2 failed - Check errors above
    pause
    exit /b 1
)

echo.
echo Ensuring all products are active...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "UPDATE products SET is_active = true WHERE is_active IS NULL OR is_active = false;" >nul 2>&1
echo [OK] Products activated

echo.
echo ========================================
echo CHECKING DATA...
echo ========================================
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT 'Categories: ' || COUNT(*) FROM categories UNION ALL SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Products: ' || COUNT(*) FROM products;"

echo.
echo ========================================
echo SEED COMPLETED!
echo ========================================
echo.
echo Next: Restart your backend (Ctrl+C and npm run dev)
echo.
pause
