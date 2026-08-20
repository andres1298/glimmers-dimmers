import { requirePersonSession } from "@/lib/session";
import { getPersonById } from "@/lib/data/people";
import { getEntryForPersonOnDate } from "@/lib/data/entries";
import { todayISO, formatLongDateEs } from "@/lib/dates";
import { env } from "@/lib/env";
import { AppHeader } from "@/components/app-header";
import { TabNav } from "@/components/tab-nav";
import { TodayEntry } from "@/components/today-entry";
import { redirect } from "next/navigation";

export default async function TodayPage() {
  const session = await requirePersonSession();
  const person = await getPersonById(session.personId);
  if (!person) redirect("/");

  const date = todayISO();
  const entry = await getEntryForPersonOnDate(session.personId, date);

  return (
    <main className="min-h-screen">
      <AppHeader person={person} />
      <TabNav active="hoy" locked={!entry} />
      <TodayEntry dateLabel={formatLongDateEs(date, env.timezone())} entry={entry} />
    </main>
  );
}
