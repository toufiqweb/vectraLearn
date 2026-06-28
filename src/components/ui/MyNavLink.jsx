"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyNavLink({ href, children }) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="group relative inline-flex items-center py-2"
    >
      <span
        className={`relative z-10 text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? "text-main-gradient" : "text-muted hover:text-secondary"}`}
      >
        {children}
      </span>

      {/* animated underline */}
      <span
        className={`absolute left-0 -bottom-0.5 h-[2px] rounded-full bg-main-gradient transition-all duration-300 ease-out ${
            isActive
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          }`}
      />

      {/* glow */}
      {isActive && (
        <span
          className="absolute left-0 bottom-[-2px] h-[2px] w-full rounded-full opacity-70 blur-sm bg-main-gradient"
        />
      )}
    </Link>
  );
}
