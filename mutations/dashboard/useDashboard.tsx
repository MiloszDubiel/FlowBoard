import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDashboard = () => {
  const deleteProject = useMutation({
    mutationFn: async (id: number | undefined) => {
      if (!id) return;
      const response = await axios.delete(`/api/projects/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
  const { mutate: switchColumns } = useMutation({
    mutationKey: ["lists"],
    mutationFn: async (lists: any) => {
      const { data } = await axios.patch("/api/card/switch", { lists });

      return data;
    },
  });

  const { mutate: reorderLists } = useMutation({
    mutationKey: ["columns"],
    mutationFn: async (columns: any) => {
      const { data } = await axios.patch("/api/list/reorder", { columns });

      return data;
    },
  });

  return { switchColumns, deleteProject, reorderLists };
};
