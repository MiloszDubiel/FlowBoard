import React from "react";
import AppNavbar from "@/components/project/Navbar";
import AppSidebar from "@/components/project/Sidebar";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getProjects } from "@/lib/data/projects";
import { prisma } from "@/lib/prisma";
import { DemoTimer } from "@/components/DemoTimer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode | null;
}) {
  const projects = await getProjects();
  const user: any = await getCurrentUser();

  const session = await prisma.demoSession.findFirst({
    where: {
      userId: Number(user.userID),
    },
  });

  return (
    <>
      <div className="min-h-screen w-full">
        <div className="block lg:flex">
          <div className="block lg:hidden ">
            <AppNavbar projects={projects}>
              {session && (
                <DemoTimer data={session.expiresAt?.getTime() || 0} />
              )}
            </AppNavbar>
          </div>

          <div className="hidden lg:block ">
            <AppSidebar projects={projects}>
              {session && (
                <DemoTimer data={session.expiresAt?.getTime() || 0} />
              )}
            </AppSidebar>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
