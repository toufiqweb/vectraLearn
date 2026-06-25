"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getAllUsersAdmin, updateUserRoleAdmin, toggleUserBlockAdmin } from "@/lib/api/users";
import Pagination from "@/components/ui/Pagination";
import AdminUsersTable from "./AdminUsersTable";

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ?? "";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "student", label: "Student" },
];

export default function AdminUsersContainer({ user }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(""); // "" = all, "false" = active, "true" = blocked

  // Per-row loading states (keyed by userId)
  const [isRoleChanging, setIsRoleChanging] = useState({});
  const [isBlockChanging, setIsBlockChanging] = useState({});

  // Debounce the search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [debouncedSearch, roleFilter, statusFilter]);

  // Fetch users whenever page or filters change
  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsersAdmin(user.id, {
          page: currentPage,
          limit: 10,
          search: debouncedSearch,
          role: roleFilter,
          blocked: statusFilter,
        });

        if (!active) return;

        if (data.success) {
          setUsers(data.data);
          setTotalPages(data.meta.totalPages ?? 1);
          setTotalUsers(data.meta.totalUsers ?? 0);
        } else {
          toast.error(data.message ?? "Failed to load users.");
        }
      } catch {
        if (active) toast.error("Network error fetching users.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchUsers();
    return () => { active = false; };
  }, [user.id, currentPage, debouncedSearch, roleFilter, statusFilter]);

  // ── Role Change Handler ──────────────────────────────────────────────────────
  const handleRoleChange = useCallback(async (userId, newRole) => {
    setIsRoleChanging((prev) => ({ ...prev, [userId]: true }));
    try {
      const data = await updateUserRoleAdmin(user.id, userId, newRole);
      if (data.success) {
        toast.success(data.message ?? `Role updated to '${newRole}'.`);
        // Optimistic UI: update the user in local state immediately
        setUsers((prev) =>
          prev.map((u) =>
            (u._id?.toString() ?? u.id?.toString()) === userId
              ? { ...u, role: data.role }
              : u
          )
        );
      } else {
        toast.error(data.message ?? "Failed to update role.");
      }
    } catch {
      toast.error("Network error while updating role.");
    } finally {
      setIsRoleChanging((prev) => ({ ...prev, [userId]: false }));
    }
  }, [user.id]);

  // ── Block / Unblock Handler ──────────────────────────────────────────────────
  const handleToggleBlock = useCallback(async (userId, isCurrentlyBlocked) => {
    const actionWord = isCurrentlyBlocked ? "Unblock" : "Block";
    const iconType = isCurrentlyBlocked ? "success" : "warning";
    const confirmColor = isCurrentlyBlocked ? "#10b981" : "#ef4444";

    const result = await Swal.fire({
      title: `${actionWord} this user?`,
      text: isCurrentlyBlocked
        ? "The user will regain full access to the platform."
        : "The user will lose the ability to perform any write actions.",
      icon: iconType,
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionWord}`,
    });

    if (!result.isConfirmed) return;

    setIsBlockChanging((prev) => ({ ...prev, [userId]: true }));
    try {
      const data = await toggleUserBlockAdmin(user.id, userId);
      if (data.success) {
        toast.success(data.message ?? `User ${actionWord.toLowerCase()}ed.`);
        // Optimistic UI update
        setUsers((prev) =>
          prev.map((u) =>
            (u._id?.toString() ?? u.id?.toString()) === userId
              ? { ...u, isBlocked: data.isBlocked }
              : u
          )
        );
      } else {
        toast.error(data.message ?? `Failed to ${actionWord.toLowerCase()} user.`);
      }
    } catch {
      toast.error(`Network error while ${actionWord.toLowerCase()}ing user.`);
    } finally {
      setIsBlockChanging((prev) => ({ ...prev, [userId]: false }));
    }
  }, [user.id]);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer transition-all min-w-[150px]"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status (Blocked / Active) Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 cursor-pointer transition-all min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 self-center sm:ml-auto">
            <Users className="w-4 h-4" />
            <span>{totalUsers} user{totalUsers !== 1 ? "s" : ""} found</span>
          </div>
        )}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
      ) : (
        <AdminUsersTable
          users={users}
          superAdminEmail={SUPER_ADMIN_EMAIL}
          onRoleChange={handleRoleChange}
          onToggleBlock={handleToggleBlock}
          isRoleChanging={isRoleChanging}
          isBlockChanging={isBlockChanging}
        />
      )}

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
