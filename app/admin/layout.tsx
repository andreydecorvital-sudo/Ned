import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminDock from "./admin-dock";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAdminAuthenticated();

  return (
    <>
      {children}
      {authenticated && <AdminDock />}
    </>
  );
}
