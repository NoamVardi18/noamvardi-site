import Link from "next/link";

const TABS = [
  { href: "/admin", label: "Articles" },
  { href: "/admin/promo", label: "Promo" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/portfolio", label: "Portfolio" },
];

export function AdminNav({ active }: { active: string }) {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={active === t.href ? "active" : ""}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
