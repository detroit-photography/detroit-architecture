#!/usr/bin/env python3
"""
Migrate existing building data to Supabase.
Run this after setting up your Supabase project and creating the schema.

Usage:
    export SUPABASE_URL="https://your-project.supabase.co"
    export SUPABASE_SERVICE_KEY="your-service-role-key"
    python3 scripts/migrate_data.py
"""

import json
import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase-py...")
    os.system("pip3 install supabase")
    from supabase import create_client, Client

# Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables")
    print("\nExample:")
    print('  export SUPABASE_URL="https://your-project.supabase.co"')
    print('  export SUPABASE_SERVICE_KEY="your-service-role-key"')
    sys.exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def load_existing_data():
    """Load the merged building data from the previous pipeline."""
    data_path = Path(__file__).parent.parent.parent / "data" / "detroit_architecture_merged.json"
    
    if not data_path.exists():
        print(f"Error: Data file not found at {data_path}")
        sys.exit(1)
    
    with open(data_path) as f:
        return json.load(f)

def transform_building(old: dict) -> dict:
    """Transform old data format to new Supabase schema."""
    # Parse alternate names
    alternate_names = old.get("alternate_names", [])
    if isinstance(alternate_names, str):
        alternate_names = [alternate_names] if alternate_names else []
    
    # Determine status
    status = "unknown"
    if old.get("demolished") or old.get("status") == "demolished":
        status = "demolished"
    elif old.get("extant") or old.get("status") == "extant":
        status = "extant"
    elif old.get("year_built"):
        status = "extant"  # Assume extant if we have year_built
    
    return {
        "name": old.get("building_name") or old.get("name"),
        "alternate_names": alternate_names,
        "address": old.get("address") if old.get("address") != "unknown" else None,
        "city": old.get("city", "Detroit"),
        "lat": old.get("lat"),
        "lng": old.get("lng"),
        "architect": old.get("architect") if old.get("architect") != "unknown" else None,
        "year_built": old.get("year_built"),
        "year_demolished": old.get("year_demolished"),
        "architectural_style": old.get("architectural_style") if old.get("architectural_style") != "unknown" else None,
        "building_type": old.get("building_type") if old.get("building_type") != "unknown" else None,
        "status": status,
        "aia_number": old.get("aia_number"),
        "aia_text": old.get("aia_text"),
        "ferry_number": old.get("ferry_number"),
        "ferry_text": old.get("ferry_text"),
        "photographer_notes": old.get("photographer_notes") or old.get("photographer_commentary"),
        "featured": False,
    }

def migrate():
    """Migrate all buildings to Supabase."""
    print("Loading existing data...")
    buildings = load_existing_data()
    print(f"Found {len(buildings)} buildings")
    
    # Check if data already exists
    existing = supabase.table("buildings").select("id", count="exact").execute()
    if existing.count and existing.count > 0:
        response = input(f"Database already has {existing.count} buildings. Clear and reimport? [y/N] ")
        if response.lower() != 'y':
            print("Aborted.")
            return
        
        print("Clearing existing data...")
        supabase.table("photos").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        supabase.table("buildings").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    # Transform and insert buildings
    print("\nMigrating buildings...")
    success = 0
    errors = 0
    
    # Insert in batches of 100
    batch_size = 100
    transformed = [transform_building(b) for b in buildings]
    
    for i in range(0, len(transformed), batch_size):
        batch = transformed[i:i+batch_size]
        try:
            result = supabase.table("buildings").insert(batch).execute()
            success += len(batch)
            print(f"  Inserted {i + len(batch)}/{len(transformed)}")
        except Exception as e:
            print(f"  Error inserting batch {i}: {e}")
            # Try one by one
            for building in batch:
                try:
                    supabase.table("buildings").insert(building).execute()
                    success += 1
                except Exception as e2:
                    errors += 1
                    print(f"    Failed: {building['name'][:40]} - {e2}")
    
    print(f"\n=== Migration Complete ===")
    print(f"Success: {success}")
    print(f"Errors: {errors}")
    print(f"\nYour data is now in Supabase!")
    print(f"View it at: {SUPABASE_URL.replace('.supabase.co', '')}/project/default/editor")

if __name__ == "__main__":
    migrate()


