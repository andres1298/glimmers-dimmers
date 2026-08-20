import Link from "next/link";
import { addMonthsISO, daysInMonth, formatMonthEs } from "@/lib/dates";

const WEEKDAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export function CalendarGrid({
  monthAnchorISO,
  selectedISO,
  todayISO,
  datesWithEntries,
  timeZone,
}: {
  monthAnchorISO: string;
  selectedISO: string;
  todayISO: string;
  datesWithEntries: Set<string>;
  timeZone: string;
}) {
  const { firstWeekday, count } = daysInMonth(monthAnchorISO);
  const [year, month] = monthAnchorISO.split("-");
  const prevMonth = addMonthsISO(monthAnchorISO, -1);
  const nextMonth = addMonthsISO(monthAnchorISO, 1);

  const cells: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= count; day++) {
    cells.push({ iso: `${year}-${month}-${String(day).padStart(2, "0")}`, day });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/calendar?date=${prevMonth}`}
          className="rounded-full border border-border px-3 py-1 text-sm text-foreground hover:border-foreground/40"
        >
          ‹
        </Link>
        <p className="font-serif text-xl capitalize italic text-foreground">
          {formatMonthEs(monthAnchorISO, timeZone)}
        </p>
        <Link
          href={`/calendar?date=${nextMonth}`}
          className="rounded-full border border-border px-3 py-1 text-sm text-foreground hover:border-foreground/40"
        >
          ›
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const isSelected = cell.iso === selectedISO;
          const hasEntries = datesWithEntries.has(cell.iso);
          const isToday = cell.iso === todayISO;

          const className = [
            "flex aspect-square items-center justify-center rounded-lg text-sm transition",
            isSelected
              ? "bg-foreground font-semibold text-background"
              : hasEntries
                ? "border border-glimmer-border bg-glimmer-bg text-glimmer-ink"
                : "text-muted hover:bg-surface",
            isToday && !isSelected ? "ring-1 ring-foreground/40" : "",
          ].join(" ");

          return (
            <Link key={cell.iso} href={`/calendar?date=${cell.iso}`} className={className}>
              {cell.day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
