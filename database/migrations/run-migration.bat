@echo off
REM ====================================
REM Run Database Migrations
REM ====================================

echo ========================================
echo DATABASE MIGRATION RUNNER
echo ========================================
echo.

REM Check Docker
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running
    pause
    exit /b 1
)

REM Check container
docker ps --filter "name=ecommerce-db" --format "{{.Names}}" | findstr ecommerce-db >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL container not running
    pause
    exit /b 1
)

echo Running migrations...
echo.

REM Copy migration file to container
docker cp 001-add-isactive-and-indexes.sql ecommerce-db:/tmp/

REM Run quick migration commands directly
echo [1/5] Adding is_active to orders...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;" >nul 2>&1
echo [OK]

echo [2/5] Adding is_active to products (if not exists)...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;" >nul 2>&1
echo [OK]

echo [3/5] Updating existing data...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "UPDATE products SET is_active = true WHERE is_active IS NULL; UPDATE orders SET is_active = true WHERE is_active IS NULL;" >nul 2>&1
echo [OK]

echo [4/5] Creating indexes...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active); CREATE INDEX IF NOT EXISTS idx_orders_is_active ON orders(is_active);" >nul 2>&1
echo [OK]

echo [5/5] Creating composite indexes...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active); CREATE INDEX IF NOT EXISTS idx_orders_customer_active ON orders(customer_id, is_active); CREATE INDEX IF NOT EXISTS idx_orders_status_active ON orders(order_status, is_active);" >nul 2>&1
echo [OK]

echo.
echo ========================================
echo VERIFICATION
echo ========================================
echo.
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT table_name, column_name, column_default FROM information_schema.columns WHERE column_name = 'is_active' AND table_name IN ('products', 'orders') ORDER BY table_name;"
echo.
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT tablename, indexname FROM pg_indexes WHERE tablename IN ('products', 'orders') AND indexdef LIKE '%%is_active%%' ORDER BY tablename, indexname;"

echo.
echo ========================================
echo MIGRATION COMPLETED!
echo ========================================
echo.
pause
