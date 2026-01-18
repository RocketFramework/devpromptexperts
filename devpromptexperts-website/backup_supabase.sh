#!/bin/bash

echo "========================================"
echo "Supabase Functions Backup Tool"
echo "========================================"

# Get credentials
read -p "Enter your Supabase Project Ref (from dashboard URL): " PROJECT_REF
read -s -p "Enter your Database Password: " PASSWORD
echo

# Create backup directory
BACKUP_DIR="supabase_backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🔄 Connecting to Supabase..."

# 1. Backup ALL functions with definitions
echo "📦 Exporting functions..."
PGPASSWORD=$PASSWORD psql \
  -h db.$PROJECT_REF.supabase.co \
  -U postgres \
  -d postgres \
  -c "
SELECT 
    '-- Function: ' || n.nspname || '.' || p.proname || E'\n' ||
    '-- Arguments: ' || pg_get_function_arguments(p.oid) || E'\n' ||
    '-- Returns: ' || pg_get_function_result(p.oid) || E'\n' ||
    '-- Language: ' || 
        CASE 
            WHEN p.prolang = 13 THEN 'sql'
            WHEN p.prolang = 14 THEN 'plpgsql'
            ELSE 'unknown'
        END || E'\n' ||
    pg_get_functiondef(p.oid) || ';' || E'\n\n'
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY p.proname;
" > "$BACKUP_DIR/all_functions.sql"

# 2. Backup full schema
echo "📦 Exporting full schema..."
PGPASSWORD=$PASSWORD pg_dump \
  -h db.$PROJECT_REF.supabase.co \
  -U postgres \
  -d postgres \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-tablespaces \
  > "$BACKUP_DIR/full_schema.sql"

# 3. Create individual function files
echo "📦 Creating individual function files..."
mkdir -p "$BACKUP_DIR/individual_functions"

PGPASSWORD=$PASSWORD psql \
  -h db.$PROJECT_REF.supabase.co \
  -U postgres \
  -d postgres \
  -c "
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY p.proname;
" -t -A -F $'\t' | while IFS=$'\t' read -r name definition; do
    if [ ! -z "$name" ] && [ ! -z "$definition" ]; then
        echo "$definition;" > "$BACKUP_DIR/individual_functions/${name}.sql"
    fi
done

echo ""
echo "✅ BACKUP COMPLETE!"
echo "========================================"
echo "Backup saved in: $BACKUP_DIR/"
echo "Contents:"
echo "  - all_functions.sql      (All functions in one file)"
echo "  - full_schema.sql        (Complete database schema)"
echo "  - individual_functions/  (Each function separately)"
echo "========================================"
