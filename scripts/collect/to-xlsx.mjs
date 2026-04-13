/**
 * to-xlsx.mjs
 *
 * Converts successful results from results.jsonl to scripts/collect/review.xlsx
 * for morning QA. Copy the reviewed rows into data/deals.xlsx when satisfied.
 *
 * Skips venues where the `error` field is present.
 *
 * Usage:
 *   node scripts/collect/to-xlsx.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { createRequire } from 'module';

// xlsx is a CommonJS module — use createRequire for .mjs compatibility
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_PATH = join(__dirname, 'results.jsonl');
const OUTPUT_PATH  = join(__dirname, 'review.xlsx');

// Column order matches deals.json schema + extra collection metadata
const COLUMNS = [
  'id',
  'name',
  'neighborhood',
  'neighborhoodName',
  'deal',
  'dealDetails',
  'time',
  'days',
  'address',
  'type',
  'rating',
  'vibe',
  'img',
  'lat',
  'lng',
  'confidence',
  'source_url',
  'image_url',
];

function main() {
  if (!existsSync(RESULTS_PATH)) {
    console.error('results.jsonl not found — run collect-deals.mjs first.');
    process.exit(1);
  }

  const lines   = readFileSync(RESULTS_PATH, 'utf8').split('\n').filter(Boolean);
  const results = lines.map(l => JSON.parse(l));

  const successes = results.filter(r => !r.error);
  const errorCount = results.length - successes.length;

  if (successes.length === 0) {
    console.log('No successful results to export.');
    process.exit(0);
  }

  // Build rows: one object per venue, with dealDetails joined for readability
  const rows = successes.map(r => {
    const row = {};
    for (const col of COLUMNS) {
      if (col === 'dealDetails') {
        row[col] = Array.isArray(r[col]) ? r[col].join(' | ') : (r[col] ?? '');
      } else {
        row[col] = r[col] ?? '';
      }
    }
    return row;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows, { header: COLUMNS });

  // Auto-size columns
  const colWidths = COLUMNS.map(col => {
    const maxLen = Math.max(
      col.length,
      ...rows.map(r => String(r[col] ?? '').length)
    );
    return { wch: Math.min(maxLen + 2, 80) };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Venues');
  XLSX.writeFile(wb, OUTPUT_PATH);

  console.log(`Wrote ${successes.length} venues to ${resolve(OUTPUT_PATH)}`);
  if (errorCount > 0) {
    console.log(`Skipped ${errorCount} venues with errors (run review.mjs to see details).`);
  }
  console.log('\nNext: open review.xlsx, QA the data, then copy rows into data/deals.xlsx');
}

main();
