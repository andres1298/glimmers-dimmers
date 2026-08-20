import { redirect } from "next/navigation";
import { requirePersonSession } from "@/lib/session";
import { getPersonById } from "@/lib/data/people";
import { getEntryForPersonOnDate, listDatesWithEntriesInRange } from "@/lib/data/entries";
import { addMonthsISO, formatLongDateEs, todayISO } from "@/lib/dates";
import { env } from "@/lib/env";
import { AppHeader } from "@/components/app-header";
import { TabNav } from "@/components/tab-nav";
import { CalendarGrid } from "@/components/calendar-grid";
import { DayFeed } from "@/components/day-feed";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await requirePersonSession();
  const person = await getPersonById(session.personId);
  if (!person) redirect("/");

  const today = todayISO();
  const myEntry = await getEntryForPersonOnDate(session.personId, today);
  if (!myEntry) redirect("/today");

  const params = await searchParams;
  const selected = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : today;
  const monthAnchor = `${selected.slice(0, 7)}-01`;
  const datesWithEntries = await listDatesWithEntriesInRange(monthAnchor, addMonthsISO(monthAnchor, 1));

  return (
    <main className="min-h-screen">
      <AppHeader person={person} />
      <TabNav active="calendario" locked={false} />
      <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 py-6 sm:px-8">
        <CalendarGrid
          monthAnchorISO={monthAnchor}
          selectedISO={selected}
          todayISO={today}
          datesWithEntries={datesWithEntries}
          timeZone={env.timezone()}
        />
        <div>
          <p className="mb-3 text-sm capitalize text-muted">
            {formatLongDateEs(selected, env.timezone())}
          </p>
          <DayFeed date={selected} currentPersonId={session.personId} />
        </div>
      </section>
    </main>
  );
}
