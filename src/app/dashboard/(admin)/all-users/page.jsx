import { redirect } from "next/navigation";
import { useUserServerSession } from "@/lib/actions/getUserServerSession";
import AdminUsersContainer from "@/components/dashboard/AdminUsersContainer";

export const metadata = {
  title: "All Users | SkillSphere Admin",
  description: "Manage user roles, block/unblock accounts, and oversee all platform members.",
};

export default async function AllUsersPage() {
  const user = await useUserServerSession();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Search, filter, manage roles, and moderate all registered users on SkillSphere.
        </p>
      </div>

      <AdminUsersContainer user={user} />
    </div>
  );
}
