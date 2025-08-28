# Drop Test

A production-ready desktop-only web app for testing music video drops with TikTok-like interface. Built with Vite, React, TypeScript, TailwindCSS, and Supabase.

## Features

- **Desktop-only UI** optimized for 1440×900
- **TikTok-like vertical feed** with full-viewport video players
- **Autoplay muted videos** with looping
- **Keyboard navigation** (Arrow keys, Page Up/Down, L/D for thumbs)
- **Mouse wheel navigation**
- **Thumb up/down voting** with toggle behavior
- **Progress tracking** (current/total)
- **End survey** for rated drops only
- **Admin panel** with CSV exports
- **Session-based data collection**

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS (dark theme)
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router (HashRouter for GitHub Pages)
- **Validation**: Zod
- **Deployment**: GitHub Pages

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd drops_webapp
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_ADMIN_KEY=your_admin_key_here
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Settings > API
4. Update your `.env` file with these values

### 4. Content Setup

#### Videos
Place your MP4 videos in `public/videos/` with the following specifications:
- Format: MP4 H.264/AAC
- Resolution: 1080×1920 (portrait)
- Duration: 10-20 seconds
- Keep file sizes small for fast loading

#### Drops Manifest
Update `public/drops.json` with your video metadata:

```json
[
  {
    "id": "drop-001",
    "track": "Song Title",
    "artist": "Artist Name",
    "albumArtUrl": "/assets/album-art/drop-001.jpg",
    "videoUrl": "/videos/drop-001.mp4",
    "durationSec": 15
  }
]
```

**Note**: Album art URLs are kept for metadata only and are not displayed in the UI.

### 5. Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### GitHub Pages

1. Update `vite.config.ts` with your repository name:
   ```typescript
   base: "/your-repo-name/",
   ```

2. Deploy using the provided script:
   ```bash
   npm run deploy
   ```

3. Or manually:
   ```bash
   npm run build
   # Upload dist/ contents to gh-pages branch
   ```

### Environment Variables for Production

For GitHub Pages, you'll need to set environment variables in your deployment process. You can use GitHub Secrets or a similar service.

## Data Model

### Tables

1. **onboarding**
   - User registration data (name, age, gender, location, music platforms)
   - Session ID for tracking

2. **events**
   - User interactions (thumb up/down, skip)
   - Tracks all actions per drop per session

3. **surveys**
   - End survey responses for rated drops
   - Visual impact ratings (1-5) and optional comments

### Security

- Row Level Security (RLS) enabled on all tables
- Insert permissions for anonymous users
- Read permissions for admin access only
- Admin access controlled by `VITE_ADMIN_KEY`

## Admin Panel

Access the admin panel at `/#/admin` or `/#/admin?key=YOUR_ADMIN_KEY`

Features:
- Export onboarding data as CSV
- Export events data as CSV
- Export survey responses as CSV

## User Flow

1. **Onboarding**: Users provide name, age, gender, location, and music platform usage
2. **Feed**: Users view 20 randomly ordered drops with thumb up/down voting
3. **Survey**: Users rate visual impact for drops they voted on
4. **Completion**: Thank you message

## Keyboard Controls

- **Arrow Up/Page Up**: Previous drop
- **Arrow Down/Page Down**: Next drop
- **Mouse Wheel**: Navigate drops
- **L**: Thumb up
- **D**: Thumb down

## File Structure

```
src/
├── components/          # Reusable UI components
├── routes/             # Page components
├── lib/                # Utilities and configurations
├── data/               # Data loading functions
├── utils/              # Helper functions
└── styles.css          # Global styles
```

## Security Considerations

- **Anon Key Exposure**: The anon key is exposed in the client. While RLS provides some protection, consider rotating keys if compromised.
- **Admin Access**: Keep your admin key secure and rotate it regularly.
- **Data Privacy**: Ensure compliance with data protection regulations for your use case.

## Troubleshooting

### Video Autoplay Issues
- Videos are muted by default (browser requirement)
- No visible controls (per spec)
- Users cannot unmute (by design)

### Database Connection Issues
- Verify Supabase URL and anon key
- Check RLS policies are correctly applied
- Ensure tables exist and have correct structure

### Build Issues
- Ensure all environment variables are set
- Check that `vite.config.ts` base path matches your repository name
- Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]
# drops-visuals-survey
# Updated for Supabase deployment
