"use client";
import { Button } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import MyNavLink from "../ui/MyNavLink";
import Link from "next/link";
import { Avatar } from "@heroui/react";
import {
  Menu,
  X,
  LogOut,
  Search,
  LayoutDashboard,
  User,
  Home,
  BookOpen,
  Rss,
  Info,
} from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useUserClientSession } from "@/lib/api/getUserServerSession";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import standaloneIcon from "@/assets/standaloneIcon.png";

const Navbar = () => {
  const { user, isPending } = useUserClientSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Blog", href: "/blogs", icon: Rss },
    { name: "About", href: "/about", icon: Info },
  ];

  const desktopLinks = (
    <>
      {navItems.map((item) => (
        <li key={item.name}>
          <MyNavLink href={item.href}>{item.name}</MyNavLink>
        </li>
      ))}
    </>
  );

  const mobileLinks = (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-4 text-base font-semibold rounded-2xl transition-all ${
                isActive
                  ? "bg-[#22E6D8]/10 text-[#22E6D8] border border-[#22E6D8]/20"
                  : "text-muted hover:text-foreground bg-card-bg/50 hover:bg-card-bg"
              }`}
            >
              <Icon
                size={20}
                className={isActive ? "text-[#22E6D8]" : "text-brand-ocean"}
              />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-2xl  transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex py-3 b items-center justify-between">
          {/* Left Side: Hamburger & Logo Identity */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <Link
              href="/"
              className="active:scale-95 transition-transform flex items-center gap-2"
              suppressHydrationWarning
            >
              <div className="dark:hidden flex">
                <Image
                  src={standaloneIcon}
                  alt="VectraLern"
                  width={48}
                  height={48}
                  priority
                  className="block object-cover"
                />
              </div>
              <div className="hidden dark:flex">
                <Image
                  src={standaloneIcon}
                  alt="VectraLern"
                  width={48}
                  height={48}
                  priority
                  className="block "
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl  font-bold text-[#22E6D8]  leading-none tracking-wide">
                  VectraLearn
                </span>
                <span className="text-[0.55rem] md:text-[0.65rem] font-bold text-foreground/70 tracking-[0.2em] mt-1 uppercase">
                  Global Online Education
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Side: Centered Navigation Links (Desktop) */}
          <ul className="hidden items-center gap-8 md:flex text-sm font-semibold text-muted">
            {desktopLinks}
          </ul>

          {/* Right Side: Search Icon, Theme Toggle & Authentication Flows */}
          <div className="flex items-center gap-4">
            <button className="text-muted hover:text-foreground p-2 transition-colors duration-300 duration-200 rounded-full hover:bg-foreground/5 hidden sm:block">
              <Search size={18} />
            </button>

            <ThemeToggle />

            {/* Desktop Dynamic Auth & Dropdown (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div
                  ref={dropdownRef}
                  className="relative flex items-center gap-3 rounded-full border border-card-border bg-card-bg/80 pl-4 pr-2 py-2 backdrop-blur-md transition-colors duration-300"
                >
                  <span className="max-w-[100px] truncate text-sm font-semibold text-foreground">
                    {user?.name}
                  </span>

                  {/* Avatar Trigger Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    type="button"
                    className="focus:outline-none active:scale-95 transition-transform"
                  >
                    <Avatar
                      size="sm"
                      className="h-8 w-8 ring-2 ring-brand-mint/30 hover:ring-brand-mint/60 transition-all"
                    >
                      <Avatar.Image alt={user?.name} src={user?.image} />
                      <Avatar.Fallback className="bg-foreground text-background text-xs">
                        {user?.name?.[0]}
                      </Avatar.Fallback>
                    </Avatar>
                  </button>

                  {/* Manual Dropdown (Desktop Only) */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-card-border bg-nav-bg p-2 text-foreground shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                      <div className="px-3 py-2 border-b border-card-border mb-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-foreground truncate mt-0.5">
                          {user?.name}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors duration-300"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors duration-300"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>

                      <div className="h-px bg-card-border my-1" />

                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          await authClient.signOut();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors duration-300 text-left"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Link href="/signin">
                    <Button
                      variant="light"
                      className="text-foreground font-semibold text-sm px-4 bg-transparent transition-colors duration-300 hover:bg-foreground/5 rounded-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-main-gradient text-white font-semibold text-sm rounded-full h-10 px-7 shadow-glow hover:brightness-110 transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Auth Button (Only shown on small devices when logged out) */}
            {!user && (
              <div className="md:hidden">
                <Link href="/signin">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-main-gradient text-white font-medium text-xs rounded-full px-4 shadow-glow"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Hamburger Menu Dropdown Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-nav-border bg-nav-bg backdrop-blur-3xl px-6 py-8 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Main Navigation Links */}
          <ul className="flex flex-col gap-3">{mobileLinks}</ul>

          <div className="border-t border-nav-border mt-8 pt-8">
            {user ? (
              <div className="flex flex-col gap-3">
                {/* User Info Card */}
                <div className="flex items-center gap-4 bg-card-bg p-4 rounded-2xl border border-card-border mb-2">
                  <Avatar
                    size="md"
                    src={user?.image}
                    name={user?.name?.[0]}
                    className="h-10 w-10 ring-2 ring-brand-mint/30"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-foreground truncate">
                      {user?.name}
                    </span>
                    <span className="text-xs text-muted truncate">
                      Logged In
                    </span>
                  </div>
                </div>

                {/* Mobile Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-4 text-base font-semibold text-muted hover:text-foreground bg-card-bg/50 hover:bg-card-bg rounded-2xl transition-all"
                >
                  <LayoutDashboard size={20} className="text-brand-ocean" />
                  <span>Dashboard</span>
                </Link>

                {/* Mobile Profile Link */}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-4 text-base font-semibold text-muted hover:text-foreground bg-card-bg/50 hover:bg-card-bg rounded-2xl transition-all"
                >
                  <User size={20} className="text-brand-ocean" />
                  <span>My Profile</span>
                </Link>

                {/* Mobile Logout Button */}
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await authClient.signOut();
                  }}
                  className="flex w-full items-center gap-3 p-4 text-base font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-all mt-2"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div>
                <Link
                  href="/signup"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-main-gradient text-white font-bold rounded-2xl h-14 text-lg shadow-glow">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
