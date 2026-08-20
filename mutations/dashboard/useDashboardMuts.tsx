import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDashboardMuts = (id: number | undefined) => {
  const deleteProject = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const response = await axios.delete(`/api/projects/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return {
    deleteProject,
  };
};
