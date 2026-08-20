import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { logout } from "@/app/actions/auth";
import type { Person } from "@/lib/data/people";

export function AppHeader({ person }: { person: Person }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-8">
      <Link href="/today" className="font-serif text-2xl italic text-foreground">
        Mers
      </Link>
      <div className="flex items-center gap-3">
        <Avatar emoji={person.avatar_emoji} color={person.avatar_color} size="sm" />
        <span className="font-medium text-foreground">{person.name}</span>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted underline underline-offset-2 hover:text-foreground">
            cambiar
          </button>
        </form>
      </div>
    </header>
  );
}
