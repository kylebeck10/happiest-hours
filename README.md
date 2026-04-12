# Happiest Hours

Discover happy hour deals across Los Angeles. Every deal in one place — find what's pouring near you right now.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with live deal counter and preview cards |
| `/explore` | Interactive map + filterable deal card grid |
| `/contact` | Contact and venue submission |
| `/privacy` | Privacy policy |

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with custom "Peach & Pop" theme
- **Map:** react-leaflet + CartoDB Positron tiles (no API key required)
- **Data:** Local JSON generated from Excel spreadsheet
- **Fonts:** Instrument Serif + DM Sans (Google Fonts)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating venue data

All venue data lives in `data/deals.xlsx`. Edit it in Excel, then the JSON regenerates automatically on the next `npm run dev` or `npm run build`.

### Adding a venue
1. Add a row to `data/deals.xlsx`
2. Use kebab-case for the `id` column (e.g. `my-new-bar`)
3. Drop a photo at `public/venues/{id}.jpg`
4. Run `npm run dev` — the JSON updates automatically

### Column reference

| Column | Required | Notes |
|---|---|---|
| `id` | ✓ | Kebab-case, must match image filename |
| `name` | ✓ | Full venue name |
| `neighborhood` | ✓ | Kebab-case ID (e.g. `silverlake`) |
| `neighborhoodName` | ✓ | Display name (e.g. `Silver Lake`) |
| `deal` | ✓ | Short deal summary shown on card |
| `dealDetails` | | Full itemized deals, separated by ` \| ` |
| `time` | ✓ | e.g. `4–7 PM`, `10 PM–1 AM` |
| `days` | | e.g. `Mon–Fri`, `Daily`, `Tue–Sun` |
| `address` | | Full street address |
| `type` | ✓ | One of: `wine`, `cocktail`, `beer`, `food` |
| `rating` | | Decimal, e.g. `4.7` |
| `vibe` | ✓ | e.g. `Rooftop`, `Dive Bar`, `Patio` |
| `img` | ✓ | Emoji placeholder shown when no photo |
| `lat` | ✓ | Decimal latitude |
| `lng` | ✓ | Decimal longitude |

### Scripts

```bash
npm run build:data   # Manually regenerate deals.json from deals.xlsx
npm run seed:xlsx    # (One-time) Bootstrap deals.xlsx from deals.json
```

## Live badge logic

The LIVE badge is computed dynamically against **LA time** (`America/Los_Angeles`) using the venue's `time` and `days` fields. It re-checks every 60 seconds. No manual toggling needed.

## Project structure

```
app/
  page.js              Landing page
  explore/page.js      Map + deal grid
  contact/page.js      Contact page
  privacy/page.js      Privacy policy
  layout.js            Root layout + fonts
  globals.css          Theme tokens + keyframes
components/
  VenueCard.jsx        Deal card for grid
  VenueModal.jsx       Click-through detail popup
  MiniCard.jsx         Compact card for landing preview
  MapView.jsx          Leaflet map with pins
  TagBadge.jsx         Colored category pill
  LiveBadge.jsx        Pulsing green LIVE indicator
data/
  deals.xlsx           Source of truth — edit this
  deals.json           Generated — do not edit directly
  neighborhoods.json   Neighborhood bounds for map
lib/
  isLive.js            Time parser + LA timezone logic
  useIsLive.js         React hook wrapping isLive
public/
  venues/              Venue photos ({id}.jpg)
scripts/
  build-deals.mjs      xlsx → json converter
  seed-xlsx.mjs        json → xlsx bootstrapper
```
