"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { loginWithPin, type LoginState } from "@/app/actions/auth";
import { Avatar } from "@/components/avatar";
import type { Person } from "@/lib/data/people";

const initialState: LoginState = {};

export function ProfileSelect({ people }: { people: Person[] }) {
  const [selected, setSelected] = useState<Person | null>(null);

  return (
    <>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-4 sm:grid-cols-3">
        {people.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => setSelected(person)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Avatar emoji={person.avatar_emoji} color={person.avatar_color} size="lg" />
            <span className="font-semibold text-foreground">{person.name}</span>
          </button>
        ))}
      </div>
      {selected && <PinModal person={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function PinModal({ person, onClose }: { person: Person; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(loginWithPin, initialState);
  const [pin, setPin] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (pin.length === 4 && !pending) {
      formRef.current?.requestSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex flex-col items-center gap-2">
          <Avatar emoji={person.avatar_emoji} color={person.avatar_color} size="lg" />
          <p className="font-semibold text-foreground">{person.name}</p>
          <p className="text-sm text-muted">Ingresa tu PIN</p>
        </div>
        <form ref={formRef} action={formAction} className="flex flex-col items-center gap-4">
          <input type="hidden" name="personId" value={person.id} />
          <input
            autoFocus
            name="pin"
            inputMode="numeric"
            type="password"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-center text-2xl tracking-[0.75em] focus:border-foreground focus:outline-none"
          />
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pin.length !== 4 || pending}
              className="rounded-full bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
