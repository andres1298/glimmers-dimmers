import { redirect } from "next/navigation";
import { requirePersonSession } from "@/lib/session";
import { getPersonById } from "@/lib/data/people";
import { getEntryForPersonOnDate } from "@/lib/data/entries";
import { todayISO } from "@/lib/dates";
import { AppHeader } from "@/components/app-header";
import { TabNav } from "@/components/tab-nav";
import { DayFeed } from "@/components/day-feed";

export default async function FamilyPage() {
  const session = await requirePersonSession();
  const person = await getPersonById(session.personId);
  if (!person) redirect("/");

  const date = todayISO();
  const myEntry = await getEntryForPersonOnDate(session.personId, date);
  if (!myEntry) redirect("/today");

  return (
    <main className="min-h-screen">
      <AppHeader person={person} />
      <TabNav active="familia" locked={false} />
      <section className="mx-auto w-full max-w-xl px-5 py-6 sm:px-8">
        <DayFeed date={date} currentPersonId={session.personId} />
      </section>
    </main>
  );
}
