"use server";

import { redirect } from "next/navigation";
import { getPersonWithPinById } from "@/lib/data/people";
import { verifyPinHash } from "@/lib/crypto";
import { clearPersonSession, setPersonSession } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginWithPin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const personId = String(formData.get("personId") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!/^\d{4}$/.test(pin)) {
    return { error: "El PIN debe tener 4 digitos." };
  }

  const person = await getPersonWithPinById(personId);
  if (!person || !person.active) {
    return { error: "Ese perfil ya no esta disponible." };
  }
  if (!verifyPinHash(pin, person.pin_hash)) {
    return { error: "PIN incorrecto." };
  }

  await setPersonSession(person.id, person.name);
  redirect("/today");
}

export async function logout() {
  await clearPersonSession();
  redirect("/");
}
