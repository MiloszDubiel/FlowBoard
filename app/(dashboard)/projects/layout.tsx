import AppSidebar from "@/components/project/AppSidebar";
import { getProjects } from "@/lib/data/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects()

  return (
    <div className="min-h-screen w-full">
      <div className="flex">
        <AppSidebar projects={projects} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
