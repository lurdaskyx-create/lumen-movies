import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PillItem {
  label: string;
  href: string;
  active?: boolean;
}

export default function FilterPills({ items, label }: { items: PillItem[]; label: string }) {
  return (
    <nav aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "true" : undefined}
          className={cn("pill", item.active ? "pill-active" : "pill-idle")}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
