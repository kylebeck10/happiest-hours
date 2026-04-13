/**
 * review.mjs
 *
 * Reads results.jsonl and prints a QA summary:
 *   - success count
 *   - error count
 *   - low-confidence venues flagged for manual check
 *
 * Usage:
 *   node scripts/collect/review.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_PATH = join(__dirname, 'results.jsonl');

function main() {
  if (!existsSync(RESULTS_PATH)) {
    console.error('results.jsonl not found — run collect-deals.mjs first.');
    process.exit(1);
  }

  const lines   = readFileSync(RESULTS_PATH, 'utf8').split('\n').filter(Boolean);
  const results = lines.map(l => JSON.parse(l));

  const errors    = results.filter(r => r.error);
  const successes = results.filter(r => !r.error);
  const high      = successes.filter(r => r.confidence === 'high');
  const medium    = successes.filter(r => r.confidence === 'medium');
  const low       = successes.filter(r => r.confidence === 'low');

  const w = (n, label) => `${String(n).padStart(4)}  ${label}`;

  console.log('');
  console.log('━━━  Happiest Hours Collection Review  ━━━');
  console.log('');
  console.log(w(results.length,  'total'));
  console.log(w(successes.length,'success'));
  console.log(w(errors.length,   'error'));
  console.log('');
  console.log('  Confidence breakdown:');
  console.log(w(high.length,   '  high'));
  console.log(w(medium.length, '  medium'));
  console.log(w(low.length,    '  low  ← needs manual review'));
  console.log('');

  if (errors.length > 0) {
    console.log('── Errors ───────────────────────────────────');
    for (const r of errors) {
      console.log(`  ✗  ${r.id}  —  ${r.error}`);
    }
    console.log('');
  }

  if (low.length > 0) {
    console.log('── Low-confidence venues (manual check needed) ──');
    for (const r of low) {
      console.log(`  ⚠  ${r.id}`);
      console.log(`       name:  ${r.name}`);
      console.log(`       deal:  ${r.deal || '(none)'}`);
      console.log(`       time:  ${r.time || '(none)'}`);
      console.log(`       src:   ${r.source_url || '(none)'}`);
    }
    console.log('');
  }

  if (medium.length > 0) {
    console.log('── Medium-confidence venues (worth a spot check) ──');
    for (const r of medium) {
      console.log(`  ~  ${r.id}  —  "${r.deal}"  ${r.time}  src: ${r.source_url || 'n/a'}`);
    }
    console.log('');
  }

  if (high.length > 0) {
    console.log('── High-confidence venues ───────────────────');
    for (const r of high) {
      console.log(`  ✓  ${r.id}  —  "${r.deal}"  ${r.time}`);
    }
    console.log('');
  }

  console.log('Next steps:');
  console.log('  1. Fix or remove low-confidence / errored venues');
  console.log('  2. node scripts/collect/to-xlsx.mjs   (export for QA)');
  console.log('  3. node scripts/collect/download-images.mjs');
  console.log('');
}

main();
