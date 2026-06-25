"use client";

/**
 * AdminUsersTable
 * Purely presentational. All data + callbacks come through props.
 *
 * Props:
 *  - users         : User[]
 *  - superAdminEmail : string  — email of the untouchable Super Admin
 *  - onRoleChange  : (userId, newRole) => void
 *  - onToggleBlock : (userId, isCurrentlyBlocked) => void
 *  - isRoleChanging: Record<userId, boolean>   — loading map per row
 *  - isBlockChanging: Record<userId, boolean>  — loading map per row
 */

import Image from "next/image";
import { ShieldAlert, Ban, CheckCircle, Loader2, ShieldCheck } from "lucide-react";

const ROLE_OPTIONS = ["student", "instructor", "admin"];

const roleBadge = (role) => {
  const styles = {
    admin: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
    instructor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    student: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[role] ?? styles.student
      }`}
    >
      {role ?? "student"}
    </span>
  );
};

const statusBadge = (isBlocked) =>
  isBlocked ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <Ban className="w-3 h-3" /> Blocked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <CheckCircle className="w-3 h-3" /> Active
    </span>
  );

export default function AdminUsersTable({
  users,
  superAdminEmail,
  onRoleChange,
  onToggleBlock,
  isRoleChanging = {},
  isBlockChanging = {},
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Current Role</th>
              <th className="px-6 py-4 font-semibold">Change Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-sm font-medium">No users match your filters.</p>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const userId = user._id?.toString() || user.id?.toString();
                const isSuper =
                  user.isSuperAdmin === true ||
                  (superAdminEmail && user.email === superAdminEmail);

                const roleLoading = isRoleChanging[userId];
                const blockLoading = isBlockChanging[userId];

                return (
                  <tr
                    key={userId}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* ── User Info ───────────────────────────────── */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative w-10 h-10 rounded-full shrink-0">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name ?? "User"}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                          )}
                          {isSuper && (
                            <span
                              title="Super Admin"
                              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-amber-400 rounded-full border-2 border-white dark:border-zinc-900"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-amber-900" />
                            </span>
                          )}
                        </div>
                        {/* Name + Email */}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {user.name ?? "Unknown"}
                            {isSuper && (
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md">
                                Super Admin
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ── Current Role Badge ───────────────────────── */}
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>

                    {/* ── Change Role Dropdown ─────────────────────── */}
                    <td className="px-6 py-4">
                      {isSuper ? (
                        <span className="text-xs text-gray-400 italic">Protected</span>
                      ) : (
                        <div className="relative inline-flex items-center">
                          <select
                            value={user.role ?? "student"}
                            disabled={roleLoading}
                            onChange={(e) => onRoleChange(userId, e.target.value)}
                            className="appearance-none bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r} className="capitalize">
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                          {/* Loading spinner overlay */}
                          {roleLoading && (
                            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-indigo-500 pointer-events-none" />
                          )}
                        </div>
                      )}
                    </td>

                    {/* ── Account Status ──────────────────────────── */}
                    <td className="px-6 py-4">{statusBadge(user.isBlocked)}</td>

                    {/* ── Block / Unblock Action ───────────────────── */}
                    <td className="px-6 py-4 text-right">
                      {isSuper ? (
                        <span
                          title="Super Admin is untouchable"
                          className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Protected
                        </span>
                      ) : user.isBlocked ? (
                        <button
                          onClick={() => onToggleBlock(userId, true)}
                          disabled={blockLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {blockLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleBlock(userId, false)}
                          disabled={blockLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {blockLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
