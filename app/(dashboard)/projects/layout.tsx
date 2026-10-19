import AppNavbar from "@/components/project/AppNavbar";
import AppSidebar from "@/components/project/AppSidebar";
import { getProjects } from "@/lib/data/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();

  return (
    <div className="min-h-screen w-full">
      <div className="block lg:flex">
        <div className="block lg:hidden ">
          <AppNavbar projects={projects} />
        </div>

        <div className="hidden lg:block ">
          <AppSidebar projects={projects} />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
