import { ReactNode } from "react";
import AppSidebar from "@/components/project/Sidebar";

interface BoardLayoutProps {
  children: ReactNode;
}

export default function AddLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex overflow-auto w-full justify-center ">
      <section className="flex max-w-3xl w-6xl">{children}</section>
    </div>
  );
}
