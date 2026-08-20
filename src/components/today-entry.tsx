"use client";

import { useActionState, useState } from "react";
import { saveTodayEntry, type SaveEntryState } from "@/app/actions/entries";
import { ENTRY_MAX_LENGTH } from "@/lib/constants";

const initialState: SaveEntryState = {};

type Entry = { glimmer_text: string; dimmer_text: string } | null;

export function TodayEntry({ dateLabel, entry }: { dateLabel: string; entry: Entry }) {
  const [isEditing, setIsEditing] = useState(!entry);
  const [state, formAction, pending] = useActionState(saveTodayEntry, initialState);

  // Switch back to display mode once a save resolves — adjusted during
  // render (not an effect) so it happens in the same commit as the new state.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.savedAt) setIsEditing(false);
  }

  return (
    <section className="mx-auto w-full max-w-xl px-5 py-6 sm:px-8">
      <p className="mb-4 text-sm capitalize text-muted">{dateLabel}</p>

      {isEditing ? (
        <EntryForm
          formAction={formAction}
          pending={pending}
          error={state.error}
          defaultGlimmer={entry?.glimmer_text ?? ""}
          defaultDimmer={entry?.dimmer_text ?? ""}
          onCancel={entry ? () => setIsEditing(false) : undefined}
        />
      ) : (
        <EntryDisplay entry={entry!} onEdit={() => setIsEditing(true)} />
      )}
    </section>
  );
}

function EntryForm({
  formAction,
  pending,
  error,
  defaultGlimmer,
  defaultDimmer,
  onCancel,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  defaultGlimmer: string;
  defaultDimmer: string;
  onCancel?: () => void;
}) {
  const [glimmer, setGlimmer] = useState(defaultGlimmer);
  const [dimmer, setDimmer] = useState(defaultDimmer);
  const canSubmit = glimmer.trim().length > 0 && dimmer.trim().length > 0;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-glimmer-border bg-surface p-4">
        <p className="text-xs font-semibold tracking-widest text-glimmer-ink">
          GLIMMER — LO MEJOR DE HOY
        </p>
        <textarea
          name="glimmer"
          value={glimmer}
          onChange={(event) => setGlimmer(event.target.value.slice(0, ENTRY_MAX_LENGTH))}
          placeholder="¿Que brillo hoy?"
          rows={3}
          className="mt-2 w-full resize-none bg-transparent font-serif text-lg italic text-foreground placeholder:text-muted focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border-2 border-dimmer-border bg-surface p-4">
        <p className="text-xs font-semibold tracking-widest text-dimmer-ink">
          DIMMER — LO NO TAN BUENO
        </p>
        <textarea
          name="dimmer"
          value={dimmer}
          onChange={(event) => setDimmer(event.target.value.slice(0, ENTRY_MAX_LENGTH))}
          placeholder="¿Que le bajo el brillo al dia?"
          rows={3}
          className="mt-2 w-full resize-none bg-transparent font-serif text-lg italic text-foreground placeholder:text-muted focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit || pending}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:bg-muted"
        >
          {pending ? "Publicando..." : "Publicar el dia"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-6 py-3 text-sm text-muted hover:text-foreground"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function EntryDisplay({
  entry,
  onEdit,
}: {
  entry: { glimmer_text: string; dimmer_text: string };
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-l-4 border-glimmer-border bg-glimmer-bg p-4">
        <p className="text-xs font-semibold tracking-widest text-glimmer-ink">GLIMMER</p>
        <p className="mt-1 font-serif text-lg italic text-foreground">{entry.glimmer_text}</p>
      </div>
      <div className="rounded-2xl border-l-4 border-dimmer-border bg-dimmer-bg p-4">
        <p className="text-xs font-semibold tracking-widest text-dimmer-ink">DIMMER</p>
        <p className="mt-1 font-serif text-lg italic text-foreground">{entry.dimmer_text}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="w-fit rounded-full border border-border px-5 py-2 text-sm text-foreground hover:border-foreground/40"
      >
        Editar
      </button>
    </div>
  );
}
