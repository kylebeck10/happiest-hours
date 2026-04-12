/**
 * seed-xlsx.js
 * One-time script: reads data/deals.json and writes data/deals.xlsx.
 * Run once to bootstrap the spreadsheet, then edit xlsx going forward.
 *
 * Usage: node scripts/seed-xlsx.js
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const deals = JSON.parse(readFileSync(resolve(root, "data/deals.json"), "utf8"));

// Flatten dealDetails array → pipe-separated string for Excel
const rows = deals.map((d) => ({
  id:               d.id,
  name:             d.name,
  neighborhood:     d.neighborhood,
  neighborhoodName: d.neighborhoodName,
  deal:             d.deal,
  dealDetails:      Array.isArray(d.dealDetails) ? d.dealDetails.join(" | ") : (d.dealDetails || ""),
  time:             d.time,
  days:             d.days || "Daily",
  address:          d.address || "",
  type:             d.type,
  rating:           d.rating ?? "",
  vibe:             d.vibe,
  img:              d.img,
  lat:              d.lat,
  lng:              d.lng,
}));

const ws = XLSX.utils.json_to_sheet(rows);

// Set column widths for readability
ws["!cols"] = [
  { wch: 20 }, // id
  { wch: 28 }, // name
  { wch: 14 }, // neighborhood
  { wch: 16 }, // neighborhoodName
  { wch: 36 }, // deal
  { wch: 60 }, // dealDetails
  { wch: 12 }, // time
  { wch: 12 }, // days
  { wch: 40 }, // address
  { wch: 10 }, // type
  { wch: 8  }, // rating
  { wch: 14 }, // vibe
  { wch: 6  }, // img
  { wch: 10 }, // lat
  { wch: 10 }, // lng
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Deals");

const outPath = resolve(root, "data/deals.xlsx");
XLSX.writeFile(wb, outPath);
console.log(`✓ Wrote ${rows.length} venues to data/deals.xlsx`);
