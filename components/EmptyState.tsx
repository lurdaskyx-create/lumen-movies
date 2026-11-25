import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { href: string; label: string };
}

export default function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center animate-fade-in">
      {icon && (
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-zinc-400 ring-1 ring-white/10">
          {icon}
        </div>
      )}
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-zinc-400">{description}</p>}
      {action && (
        <Link href={action.href} className="btn-primary mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
