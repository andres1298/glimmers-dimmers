import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

export type Person = {
  id: string;
  name: string;
  avatar_emoji: string;
  avatar_color: string;
  active: boolean;
};

export type PersonWithPin = Person & { pin_hash: string };

const PUBLIC_COLUMNS = "id, name, avatar_emoji, avatar_color, active";

export async function listActivePeople(): Promise<Person[]> {
  const { data, error } = await supabaseAdmin()
    .from("people")
    .select(PUBLIC_COLUMNS)
    .eq("active", true)
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAllPeople(): Promise<Person[]> {
  const { data, error } = await supabaseAdmin()
    .from("people")
    .select(PUBLIC_COLUMNS)
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPersonById(id: string): Promise<Person | null> {
  const { data, error } = await supabaseAdmin()
    .from("people")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPersonWithPinById(id: string): Promise<PersonWithPin | null> {
  const { data, error } = await supabaseAdmin()
    .from("people")
    .select(`${PUBLIC_COLUMNS}, pin_hash`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createPerson(input: {
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  pinHash: string;
}): Promise<void> {
  const { error } = await supabaseAdmin().from("people").insert({
    name: input.name,
    avatar_emoji: input.avatarEmoji,
    avatar_color: input.avatarColor,
    pin_hash: input.pinHash,
  });
  if (error) throw new Error(error.message);
}

export async function updatePerson(
  id: string,
  input: { name: string; avatarEmoji: string; avatarColor: string; active: boolean }
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("people")
    .update({
      name: input.name,
      avatar_emoji: input.avatarEmoji,
      avatar_color: input.avatarColor,
      active: input.active,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updatePersonPin(id: string, pinHash: string): Promise<void> {
  const { error } = await supabaseAdmin().from("people").update({ pin_hash: pinHash }).eq("id", id);
  if (error) throw new Error(error.message);
}
