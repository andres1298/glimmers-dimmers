"use client";

import { useTransition } from "react";
import { toggleReactionAction } from "@/app/actions/reactions";
import { REACTIONS, type ReactionEmoji } from "@/lib/constants";

export function ReactionBar({
  entryId,
  counts,
  myReactions,
}: {
  entryId: string;
  counts: Record<ReactionEmoji, number>;
  myReactions: ReactionEmoji[];
}) {
  const [isPending, startTransition] = useTransition();
  const mine = new Set(myReactions);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {REACTIONS.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const active = mine.has(emoji);
        return (
          <button
            key={emoji}
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => toggleReactionAction(entryId, emoji))}
            className={[
              "flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition disabled:opacity-60",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-foreground hover:border-foreground/40",
            ].join(" ")}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
