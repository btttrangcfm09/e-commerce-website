#!/bin/bash
# ====================================
# COMPLETE SEED SCRIPT - All Data
# ====================================
# Seeds: Categories -> Users -> Products -> Orders
# Run this for full database setup

echo "========================================"
echo "COMPLETE DATABASE SEEDING"
echo "========================================"
echo "This will seed: Categories, Users, Products, and Orders"
echo ""

# Check Docker
if ! docker ps > /dev/null 2>&1; then
    echo "ERROR: Docker is not running"
    echo "Please start Docker"
    exit 1
fi

# Check PostgreSQL container
if ! docker ps --filter "name=ecommerce-db" --format "{{.Names}}" | grep -q ecommerce-db; then
    echo "ERROR: PostgreSQL container 'ecommerce-db' is not running"
    echo "Please start it with: docker-compose up -d"
    exit 1
fi

echo ""
echo "========================================"
echo "STEP 1/5: Seeding Categories..."
echo "========================================"
docker cp 01-categories.sql ecommerce-db:/tmp/
if docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/01-categories.sql > /dev/null 2>&1; then
    echo "[OK] Categories seeded successfully"
else
    echo "[FAIL] Categories failed"
    exit 1
fi

echo ""
echo "========================================"
echo "STEP 2/5: Seeding Users..."
echo "========================================"
docker cp 02-users.sql ecommerce-db:/tmp/
if docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/02-users.sql > /dev/null 2>&1; then
    echo "[OK] Users seeded successfully"
else
    echo "[FAIL] Users failed"
    exit 1
fi

echo ""
echo "========================================"
echo "STEP 3/5: Seeding Products (Part 1)..."
echo "========================================"
docker cp 03-products-part1.sql ecommerce-db:/tmp/
if docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/03-products-part1.sql; then
    echo "[OK] Products Part 1 seeded"
else
    echo "[FAIL] Products Part 1 failed - Check errors above"
    exit 1
fi

echo ""
echo "========================================"
echo "STEP 4/5: Seeding Products (Part 2)..."
echo "========================================"
docker cp 03-products-part2.sql ecommerce-db:/tmp/
if docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/03-products-part2.sql; then
    echo "[OK] Products Part 2 seeded"
else
    echo "[FAIL] Products Part 2 failed - Check errors above"
    exit 1
fi

echo ""
echo "========================================"
echo "STEP 5/5: Seeding Orders (50 sample orders)..."
echo "========================================"
docker cp 04-orders.sql ecommerce-db:/tmp/
if docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/04-orders.sql; then
    echo "[OK] Orders seeded successfully"
else
    echo "[FAIL] Orders failed - Check errors above"
    exit 1
fi

echo ""
echo "========================================"
echo "FINAL CHECK: Verifying Data..."
echo "========================================"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT 'Categories: ' || COUNT(*)::text as info FROM categories UNION ALL SELECT 'Users: ' || COUNT(*)::text FROM users UNION ALL SELECT 'Products: ' || COUNT(*)::text FROM products UNION ALL SELECT 'Orders: ' || COUNT(*)::text FROM orders;"

echo ""
echo "========================================"
echo "DATABASE SEEDING COMPLETED!"
echo "========================================"
echo ""
echo "Summary:"
echo "  - Categories: ~35 (5 main + 30 sub-categories)"
echo "  - Users: ~22 (2 admins + 20 customers)"
echo "  - Products: ~120 products across all categories"
echo "  - Orders: ~50 sample orders with items"
echo ""
echo "Next steps:"
echo "  1. Restart your backend: npm run dev"
echo "  2. Login with: admin / admin123"
echo "  3. Test the application!"
echo ""
