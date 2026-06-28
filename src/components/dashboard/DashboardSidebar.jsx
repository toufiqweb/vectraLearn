"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  Settings,
  Activity,
  Clock,
  BarChart,
  UsersRound,
  PlusCircle,
  Book,
  Heart,
  User,
  House,
  Crown,
  Zap,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import Image from "next/image";

const adminLinks = [
  {
    name: "Platform Analytics",
    href: "/dashboard/platform-analytics",
    icon: Activity,
  },
  { name: "All Courses", href: "/dashboard/all-courses", icon: BookOpen },
  { name: "All Users", href: "/dashboard/all-users", icon: Users },
  { name: "Manage Reviews", href: "/dashboard/manage-review", icon: Settings },
  { name: "Pending Courses", href: "/dashboard/pending-courses", icon: Clock },
];

const instructorLinks = [
  {
    name: "Course Analytics",
    href: "/dashboard/course-analytics",
    icon: BarChart,
  },
  {
    name: "Course Students",
    href: "/dashboard/course-students",
    icon: UsersRound,
  },
  { name: "Create Course", href: "/dashboard/create-course", icon: PlusCircle },
  { name: "My Courses", href: "/dashboard/my-courses", icon: Book },
];

const studentLinks = [
  { name: "My Learning", href: "/dashboard/my-learning", icon: BookOpen },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
];

const commonLinks = [
  { name: "Home", href: "/dashboard", icon: House },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);

  let links = [];
  if (role === "admin") links = adminLinks;
  else if (role === "instructor") links = instructorLinks;
  else if (role === "student") links = studentLinks;

  const allLinks = [...commonLinks, ...links];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
          isActive
            ? "bg-foreground/10 text-foreground"
            : "text-muted hover:bg-foreground/5 hover:text-foreground"
        }`}
        style={{ borderRadius: "8px" }}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
        
        {!isCollapsed && (
          <span className="text-[13px] font-medium truncate">{item.name}</span>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-4 rounded-md bg-card-bg px-2.5 py-1.5 text-[11px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 shadow-card border border-card-border whitespace-nowrap">
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-card-bg/95 backdrop-blur-3xl border-r border-card-border transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-[72px] w-[260px]" : "w-[260px]"}`}
      >
        {/* Top Header Logo Area */}
        <div className={`flex shrink-0 ${isCollapsed ? 'flex-col items-center py-5 gap-5' : 'h-[72px] items-center justify-between px-4'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white shadow-lg shadow-orange-500/20">
              <Zap size={16} fill="currentColor" />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-bold text-foreground whitespace-nowrap tracking-tight">
                VectraLearn Workspace
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            className="hidden lg:flex text-muted hover:text-foreground transition-colors rounded-lg p-1.5 hover:bg-foreground/5 shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden text-muted hover:text-foreground transition-colors rounded-lg p-1.5 hover:bg-foreground/5"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 scrollbar-none">
          {!isCollapsed && (
             <div className="px-3 mb-2 mt-2 text-[10px] font-bold uppercase tracking-wider text-muted">
               Navigation
             </div>
          )}
          {allLinks.map(renderNavItem)}
        </div>

        <div className="mt-auto flex flex-col gap-2 p-3">
          {/* Upgrade Card */}
          {isCollapsed ? (
            <div className="group relative flex justify-center p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-card-border cursor-pointer transition-colors">
              <Crown size={18} className="text-yellow-500" />
              {/* Tooltip */}
              <div className="absolute left-full ml-4 rounded-md bg-card-bg px-2.5 py-1.5 text-[11px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 shadow-card border border-card-border whitespace-nowrap">
                Upgrade to Pro
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-foreground/5 to-transparent border border-card-border p-4">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-500/10 blur-2xl" />
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <Crown size={12} fill="currentColor" />
                  </div>
                  <h4 className="text-[13px] font-bold text-foreground tracking-tight">
                    Upgrade to Pro
                  </h4>
                </div>
                <p className="text-[10px] leading-relaxed text-muted">
                  Unlock premium features and routing controls.
                </p>
                <button className="mt-2 w-full rounded-md bg-foreground py-1.5 text-[11px] font-bold text-background transition-transform active:scale-95 hover:opacity-90">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className={`flex items-center rounded-xl p-2 mt-1 hover:bg-foreground/5 cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-card-border bg-foreground/5">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-[12px] font-bold text-foreground tracking-tight truncate">
                    Abhishek Hirapara
                  </span>
                  <span className="text-[10px] text-muted truncate">
                    Client Id: 10001
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <MoreVertical size={16} className="text-muted shrink-0 hover:text-foreground transition-colors" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
