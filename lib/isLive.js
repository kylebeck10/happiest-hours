/**
 * Determines whether a venue's happy hour is currently active.
 * Always evaluated against LA time (America/Los_Angeles).
 *
 * Expects venue fields:
 *   time: string  e.g. "4–7 PM", "3–6:30 PM", "10 PM–1 AM"
 *   days: string  e.g. "Mon–Fri", "Daily", "Thu–Sun"  (optional — defaults to daily)
 */

// Day abbreviation → 0 (Sun) … 6 (Sat)
const DAY_INDEX = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

/** Parse "4", "4:30", "10" → fractional hour (4, 4.5, 10) */
function parseHourStr(str) {
  const parts = str.trim().split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] ? parseInt(parts[1], 10) : 0;
  return h + m / 60;
}

/** Parse "4–7 PM" or "10 PM–1 AM" → { start: number, end: number } in 24h floats */
function parseTimeRange(timeStr) {
  // Normalize dashes (en-dash, em-dash, hyphen)
  const normalized = timeStr.replace(/[–—-]/g, "-").trim();

  // Extract AM/PM tokens and numeric parts
  // Examples: "4-7 PM", "3-6:30 PM", "10 PM-1 AM", "11 AM-2 PM"
  const match = normalized.match(
    /^(\d+(?::\d+)?)\s*(AM|PM)?\s*-\s*(\d+(?::\d+)?)\s*(AM|PM)?$/i
  );
  if (!match) return null;

  let [, startStr, startMeridiem, endStr, endMeridiem] = match;
  startMeridiem = (startMeridiem || "").toUpperCase();
  endMeridiem = (endMeridiem || "").toUpperCase();

  let startH = parseHourStr(startStr);
  let endH = parseHourStr(endStr);

  // If only one meridiem given (e.g. "4–7 PM"), it applies to both end and start
  // unless start is explicitly AM/PM
  if (!startMeridiem && endMeridiem) {
    startMeridiem = endMeridiem;
  }

  // Convert to 24h
  if (startMeridiem === "PM" && startH < 12) startH += 12;
  if (startMeridiem === "AM" && startH === 12) startH = 0;
  if (endMeridiem === "PM" && endH < 12) endH += 12;
  if (endMeridiem === "AM" && endH === 12) endH = 0;

  return { start: startH, end: endH };
}

/** Parse "Mon–Fri", "Daily", "Thu–Sun", "Fri–Sat" → Set of day indices (0=Sun…6=Sat) */
function parseDays(daysStr) {
  if (!daysStr) return new Set([0, 1, 2, 3, 4, 5, 6]); // default: every day

  const normalized = daysStr.toLowerCase().replace(/[–—-]/g, "-").trim();

  if (normalized === "daily" || normalized === "every day" || normalized === "everyday") {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  // Range like "mon-fri"
  const rangeMatch = normalized.match(/^(\w+)\s*-\s*(\w+)$/);
  if (rangeMatch) {
    const startDay = DAY_INDEX[rangeMatch[1]];
    const endDay = DAY_INDEX[rangeMatch[2]];
    if (startDay !== undefined && endDay !== undefined) {
      const days = new Set();
      // Handle wrap-around (e.g. Fri–Sun = 5,6,0)
      let d = startDay;
      while (true) {
        days.add(d);
        if (d === endDay) break;
        d = (d + 1) % 7;
      }
      return days;
    }
  }

  // Comma-separated like "Mon, Wed, Fri"
  const parts = normalized.split(/,\s*/);
  const days = new Set();
  parts.forEach((p) => {
    const idx = DAY_INDEX[p.trim()];
    if (idx !== undefined) days.add(idx);
  });
  if (days.size > 0) return days;

  // Fallback: every day
  return new Set([0, 1, 2, 3, 4, 5, 6]);
}

/**
 * Returns true if the venue's happy hour is currently active in LA time.
 * @param {object} venue  - must have `time` string; optionally `days` string
 * @param {Date}   [now]  - defaults to new Date(); pass a custom date for testing
 */
export function isLive(venue, now = new Date()) {
  const range = parseTimeRange(venue.time);
  if (!range) return false;

  // Get LA local time
  const laStr = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const laDate = new Date(laStr);
  const laDay = laDate.getDay(); // 0=Sun…6=Sat
  const laHour = laDate.getHours() + laDate.getMinutes() / 60;

  // Check day
  const validDays = parseDays(venue.days);
  if (!validDays.has(laDay)) return false;

  // Check time (handle midnight crossover e.g. 10 PM–1 AM)
  if (range.start <= range.end) {
    return laHour >= range.start && laHour < range.end;
  } else {
    // Crosses midnight
    return laHour >= range.start || laHour < range.end;
  }
}
