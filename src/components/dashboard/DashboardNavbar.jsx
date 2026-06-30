"use client";
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSidebar } from "./SidebarProvider";
import { useUserClientSession } from "@/lib/api/getUserServerSession";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setSidebarOpen } = useSidebar();

  const { user, isPending } = useUserClientSession();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 bg-card-bg/95 backdrop-blur-xl items-center gap-x-4 border-b border-card-border  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-secondary lg:hidden hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form
          className="relative flex flex-1 items-center"
          action="#"
          method="GET"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute inset-y-0 left-4 h-full w-4 text-muted"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full rounded-full border border-card-border bg-card-bg py-1.5 pl-11 pr-4 text-primary placeholder:text-muted focus:border-[var(--brand-cyan)] focus:ring-2 focus:ring-[var(--brand-cyan)]/15 outline-none sm:text-sm sm:leading-6 transition-all font-medium shadow-sm"
              placeholder="Search anything..."
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="p-2 text-muted hover:text-primary transition-colors bg-card-bg border border-card-border shadow-sm rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="sr-only">Toggle dark mode</span>
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            className="relative p-2 text-muted hover:text-primary transition-colors bg-card-bg border border-card-border shadow-sm rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-[var(--brand-mint)] ring-2 ring-nav-bg shadow-sm"></span>
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-nav-border"
            aria-hidden="true"
          />

          {/* Profile dropdown / Auth Loader */}
          <div className="relative">
            {isPending ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-card-bg border border-card-border"></div>
                <div className="hidden lg:flex flex-col gap-1">
                  <div className="h-4 w-20 bg-card-bg rounded"></div>
                  <div className="h-3 w-12 bg-card-bg rounded"></div>
                </div>
              </div>
            ) : user ? (
              <>
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full lg:rounded-xl transition-colors"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  {user.image ? (
                    <Image
                      width={20}
                      height={20}
                      className="h-9 w-9 rounded-full shadow-sm object-cover border border-card-border"
                      src={user.image}
                      alt={user.name || "User Avatar"}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-main-gradient flex items-center justify-center text-white font-bold text-sm shadow-sm border border-card-border">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  <span className="hidden lg:flex lg:items-center">
                    <span
                      className="ml-3 text-sm font-bold leading-6 text-primary"
                      aria-hidden="true"
                    >
                      {user.name || "User"}
                    </span>
                    <span className="ml-2 rounded-full bg-[var(--brand-ocean)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--brand-cyan)] ring-1 ring-inset ring-[var(--brand-cyan)]/20 capitalize">
                      {user.role || "User"}
                    </span>
                  </span>
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div
                      className="absolute right-0 z-20 mt-2.5 w-56 origin-top-right rounded-2xl glass-card py-2 shadow-card focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <div className="px-4 py-3 border-b border-card-border mb-1 lg:hidden">
                        <p className="text-sm font-bold text-primary">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs font-semibold text-muted mt-1 capitalize">
                          {user.role || "User"}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        Your profile
                      </Link>
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors mt-1 border-t border-card-border pt-2"
                        role="menuitem"
                        tabIndex="-1"
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          await authClient.signOut();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
