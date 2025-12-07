# Detroit Architecture Repository

A comprehensive catalog of historic Detroit architecture, featuring buildings from the AIA Detroit Guide and The Buildings of Detroit by W. Hawkins Ferry.

## Features

- 🏛️ **550+ buildings** with detailed information
- 🗺️ **Interactive map** with filtering
- 📷 **Photo gallery** with upload capability
- 🔍 **Advanced search** by name, architect, style, year
- 📱 **Mobile responsive** design
- ⚡ **Fast** - built with Next.js and Supabase

## Quick Start

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase-schema.sql`
4. Go to Settings → API and copy your keys

### 3. Configure Environment

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Install Dependencies

```bash
cd detroit-architecture-site
npm install
```

### 5. Migrate Data

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"
python3 scripts/migrate_data.py
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

1. Push to GitHub
2. Connect to [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

## Project Structure

```
detroit-architecture-site/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Home page (building grid)
│   │   ├── map/               # Interactive map
│   │   ├── building/[id]/     # Individual building pages
│   │   └── admin/             # Admin panel
│   ├── components/            # React components
│   └── lib/                   # Utilities & Supabase client
├── scripts/                   # Python scripts
│   ├── migrate_data.py       # Import existing data
│   └── upload_photos.py      # Bulk photo upload
├── public/                    # Static assets
└── supabase-schema.sql       # Database schema
```

## Admin Panel

Access at `/admin` to:
- Upload photos for buildings
- Add photographer notes
- Manage building data

## Python Scripts

### Migrate Data
```bash
python3 scripts/migrate_data.py
```

### Upload Photos
```bash
# Single building
python3 scripts/upload_photos.py -b "Fisher Building" -p photo1.jpg photo2.jpg

# Directory structure (subdirs = building names)
python3 scripts/upload_photos.py -d ./photos/
```

## Customization

### Styling
Edit `tailwind.config.ts` for colors and fonts. Main colors:
- `detroit-blue`: #1a365d
- `detroit-gold`: #c9a227
- `detroit-red`: #8b2635

### Adding Buildings
Use the Supabase dashboard or Python scripts to add new buildings.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Maps**: Leaflet
- **Deployment**: Vercel

## Domain Setup

To use `architecture.detroitphotography.com`:

1. In Vercel, go to Settings → Domains
2. Add `architecture.detroitphotography.com`
3. Add a CNAME record in your DNS pointing to Vercel

## License

© Andrew Petrov. All rights reserved.

Data sourced from:
- AIA Detroit Guide (2003)
- The Buildings of Detroit by W. Hawkins Ferry (1968)


