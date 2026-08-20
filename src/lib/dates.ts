import { env } from "@/lib/env";

export function todayISO(): string {
  return isoInTz(new Date(), env.timezone());
}

/** en-CA locale formats as YYYY-MM-DD, which is exactly what we want. */
export function isoInTz(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function addMonthsISO(iso: string, months: number): string {
  const [y, m] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + months, 1));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

/** Consecutive-day streak ending today or yesterday (grace period until the day closes). */
export function computeStreak(entryDatesISO: Set<string>, today: string): number {
  let cursor = entryDatesISO.has(today) ? today : addDaysISO(today, -1);
  let count = 0;
  while (entryDatesISO.has(cursor)) {
    count++;
    cursor = addDaysISO(cursor, -1);
  }
  return count;
}

/** Returned lowercase on purpose — apply Tailwind's `capitalize` class where displayed. */
export function formatLongDateEs(iso: string, timeZone: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(dt);
}

export function formatMonthEs(iso: string, timeZone: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("es-ES", { timeZone, month: "long", year: "numeric" }).format(dt);
}

export function daysInMonth(iso: string): { firstWeekday: number; count: number } {
  const [y, m] = iso.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const jsWeekday = first.getUTCDay(); // 0 = Sun
  const firstWeekday = (jsWeekday + 6) % 7; // 0 = Mon
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { firstWeekday, count };
}
