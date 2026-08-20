"use client";

import { useActionState } from "react";
import { adminLogin, type AdminFormState } from "@/app/actions/admin";

const initialState: AdminFormState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <form action={formAction} className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <input
        type="password"
        name="password"
        placeholder="Clave de administracion"
        required
        autoFocus
        className="rounded-lg border border-border bg-surface px-3 py-2 focus:border-foreground focus:outline-none"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
