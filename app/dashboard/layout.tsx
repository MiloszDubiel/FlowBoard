import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">

      <div className="flex">
        <AppSidebar />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
