import { ReactNode } from "react";

interface BoardLayoutProps {
  children: ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      <section className="flex min-w-0 flex-1 flex-col">{children}</section>
    </div>
  );
}
