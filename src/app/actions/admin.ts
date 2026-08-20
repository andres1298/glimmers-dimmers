"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { clearAdminSession, requireAdminSession, setAdminSession } from "@/lib/session";
import { createPerson, updatePerson, updatePersonPin } from "@/lib/data/people";
import { hashPin } from "@/lib/crypto";
import { AVATAR_COLORS, AVATAR_EMOJIS } from "@/lib/constants";

export type AdminFormState = { error?: string; success?: string };

export async function adminLogin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const password = String(formData.get("password") ?? "");
  if (password !== env.adminPassword()) {
    return { error: "Clave incorrecta." };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin");
}

function isValidEmoji(emoji: string): boolean {
  return (AVATAR_EMOJIS as readonly string[]).includes(emoji);
}

function isValidColor(color: string): boolean {
  return AVATAR_COLORS.some((c) => c.value === color);
}

export async function createPersonAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "");
  const color = String(formData.get("color") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (name.length < 2 || name.length > 40) {
    return { error: "El nombre debe tener entre 2 y 40 caracteres." };
  }
  if (!isValidEmoji(emoji) || !isValidColor(color)) {
    return { error: "Elige un icono y un color de la lista." };
  }
  if (!/^\d{4}$/.test(pin)) {
    return { error: "El PIN debe tener 4 digitos." };
  }

  try {
    await createPerson({ name, avatarEmoji: emoji, avatarColor: color, pinHash: hashPin(pin) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "No se pudo crear el perfil.";
    return { error: message.includes("duplicate") ? "Ya existe alguien con ese nombre." : message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: `${name} fue agregada al grupo.` };
}

export async function updatePersonAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "");
  const color = String(formData.get("color") ?? "");
  const active = formData.get("active") === "on";

  if (!id) return { error: "Perfil invalido." };
  if (name.length < 2 || name.length > 40) {
    return { error: "El nombre debe tener entre 2 y 40 caracteres." };
  }
  if (!isValidEmoji(emoji) || !isValidColor(color)) {
    return { error: "Elige un icono y un color de la lista." };
  }

  await updatePerson(id, { name, avatarEmoji: emoji, avatarColor: color, active });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/family");
  revalidatePath("/calendar");
  return { success: "Perfil actualizado." };
}

export async function resetPinAction(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!id) return { error: "Perfil invalido." };
  if (!/^\d{4}$/.test(pin)) {
    return { error: "El PIN debe tener 4 digitos." };
  }

  await updatePersonPin(id, hashPin(pin));
  return { success: "PIN actualizado." };
}
