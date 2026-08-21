import { ReactNode } from "react";
import AppSidebar from "@/components/dashboard/AppSidebar";

interface BoardLayoutProps {
  children: ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
