import Link from "next/link";

type Tab = { key: "hoy" | "familia" | "calendario"; label: string; href: string; locked: boolean };

export function TabNav({ active, locked }: { active: Tab["key"]; locked: boolean }) {
  const tabs: Tab[] = [
    { key: "hoy", label: "Hoy", href: "/today", locked: false },
    { key: "familia", label: "Familia", href: "/family", locked },
    { key: "calendario", label: "Calendario", href: "/calendar", locked },
  ];

  return (
    <nav className="flex flex-wrap gap-2 px-5 pt-5 sm:px-8">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const className = [
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-foreground text-background"
            : tab.locked
              ? "cursor-not-allowed border border-border bg-surface text-muted"
              : "border border-border bg-surface text-foreground hover:border-foreground/30",
        ].join(" ");

        if (tab.locked) {
          return (
            <span key={tab.key} className={className} title="Publica tu dia para desbloquear">
              🔒 {tab.label}
            </span>
          );
        }

        return (
          <Link key={tab.key} href={tab.href} className={className}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
