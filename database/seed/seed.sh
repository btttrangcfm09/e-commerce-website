#!/bin/bash
# ====================================
# Shell Script to Seed Database (Linux/Mac)
# ====================================

echo "========================================"
echo "DATABASE SEEDING SCRIPT (Linux/Mac)"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f "database/.env" ]; then
    echo "ERROR: .env file not found in database folder"
    echo "Please create database/.env with your database credentials"
    echo "Example:"
    echo "  DB_HOST=localhost"
    echo "  DB_PORT=5432"
    echo "  DB_NAME=ecommerce"
    echo "  DB_USER=postgres"
    echo "  DB_PASSWORD=your_password"
    exit 1
fi

# Load environment variables from .env
export $(cat database/.env | grep -v '^#' | xargs)

echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql command not found"
    echo "Please install PostgreSQL client tools"
    exit 1
fi

echo "Starting seed process..."
echo ""

# Run the seed script
export PGPASSWORD=$DB_PASSWORD
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seed/seed-all.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "SEED COMPLETED SUCCESSFULLY!"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "SEED FAILED!"
    echo "========================================"
    echo "Please check the error messages above"
    exit 1
fi

echo ""
