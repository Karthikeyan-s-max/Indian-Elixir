export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?forbidden=1");
  }

  return (
    <div className="flex min-h-screen bg-cream-card">
      <AdminSidebar name={session.user.name} />
      <main className="ml-64 flex-1 p-16">{children}</main>
    </div>
  );
}
