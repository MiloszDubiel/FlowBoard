import Dashboard from "@/components/project/Projects";
import { getProjects } from "@/lib/data/projects";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const projects = await getProjects();

  const doneTasks = projects.reduce(
    (acc, curr) => acc + curr.completedTasks,
    0,
  );
  const allTasks = projects.reduce((acc, curr) => acc + curr.totalTasks, 0);

  return (
    <section className="min-h-screen w-full flex-1 bg-muted/30">
      <Dashboard
        projects={projects}
        taskState={{ doneTasks, allTasks }}
      ></Dashboard>
    </section>
  );
}
