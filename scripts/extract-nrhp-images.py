#!/usr/bin/env python3
"""
Extract PHOTOGRAPHS from NRHP PDF files, filtering out form pages.
Uses GPT-4 Vision to determine if images are photos and if they need rotation.
Usage: python scripts/extract-nrhp-images.py <pdf_file>
"""

import sys
import os
import json
import re
import base64
import fitz  # PyMuPDF
from pathlib import Path
from PIL import Image, ExifTags
import io
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local
script_dir = Path(__file__).parent
env_path = script_dir.parent / '.env.local'
load_dotenv(env_path)

# Also try parent directory .env
parent_env = script_dir.parent.parent / '.env'
if parent_env.exists():
    load_dotenv(parent_env)

# Initialize OpenAI client
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    # Try to read from common locations
    for env_file in ['.env', '.env.local', '../.env', '~/.openai_api_key']:
        try:
            path = Path(env_file).expanduser()
            if path.exists():
                with open(path) as f:
                    for line in f:
                        if 'OPENAI_API_KEY' in line:
                            api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
                            break
        except:
            pass
        if api_key:
            break

client = OpenAI(api_key=api_key) if api_key else None

def analyze_rotation_by_brightness(image_bytes: bytes) -> int:
    """
    Analyze image brightness to determine rotation.
    Sky should be at top (brightest), ground at bottom.
    Returns rotation needed in degrees clockwise (0, 90, 180, 270).
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        arr = np.array(img)
        height, width = arr.shape[:2]
        
        # Calculate average brightness of each edge region (10% of image)
        edge_size_h = height // 10
        edge_size_w = width // 10
        
        top_brightness = np.mean(arr[:edge_size_h, :, :])
        bottom_brightness = np.mean(arr[-edge_size_h:, :, :])
        left_brightness = np.mean(arr[:, :edge_size_w, :])
        right_brightness = np.mean(arr[:, -edge_size_w:, :])
        
        edges = {
            'top': top_brightness,
            'bottom': bottom_brightness,
            'left': left_brightness,
            'right': right_brightness
        }
        
        brightest_edge = max(edges, key=edges.get)
        brightness_diff = max(edges.values()) - min(edges.values())
        
        # Only rotate if there's a significant brightness difference (> 25)
        if brightness_diff > 25:
            if brightest_edge == 'bottom':
                return 180
            elif brightest_edge == 'left':
                return 90
            elif brightest_edge == 'right':
                return 270
        
        return 0
    except:
        return 0


def analyze_image_with_ai(image_bytes: bytes) -> dict:
    """
    Use GPT-4 Vision to analyze if image is a photo and if it needs rotation.
    Falls back to brightness analysis if no API key.
    Returns: {'is_photo': bool, 'rotation_needed': int (0, 90, 180, 270), 'reason': str}
    """
    if not client:
        print("      ⚠️  No OpenAI API key - using brightness analysis")
        rotation = analyze_rotation_by_brightness(image_bytes)
        return {'is_photo': True, 'rotation_needed': rotation, 'reason': 'Brightness analysis (no API key)'}
    
    try:
        # Convert to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this image from a National Register of Historic Places PDF filing.

Answer these questions:
1. Is this a PHOTOGRAPH of a building/structure? (Not a map, form, drawing, floor plan, or text document)
2. If it's a photograph, is it correctly oriented? (Sky should be at top, ground at bottom, building upright)
3. If rotation is needed, how many degrees clockwise should it be rotated? (90, 180, or 270)

Respond in JSON format only:
{"is_photo": true/false, "rotation_needed": 0/90/180/270, "reason": "brief explanation"}"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "low"
                            }
                        }
                    ]
                }
            ],
            max_tokens=150
        )
        
        # Parse JSON response
        content = response.choices[0].message.content.strip()
        # Extract JSON from response (handle markdown code blocks)
        if '```' in content:
            content = content.split('```')[1]
            if content.startswith('json'):
                content = content[4:]
        
        result = json.loads(content)
        return result
        
    except Exception as e:
        print(f"      ⚠️  AI analysis failed: {e}")
        # Fallback to brightness analysis
        rotation = analyze_rotation_by_brightness(image_bytes)
        return {'is_photo': True, 'rotation_needed': rotation, 'reason': 'Fallback to brightness analysis'}

def detect_and_fix_rotation(image_bytes: bytes) -> tuple[bytes, int]:
    """
    Detect if image needs rotation based on EXIF data and image content analysis.
    For building photos: sky should be at top (brighter), ground at bottom (darker).
    Returns (corrected_bytes, rotation_applied)
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        rotation = 0
        
        # Check EXIF orientation tag first
        if hasattr(img, '_getexif') and img._getexif():
            exif = img._getexif()
            if exif:
                for tag, value in exif.items():
                    if ExifTags.TAGS.get(tag) == 'Orientation':
                        if value == 3:
                            img = img.rotate(180, expand=True)
                            rotation = 180
                        elif value == 6:
                            img = img.rotate(270, expand=True)
                            rotation = 90
                        elif value == 8:
                            img = img.rotate(90, expand=True)
                            rotation = 270
                        break
        
        # If EXIF already rotated, we're done
        if rotation != 0:
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=95)
            return output.getvalue(), rotation
        
        # Analyze image content to determine correct orientation
        # For building photos: sky (bright) should be at top, ground (dark) at bottom
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        arr = np.array(img)
        height, width = arr.shape[:2]
        
        # Calculate average brightness of each edge region (10% of image)
        edge_size_h = height // 10
        edge_size_w = width // 10
        
        top_brightness = np.mean(arr[:edge_size_h, :, :])
        bottom_brightness = np.mean(arr[-edge_size_h:, :, :])
        left_brightness = np.mean(arr[:, :edge_size_w, :])
        right_brightness = np.mean(arr[:, -edge_size_w:, :])
        
        # Determine which edge is likely the sky (brightest)
        edges = {
            'top': top_brightness,
            'bottom': bottom_brightness,
            'left': left_brightness,
            'right': right_brightness
        }
        
        brightest_edge = max(edges, key=edges.get)
        brightness_diff = max(edges.values()) - min(edges.values())
        
        # Only rotate if there's a significant brightness difference (> 20)
        # This indicates a clear sky vs ground distinction
        if brightness_diff > 20:
            if brightest_edge == 'bottom':
                # Image is upside down
                img = img.rotate(180, expand=True)
                rotation = 180
                print(f"      🔄 Auto-rotating 180°: sky detected at bottom")
            elif brightest_edge == 'left':
                # Image is rotated 90° counterclockwise
                img = img.rotate(-90, expand=True)
                rotation = 90
                print(f"      🔄 Auto-rotating 90° CW: sky detected on left")
            elif brightest_edge == 'right':
                # Image is rotated 90° clockwise
                img = img.rotate(90, expand=True)
                rotation = 270
                print(f"      🔄 Auto-rotating 90° CCW: sky detected on right")
            # If brightest is top, image is correctly oriented
        
        # Fallback: if still very portrait and no rotation applied, likely needs 90° rotation
        width, height = img.size
        aspect = width / height
        if aspect < 0.7 and rotation == 0:
            # Very portrait image - likely scanned sideways
            img = img.rotate(-90, expand=True)
            rotation = 90
            print(f"      🔄 Auto-rotating: very portrait aspect {aspect:.2f}")
        
        if rotation != 0:
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=95)
            return output.getvalue(), rotation
        
        return image_bytes, 0
        
    except Exception as e:
        print(f"      Warning: Could not check rotation: {e}")
        return image_bytes, 0

