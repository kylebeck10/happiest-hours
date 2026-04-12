/**
 * build-deals.js
 * Reads data/deals.xlsx and writes data/deals.json.
 * Run via: npm run build:data
 * Runs automatically before `npm run dev` and `npm run build`.
 *
 * Column order in Excel (all required unless marked optional):
 *   id | name | neighborhood | neighborhoodName | deal | dealDetails |
 *   time | days | address | type | rating (optional) | vibe | img | lat | lng
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const xlsxPath = resolve(root, "data/deals.xlsx");
const jsonPath = resolve(root, "data/deals.json");

if (!existsSync(xlsxPath)) {
  console.error("✗ data/deals.xlsx not found. Run `node scripts/seed-xlsx.js` first.");
  process.exit(1);
}

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

const VALID_TYPES = new Set(["wine", "cocktail", "beer", "food"]);
const errors = [];
const warnings = [];

const deals = rows
  .filter((row, i) => {
    // Skip completely empty rows
    if (!row.id && !row.name) return false;

    const rowLabel = `Row ${i + 2} (${row.name || row.id || "unnamed"})`;

    // Required field checks
    const required = ["id", "name", "neighborhood", "neighborhoodName", "deal", "time", "type", "vibe", "img", "lat", "lng"];
    for (const field of required) {
      if (!row[field] && row[field] !== 0) {
        errors.push(`${rowLabel}: missing required field "${field}"`);
      }
    }

    if (row.type && !VALID_TYPES.has(String(row.type).toLowerCase().trim())) {
      errors.push(`${rowLabel}: invalid type "${row.type}" — must be wine, cocktail, beer, or food`);
    }

    if (isNaN(Number(row.lat)) || isNaN(Number(row.lng))) {
      errors.push(`${rowLabel}: lat/lng must be numbers`);
    }

    // Image file warning
    const imgPath = resolve(root, "public/venues", `${row.id}.jpg`);
    if (!existsSync(imgPath)) {
      warnings.push(`${rowLabel}: no image found at public/venues/${row.id}.jpg`);
    }

    return true;
  })
  .map((row) => ({
    id:               String(row.id).trim(),
    name:             String(row.name).trim(),
    neighborhood:     String(row.neighborhood).trim(),
    neighborhoodName: String(row.neighborhoodName).trim(),
    deal:             String(row.deal).trim(),
    // dealDetails: pipe-separated string in Excel → array in JSON
    dealDetails:      row.dealDetails
                        ? String(row.dealDetails).split("|").map((s) => s.trim()).filter(Boolean)
                        : [],
    time:             String(row.time).trim(),
    days:             row.days ? String(row.days).trim() : "Daily",
    address:          row.address ? String(row.address).trim() : "",
    type:             String(row.type).toLowerCase().trim(),
    rating:           row.rating !== "" ? Number(row.rating) : null,
    vibe:             String(row.vibe).trim(),
    img:              String(row.img).trim(),
    lat:              Number(row.lat),
    lng:              Number(row.lng),
  }));

if (warnings.length) {
  warnings.forEach((w) => console.warn(`⚠  ${w}`));
}

if (errors.length) {
  errors.forEach((e) => console.error(`✗  ${e}`));
  console.error(`\nFix the ${errors.length} error(s) above and try again.`);
  process.exit(1);
}

writeFileSync(jsonPath, JSON.stringify(deals, null, 2));
console.log(`✓ Built data/deals.json with ${deals.length} venues`);
if (warnings.length) {
  console.log(`  (${warnings.length} image warning(s) — add images to public/venues/ to resolve)`);
}
