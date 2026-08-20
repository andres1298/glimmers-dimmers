"use client";

import { useActionState, useState } from "react";
import {
  adminLogout,
  createPersonAction,
  resetPinAction,
  updatePersonAction,
  type AdminFormState,
} from "@/app/actions/admin";
import { AVATAR_COLORS, AVATAR_EMOJIS } from "@/lib/constants";
import type { Person } from "@/lib/data/people";
import { Avatar } from "@/components/avatar";

const initialState: AdminFormState = {};

function EmojiPicker({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVATAR_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
            value === emoji ? "border-foreground bg-glimmer-bg" : "border-border bg-surface"
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVATAR_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          title={color.name}
          onClick={() => onChange(color.value)}
          className={`h-8 w-8 rounded-full border-2 transition ${
            value === color.value ? "border-foreground" : "border-transparent"
          }`}
          style={{ backgroundColor: color.value }}
        />
      ))}
    </div>
  );
}

export function AdminPeopleManager({ people }: { people: Person[] }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl italic text-foreground">Panel de Mers</h1>
        <form action={adminLogout}>
          <button type="submit" className="text-sm text-muted underline hover:text-foreground">
            salir
          </button>
        </form>
      </div>

      <CreatePersonForm />

      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-foreground">Personas ({people.length})</h2>
        {people.map((person) => (
          <EditPersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}

function CreatePersonForm() {
  const [state, formAction, pending] = useActionState(createPersonAction, initialState);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState<string>(AVATAR_EMOJIS[0]);
  const [color, setColor] = useState<string>(AVATAR_COLORS[0].value);
  const [pin, setPin] = useState("");

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      setName("");
      setPin("");
    }
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <h2 className="font-semibold text-foreground">Agregar persona</h2>
      <div className="flex items-center gap-4">
        <Avatar emoji={emoji} color={color} size="md" />
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre"
          required
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 focus:border-foreground focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted">ICONO</p>
        <EmojiPicker value={emoji} onChange={setEmoji} />
        <input type="hidden" name="emoji" value={emoji} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted">COLOR</p>
        <ColorPicker value={color} onChange={setColor} />
        <input type="hidden" name="color" value={color} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-widest text-muted">PIN INICIAL (4 digitos)</p>
        <input
          name="pin"
          inputMode="numeric"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          maxLength={4}
          required
          className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-center tracking-[0.4em] focus:border-foreground focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-glimmer-ink">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-foreground px-5 py-2 text-sm text-background disabled:opacity-50"
      >
        {pending ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}

function EditPersonCard({ person }: { person: Person }) {
  const [state, formAction, pending] = useActionState(updatePersonAction, initialState);
  const [name, setName] = useState(person.name);
  const [emoji, setEmoji] = useState(person.avatar_emoji);
  const [color, setColor] = useState(person.avatar_color);
  const [active, setActive] = useState(person.active);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={person.id} />
        <div className="flex items-center gap-4">
          <Avatar emoji={emoji} color={color} size="md" />
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 focus:border-foreground focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="active"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
            Activa
          </label>
        </div>

        <EmojiPicker value={emoji} onChange={setEmoji} />
        <input type="hidden" name="emoji" value={emoji} />

        <ColorPicker value={color} onChange={setColor} />
        <input type="hidden" name="color" value={color} />

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && <p className="text-sm text-glimmer-ink">{state.success}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-foreground/40 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <ResetPinForm personId={person.id} />
    </div>
  );
}

function ResetPinForm({ personId }: { personId: string }) {
  const [state, formAction, pending] = useActionState(resetPinAction, initialState);
  const [pin, setPin] = useState("");

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setPin("");
  }

  return (
    <form
      action={formAction}
      className="mt-4 flex items-center gap-3 border-t border-border pt-4"
    >
      <input type="hidden" name="id" value={personId} />
      <p className="text-xs font-semibold tracking-widest text-muted">NUEVO PIN</p>
      <input
        name="pin"
        inputMode="numeric"
        value={pin}
        onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
        maxLength={4}
        placeholder="0000"
        className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-center tracking-[0.3em] focus:border-foreground focus:outline-none"
      />
      <button
        type="submit"
        disabled={pin.length !== 4 || pending}
        className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:border-foreground/40 disabled:opacity-50"
      >
        {pending ? "..." : "Restablecer"}
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      {state.success && <span className="text-xs text-glimmer-ink">{state.success}</span>}
    </form>
  );
}
