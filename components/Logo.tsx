import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${SITE_NAME} home`} className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#12121d" />
        <path
          d="M24 17.5v29a2 2 0 0 0 3 1.7l23-14.5a2 2 0 0 0 0-3.4L27 15.8a2 2 0 0 0-3 1.7z"
          fill="url(#logo-gradient)"
        />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight">{SITE_NAME}</span>
    </Link>
  );
}
