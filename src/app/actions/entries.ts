"use server";

import { revalidatePath } from "next/cache";
import { requirePersonSession } from "@/lib/session";
import { upsertEntry } from "@/lib/data/entries";
import { todayISO } from "@/lib/dates";
import { ENTRY_MAX_LENGTH } from "@/lib/constants";

export type SaveEntryState = { error?: string; savedAt?: number };

export async function saveTodayEntry(
  _prev: SaveEntryState,
  formData: FormData
): Promise<SaveEntryState> {
  const session = await requirePersonSession();

  const glimmer = String(formData.get("glimmer") ?? "").trim();
  const dimmer = String(formData.get("dimmer") ?? "").trim();

  if (!glimmer || !dimmer) {
    return { error: "Cuentanos tanto el glimmer como el dimmer de hoy." };
  }
  if (glimmer.length > ENTRY_MAX_LENGTH || dimmer.length > ENTRY_MAX_LENGTH) {
    return { error: `Cada campo puede tener hasta ${ENTRY_MAX_LENGTH} caracteres.` };
  }

  await upsertEntry(session.personId, todayISO(), glimmer, dimmer);

  revalidatePath("/today");
  revalidatePath("/family");
  revalidatePath("/calendar");

  return { savedAt: Date.now() };
}
