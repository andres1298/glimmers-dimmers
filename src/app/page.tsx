import { redirect } from "next/navigation";
import { getPersonById, listActivePeople } from "@/lib/data/people";
import { getPersonSession } from "@/lib/session";
import { ProfileSelect } from "@/components/profile-select";

export default async function HomePage() {
  const session = await getPersonSession();
  if (session) {
    // The session cookie only proves it was signed by us, not that the
    // person still exists (e.g. removed from /admin after logging in).
    // A Server Component can't clear cookies, so a stale one just sits
    // there unused until overwritten by the next successful login.
    const person = await getPersonById(session.personId);
    if (person && person.active) redirect("/today");
  }

  const people = await listActivePeople();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16">
      <div className="text-center">
        <h1 className="font-serif text-6xl italic text-foreground">Mers</h1>
        <p className="mt-3 text-muted">Un glimmer y un dimmer, cada dia.</p>
      </div>
      {people.length === 0 ? (
        <p className="max-w-sm text-center text-sm text-muted">
          Todavia no hay perfiles creados. Pide a quien administra la app que los agregue en{" "}
          <a href="/admin" className="underline">
            /admin
          </a>
          .
        </p>
      ) : (
        <ProfileSelect people={people} />
      )}
    </main>
  );
}
