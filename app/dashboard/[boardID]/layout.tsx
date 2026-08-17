export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="w-1/3">Coś</div>

      <main className="w-2/3">Tu jest renderowany page.tsx {children}</main>
    </div>
  );
}
