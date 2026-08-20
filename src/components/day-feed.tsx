import { listAllEntryDatesByPerson, listEntriesForDate } from "@/lib/data/entries";
import { listReactionsForEntries } from "@/lib/data/reactions";
import { computeStreak } from "@/lib/dates";
import { REACTIONS, type ReactionEmoji } from "@/lib/constants";
import { PersonEntryCard } from "@/components/person-entry-card";

export async function DayFeed({
  date,
  currentPersonId,
}: {
  date: string;
  currentPersonId: string;
}) {
  const [entries, streaksMap] = await Promise.all([
    listEntriesForDate(date),
    listAllEntryDatesByPerson(),
  ]);

  if (entries.length === 0) {
    return <p className="px-1 text-sm text-muted">Nadie ha publicado este dia todavia.</p>;
  }

  const reactions = await listReactionsForEntries(entries.map((entry) => entry.id));

  const reactionsByEntry = new Map<
    string,
    { counts: Record<ReactionEmoji, number>; mine: ReactionEmoji[] }
  >();
  for (const entry of entries) {
    reactionsByEntry.set(entry.id, {
      counts: Object.fromEntries(REACTIONS.map((r) => [r, 0])) as Record<ReactionEmoji, number>,
      mine: [],
    });
  }
  for (const reaction of reactions) {
    const bucket = reactionsByEntry.get(reaction.entry_id);
    if (!bucket) continue;
    bucket.counts[reaction.emoji] += 1;
    if (reaction.reactor_person_id === currentPersonId) bucket.mine.push(reaction.emoji);
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => {
        const streak = computeStreak(streaksMap.get(entry.person_id) ?? new Set(), date);
        const bucket = reactionsByEntry.get(entry.id)!;
        return (
          <PersonEntryCard
            key={entry.id}
            person={entry.person}
            isMe={entry.person_id === currentPersonId}
            glimmerText={entry.glimmer_text}
            dimmerText={entry.dimmer_text}
            streak={streak}
            entryId={entry.id}
            reactionCounts={bucket.counts}
            myReactions={bucket.mine}
          />
        );
      })}
    </div>
  );
}
