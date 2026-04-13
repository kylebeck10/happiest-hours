/**
 * collect-deals.mjs
 *
 * Reads seed-venues.json, calls Claude (claude-opus-4-6) with web search for
 * each venue, and appends one JSON object per line to results.jsonl.
 * Resumable: already-processed venue IDs are skipped.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/collect/collect-deals.mjs
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

const SEED_PATH    = join(__dirname, 'seed-venues.json');
const RESULTS_PATH = join(__dirname, 'results.jsonl');
const DELAY_MS     = 2000;

// ---------------------------------------------------------------------------
// Schema Claude must populate
// ---------------------------------------------------------------------------
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    neighborhood:     { type: 'string', description: 'lowercase slug, e.g. silverlake' },
    neighborhoodName: { type: 'string', description: 'Display name, e.g. Silver Lake' },
    deal:             { type: 'string', description: 'Short summary, 50 chars max' },
    dealDetails:      { type: 'array',  items: { type: 'string' }, description: 'List of individual deal items' },
    time:             { type: 'string', description: 'Happy hour time range, e.g. 4–7 PM' },
    days:             { type: 'string', description: 'Days active, e.g. Mon–Fri' },
    type:             { type: 'string', enum: ['wine', 'cocktail', 'beer', 'food'] },
    rating:           { type: 'number', description: 'Venue rating 1–5' },
    vibe:             { type: 'string', description: 'One-word atmosphere tag, e.g. Rooftop' },
    img:              { type: 'string', description: 'Single relevant emoji for the venue' },
    lat:              { type: 'number', description: 'Latitude' },
    lng:              { type: 'number', description: 'Longitude' },
    confidence:       { type: 'string', enum: ['high', 'medium', 'low'] },
    source_url:       { type: 'string', description: 'URL where deal info was found' },
    image_url:        { type: 'string', description: 'Direct URL to a photo of the venue' },
  },
  required: [
    'neighborhood', 'neighborhoodName', 'deal', 'dealDetails',
    'time', 'days', 'type', 'rating', 'vibe', 'img',
    'lat', 'lng', 'confidence', 'source_url', 'image_url',
  ],
  additionalProperties: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadProcessedIds() {
  const ids = new Set();
  if (!existsSync(RESULTS_PATH)) return ids;
  const lines = readFileSync(RESULTS_PATH, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj.id) ids.add(obj.id);
    } catch { /* skip malformed lines */ }
  }
  return ids;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Core collection logic
// ---------------------------------------------------------------------------
async function collectVenueData(client, venue) {
  const prompt = `Search the web for happy hour details for the restaurant/bar "${venue.name}" located at ${venue.address}, Los Angeles.

Find and return:
1. Current happy hour deals (specific drink/food items and prices)
2. Happy hour hours and days of the week
3. The neighborhood (e.g. West Hollywood, Silver Lake, DTLA, Hollywood, Koreatown)
4. The venue's vibe/atmosphere (one word like: Rooftop, Dive Bar, Upscale, Trendy, Cozy, Patio)
5. The primary deal type: wine, cocktail, beer, or food (pick the most prominent)
6. Current Yelp or Google rating
7. GPS coordinates (lat/lng)
8. A direct URL to a photo of the venue (from their website, Yelp, or Google)
9. The URL where you found the happy hour information

Set confidence to:
- "high" if you found specific current prices and times from an official or reputable source
- "medium" if you found some details but they may be outdated or incomplete
- "low" if you could not find reliable happy hour info

If no happy hour exists or the venue is closed, still return your best guess with confidence "low".`;

  let messages = [{ role: 'user', content: prompt }];

  // Loop to handle pause_turn (server-side tool iteration limit)
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20260209', name: 'web_search' }],
      messages,
      output_config: {
        format: {
          type: 'json_schema',
          schema: OUTPUT_SCHEMA,
        },
      },
    });

    if (response.stop_reason === 'pause_turn') {
      // Server-side tool hit iteration limit — re-send to continue
      messages = [
        { role: 'user', content: prompt },
        { role: 'assistant', content: response.content },
      ];
      continue;
    }

    // Extract the JSON text block
    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock) throw new Error('No text block in response');

    const data = JSON.parse(textBlock.text);

    return {
      id:   venue.id,
      name: venue.name,
      address: venue.address,
      ...data,
    };
  }

  throw new Error('Exceeded pause_turn retry limit');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const seedVenues = JSON.parse(readFileSync(SEED_PATH, 'utf8'));
  const processedIds = loadProcessedIds();

  const todo = seedVenues.filter(v => !processedIds.has(v.id));
  console.log(`Found ${seedVenues.length} venues, ${processedIds.size} already processed, ${todo.length} to collect.\n`);

  for (let i = 0; i < todo.length; i++) {
    const venue = todo[i];
    console.log(`[${i + 1}/${todo.length}] ${venue.name}`);

    try {
      const result = await collectVenueData(client, venue);
      appendFileSync(RESULTS_PATH, JSON.stringify(result) + '\n');
      console.log(`  ✓ saved  confidence=${result.confidence}  type=${result.type}  time="${result.time}"`);
    } catch (err) {
      const errorResult = { id: venue.id, name: venue.name, address: venue.address, error: err.message };
      appendFileSync(RESULTS_PATH, JSON.stringify(errorResult) + '\n');
      console.error(`  ✗ error: ${err.message}`);
    }

    if (i < todo.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\nDone. Results written to scripts/collect/results.jsonl');
}

main().catch(err => { console.error(err); process.exit(1); });
