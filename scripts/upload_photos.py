#!/usr/bin/env python3
"""
Bulk upload photos to Supabase.

Usage:
    # Upload photos for a specific building
    python3 scripts/upload_photos.py --building "Fisher Building" --photos ./photos/fisher/*.jpg
    
    # Upload photos from a directory structure (building_name/photo.jpg)
    python3 scripts/upload_photos.py --dir ./photos/
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase-py...")
    os.system("pip3 install supabase")
    from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def find_building(name: str):
    """Find a building by name (fuzzy match)."""
    result = supabase.table("buildings").select("*").ilike("name", f"%{name}%").execute()
    
    if not result.data:
        print(f"No building found matching '{name}'")
        return None
    
    if len(result.data) > 1:
        print(f"Multiple buildings found matching '{name}':")
        for i, b in enumerate(result.data[:5]):
            print(f"  {i+1}. {b['name']}")
        
        choice = input("Enter number to select (or 0 to cancel): ")
        if choice == "0" or not choice.isdigit():
            return None
        
        return result.data[int(choice) - 1]
    
    return result.data[0]

def upload_photo(building_id: str, file_path: Path, photographer: str = "Andrew Petrov"):
    """Upload a single photo."""
    file_ext = file_path.suffix.lower()
    if file_ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        print(f"Skipping unsupported file: {file_path}")
        return None
    
    # Generate unique filename
    import time
    import random
    filename = f"{building_id}/{int(time.time())}-{random.randint(1000, 9999)}{file_ext}"
    
    # Upload to storage
    with open(file_path, 'rb') as f:
        result = supabase.storage.from_("building-photos").upload(filename, f.read())
    
    # Get public URL
    public_url = supabase.storage.from_("building-photos").get_public_url(filename)
    
    # Get current photo count for sort order
    existing = supabase.table("photos").select("id", count="exact").eq("building_id", building_id).execute()
    sort_order = existing.count or 0
    
    # Create photo record
    photo_data = {
        "building_id": building_id,
        "url": public_url,
        "photographer": photographer,
        "sort_order": sort_order,
        "is_primary": sort_order == 0,
    }
    
    result = supabase.table("photos").insert(photo_data).execute()
    return result.data[0] if result.data else None

def upload_for_building(building_name: str, photo_paths: list, photographer: str):
    """Upload photos for a specific building."""
    building = find_building(building_name)
    if not building:
        return
    
    print(f"\nUploading {len(photo_paths)} photos for: {building['name']}")
    
    success = 0
    for path in photo_paths:
        photo_path = Path(path)
        if not photo_path.exists():
            print(f"  File not found: {path}")
            continue
        
        result = upload_photo(building['id'], photo_path, photographer)
        if result:
            success += 1
            print(f"  ✓ Uploaded: {photo_path.name}")
        else:
            print(f"  ✗ Failed: {photo_path.name}")
    
    print(f"\nUploaded {success}/{len(photo_paths)} photos")

def upload_from_directory(dir_path: str, photographer: str):
    """Upload photos from a directory structure."""
    base_dir = Path(dir_path)
    if not base_dir.exists():
        print(f"Directory not found: {dir_path}")
        return
    
    # Each subdirectory is a building name
    for building_dir in base_dir.iterdir():
        if not building_dir.is_dir():
            continue
        
        building_name = building_dir.name
        photos = list(building_dir.glob("*"))
        photos = [p for p in photos if p.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
        
        if not photos:
            continue
        
        upload_for_building(building_name, [str(p) for p in photos], photographer)

def main():
    parser = argparse.ArgumentParser(description="Upload photos to Detroit Architecture database")
    parser.add_argument("--building", "-b", help="Building name to upload photos for")
    parser.add_argument("--photos", "-p", nargs="+", help="Photo files to upload")
    parser.add_argument("--dir", "-d", help="Directory of photos (subdirs = building names)")
    parser.add_argument("--photographer", default="Andrew Petrov", help="Photographer name")
    
    args = parser.parse_args()
    
    if args.dir:
        upload_from_directory(args.dir, args.photographer)
    elif args.building and args.photos:
        upload_for_building(args.building, args.photos, args.photographer)
    else:
        parser.print_help()
        print("\nExamples:")
        print('  python3 scripts/upload_photos.py -b "Fisher Building" -p photo1.jpg photo2.jpg')
        print('  python3 scripts/upload_photos.py -d ./photos/')

if __name__ == "__main__":
    main()


