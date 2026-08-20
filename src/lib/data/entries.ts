import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Person } from "@/lib/data/people";

export type EntryRow = {
  id: string;
  person_id: string;
  entry_date: string;
  glimmer_text: string;
  dimmer_text: string;
  updated_at: string;
};

export type EntryWithPerson = EntryRow & { person: Person };

export async function getEntryForPersonOnDate(
  personId: string,
  date: string
): Promise<EntryRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("entries")
    .select("id, person_id, entry_date, glimmer_text, dimmer_text, updated_at")
    .eq("person_id", personId)
    .eq("entry_date", date)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertEntry(
  personId: string,
  date: string,
  glimmerText: string,
  dimmerText: string
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("entries")
    .upsert(
      {
        person_id: personId,
        entry_date: date,
        glimmer_text: glimmerText,
        dimmer_text: dimmerText,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "person_id,entry_date" }
    );
  if (error) throw new Error(error.message);
}

/** Entries for a given date, joined with their author, active people first. */
export async function listEntriesForDate(date: string): Promise<EntryWithPerson[]> {
  const { data, error } = await supabaseAdmin()
    .from("entries")
    .select(
      "id, person_id, entry_date, glimmer_text, dimmer_text, updated_at, person:people(id, name, avatar_emoji, avatar_color, active)"
    )
    .eq("entry_date", date);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as EntryWithPerson[])
    .filter((row) => row.person)
    .sort((a, b) => a.person.name.localeCompare(b.person.name, "es"));
}

/** All entry dates for every person, used to compute streaks in one query. */
export async function listAllEntryDatesByPerson(): Promise<Map<string, Set<string>>> {
  const { data, error } = await supabaseAdmin().from("entries").select("person_id, entry_date");
  if (error) throw new Error(error.message);
  const map = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    const set = map.get(row.person_id) ?? new Set<string>();
    set.add(row.entry_date);
    map.set(row.person_id, set);
  }
  return map;
}

/** Which calendar days (within a month) have at least one entry, for highlighting. */
export async function listDatesWithEntriesInRange(
  startDate: string,
  endDate: string
): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin()
    .from("entries")
    .select("entry_date")
    .gte("entry_date", startDate)
    .lte("entry_date", endDate);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.entry_date));
}
