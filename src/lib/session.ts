import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSignedToken, verifySignedToken } from "@/lib/crypto";
import { env } from "@/lib/env";
import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE_HOURS,
  SESSION_COOKIE,
  SESSION_MAX_AGE_DAYS,
} from "@/lib/constants";

type PersonSessionPayload = { personId: string; name: string; iat: number; exp: number };
type AdminSessionPayload = { admin: true; iat: number; exp: number };

export async function getPersonSession(): Promise<{ personId: string; name: string } | null> {
  const store = await cookies();
  const payload = verifySignedToken<PersonSessionPayload>(
    store.get(SESSION_COOKIE)?.value,
    env.sessionSecret()
  );
  return payload ? { personId: payload.personId, name: payload.name } : null;
}

export async function requirePersonSession() {
  const session = await getPersonSession();
  if (!session) redirect("/");
  return session;
}

export async function setPersonSession(personId: string, name: string) {
  const store = await cookies();
  const now = Date.now();
  const maxAgeMs = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const token = createSignedToken(
    { personId, name, iat: now, exp: now + maxAgeMs },
    env.sessionSecret()
  );
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeMs / 1000,
  });
}

export async function clearPersonSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const payload = verifySignedToken<AdminSessionPayload>(
    store.get(ADMIN_COOKIE)?.value,
    env.sessionSecret()
  );
  return !!payload?.admin;
}

export async function requireAdminSession() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin");
}

export async function setAdminSession() {
  const store = await cookies();
  const now = Date.now();
  const maxAgeMs = ADMIN_MAX_AGE_HOURS * 60 * 60 * 1000;
  const token = createSignedToken({ admin: true, iat: now, exp: now + maxAgeMs }, env.sessionSecret());
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeMs / 1000,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
