# Detroit Photography: Strategic Vision & Prime Directive

> **Last Updated:** December 15, 2024  
> **Purpose:** Guide all development decisions and provide context for AI agents and collaborators

---

## Executive Summary

Detroit Photography is a portrait photography business with a strategic content play: building the definitive online resource for Detroit's historic architecture. This architecture content serves as an SEO engine and authority builder that drives traffic and credibility, ultimately converting visitors into portrait photography clients.

**The money is in portraiture. The moat is in architecture content.**

---

## Business Model

### Primary Revenue: Portrait Photography
- Professional headshots (starting at $149)
- Corporate team photography
- Executive portraits
- LinkedIn profile photos
- Branding photography sessions

### Secondary Revenue: Architecture
- Fine art print sales of Detroit architecture
- Licensing of architectural photography
- (Future) Guided photography tours

### The Strategic Bridge
Architecture enthusiasts who discover the site through historic building content are the exact demographic that hires portrait photographers:
- Professionals who care about aesthetics
- Executives at Detroit companies
- People connected to Detroit's history and identity
- Individuals with disposable income for quality photography

---

## The NRHP Content Strategy

### What is NRHP?
The National Register of Historic Places (NRHP) is the official list of historic properties in the United States. Each listed property has a **nomination document** (PDF) containing:
- Detailed architectural descriptions
- Historical significance statements
- Original construction dates and architects
- **Historic photographs** (often from the early 1900s)
- Maps and site plans

**Critical insight:** This content is public domain and can be used for any purpose, but it's buried in government PDFs that Google cannot index. We are digitizing and structuring this content.

### The Content Moat
By extracting, structuring, and presenting NRHP data in an SEO-friendly format, we create:

1. **Unique text content** - Historic significance statements not available anywhere else online
2. **Unique historic images** - Scanned photographs from nomination documents
3. **Original photography** - Our own copyrighted modern photos of these buildings
4. **Structured data** - Architect, style, year, neighborhood relationships
5. **Local authority** - Detroit-specific focus with professional local presence

### Competitive Advantage
| Factor | Wikipedia | HistoricDetroit.org | DetroitUrbex | **Us** |
|--------|-----------|---------------------|--------------|--------|
| Complete NRHP data | Partial | Some | No | **Yes** |
| Professional photos | No | Limited | Good | **Yes** |
| Structured database | No | No | No | **Yes** |
| Local business presence | No | No | No | **Yes** |
| Portrait cross-sell | No | No | No | **Yes** |

---

## Content Architecture

### Building Pages (`/architecture/building/[id]`)
Each historic building gets a dedicated page with:
- Hero image (our photo if available, historic if not)
- Quick facts (year, architect, style, status)
- Historical significance (from NRHP nomination)
- Image gallery (mixing historic + modern)
- Interactive map
- Nearby buildings
- Links to architect's other works
- CTA for portrait sessions at this or similar locations

### Aggregate Pages
- **By Neighborhood:** Corktown, Midtown, Downtown, New Center, etc.
- **By Architect:** Albert Kahn, Minoru Yamasaki, Wirt Rowland, etc.
- **By Style:** Art Deco, Romanesque Revival, Beaux-Arts, etc.
- **By Era:** 1900s, 1920s, 1960s, etc.
- **Curated Lists:** "Detroit's Most Photographed Buildings," "Hidden Gems," etc.

### Blog/Guide Content
- Deep-dive articles on specific buildings
- Architect profiles and legacy pieces
- Neighborhood architecture guides
- "Best locations for portrait photography"
- Walking tour guides

### SEO Keyword Targets
- "[Building Name] Detroit" (e.g., "Fisher Building Detroit")
- "[Building Name] history"
- "[Architect] Detroit buildings"
- "Historic buildings in [Neighborhood]"
- "Art Deco buildings Detroit"
- "Best photo locations Detroit"

---

## Technical Architecture

### Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Image Optimization:** Next.js Image with AVIF/WebP
- **Maps:** Leaflet

### Database Schema (Target State)
```sql
-- Core building data
buildings:
  id UUID PRIMARY KEY
  name TEXT NOT NULL
  slug TEXT UNIQUE NOT NULL
  address TEXT
  city TEXT DEFAULT 'Detroit'
  state TEXT DEFAULT 'MI'
  lat DECIMAL
  lng DECIMAL
  year_built INTEGER
  year_demolished INTEGER (nullable)
  architect_id UUID REFERENCES architects
  style TEXT
  neighborhood TEXT
  nrhp_number TEXT
  nrhp_listed_date DATE
  significance_text TEXT (from NRHP - the gold)
  current_status TEXT (active, demolished, endangered)
  created_at TIMESTAMP
  updated_at TIMESTAMP

-- Images for buildings
building_images:
  id UUID PRIMARY KEY
  building_id UUID REFERENCES buildings
  image_url TEXT NOT NULL
  source TEXT (nrhp_historic, own_photo, public_domain)
  caption TEXT
  year_taken INTEGER
  is_primary BOOLEAN DEFAULT FALSE
  photographer TEXT
  copyright_status TEXT

-- Architect information
architects:
  id UUID PRIMARY KEY
  name TEXT NOT NULL
  slug TEXT UNIQUE
  birth_year INTEGER
  death_year INTEGER
  bio TEXT
  notable_style TEXT

-- For future: user engagement
building_views:
  building_id UUID
  viewed_at TIMESTAMP
  referrer TEXT
```

### File Structure
```
/data/nrhp/
  /pdfs/           # Original NRHP nomination PDFs (git-ignored, large files)
  /extracted/      # Extracted text and metadata (JSON)
  /images/         # Historic images extracted from PDFs

/public/images/
  /architecture/   # Our own architecture photography
  /headshots/      # Portrait photography
```

