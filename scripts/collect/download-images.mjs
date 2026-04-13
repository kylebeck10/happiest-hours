/**
 * download-images.mjs
 *
 * Reads results.jsonl, downloads image_url for each successful venue,
 * resizes to 800px wide with sharp, and saves to public/venues/{id}.jpg.
 * Skips venues with errors and already-downloaded files.
 *
 * Usage:
 *   node scripts/collect/download-images.mjs
 */

import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

const RESULTS_PATH  = join(__dirname, 'results.jsonl');
const IMAGES_DIR    = join(REPO_ROOT, 'public', 'venues');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadResults() {
  if (!existsSync(RESULTS_PATH)) {
    console.error('results.jsonl not found — run collect-deals.mjs first.');
    process.exit(1);
  }
  return readFileSync(RESULTS_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

async function downloadBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HappiestHoursBot/1.0)',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  mkdirSync(IMAGES_DIR, { recursive: true });

  const results = loadResults();
  const venues  = results.filter(r => !r.error && r.image_url);
  const skipped = results.length - venues.length;

  console.log(`${results.length} total results, ${skipped} skipped (error or no image_url), ${venues.length} to process.\n`);

  let downloaded = 0;
  let alreadyExists = 0;
  let failed = 0;

  for (const venue of venues) {
    const destPath = join(IMAGES_DIR, `${venue.id}.jpg`);

    if (existsSync(destPath)) {
      console.log(`  skip  ${venue.id}  (already exists)`);
      alreadyExists++;
      continue;
    }

    try {
      process.stdout.write(`  dl    ${venue.id}  ${venue.image_url.slice(0, 60)}...`);
      const buffer = await downloadBuffer(venue.image_url);

      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(destPath);

      console.log(' ✓');
      downloaded++;
    } catch (err) {
      console.log(` ✗  ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. downloaded=${downloaded}  already_existed=${alreadyExists}  failed=${failed}`);
  if (failed > 0) {
    console.log('Tip: manually supply images for failed venues at public/venues/{id}.jpg');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
