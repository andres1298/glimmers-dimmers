"use server";

import { revalidatePath } from "next/cache";
import { requirePersonSession } from "@/lib/session";
import { toggleReaction } from "@/lib/data/reactions";
import { REACTIONS, type ReactionEmoji } from "@/lib/constants";

export async function toggleReactionAction(entryId: string, emoji: ReactionEmoji): Promise<void> {
  const session = await requirePersonSession();
  if (!REACTIONS.includes(emoji)) throw new Error("Reaccion invalida.");

  await toggleReaction(entryId, session.personId, emoji);

  revalidatePath("/family");
  revalidatePath("/calendar");
}
