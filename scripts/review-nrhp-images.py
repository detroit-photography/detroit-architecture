#!/usr/bin/env python3
"""
Interactive review of extracted NRHP images before uploading.
Shows each image and asks:
1. Is this a photo? (skip maps/text)
2. Is it correctly rotated? (rotate if needed)

Usage: python scripts/review-nrhp-images.py <ref_number>
"""

import sys
import os
import json
import shutil
from pathlib import Path
from PIL import Image
import subprocess

def open_image(image_path: Path):
    """Open image in default viewer."""
    if sys.platform == 'darwin':  # macOS
        subprocess.run(['open', str(image_path)])
    elif sys.platform == 'linux':
        subprocess.run(['xdg-open', str(image_path)])
    else:  # Windows
        os.startfile(str(image_path))

def rotate_image(image_path: Path, degrees: int):
    """Rotate image and save in place."""
    img = Image.open(image_path)
    # PIL rotate is counterclockwise, so we negate for clockwise
    rotated = img.rotate(-degrees, expand=True)
    rotated.save(image_path, 'JPEG', quality=95)
    print(f"   ✅ Rotated {degrees}° clockwise")

def review_images(ref_number: str):
    """Interactive review of extracted images."""
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / 'data' / 'nrhp' / 'images' / ref_number
    public_dir = script_dir.parent / 'public' / 'images' / 'nrhp' / ref_number
    
    if not data_dir.exists():
        print(f"❌ No images found for {ref_number}")
        print(f"   Run: python scripts/extract-nrhp-images.py data/nrhp/pdfs/{ref_number}_*.pdf")
        return
    
    # Get list of images
    images = sorted([f for f in data_dir.iterdir() if f.suffix.lower() in ['.jpeg', '.jpg', '.png']])
    
    if not images:
        print(f"❌ No images found in {data_dir}")
        return
    
    # Load metadata for captions
    metadata_path = data_dir / 'metadata.json'
    captions = {}
    if metadata_path.exists():
        with open(metadata_path) as f:
            meta = json.load(f)
            for img in meta.get('images', []):
                captions[img['filename']] = img.get('caption', '')
    
    print(f"\n📷 Reviewing {len(images)} images for NRHP {ref_number}")
    print("=" * 60)
    
    approved = []
    
    for i, img_path in enumerate(images, 1):
        print(f"\n[{i}/{len(images)}] {img_path.name}")
        caption = captions.get(img_path.name, '')
        if caption:
            print(f"   Caption: {caption[:80]}{'...' if len(caption) > 80 else ''}")
        
        # Show image dimensions
        with Image.open(img_path) as img:
            w, h = img.size
            orientation = "landscape" if w > h else "portrait"
            print(f"   Size: {w}x{h} ({orientation})")
        
        # Open image for viewing
        open_image(img_path)
        
        # Ask if it's a photo
        while True:
            response = input("\n   Is this a PHOTO? [y/n/q]: ").strip().lower()
            if response in ['y', 'yes']:
                is_photo = True
                break
            elif response in ['n', 'no']:
                is_photo = False
                break
            elif response in ['q', 'quit']:
                print("\n⏹️  Review cancelled")
                return
            else:
                print("   Please enter y (yes), n (no), or q (quit)")
        
        if not is_photo:
            print("   ⏭️  Skipped (not a photo)")
            continue
        
        # Ask about rotation
        while True:
            response = input("   Is rotation CORRECT? [y/n]: ").strip().lower()
            if response in ['y', 'yes']:
                break
            elif response in ['n', 'no']:
                # Ask for rotation direction
                while True:
                    rot = input("   Rotate: [1] 90° CW  [2] 90° CCW  [3] 180°  [c] cancel: ").strip().lower()
                    if rot == '1':
                        rotate_image(img_path, 90)
                        open_image(img_path)  # Show rotated version
                        break
                    elif rot == '2':
                        rotate_image(img_path, -90)
                        open_image(img_path)
                        break
                    elif rot == '3':
                        rotate_image(img_path, 180)
                        open_image(img_path)
                        break
                    elif rot == 'c':
                        break
                    else:
                        print("   Please enter 1, 2, 3, or c")
                
                # Ask again if rotation is now correct
                continue
            else:
                print("   Please enter y (yes) or n (no)")
        
        approved.append(img_path)
        print("   ✅ Approved")
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📊 Review Complete")
    print(f"   ✅ Approved: {len(approved)} photos")
    print(f"   ⏭️  Skipped: {len(images) - len(approved)} non-photos")
    
    if not approved:
        print("\n⚠️  No photos approved")
        return
    
    # Copy approved images to public folder
    response = input(f"\n   Copy {len(approved)} photos to public folder? [y/n]: ").strip().lower()
    if response in ['y', 'yes']:
        public_dir.mkdir(parents=True, exist_ok=True)
        
        for img_path in approved:
            dest = public_dir / img_path.name
            shutil.copy2(img_path, dest)
            print(f"   📁 Copied: {img_path.name}")
        
        print(f"\n✅ Done! Photos copied to {public_dir}")
        print(f"\n   Next steps:")
        print(f"   1. Run: node scripts/import-nrhp.mjs import {ref_number} \"Building Name\"")
        print(f"   2. Deploy: npx vercel --prod --yes")
    else:
        print("   ⏹️  Copy cancelled")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/review-nrhp-images.py <ref_number>")
        print("Example: python scripts/review-nrhp-images.py 95000531")
        sys.exit(1)
    
    review_images(sys.argv[1])

