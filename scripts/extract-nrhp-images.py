#!/usr/bin/env python3
"""
Extract PHOTOGRAPHS from NRHP PDF files, filtering out form pages.
Usage: python scripts/extract-nrhp-images.py <pdf_file>
"""

import sys
import os
import json
import re
import fitz  # PyMuPDF
from pathlib import Path
from PIL import Image
import io
import numpy as np

def is_photograph(image_bytes: bytes, width: int, height: int) -> tuple[bool, str]:
    """
    Determine if an image is a photograph vs a form/document page.
    Returns (is_photo, reason)
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to numpy array for analysis
        if img.mode != 'RGB':
            img = img.convert('RGB')
        arr = np.array(img)
        
        # Check aspect ratio - forms are usually letter/legal sized (portrait)
        aspect = width / height
        
        # Calculate color statistics
        std_dev = np.std(arr)
        mean_val = np.mean(arr)
        
        # Check for mostly white images (forms typically have white backgrounds)
        white_threshold = 240
        white_pixels = np.sum(np.all(arr > white_threshold, axis=2))
        total_pixels = width * height
        white_ratio = white_pixels / total_pixels
        
        # Check for color variation (photos have more varied colors)
        color_std = np.std(arr, axis=(0,1))  # std per channel
        avg_color_std = np.mean(color_std)
        
        # Forms typically have:
        # - High white ratio (>60%)
        # - Low color variation
        # - Standard document aspect ratios
        
        if white_ratio > 0.6:
            return False, f"Too white ({white_ratio:.1%} white pixels - likely a form)"
        
        if avg_color_std < 25 and white_ratio > 0.4:
            return False, f"Low color variation ({avg_color_std:.1f}) with high white ({white_ratio:.1%})"
        
        # Check if it's a mostly uniform image
        if std_dev < 30:
            return False, f"Too uniform (std dev {std_dev:.1f})"
        
        # Small images in document aspect ratio are likely form elements
        if width < 500 and height < 500 and 0.7 < aspect < 1.4:
            return False, f"Small document-like image ({width}x{height})"
        
        return True, "Looks like a photograph"
        
    except Exception as e:
        # If analysis fails, be conservative and include it
        return True, f"Analysis failed ({e}), including by default"


def extract_page_text(page) -> str:
    """Extract text from a PDF page, cleaning up common artifacts."""
    text = page.get_text()
    
    # Common NRHP form artifacts to remove
    artifacts = [
        r'NPS Form \d+-\d+.*',
        r'OMB No\. \d+-\d+',
        r'United States Department of the Interior',
        r'National Park Service',
        r'National Register of Historic Places',
        r'Registration Form',
        r'Continuation Sheet',
        r'See continuation sheet',
        r'Section \d+\s+Page \d+',
        r'Section number.*Page.*',
        r'\(Expires \d+/\d+/\d+\)',
        r'For NPS use only',
        r'received\s+date entered',
    ]
    
    for pattern in artifacts:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE | re.MULTILINE)
    
    # Clean up extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.strip()
    
    return text


def clean_statement_text(text: str) -> str:
    """Clean up statement of significance or description text."""
    # Remove page breaks and artifacts
    artifacts = [
        r'CONTINUATION SHEET.*?\n',
        r'Section \d+.*?Page \d+',
        r'See continuation sheet',
        r'\(NR\)',  # National Register notation
        r'Statement of Significance',
        r'Narrative Description',
        r'8\.\s+Statement of Significance',
        r'7\.\s+Description',
    ]
    
    for pattern in artifacts:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    # Fix common OCR issues
    text = re.sub(r'i n', 'in', text)
    text = re.sub(r'o f', 'of', text)
    text = re.sub(r't h e', 'the', text)
    
    # Clean up whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    
    return text.strip()


def extract_images(pdf_path: str):
    """Extract photographs from a PDF file, filtering out form pages."""
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
    
    photo_count = 0
    skipped_count = 0
    extracted_images = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_images()
        page_text = extract_page_text(page)
        
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
                
                # Check if it's a photograph
                is_photo, reason = is_photograph(image_bytes, width, height)
                
                if not is_photo:
                    print(f"   ⏭️  Skipped: {reason}")
                    skipped_count += 1
                    continue
                
                # Generate filename
                filename = f"{ref_number}_page{page_num + 1:03d}_img{img_idx + 1:02d}.{image_ext}"
                output_path = output_dir / filename
                
                # Save image
                with open(output_path, "wb") as f:
                    f.write(image_bytes)
                
                print(f"   ✅ {filename} ({width}x{height}) - {reason}")
                
                # Try to extract caption from page text
                caption = None
                if page_text:
                    # Look for photo captions (often after "Photo" or at end of text)
                    caption_patterns = [
                        r'Photo \d+ of \d+.*',
                        r'View (?:from|of|looking).*',
                        r'(?:North|South|East|West).*(?:elevation|facade|view).*',
                    ]
                    for pattern in caption_patterns:
                        match = re.search(pattern, page_text, re.IGNORECASE)
                        if match:
                            caption = page_text  # Use full page text as caption
                            break
                    if not caption and len(page_text) < 500:
                        caption = page_text  # Short text is likely a caption
                
                extracted_images.append({
                    "filename": filename,
                    "page": page_num + 1,
                    "width": width,
                    "height": height,
                    "caption": caption
                })
                
                photo_count += 1
                
            except Exception as e:
                print(f"   ❌ Failed to extract image {img_idx + 1}: {e}")
    
    doc.close()
    
    print(f"\n📊 Results:")
    print(f"   ✅ Extracted {photo_count} photographs")
    print(f"   ⏭️  Skipped {skipped_count} form/document pages")
    
    # Create metadata file
    metadata = {
        "source_pdf": pdf_path.name,
        "ref_number": ref_number,
        "photos_extracted": photo_count,
        "forms_skipped": skipped_count,
        "images": extracted_images
    }
    
    with open(output_dir / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Done! Metadata saved to {output_dir / 'metadata.json'}")
    return metadata


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("""
Extract PHOTOGRAPHS from NRHP PDF files (filters out form pages).

Usage:
    python scripts/extract-nrhp-images.py <pdf_file>
    
Examples:
    python scripts/extract-nrhp-images.py data/nrhp/pdfs/95000531_architects_building.pdf
    python scripts/extract-nrhp-images.py data/nrhp/pdfs/89001165_guardian_building.pdf
""")
        sys.exit(1)
    
    extract_images(sys.argv[1])
