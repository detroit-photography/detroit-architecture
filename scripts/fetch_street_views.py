#!/usr/bin/env python3
"""
Fetch Google Street View images for all buildings and upload to Supabase storage.
Stores them as photos with source='street_view' so they can be displayed on building pages.
"""

import os
import requests
import time
from supabase import create_client, Client

# Configuration
SUPABASE_URL = "https://qjxuiljsgrmymeayoqzi.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeHVpbGpzZ3JteW1lYXlvcXppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2Njk2NCwiZXhwIjoyMDgwNTQyOTY0fQ.HUDqDqvEKADQXQTndpQcG-iS_RJok2J8lA1-ZNPts0c")
GOOGLE_API_KEY = os.environ.get("GOOGLE_MAPS_KEY", "AIzaSyDiSm5Vx1gi1AzseFaDY4gq4eggSEpCMCc")

# Street View API settings
STREET_VIEW_SIZE = "600x400"
STREET_VIEW_FOV = 90
STREET_VIEW_PITCH = 10

def get_street_view_image(lat: float, lng: float) -> tuple[bytes | None, dict | None]:
    """Fetch Street View image from Google API. Returns (image_data, metadata)."""
    # First check if Street View is available at this location (outdoor only)
    metadata_url = f"https://maps.googleapis.com/maps/api/streetview/metadata?location={lat},{lng}&source=outdoor&key={GOOGLE_API_KEY}"
    
    try:
        meta_response = requests.get(metadata_url)
        meta_data = meta_response.json()
        
        if meta_data.get("status") != "OK":
            print(f"  No outdoor Street View available: {meta_data.get('status')}")
            return None, None
        
        # Fetch the actual image (outdoor only)
        image_url = f"https://maps.googleapis.com/maps/api/streetview?size={STREET_VIEW_SIZE}&location={lat},{lng}&fov={STREET_VIEW_FOV}&heading=0&pitch={STREET_VIEW_PITCH}&source=outdoor&key={GOOGLE_API_KEY}"
        
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            return img_response.content, meta_data
        else:
            print(f"  Failed to fetch image: {img_response.status_code}")
            return None, None
            
    except Exception as e:
        print(f"  Error fetching Street View: {e}")
        return None, None

def main():
    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Get all buildings with coordinates
    response = supabase.table("buildings").select("id, name, lat, lng").not_.is_("lat", "null").not_.is_("lng", "null").execute()
    
    buildings = response.data
    print(f"Found {len(buildings)} buildings with coordinates")
    
    # Get existing street view photos to avoid duplicates (identified by photographer = "Google Street View")
    existing_response = supabase.table("photos").select("building_id").eq("photographer", "Google Street View").execute()
    existing_building_ids = {p["building_id"] for p in existing_response.data}
    print(f"Found {len(existing_building_ids)} existing Street View photos")
    
    # Filter to only those without street view
    buildings_to_process = [b for b in buildings if b["id"] not in existing_building_ids]
    print(f"Processing {len(buildings_to_process)} buildings without Street View")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for i, building in enumerate(buildings_to_process):
        print(f"\n[{i+1}/{len(buildings_to_process)}] {building['name']}")
        
        lat = building["lat"]
        lng = building["lng"]
        building_id = building["id"]
        
        # Fetch Street View image
        image_data, metadata = get_street_view_image(lat, lng)
        
        if image_data is None:
            skip_count += 1
            continue
        
        # Upload to Supabase storage
        file_name = f"street-views/{building_id}.jpg"
        
        try:
            # Delete existing if any
            try:
                supabase.storage.from_("building-photos").remove([file_name])
            except:
                pass
            
            upload_result = supabase.storage.from_("building-photos").upload(
                file_name,
                image_data,
                {"content-type": "image/jpeg"}
            )
            
            # Get public URL
            public_url = supabase.storage.from_("building-photos").get_public_url(file_name)
            
            # Get the capture date from metadata if available
            capture_date = metadata.get("date", "") if metadata else ""
            
            # Create photo record (identified by photographer = "Google Street View")
            supabase.table("photos").insert({
                "building_id": building_id,
                "url": public_url,
                "caption": f"Street View{' (' + capture_date + ')' if capture_date else ''}",
                "photographer": "Google Street View",
                "sort_order": 999,  # Put street view last
                "is_primary": False,
            }).execute()
            
            print(f"  ✓ Saved Street View")
            success_count += 1
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
            error_count += 1
        
        # Rate limiting - be nice to the API
        time.sleep(0.2)
    
    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Success: {success_count}")
    print(f"  Skipped (no coverage): {skip_count}")
    print(f"  Errors: {error_count}")

if __name__ == "__main__":
    main()

