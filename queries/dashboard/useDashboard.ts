import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDashboard = () => {
  const getProjects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get(`/api/projects`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return {
    getProjects,
  };
};
