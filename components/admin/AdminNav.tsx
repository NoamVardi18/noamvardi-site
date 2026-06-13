import Link from "next/link";

const TABS = [
  { href: "/admin", label: "מאמרים" },
  { href: "/admin/promo", label: "פרומו" },
  { href: "/admin/leads", label: "לידים" },
  { href: "/admin/users", label: "משתמשים" },
];

export function AdminNav({ active }: { active: string }) {
  return (
    <nav className="admin-nav" aria-label="ניווט ניהול">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={active === t.href ? "active" : ""}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
