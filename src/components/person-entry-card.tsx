import { Avatar } from "@/components/avatar";
import { ReactionBar } from "@/components/reaction-bar";
import type { ReactionEmoji } from "@/lib/constants";
import type { Person } from "@/lib/data/people";

export function PersonEntryCard({
  person,
  isMe,
  glimmerText,
  dimmerText,
  streak,
  entryId,
  reactionCounts,
  myReactions,
}: {
  person: Person;
  isMe: boolean;
  glimmerText: string;
  dimmerText: string;
  streak: number;
  entryId: string;
  reactionCounts: Record<ReactionEmoji, number>;
  myReactions: ReactionEmoji[];
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <Avatar emoji={person.avatar_emoji} color={person.avatar_color} size="sm" />
        <span className="font-semibold text-foreground">
          {person.name}
          {isMe && <span className="ml-1 font-normal text-muted">(tu)</span>}
        </span>
        {streak >= 2 && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-glimmer-bg px-2 py-0.5 text-xs font-medium text-glimmer-ink">
            🔥 {streak}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl bg-glimmer-bg p-3">
          <p className="text-xs font-semibold tracking-widest text-glimmer-ink">GLIMMER</p>
          <p className="mt-1 font-serif italic text-foreground">{glimmerText}</p>
        </div>
        <div className="rounded-xl bg-dimmer-bg p-3">
          <p className="text-xs font-semibold tracking-widest text-dimmer-ink">DIMMER</p>
          <p className="mt-1 font-serif italic text-foreground">{dimmerText}</p>
        </div>
      </div>

      <ReactionBar entryId={entryId} counts={reactionCounts} myReactions={myReactions} />
    </article>
  );
}
