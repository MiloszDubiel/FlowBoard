export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ boardID: string }>;
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}) {
  const { boardID } = await params;
  const { filter, search } = await searchParams;

  return (
    <div>
      <p>Board: {boardID}</p>
      <p>Filter: {filter}</p>
      <p>Search: {search}</p>
    </div>
  );
}