def is_photograph(image_bytes: bytes, width: int, height: int) -> tuple[bool, str]:
    """
    Determine if an image is a photograph vs a form/document/map/drawing.
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
        
        # ========== DETECT MAPS ==========
        # Maps have distinctive cartographic colors: bright blue (water), red/pink (buildings), green (parks)
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        
        # Check for map-like colors (bright blue water, red/pink areas)
        bright_blue = np.sum((b > 150) & (r < 150) & (g < 200)) / total_pixels
        bright_red_pink = np.sum((r > 180) & (b < 180) & (g < 180)) / total_pixels
        
        if bright_blue > 0.03 and bright_red_pink > 0.05:
            return False, f"Appears to be a map (blue: {bright_blue:.1%}, red/pink: {bright_red_pink:.1%})"
        
        # Maps often have very saturated, distinct color regions
        # Check for high color saturation in discrete regions
        hsv_like = np.max(arr, axis=2) - np.min(arr, axis=2)  # Approximate saturation
        high_saturation = np.sum(hsv_like > 100) / total_pixels
        if high_saturation > 0.15 and bright_blue > 0.02:
            return False, f"Appears to be a colored map (saturation: {high_saturation:.1%})"
        
        # ========== DETECT ARCHITECTURAL DRAWINGS ==========
        # Floor plans/drawings are mostly white with thin black lines
        black_threshold = 50
        black_pixels = np.sum(np.all(arr < black_threshold, axis=2))
        black_ratio = black_pixels / total_pixels
        
        # Drawings: high white + some black lines, low mid-tones
        if white_ratio > 0.5 and black_ratio > 0.02 and black_ratio < 0.15:
            # Check for line-like structures (low mid-tone content)
            mid_pixels = np.sum((arr > 80) & (arr < 200))
            mid_ratio = mid_pixels / (total_pixels * 3)  # 3 channels
            if mid_ratio < 0.2:
                return False, f"Appears to be an architectural drawing (white: {white_ratio:.1%}, black lines: {black_ratio:.1%})"
        
        # ========== STANDARD FORM DETECTION ==========
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


def find_photo_captions(doc) -> dict:
    """
    Search the entire document for a caption page that lists photo descriptions.
    Returns a dict mapping photo number to caption text.
    """
    best_captions = {}
    best_page = -1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        captions = {}
        
        # Look for dedicated photo/view caption pages
        # These pages typically have "Photographs" header AND numbered views
        is_caption_page = (
            ('views:' in text.lower() and '#' in text) or
            ('photograph' in text.lower() and 'continuation sheet' in text.lower()) or
            (re.search(r'Photo\s+\d+\s+of\s+\d+', text, re.IGNORECASE))
        )
        
        if is_caption_page:
            # Pattern 1: #1: Description; #2: Description; (separated by semicolon or newline)
            pattern1 = r'#(\d+)[:\s]+([^#]+?)(?=;?\s*#\d|$)'
            matches1 = re.findall(pattern1, text, re.DOTALL)
            for num, desc in matches1:
                desc_clean = desc.strip().replace('\n', ' ').rstrip(';').strip()
                if len(desc_clean) > 5:  # Must be meaningful
                    captions[int(num)] = desc_clean
            
            # Pattern 2: Photo 1: Description / Photo 2: Description
            pattern2 = r'Photo\s*(\d+)[:\s]+([^P]+?)(?=Photo\s*\d|$)'
            matches2 = re.findall(pattern2, text, re.IGNORECASE | re.DOTALL)
            for num, desc in matches2:
                desc_clean = desc.strip().replace('\n', ' ')
                if len(desc_clean) > 5:
                    captions[int(num)] = desc_clean
        
        # Keep the page with the most photo captions found
        if len(captions) > len(best_captions):
            best_captions = captions
            best_page = page_num
            
            # Also capture photographer/date info from this page
            photographer_match = re.search(r'Photographer[:\s]+([^\n]+)', text, re.IGNORECASE)
            date_match = re.search(r'Date\s+taken[:\s]+([^\n]+)', text, re.IGNORECASE)
            if not date_match:
                date_match = re.search(r'Date[:\s]+([^\n]+)', text, re.IGNORECASE)
            
            if photographer_match:
                best_captions['_photographer'] = photographer_match.group(1).strip()
            if date_match:
                best_captions['_date'] = date_match.group(1).strip()
    
    if best_captions:
        print(f"📝 Found {len([k for k in best_captions if not str(k).startswith('_')])} photo captions on page {best_page + 1}")
    
    return best_captions


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
    
    # First, find the caption page with numbered photo descriptions
    photo_captions = find_photo_captions(doc)
    if photo_captions:
        for num, caption in photo_captions.items():
            if not str(num).startswith('_'):
                print(f"   #{num}: {caption[:60]}{'...' if len(caption) > 60 else ''}")
    
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
                
                # First do quick filter with basic analysis
                is_photo_basic, reason = is_photograph(image_bytes, width, height)
                
                if not is_photo_basic:
                    print(f"   ⏭️  Skipped: {reason}")
                    skipped_count += 1
                    continue
                
                # Use AI to verify it's a photo and check rotation
                print(f"   🤖 Analyzing with AI...")
                ai_result = analyze_image_with_ai(image_bytes)
                
                if not ai_result.get('is_photo', True):
                    print(f"   ⏭️  Skipped (AI): {ai_result.get('reason', 'Not a photo')}")
                    skipped_count += 1
                    continue
                
                # Apply rotation if AI detected it's needed
                rotation_needed = ai_result.get('rotation_needed', 0)
                corrected_bytes = image_bytes
                
                if rotation_needed and rotation_needed != 0:
                    print(f"   🔄 AI detected rotation needed: {rotation_needed}° clockwise")
                    img = Image.open(io.BytesIO(image_bytes))
                    # PIL rotate is counterclockwise, so we negate
                    rotated = img.rotate(-rotation_needed, expand=True)
                    output = io.BytesIO()
                    rotated.save(output, format='JPEG', quality=95)
                    corrected_bytes = output.getvalue()
                    print(f"   ✅ Rotated {rotation_needed}°")
                
                # Generate filename (always save as JPEG for consistency)
                filename = f"{ref_number}_page{page_num + 1:03d}_img{img_idx + 1:02d}.jpeg"
                output_path = output_dir / filename
                
                # Save image
                with open(output_path, "wb") as f:
                    f.write(corrected_bytes)
                
                print(f"   ✅ {filename} ({width}x{height}) - {ai_result.get('reason', 'Photo')}")
                
                # Try to extract caption - check current page, previous page, and next page
                caption = None
                pages_to_check = []
                
                # Current page
                if page_text:
                    pages_to_check.append(("current", page_text))
                
                # Previous page (captions often precede photos)
                if page_num > 0:
                    prev_page = doc[page_num - 1]
                    prev_text = extract_page_text(prev_page)
                    if prev_text:
                        pages_to_check.append(("previous", prev_text))
                
                # Next page (captions sometimes follow photos)
                if page_num < len(doc) - 1:
                    next_page = doc[page_num + 1]
                    next_text = extract_page_text(next_page)
                    if next_text:
                        pages_to_check.append(("next", next_text))
                
                # Look for caption patterns in each page
                caption_patterns = [
                    r'Photo \d+ of \d+.*',
                    r'View (?:from|of|looking).*',
                    r'(?:North|South|East|West).*(?:elevation|facade|view).*',
                    r'(?:Exterior|Interior|Front|Rear|Side).*(?:view|elevation).*',
                    r'(?:First|Second|Third|Ground).*(?:floor|story).*',
                    r'(?:Detail|Close-up|Showing).*',
                ]
                
                for page_location, text in pages_to_check:
                    # First check for specific caption patterns
                    for pattern in caption_patterns:
                        match = re.search(pattern, text, re.IGNORECASE)
                        if match:
                            caption = text.strip()
                            print(f"      📝 Caption found on {page_location} page")
                            break
                    if caption:
                        break
                    
                    # If short text (likely a caption page), use it
                    if len(text) < 800 and len(text) > 20:
                        # Check if it looks like a caption (has building name, photo info, etc.)
                        if any(kw in text.lower() for kw in ['photo', 'view', 'building', 'elevation', 'facade', 'exterior', 'interior']):
                            caption = text.strip()
                            print(f"      📝 Caption found on {page_location} page (short text)")
                            break
                
                # If no caption from adjacent pages, try the pre-found numbered captions
                if not caption and (photo_count + 1) in photo_captions:
                    caption = photo_captions[photo_count + 1]
                    print(f"      📝 Using caption #{photo_count + 1} from caption page")
                
                if not caption:
                    print(f"      ⚠️  No caption found")
                
                # Build full caption with photographer/date if available
                full_caption = caption
                if caption and '_photographer' in photo_captions:
                    full_caption = f"{caption} (Photo by {photo_captions['_photographer']}"
                    if '_date' in photo_captions:
                        full_caption += f", {photo_captions['_date']}"
                    full_caption += ")"
                
                extracted_images.append({
                    "filename": filename,
                    "page": page_num + 1,
                    "width": width,
                    "height": height,
                    "caption": full_caption
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