### Deployment Notes
- Large NRHP PDFs are excluded from git (see .gitignore)
- Deploy to Vercel with `npx vercel --prod`
- Always commit and push to GitHub after Vercel deploy
- Google Places API configured for live review counts

---

## The Portrait-Architecture Bridge

### On Architecture Pages
Every architecture page should include subtle but present CTAs:
- "Book a portrait session at this historic location"
- "We photograph people in Detroit's most beautiful buildings"
- Link to `/book` or `#pricing`

### Location-Based Service Pages
Create landing pages targeting:
- "Headshots at the Fisher Building"
- "Executive portraits in historic Detroit"
- "Unique headshot locations in Detroit"

### The Studio Location Advantage
We operate out of **Bagley Mansion** (John N. Bagley House), which is itself on the National Register of Historic Places. This creates a perfect narrative:
- "We're so passionate about Detroit's architecture that we work in a National Historic Landmark"
- The studio is a destination, not just a backdrop
- Clients experience history while getting professional portraits

---

## Content Pipeline

### Phase 1: Data Acquisition
1. Download all Wayne County NRHP nomination PDFs (~200-300 properties)
2. Prioritize Detroit city properties
3. Store in `/data/nrhp/pdfs/`

### Phase 2: Data Extraction
1. Parse PDFs to extract:
   - Building name, address
   - Year built, architect, style
   - Significance statement (Section 8 of NRHP form)
   - Historic photographs
2. Store structured data in Supabase
3. Store extracted images in `/data/nrhp/images/`

### Phase 3: Content Enrichment
1. Match buildings with our own photography
2. Add modern context (current use, recent news)
3. Create neighborhood and architect groupings
4. Write additional editorial content

### Phase 4: SEO Optimization
1. Schema.org markup for `LandmarksOrHistoricalBuildings`
2. Internal linking (building → architect → neighborhood)
3. Dynamic sitemap generation
4. Open Graph images for social sharing

### Phase 5: Scale
1. Expand to Oakland and Macomb counties
2. Add user-contributed photos (moderated)
3. Build "Recently Demolished" memorial section
4. Partner with local history organizations for backlinks

---

## Key Metrics

### Architecture Content
- Organic search impressions/clicks
- Page views per building
- Time on page (engagement)
- Backlinks acquired
- Social shares

### Business Conversion
- Architecture → Headshots page navigation
- Form submissions from architecture visitors
- Booking conversions with architecture referrer

### Technical Health
- PageSpeed scores (target: 90+ mobile)
- Core Web Vitals
- Indexation rate in Google Search Console

---

## Principles for Development

### 1. Content Quality Over Quantity
One deeply researched building page beats ten shallow ones. Each page should provide genuine value that can't be found elsewhere.

### 2. Photography First
We are photographers. Every page should showcase visual excellence. If we don't have a good photo of a building, the historic images should be presented beautifully.

### 3. Local Authenticity
This is a Detroit project by a Detroit photographer. The voice should be knowledgeable, passionate, and locally rooted—not generic SEO content.

### 4. Sustainable Architecture
Build for the long term. Clean code, proper database design, and maintainable content structures. This site should still work and be updatable in 5 years.

### 5. The Bridge is Natural
Never force the portrait upsell. The connection between "we document Detroit's architecture" and "we photograph Detroit's people" should feel organic and credible.

### 6. Performance Matters
Fast page loads, optimized images, proper caching. Mobile-first design. Our audience may be browsing on phones while walking past these buildings.

---

## Current State (December 2024)

### Completed
- [x] Core Next.js site with headshots focus
- [x] `/architecture` section with map view
- [x] `/architecture/building/[id]` dynamic pages
- [x] `/architecture/store` for print sales
- [x] Supabase integration
- [x] Basic building database structure
- [x] Some NRHP PDFs collected

### In Progress
- [ ] PDF parsing pipeline for NRHP documents
- [ ] Bulk data extraction
- [ ] Historic image extraction

### Next Up
- [ ] Complete Wayne County NRHP download
- [ ] Design building page template with historic content
- [ ] Create architect and neighborhood aggregate pages
- [ ] Implement Schema.org markup for historic places
- [ ] Build internal linking system

---

## For AI Agents: Key Context

When working on this codebase, remember:

1. **Dual purpose:** This site serves both portrait photography clients AND architecture enthusiasts. Don't break either experience.

2. **NRHP is the secret weapon:** The `/data/nrhp/` folder contains public domain gold. Treat this content extraction as a core priority.

3. **SEO matters:** Every architecture page is a potential search entry point. Proper meta tags, schema markup, and semantic HTML are essential.

4. **The studio is Bagley Mansion:** References to "our studio" or "the mansion" refer to the John N. Bagley House, a National Historic Landmark at 2921 E Jefferson Ave.

5. **Deployment pattern:** Always deploy to Vercel first (`npx vercel --prod`), then commit and push to GitHub. This is faster than waiting for GitHub webhooks.

6. **Large files:** PDFs in `/data/nrhp/pdfs/` are git-ignored due to size. Don't try to commit them.

7. **The owner is Andrew Petrov:** Professional photographer, architecture enthusiast, and the creative vision behind this project.

---

## Contact & Resources

- **Website:** https://www.detroitphotography.com
- **Studio:** Bagley Mansion, 2921 E Jefferson Ave, Detroit, MI 48207
- **NRHP Database:** https://npgallery.nps.gov/NRHP
- **Michigan SHPO:** https://www.michigan.gov/mshda/development/shpo

---

*This document is the prime directive. When in doubt, refer back to the core insight: the money is in portraiture, but the moat is in architecture content. Build the moat.*

