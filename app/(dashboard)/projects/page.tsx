import Dashboard from "@/components/project/Projects";
import { getProjects } from "@/lib/data/projects";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <Dashboard projects={projects}></Dashboard>
    </section>
  );
}
