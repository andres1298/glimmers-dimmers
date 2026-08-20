import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { ReactionEmoji } from "@/lib/constants";

export type ReactionRow = {
  id: string;
  entry_id: string;
  reactor_person_id: string;
  emoji: ReactionEmoji;
};

export async function listReactionsForEntries(entryIds: string[]): Promise<ReactionRow[]> {
  if (entryIds.length === 0) return [];
  const { data, error } = await supabaseAdmin()
    .from("reactions")
    .select("id, entry_id, reactor_person_id, emoji")
    .in("entry_id", entryIds);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Adds the reaction if missing, removes it if present. Returns the resulting state. */
export async function toggleReaction(
  entryId: string,
  reactorPersonId: string,
  emoji: ReactionEmoji
): Promise<"added" | "removed"> {
  const client = supabaseAdmin();
  const { data: existing, error: findError } = await client
    .from("reactions")
    .select("id")
    .eq("entry_id", entryId)
    .eq("reactor_person_id", reactorPersonId)
    .eq("emoji", emoji)
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  if (existing) {
    const { error } = await client.from("reactions").delete().eq("id", existing.id);
    if (error) throw new Error(error.message);
    return "removed";
  }

  const { error } = await client
    .from("reactions")
    .insert({ entry_id: entryId, reactor_person_id: reactorPersonId, emoji });
  if (error) throw new Error(error.message);
  return "added";
}
