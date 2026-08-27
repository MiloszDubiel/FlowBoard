import { ReactNode } from "react";
import AppSidebar from "@/components/project/AppSidebar";

interface BoardLayoutProps {
  children: ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex h-screen overflow-auto w-full">
      <section className="flex min-w-0 flex-1 flex-col">{children}</section>
    </div>
  );
}
