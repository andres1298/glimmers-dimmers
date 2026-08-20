import { getAdminSession } from "@/lib/session";
import { listAllPeople } from "@/lib/data/people";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminPeopleManager } from "@/components/admin-people-manager";

export default async function AdminPage() {
  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <h1 className="font-serif text-3xl italic text-foreground">Panel de Mers</h1>
        <AdminLoginForm />
      </main>
    );
  }

  const people = await listAllPeople();
  return (
    <main className="min-h-screen">
      <AdminPeopleManager people={people} />
    </main>
  );
}
