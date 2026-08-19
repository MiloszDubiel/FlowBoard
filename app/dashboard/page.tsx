import MainPage from "@/components/MainPage";
import axios from "axios";

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

  return <MainPage />;
}
