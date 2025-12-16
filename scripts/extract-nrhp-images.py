#!/usr/bin/env python3
"""
Extract images from NRHP PDF files.
Usage: python scripts/extract-nrhp-images.py <pdf_file>
"""

import sys
import os
import fitz  # PyMuPDF
from pathlib import Path

def extract_images(pdf_path: str):
    """Extract images from a PDF file."""
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"❌ File not found: {pdf_path}")
        return
    
    # Get ref number from filename
    ref_number = pdf_path.stem.split('_')[0]
    
    # Output directory
    script_dir = Path(__file__).parent
    output_dir = script_dir.parent / 'data' / 'nrhp' / 'images' / ref_number
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📄 Processing: {pdf_path.name}")
    print(f"📂 Output dir: {output_dir}")
    
    # Open PDF
    doc = fitz.open(pdf_path)
    print(f"📑 Pages: {len(doc)}")
    
    image_count = 0
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_images()
        
        if images:
            print(f"\n📃 Page {page_num + 1}: {len(images)} images")
        
        for img_idx, img in enumerate(images):
            xref = img[0]
            
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                width = base_image["width"]
                height = base_image["height"]
                
                # Skip very small images (likely icons or artifacts)
                if width < 100 or height < 100:
                    continue
                
                # Generate filename
                filename = f"{ref_number}_page{page_num + 1:03d}_img{img_idx + 1:02d}.{image_ext}"
                output_path = output_dir / filename
                
                # Save image
                with open(output_path, "wb") as f:
                    f.write(image_bytes)
                
                print(f"   ✅ {filename} ({width}x{height})")
                image_count += 1
                
            except Exception as e:
                print(f"   ❌ Failed to extract image {img_idx + 1}: {e}")
    
    doc.close()
    
    print(f"\n📊 Extracted {image_count} images to {output_dir}")
    
    # Create metadata file
    metadata = {
        "source_pdf": pdf_path.name,
        "ref_number": ref_number,
        "images_extracted": image_count
    }
    
    import json
    with open(output_dir / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Done!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("""
Extract images from NRHP PDF files.

Usage:
    python scripts/extract-nrhp-images.py <pdf_file>
    
Examples:
    python scripts/extract-nrhp-images.py data/nrhp/pdfs/95000531_architects_building.pdf
    python scripts/extract-nrhp-images.py data/nrhp/pdfs/89001165_guardian_building.pdf
""")
        sys.exit(1)
    
    extract_images(sys.argv[1])

