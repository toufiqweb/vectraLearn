"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getAllUsersAdmin } from "@/lib/api/user";
import { updateUserRoleAdmin, toggleUserBlockAdmin } from "@/lib/actions/user";
import Pagination from "@/components/ui/Pagination";
import AdminUsersTable from "./AdminUsersTable";
import SearchFilterBar from "@/components/ui/SearchFilterBar";

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
  const [limit, setLimit] = useState(10);
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

  // Reset to page 1 when filters or limit change
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [debouncedSearch, roleFilter, statusFilter, limit]);

  // Fetch users whenever page, limit, or filters change
  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsersAdmin(user.id, {
          page: currentPage,
          limit: limit,
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
  }, [user.id, currentPage, limit, debouncedSearch, roleFilter, statusFilter]);

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
      <SearchFilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch("")}
        searchPlaceholder="Search by name or email..."
        filters={[
          {
            value: roleFilter,
            onChange: setRoleFilter,
            options: ROLE_OPTIONS,
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "", label: "ALL STATUSES" },
              { value: "false", label: "Active" },
              { value: "true", label: "Blocked" },
            ],
          },
        ]}
      />
      
      {/* Results count */}
      {!isLoading && (
        <div className="flex items-center justify-end gap-2 text-sm text-muted font-bold">
          <Users className="w-4 h-4" />
          <span>{totalUsers} user{totalUsers !== 1 ? "s" : ""} found</span>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="glass-card border border-card-border shadow-card rounded-[24px] min-h-[200px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--brand-cyan)]" />
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
      {!isLoading && (totalPages > 1 || totalUsers > 0) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalUsers}
          itemsPerPage={limit}
          onItemsPerPageChange={setLimit}
        />
      )}
    </div>
  );
}

